define(['exports','module','react','app/store','app/components/base','app/components/login','app/components/nonadmin','app/components/application'],function(exports,module,_react,_appStore,_appComponentsBase,_appComponentsLogin,_appComponentsNonadmin,_appComponentsApplication){'use strict';var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if('value' in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();var _get=function get(_x,_x2,_x3){var _again=true;_function: while(_again) {var object=_x,property=_x2,receiver=_x3;desc = parent = getter = undefined;_again = false;if(object === null)object = Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc === undefined){var parent=Object.getPrototypeOf(object);if(parent === null){return undefined;}else {_x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;}}else if('value' in desc){return desc.value;}else {var getter=desc.get;if(getter === undefined){return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}var _React=_interopRequireDefault(_react);var _Base2=_interopRequireDefault(_appComponentsBase);var _Login=_interopRequireDefault(_appComponentsLogin);var _NonAdmin=_interopRequireDefault(_appComponentsNonadmin);var _Application=_interopRequireDefault(_appComponentsApplication);var Root=(function(_Base){_inherits(Root,_Base);function Root(){_classCallCheck(this,Root);_get(Object.getPrototypeOf(Root.prototype),'constructor',this).apply(this,arguments);}_createClass(Root,[{key:'componentWillMount',value:function componentWillMount(){this.setState(_appStore.store.getState());this.unsubscribe = _appStore.store.subscribe((function(){this.setState(_appStore.store.getState());}).bind(this));}},{key:'componentWillUnmount',value:function componentWillUnmount(){this.unsubscribe();}},{key:'render',value:function render(){if(this.state.profile.admin === false) // user is not an admin
return _React['default'].createElement(_NonAdmin['default'],this.state);else if(this.state.profile.admin === true) // user is logged in
return _React['default'].createElement(_Application['default'],this.state);else  // user is not logged in
return _React['default'].createElement(_Login['default'],this.state);}}]);return Root;})(_Base2['default']);module.exports = Root;});
//# sourceMappingURL=root.js.map
