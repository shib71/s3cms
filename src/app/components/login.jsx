import React from 'react';
import Base from 'app/components/base';
import Google from 'app/components/logins/google';

export default class Login extends Base {
	render(){
		const { profile, config } = this.props;
		
		return <div className="container">
			<div className="row">
				<div className="col-md-4 col-md-offset-4">
					<div className="login-panel panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">Please Sign In</h3>
						</div>
						<div className="panel-body">
							<Google profile={profile} config={config}></Google>
						</div>
					</div>
				</div>
			</div>
		</div>;
	}
};