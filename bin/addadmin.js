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

if (process.argv[2].search(/(us-east-1|eu-west-1):\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/) === -1)
	throw "The first argument is not a valid Cognito identity ID: "+process.argv[2];

getPolicy(Config.aws.adminPolicyArn)
	.get("DefaultVersionId")
	.then(getPolicyVersion.bind(null, Config.aws.adminPolicyArn))
	.then(addPolicyUsers.bind(null, [ process.argv[2] ]))
	.then(JSON.stringify).then(console.log);


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

function addPolicyUsers(users, policyVersion){
	policyVersion.Statement.forEach(function(statement){
		if (statement.Condition === undefined)
			return;

		if (statement.Condition.StringEquals === undefined)
			return;

		if (statement.Condition.StringEquals["cognito-identity.amazonaws.com:aud"] !== Config.aws.identityPoolId)
			return;

		if (statement.Condition.StringEquals["cognito-identity.amazonaws.com:sub"] === undefined)
			statement.Condition.StringEquals["cognito-identity.amazonaws.com:sub"] = [];

		users.forEach(function(userid){
			if (statement.Condition.StringEquals["cognito-identity.amazonaws.com:sub"].indexOf(userid) === -1)
				statement.Condition.StringEquals["cognito-identity.amazonaws.com:sub"].push(userid);
		});

		added = true;
	});

	if (!added) {
		var newStatement = {
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": [
                "arn:aws:s3:::" + Config.aws.bucket,
                "arn:aws:s3:::" + Config.aws.bucket + "/*"
            ],
            "Condition": {
            	"StringEquals": {
            		"cognito-identity.amazonaws.com:aud": Config.aws.identityPoolId,
            		"cognito-identity.amazonaws.com:sub": users
            	}
            }
       	};
	}

	return policyVersion;
}
