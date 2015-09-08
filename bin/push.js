var AWS = require('aws-sdk');
var Config = require("../s3cms_project/config.js");
var fs = require("fs");
var path = require("path");
var mime = require('mime-types');
var crypto = require("crypto");
var inherits = require("util").inherits;
var Promise = require("bluebird");

Promise.longStackTraces();

var s3 = new AWS.S3({
	region: Config.awsRegion
});

s3.createBucket({ Bucket: Config.awsBucket }, function() {
	var results = uploadFiles(
		path.resolve("."), 
		s3, 
		s3HashFetcher(["admin/", "s3cms_project/"], s3), 
		createParamFunction(path.resolve("."))
	).forEach(function(result){
		result.then(console.log, console.error);
	});
});


function uploadFiles(directory, s3, hashFetcher, fnParams){
	var contents = fs.readdirSync(directory).map(function(f){ 
		return {
			value: f,
			full: path.join(directory,f),
			stat: fs.statSync(path.join(directory,f))
		};
	});
	var result = [];

	for (var i=0, ii=contents.length; i<ii; i++){
		if (contents[i].stat.isFile()){
			result.push(uploadFile(contents[i].full, s3, hashFetcher, fnParams));
		}
		else if (contents[i].stat.isDirectory()){
			result = result.concat(uploadFiles(contents[i].full, s3, hashFetcher, fnParams));
		}
	}

	return result;
}

function uploadFile(file, s3, hashFetcher, fnParams){
	var params = fnParams(file);

	if (params === null){
		return Promise.resolve("");
	}

	return Promise.all([ 
		hashFetcher(params.Key).catch(NotExistError, function(e){ return ""; }),
		hashFile(file) 
	]).spread(function(oldHash, newHash){
		if (oldHash === newHash)
			return "skipped";

		return new Promise(function(resolve, reject) {
			s3.putObject(params, function(err, data) {
				if (err)
					resolve("failed: "+err.toString());
				else
					resolve("uploaded");
			});
		}).then(function(result){
			return params.Key+result;
		});
	});
}

function createParamFunction(baseDir){
	return function(file){
		var key = path.relative(baseDir, file);
		var base = key.split(/[\/\\]/)[0];

		if (["s3cms_project", "admin"].indexOf(base) === -1)
			return null;

		return { 
			Bucket: Config.awsBucket, 
			Key: key, 
			Body: fs.createReadStream(file),
			ACL: base === "admin" || key === "s3cms_project/config.js" ? "public-read" : "private",
			ContentType: mime.lookup(key) || 'application/octet-stream'
		};
	}
}

function s3HashFetcher(paths, s3) {
	return scatterResolve(function(resolve, reject, done){
		return Promise.all(paths.map(function(path){
			var request = s3.listObjects({ 
				Prefix:path, 
				Bucket:Config.awsBucket 
			});

			request.eachPage(function(err, data){
				if (err || data === null){
					done();
					return;
				}

				data.Contents.forEach(function(item){console.log(item);
					resolve(item.Key, item.ETag);
				});
			});

			request.send();
		}));
	});
}

function hashFile(path) {
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
	});
}

function scatterResolve(fn) {
	var result = {};
	var resolvers = {};
	var rejecters = {};
	var bDone = false;

	function resolve(key, value) {
		if (result[key] === undefined)
			result[key] = Promise.resolve(value);
		else {
			resolvers[key](value);
			delete resolvers[key];
			delete rejecters[key];
		}
	}

	function reject(key, reason) {
		if (result[key] === undefined)
			result[key] = Promise.reject(reason);
		else {
			rejecters[key](reason);
			delete resolvers[key];
			delete rejecters[key];
		}
	}

	function done() {
		bDone = true;

		for (var key in rejecters){
			rejecters[key](NotExistError());
			delete resolvers[key];
			delete rejecters[key];
		}
	}

	function get(key) {
		var i = 0;

		// initialize promise for requested key
		if (result[key] === undefined) {
			if (bDone) {
				result[key] = NotExistError();
			}
			else {
				result[key] = new Promise(function(resolve, reject) { 
					resolvers[key] = resolve;
					rejecters[key] = reject;
				});
			}
		}

		return result[key];
	}

	fn(resolve, reject, done);

	return get;
}

function NotExistError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
};
inherits(NotExistError, Error);
