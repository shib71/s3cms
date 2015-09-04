import React from "react";
import "plusone";
import Config from "/s3cms_project/config.js";

export var Login = React.createClass({
	render: function(){
		return <div class="container">
			<div class="row">
				<div class="col-md-4 col-md-offset-4">
					<div class="login-panel panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title">Please Sign In</h3>
						</div>
						<div class="panel-body">
							<form role="form">
								<fieldset>
									<div class="form-group">
										<span
											id="login"
											class="g-signin"
											data-height="short"
											data-callback="loginToGoogle"
											data-cookiepolicy="single_host_origin"
											data-requestvisibleactions="http://schemas.google.com/AddActivity"
											data-scope="https://www.googleapis.com/auth/plus.login,https://www.googleapis.com/auth/plus.login">
										</span>
									</div>
								</fieldset>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>;
	}
});