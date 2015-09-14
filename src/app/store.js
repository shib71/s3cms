import { createStore, bindActionCreators, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as ActionCreators from "app/store/actions";
import Reducer from "app/store/reducers";
import Config from "/s3cms_project/config.js";

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware // lets us dispatch() functions
)(createStore);

export const store = createStoreWithMiddleware(Reducer, { 
	preferences : {},
	profile : {},
	config : Config
});
export const actions = bindActionCreators(ActionCreators, store.dispatch);