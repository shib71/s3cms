define(['exports','module'],function(exports,module){'use strict';module.exports = thunkMiddleware;function thunkMiddleware(_ref){var dispatch=_ref.dispatch;var getState=_ref.getState;return function(next){return function(action){return typeof action === 'function'?action(dispatch,getState):next(action);};};}});
//# sourceMappingURL=redux-thunk.js.map
