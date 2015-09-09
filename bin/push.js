var AWS = require('aws-sdk');
var Config = require("../s3cms_project/config.js");
var path = require("path");
var mime = require('mime-types');
var crypto = require("crypto");
var inherits = require("util").inherits;
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

Promise.longStackTraces();

var unhandledPromises = [];
Promise.onUnhandledRejectionHandled(function(e, promise) {
	unhandledPromises.push(promise);
});
Promise.onUnhandledRejectionHandled(function(promise) {
	var index = unhandledPromises.indexOf(promise);
	unhandledPromises.splice(index, 1);
});
process.on("SIGINT", function(){
	for (var i=0; i<unhandledPromises.length; i++){
		if (unhandledPromises.isRejected())
			console.log(unhandledPromises[i].reason());
	}
});

var s3 = new AWS.S3({
	region: Config.awsRegion
});

s3.createBucket({ Bucket: Config.awsBucket }, function() {
	uploadFiles(["admin/", "s3cms_project/"], s3);
});

function listAllObjects(path, s3, add){
	var request = s3.listObjects({ 
		Prefix: path, 
		Bucket: Config.awsBucket 
	});
	var count = 0;

	return new Promise(function(resolve, reject){
		request.eachPage(function(err, data){
			if (err) {
				reject(err);
				return;
			}
			if (data === null) {
				resolve(count);
				return;
			}

			data.Contents.forEach(function(item){
				count += 1;
				add(item);
			});
		});
	});
}

function s3HashFetcher(paths, s3) {
	return scatterResolve(paths, function(resolveKey, rejectKey, done){
		return Promise.all(paths.map(function(path){
			return listAllObjects(path, s3, function(item){
				resolveKey(item.Key, item.ETag);
			}).catch(function(err){
				done(path, err);

				return "done";
			});
		}));
	});
}

function scatterResolve(groups, fn) {
	var result = {};
	var resolvers = {};
	var rejecters = {};
	var groupsDone = {};

	groups.forEach(function(group){
		groupsDone[group] = new Promise(function(resolve, reject){
			resolvers[group] = resolve;
			rejecters[group] = reject;
		});
	});

	function resolve(key, value) {
		if (result[key] === undefined)
			result[key] = Promise.resolve(value);
		else if (resolvers[key]) {
			resolvers[key](value);
			delete resolvers[key];
			delete rejecters[key];
		}
	}

	function reject(key, reason) {
		if (result[key] === undefined)
			result[key] = Promise.reject(reason);
		else if (rejecters[key]) {
			rejecters[key](reason);
			delete resolvers[key];
			delete rejecters[key];
		}
	}

	function done(group, err) {
		if (typeof(group) !== "string" && group.constructor !== Array && typeof(err) === "undefined"){
			err = group;
			group = groups.filter(function(group){ return group in resolvers; });
		}
		if (typeof("group") === "string"){
			group = [group];
		}
		if (typeof(err) === "undefined"){
			err = NotExistError();
		}

		group.forEach(function(thisgroup){
			if (rejecters[thisgroup]){
				rejecters[thisgroup](err);
				delete resolvers[thisgroup];
				delete rejecters[thisgroup];
			}
		});
	}

	function keyGroup(key) {
		for (var i=0; i<groups.length; i++){
			if (key.slice(0, groups[i].length) === groups[i])
				return groups[i];
		}

		return null;
	}

	function get(key) {
		var i = 0;
		var prefix = "";
		var prefixsofar = undefined;
		var group = keyGroup(key);

		// initialize promise for requested key
		if (result[key] === undefined) {
			if (group) {
				result[key] = Promise.race([
					groupsDone[keyGroup(key)],
					new Promise(function(resolve, reject){
						resolvers[key] = resolve;
						rejecters[key] = reject;
					})
				]);
			}
			else {
				result[key] = new Promise(function(resolve, reject){
					resolvers[key] = resolve;
					rejecters[key] = reject;
				});
			}
		}

		return result[key];
	}

	fn(resolve, reject, done).then(function(){
		done(NotExistError());
	}).catch(function(err){
		done(err);
	});

	return get;
}

function File(base, file, hashFetcher){
	this.base = base;
	this.key = file;
	this.hashFetcher = hashFetcher;
	this.path = path.join(base, file);
}
File.prototype.hashFile = function() {
	var path = this.path;

	return new Promise(function(resolve, reject){
		var hash = crypto.createHash('md5'), 
			stream = fs.createReadStream(path);

		stream.on('data', function (data) {
			hash.update(data, 'utf8')
		});

		stream.on('error', function (err) {
			reject(err);
		});

		stream.on('end', function () {
			resolve(hash.digest('hex'));
		});
	}).bind(this);
}
File.prototype.changed = function(){
	return Promise.all([ this.hashFetcher(this.key), this.hashFile() ]).spread(function(remoteHash, localHash){
		return remoteHash !== localHash;
	}).bind(this);
}
File.prototype.getParams = function(config){
	var base = this.key.split(/[\/\\]/)[0];

	return { 
		Bucket: Config.awsBucket, 
		Key: this.key, 
		Body: fs.createReadStream(this.path),
		ACL: base === "admin" || this.key === "s3cms_project/config.js" ? "public-read" : "private",
		ContentType: mime.lookup(this.key) || 'application/octet-stream'
	};
}
File.prototype.upload = function(s3){
	return this.stat().call("isDirectory").then(function(isDirectory){
		if (isDirectory)
			return this.uploadDirectory();
		else
			return this.uploadFile();
	});
}
File.prototype.uploadDirectory = function(s3){
	this.list().map(function(file){
		return file.upload();
	}).settle();
}
File.prototype.uploadFile = function(s3){
	var params = this.getParams();

	return this.changed().then(function(changed){
		if (!changed)
			return "unchanged";

		return new Promise(function(resolve, reject) {
			s3.putObject(params, function(err, data) {
				if (err)
					reject(err);
				else
					resolve("uploaded");
			});
		});
	}).catch(function(err){
		return err.toString();
	}).then(function(result){
		return params.Key+": "+result;
	}).tap(console.log);
}
File.prototype.stat = function(){
	return fs.statAsync(this.path).bind(this);
}
File.prototype.list = function(){
	return fs.readdirAsync(this.path).bind(this).map(function(child){ 
		return new File(this.base, path.relative(this.base, path.join(this.path, child)), this.hashFetcher);
	});
}

function uploadFiles(paths, s3){
	var basePath = path.resolve(".");
	var hashFetcher = s3HashFetcher(paths, s3);

	return Promise.resolve(paths).map(function(thispath){
		var f = new File(basePath, path.relative(basePath, thispath), hashFetcher);
		return f.upload();
	}).settle();
}

function NotExistError(message) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
};
inherits(NotExistError, Error);
