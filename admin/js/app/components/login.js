define(["exports","lib/react-0.13.3.min","https://apis.google.com/js/client:plusone.js","/s3cms_project/config.js"],function(exports,_libReact0133Min,_httpsApisGoogleComJsClientPlusoneJs,_s3cms_projectConfigJs){"use strict";Object.defineProperty(exports,"__esModule",{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{"default":obj};}var _React=_interopRequireDefault(_libReact0133Min);var _Config=_interopRequireDefault(_s3cms_projectConfigJs);var Login=_React["default"].createClass({displayName:"Login",render:function render(){return _React["default"].createElement("div",{"class":"container"},_React["default"].createElement("div",{"class":"row"},_React["default"].createElement("div",{"class":"col-md-4 col-md-offset-4"},_React["default"].createElement("div",{"class":"login-panel panel panel-default"},_React["default"].createElement("div",{"class":"panel-heading"},_React["default"].createElement("h3",{"class":"panel-title"},"Please Sign In")),_React["default"].createElement("div",{"class":"panel-body"},_React["default"].createElement("form",{role:"form"},_React["default"].createElement("fieldset",null,_React["default"].createElement("div",{"class":"form-group"},_React["default"].createElement("span",{id:"login","class":"g-signin","data-height":"short","data-callback":"loginToGoogle","data-cookiepolicy":"single_host_origin","data-requestvisibleactions":"http://schemas.google.com/AddActivity","data-scope":"https://www.googleapis.com/auth/plus.login,https://www.googleapis.com/auth/plus.login"})))))))));}});exports.Login = Login;});
//# sourceMappingURL=login.js.map