import { createStore } from 'redux';
import { login, logout, setPreference } from "app/store/actions";
import Reducer from "app/store/reducers";
console.log(Reducer);
var store = createStore(Reducer);

function bindAction(fn){
	return function() {
		return store.dispatch(fn.apply(null, arguments));
	}
}

export var boundLogin = bindAction(login);
export var boundLogout = bindAction(logout);
export var boundSetPreference = bindAction(setPreference);
export var subscribe = store.subscribe.bind(store);
export var getState = store.getState.bind(store);