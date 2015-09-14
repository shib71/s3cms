import React from 'react';
import Base from 'app/components/base';

export default class Application extends Base {
	render(){
		return <div>Hello {this.props.profile.name}</div>;
	}
}