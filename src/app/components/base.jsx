import React, { Component } from 'react';

export default class Base extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return !this.shallowEqual(this.props, nextProps) || !this.shallowEqual(this.state, nextState);
	}

	shallowEqual(objA, objB) {
		if (objA === objB) {
			return true;
		}
		var key;
		// Test for A's keys different from B.
		for (key in objA) {
			if (objA.hasOwnProperty(key) && (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
				return false;
			}
		}
		// Test for B's keys missing from A.
		for (key in objB) {
			if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	}
}