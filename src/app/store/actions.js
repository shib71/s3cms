import { BEGINLOGIN, CANCELLOGIN, LOGIN, LOGOUT, SETPREFERENCE, DELETEPREFERENCE } from "app/store/types";
import Config from "/s3cms_project/config.js";
import 'aws';

const creds = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: Config.aws.identityPoolId
});
AWS.config.update({
    region: Config.aws.cognitoRegion,
    credentials: creds
});

const bucket = new AWS.S3({
	params: {
		Bucket: Config.aws.bucket
	},
	region: Config.aws.region
});

export function beginLogin(provider, info) {
	return {
		type: BEGINLOGIN,
		provider: provider,
		info: info
	}
}

export function finalizeLogin(provider, id, name, email) {
	return function (dispatch) {
		dispatch(beginLogin(provider, "Confirming login with AWS"));

		creds.params.Logins = {};
		creds.params.Logins[provider] = id;
		 
		// Explicity expire credentials so they are refreshed
		// on the next request.
		creds.expired = true;

		creds.refresh(function(err){
			if (err){
				dispatch(cancelLogin(provider, err.toString()));
				return;
			}

			dispatch(beginLogin(provider, "Checking permissions"));

			bucket.getObject({
				Key: "s3cms_project/permission_test.txt"
			}, function(err, data){
				if (err.code === "AccessDenied"){
					dispatch(login(provider, creds.identityId, name, email, false));
					return;
				}
				if (err){
					dispatch(cancelLogin(provider, err.toString()));
					return;
				}
				
				dispatch(login(provider, creds.identityId, name, email, true));
			});
		});
	};
}

export function cancelLogin(provider, reason) {
	return {
		type: CANCELLOGIN,
		provider: provider,
		reason: reason
	}
}

export function login(provider, id, name, email, admin) {
  return {
    type: LOGIN,
    provider: provider,
    id: id,
    name: name,
    email: email,
    admin: admin
  };
}

export function logout(){
	return {
		type: LOGOUT
	};
}

export function setPreference(key, value) {
	return {
		type: SETPREFERENCE,
		key: key,
		value: value
	}
}

export function deletePreference(key, value) {
	return {
		type: DELETEPREFERENCE,
		key: key
	}
}