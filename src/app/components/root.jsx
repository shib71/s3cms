import React from 'react';
import { store } from 'app/store';
import Base from 'app/components/base';
import Login from 'app/components/login';
import NonAdmin from 'app/components/nonadmin';
import Application from 'app/components/application';

export default class Root extends Base {
	componentWillMount(){
		this.setState(store.getState());

		this.unsubscribe = store.subscribe(function(){
			this.setState(store.getState());
		}.bind(this));
	}

	componentWillUnmount(){
		this.unsubscribe();
	}

	render() {
		if (this.state.profile.admin === false)
			// user is not an admin
			return <NonAdmin {...this.state} />

		else if (this.state.profile.admin === true)
			// user is logged in
			return <Application {...this.state} />;

		else
			// user is not logged in
			return <Login {...this.state} />
	}
}