import { combineReducers } from 'redux';
import { 
	BEGINLOGIN, FINALIZELOGIN, CANCELLOGIN, LOGIN, LOGOUT, 
	SETPREFERENCE, DELETEPREFERENCE 
} from "app/store/types";

function profile(state={}, action={}) {
	switch (action.type) {
	case BEGINLOGIN:
		return {
			provider: action.provider,
			status: "processing",
			info: action.info
		};
	case CANCELLOGIN:
		return {
			provider: action.provider,
			status: "cancelled",
			error: action.reason
		};
	case LOGIN:
		return {
			provider: action.provider,
			id: action.id,
			name: action.name,
			email: action.email,
			admin: action.admin,
			status: "loggedin"
		};
	case LOGOUT:
		return {};
	default:
		return state;
	}
}

function preferences(state={}, action={}) {
	switch (action.type) {
	case SETPREFERENCE:
		return Object.assign({}, state, {[action.key]:action.value});
	case DELETEPREFERENCE:
		var newstate = Object.assign({}, state);
		delete newstate[action.key];
		return newstate;
	default:
		return state;
	}
}

function config(state={}, action={}) {
	return state;
}

var cmsApp = combineReducers({
	profile,
	preferences,
	config
});

export default cmsApp;