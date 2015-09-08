import { combineReducers } from 'redux';
import { LOGIN, LOGOUT, SET } from "app/store/types";

function profile(state={}, action={}) {
	switch (action.type) {
	case LOGIN:
		return {
			provider: action.provider,
			id: action.id,
			name: action.name,
			email: action.email 
		};
	case LOGOUT:
		return {};
	default:
		return state;
	}
}

function preferences(state={}, action={}) {
	switch (action.type) {
	case SET:
		var st = {};
		st[action.key] = action.value;
console.log(Object.assign({}, state, st));
		return Object.assign({}, state, st);
	default:
		return state;
	}
}

var cmsApp = combineReducers({
	profile,
	preferences
});

export default cmsApp;