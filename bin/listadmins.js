var AWS = require('aws-sdk');
var Config = require("../s3cms_project/config.js");
var path = require("path");
var mime = require('mime-types');
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
	region: Config.aws.region
});
var iam = new AWS.IAM();

getPolicy(Config.aws.adminPolicyArn)
	.get("DefaultVersionId")
	.then(getPolicyVersion.bind(null, Config.aws.adminPolicyArn))
	.then(getPolicyUsers)
	.map(console.log);


function getPolicy(arn){
	return new Promise(function(resolve, reject){
		iam.getPolicy({
			PolicyArn: arn
		}, function(err, data) {
			if (err)
				reject(err);
			else
				resolve(data.Policy);
		});
	});
}

function getPolicyVersion(arn, version){
	return new Promise(function(resolve, reject){
		iam.getPolicyVersion({
			PolicyArn: arn,
			VersionId: version
		}, function(err, data) {
			if (err)
				reject(err);
			else
				resolve(JSON.parse(decodeURIComponent(data.PolicyVersion.Document)));
		});
	});
}

function getPolicyUsers(policyVersion){
	var userids = [];

	policyVersion.Statement.forEach(function(statement){
		if (statement.Condition === undefined)
			return;

		if (statement.Condition.StringEquals === undefined)
			return;

		if (statement.Condition.StringEquals["cognito-identity.amazonaws.com:aud"] !== Config.aws.identityPoolId)
			return;

		if (statement.Condition.StringEquals["cognito-identity.amazonaws.com:sub"] === undefined)
			return;

		if (typeof(statement.Condition.StringEquals["cognito-identity.amazonaws.com:sub"]) === "string") {
			statement.Condition.StringEquals["cognito-identity.amazonaws.com:sub"] = [ statement.Condition.StringEquals["cognito-identity.amazonaws.com:sub"] ];
		}

		if (statement.Condition.StringEquals["cognito-identity.amazonaws.com:sub"].constructor === Array) {
			statement.Condition.StringEquals["cognito-identity.amazonaws.com:sub"].forEach(function(userid){
				if (userids.indexOf(userid) === -1)
					userids.push(userid);
			});
		}
	});

	return userids;
}
