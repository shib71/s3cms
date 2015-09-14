import React from 'react';
import Base from 'app/components/base';

export default class NonAdmin extends Base {
	render(){
		return <div className="container">
			<div className="row">
				<div className="col-md-4 col-md-offset-4">
					<div className="login-panel panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">Who Are You?</h3>
						</div>
						<div className="panel-body">
							Hello {this.props.profile.name}. You aren&rsquo;t a registered admin for this website. Send an email to the <a href={"mailto:"+this.props.config.adminEmail+"?subject=Please%20add%20me%20as%20a%20user%20to%20"+window.location.host+"&body=My%20user%20id%20is%20"+this.props.profile.id+".%20Thanks,%20"+this.props.profile.name+"."}>website administor</a> with your user id: <code>{this.props.profile.id} to be given access</code>
						</div>
					</div>
				</div>
			</div>
		</div>;
	}
};