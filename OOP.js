/*
* OOP v1.0.1 Copyright (c) 2016 AJ Savino
* https://github.com/koga73/OOP
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/
var OOP = function(){
	var _methods = {
		//Namespaces an object or function
		//Adds a _type property to the obj equal to the namespace
		namespace:function(namespace, obj){
			var objs = namespace.split(".");
			var objsLen = objs.length;
			var node = window;
			for (var i = 0; i < objsLen; i++){
				var objName = objs[i];
				if (i == objsLen - 1){
					node[objName] = obj;
				} else {
					node[objName] = node[objName] || {};
				}
				node[objName]._type = objs.slice(0, i + 1).join(".");
				node = node[objName];
			}

			return obj;
		},

		//Adds propertes on extendingObj from new obj if not there
		//Adds _super property on extendingObj pointing to obj
		//Updates _interface property on _super chain to point to extendingObj
		extend:function(obj, extendingObj){
            if (typeof obj === typeof undefined){
                throw "Error base object is undefined";
                return;
            }
            if (!_methods._isFunction(obj)){
				throw "Error base object must be a function";
				return;
            }
			var _super = new obj();
			
			for (var prop in _super){
				if (typeof extendingObj[prop] === typeof undefined){
					extendingObj[prop] = _super[prop];
				}
			}
			
			var context = _super;
			do {
				context._interface = extendingObj;
				context = context._super;
			} while (typeof context !== typeof undefined)
			extendingObj._super = _super;

			return extendingObj;
		},

		//Overwrites properties on obj with those of params
		//Adds an _isType method to obj
		//Adds an _interface property to obj
		//Adds a _type property to namespaced objects
		construct:function(obj, params, events){
			var type = null;
			if (arguments && arguments.callee && arguments.callee.caller){
				type = arguments.callee.caller._type; //Pull type from namespaced object
				obj._type = type;
			}
			obj._isType = function(type) {
				return _methods.isType(obj, type);
			}
			obj._interface = obj;

			for (var prop in params) {
				if (_methods._isFunction(obj[prop])){ //Getter/Setter
					obj[prop](params[prop]);
				} else {
					obj[prop] = params[prop];
				}
			}
			
			if (events == true){
				if (!obj._eventHandlers){
					obj._eventHandlers = {};
				}
				if (!obj.addEventListener){
					obj.addEventListener = _methods._addEventListener;
				}
				if (!obj.removeEventListener){
					obj.removeEventListener = _methods._removeEventListener;
				}
				if (!obj.dispatchEvent){
					obj.dispatchEvent = _methods._dispatchEvent;
				}
			}
			
			return obj;
		},
		
		//Safe cross-browser event (use 'new OOP.Event()')
		event:function(type, data){
			var event = null;
			try { //IE catch
				event = new CustomEvent(type); //Non-IE
			} catch (ex){
				if (document.createEventObject){ //IE
					event = document.createEventObject("Event");
					if (event.initCustomEvent){
						event.initCustomEvent(type, true, true);
					}
				} else { //Custom
					event = {};
				}
			}
			event._type = type;
			event._data = data;
			return event;
		},

		//Safe cross-browser way to listen for one or more events
		//Pass obj, comma delimeted event types, and a handler
		addEventListener:function(obj, types, handler){
			if (!obj._eventHandlers){
				obj._eventHandlers = {};
			}
			types = types.split(",");
			var typesLen = types.length;
			for (var i = 0; i < typesLen; i++){
				var type = types[i];
				if (obj.addEventListener){ //Standard
					handler = _methods._addEventHandler(obj, type, handler);
					obj.addEventListener(type, handler);
				} else if (obj.attachEvent){ //IE
					var attachHandler = function(){
						handler(window.event);
					}
					attachHandler.handler = handler; //Store reference to original handler
					attachHandler = _methods._addEventHandler(obj, type, attachHandler);
					obj.attachEvent("on" + type, attachHandler);
				} else if (typeof jQuery !== typeof undefined){ //jQuery
					handler = _methods._addEventHandler(obj, type, handler);
					jQuery.on(type, handler);
				} else { //Custom
					obj.addEventListener = _methods._addEventListener;
					obj.addEventListener(type, handler);
				}
			}
		},

		//This is the custom method that gets added to objects
		_addEventListener:function(type, handler){
			handler._isCustom = true;
			_methods._addEventHandler(this, type, handler);
		},

		//Stores and returns handler reference
		_addEventHandler:function(obj, type, eventHandler){
			if (!obj._eventHandlers[type]){
				obj._eventHandlers[type] = [];
			}
			var eventHandlers = obj._eventHandlers[type];
			var eventHandlersLen = eventHandlers.length;
			for (var i = 0; i < eventHandlersLen; i++){
				if (eventHandlers[i] === eventHandler){
					return eventHandler;
				} else if (eventHandlers[i].handler && eventHandlers[i].handler === eventHandler){
					return eventHandlers[i];
				}
			}
			eventHandlers.push(eventHandler);
			return eventHandler;
		},

		//Safe cross-browser way to listen for one or more events
		//Pass obj, comma delimeted event types, and optionally handler
		//If no handler is passed all handlers for each event type will be removed
		removeEventListener:function(obj, types, handler){
			if (!obj._eventHandlers){
				obj._eventHandlers = {};
			}
			types = types.split(",");
			var typesLen = types.length;
			for (var i = 0; i < typesLen; i++){
				var type = types[i];
				var handlers;
				if (typeof handler === typeof undefined){
					handlers = obj._eventHandlers[type] || [];
				} else {
					handlers = [handler];
				}
				var handlersLen = handlers.length;
				for (var j = 0; j < handlersLen; j++){
					var handler = handlers[j];
					if (obj.removeEventListener){ //Standard
						handler = _methods._removeEventHandler(obj, type, handler);
						obj.removeEventListener(type, handler);
					} else if (obj.detachEvent){ //IE
						handler = _methods._removeEventHandler(obj, type, handler);
						obj.detachEvent("on" + type, handler);
					} else if (typeof jQuery !== typeof undefined){ //jQuery
						handler = _methods._removeEventHandler(obj, type, handler);
						jQuery.off(type, handler);
					} else { //Custom
						obj.removeEventListener = _methods._removeEventListener;
						obj.removeEventListener(type, handler);
					}
				}
			}
		},

		//This is the custom method that gets added to objects
		//Pass comma delimeted event types, and optionally handler
		//If no handler is passed all handlers for each event type will be removed
		_removeEventListener:function(types, handler){
			types = types.split(",");
			var typesLen = types.length;
			for (var i = 0; i < typesLen; i++){
				var type = types[i];
				var handlers;
				if (typeof handler === typeof undefined){
					handlers = this._eventHandlers[type] || [];
				} else {
					handlers = [handler];
				}
				var handlersLen = handlers.length;
				for (var j = 0; j < handlersLen; j++){
					var handler = handlers[j];
					handler._isCustom = false;
					_methods._removeEventHandler(this, type, handler);
				}
			}
		},

		//Removes and returns handler reference
		_removeEventHandler:function(obj, type, eventHandler){
			if (!obj._eventHandlers[type]){
				obj._eventHandlers[type] = [];
			}
			var eventHandlers = obj._eventHandlers[type];
			var eventHandlersLen = eventHandlers.length;
			for (var i = 0; i < eventHandlersLen; i++){
				if (eventHandlers[i] === eventHandler){
					return eventHandlers.splice(i, 1)[0];
				} else if (eventHandlers[i].handler && eventHandlers[i].handler === eventHandler){
					return eventHandlers.splice(i, 1)[0];
				}
			}
		},

		//Safe cross-browser way to dispatch an event
		dispatchEvent:function(obj, event){
			if (!obj._eventHandlers){
				obj._eventHandlers = {};
			}
			if (obj.dispatchEvent){ //Standard
				obj.dispatchEvent(event);
			} else if (obj.fireEvent){ //IE
				obj.fireEvent("on" + type, event);
			} else if (typeof jQuery !== typeof undefined){
				jQuery(obj).trigger(jQuery.Event(event._type, {
					_type:event._type,
					_data:event._data
				}));
			} else { //Custom
				obj.dispatchEvent = _methods._dispatchEvent;
				obj.dispatchEvent(event);
			}
		},

		//This is the custom method that gets added to objects
		_dispatchEvent:function(event){
			_methods._dispatchEventHandlers(this, event);
		},

		//Dispatches an event to handler references
		_dispatchEventHandlers: function(obj, event){
			var eventHandlers = obj._eventHandlers[event._type];
			if (!eventHandlers){
				return;
			}
			var eventHandlersLen = eventHandlers.length;
			for (var i = 0; i < eventHandlersLen; i++){
				eventHandlers[i](event);
			}
		},
		
		isType:function(obj, type){
			var context = obj;
			do {
				if (context._type == type || context._type == type._type) {
					return true;
				}
				context = context._super;
			} while (typeof context !== typeof undefined)
			return false;
		},

		_isFunction:function(obj){
			return obj && Object.prototype.toString.call(obj) == "[object Function]";
		}
	}

	return {
		Namespace:_methods.namespace,
		Extend:_methods.extend,
		Construct:_methods.construct,
		Event:_methods.event,

		addEventListener:_methods.addEventListener,
		removeEventListener:_methods.removeEventListener,
		dispatchEvent:_methods.dispatchEvent,

		isType: _methods.isType
	};
}();