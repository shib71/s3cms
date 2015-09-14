import React from 'react';
import Base from 'app/components/base';
import { actions } from 'app/store';
import "plusone";
import AWS from 'aws';

export default class GoogleLogin extends Base {
	onLoginSuccess(user){
		const profile = user.getBasicProfile();
		const authresponse = user.getAuthResponse();

		actions.finalizeLogin("accounts.google.com", authresponse.id_token, profile.getName(), profile.getEmail());
	}

	onLoginFailure(){
		actions.cancelLogin("accounts.google.com", "Login failed");
	}

	componentDidMount(){
		const { google : { clientID } } = this.props.config;
		
		gapi.load('auth2', function(){
			gapi.auth2.init({ 
				'client_id' : clientID 
			});
			gapi.signin2.render("google-login", {
				'scope': 'https://www.googleapis.com/auth/plus.login',
				'width': 328,
				'height': 50,
				'longtitle': true,
				'theme': 'dark',
				'onsuccess': this.onLoginSuccess.bind(this),
				'onfailure': this.onLoginFailure.bind(this)
			});
		}.bind(this));
	}

	renderStatus(){
		if (this.props.profile.status === undefined)
			return null;

		if (this.props.profile.error !== undefined && this.props.profile.error !== '')
			return <div className="alert alert-danger" style={{marginTop:'5px'}}>{this.props.profile.error}</div>;

		if (this.props.profile.info !== undefined && this.props.profile.info !== '')
			return <div className="alert alert-info" style={{marginTop:'5px'}}>{this.props.profile.info}</div>;
	}

	render(){
		return <form role="form">
			<fieldset>
				<div className="form-group">
					<div id="google-login">&nbsp;</div>
					{this.renderStatus()}
				</div>
			</fieldset>
		</form>;
	}
};