[![Build Status](https://travis-ci.org/koga73/OOP.svg?branch=master)](https://travis-ci.org/koga73/OOP)
[![Support: IE8+](https://img.shields.io/badge/support-ie8%2B-brightgreen.svg)]()
[![Dependencies: None](https://img.shields.io/badge/dependencies-none-lightgrey.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/koga73/OOP/blob/master/LICENSE.md)

# OOP

This project when combined with design patterns adds common OOP functionality to JavaScript

Goals:
- Provide OOP like functionality including namespacing, classes, inheritance, public / private scope
- Provide a cross-browser event model that can be added to any object
- Provide methods for cloning and extending objects
- Provide methods for type checking

## Install:
``` bash
npm i @koga73/oop
```

### Run unit tests:
##### Run NodeJS unit test:
``` bash
npm test
```
##### Run HTML/JS unit test:
```
tests/test.html
```

## *examples/pong* snippet:
``` javascript
(function(){
	//Imports from Pong example
	var Models = Pong.Models;
	var DomRenderer = Pong.Renderers.DomRenderer;
	var InputManager = Pong.Managers.InputManager;
	var NormalTimer = Pong.Utils.NormalTimer;
	
	//This returns a reference to the class. We are using the word "_class" as a shortcut to easily access static members
	var _class = namespace("Foo.Bar.Pong", construct({
		//Constants
		static:{
			ID_BALL:"ball",
			SPEED_BALL:400, //Pixels-per-second
			
			singleton:null,
			getSingleton:function(){
				if (!_class.singleton){
					_class.singleton = new Foo.Bar.Pong(
						_class.ID_BALL
					);
				}
				return _class.singleton;
			}
		},

		//In general _public is optional since it's the same as "this" (except in the scope of a private method)
		//Properties and methods starting with an underscore '_' are private
		instance:function(_private, _public){
			return {
				ball:null,

				normalTimer:null,
				inputManager:null,

				_renderer:null,
				_renderQueue:[],

				__construct:function(ballId){
					//Init game objects
					this.ball = new Models.Object2D(ballId);

					//Init game timer
					this.normalTimer = new NormalTimer({
						paused:false,
						onTick:_private._onTick
					});
					this.inputManager = InputManager.getSingleton();

					//Init renderer
					_private._renderer = new DomRenderer();
					_private._renderQueue = [
						this.ball
					];

					//--- LISTEN FOR EVENTS ---

					//Start
					this.resetBall();
				},

				//Delta is the time elapsed between ticks
				//Multiplying a movement value by delta makes the movement timebased rather than based on the clock cycle
				_onTick:function(delta){
					//Move
					var queueLen = _private._renderQueue.length;
					for (var i = 0; i < queueLen; i++){
						var obj2d = _private._renderQueue[i];
						obj2d.x += obj2d.moveX * delta;
						obj2d.y += obj2d.moveY * delta;
					}
					
					//--- DO LOGIC ---

					//Render
					_private._renderer.render(_private._renderQueue);
				},

				resetBall:function(){
					//--- DO LOGIC ---
				}
			};
		}
	}));
})();
```

---

## Simple class:
``` javascript
OOP.namespace("foo.bar.Shape", OOP.construct({
	instance:{
		width:100,
		height:200
	}
}));

var defaultShape = new foo.bar.Shape();
console.log(defaultShape);
```

### Change scope:
This allows you to change the scope of OOP methods so don't have to put "OOP" all over the place.
``` javascript
//Add OOP methods to window/global by default or to any object passed in
OOP.changeScope();

namespace("foo.bar.Shape", construct({
	instance:{
		width:100,
		height:200
	}
}));

var defaultShape = new foo.bar.Shape();
console.log(defaultShape);
```

### Constructor:
``` javascript
OOP.namespace("foo.bar.Shape", OOP.construct({
	instance:{
		width:100,
		height:200,

		_construct:function(newWidth, newHeight){
			this.width = newWidth || this.width;
			this.height = newHeight || this.height;
			console.log("This gets called when a new instance is created", this.width, this.height);
		}
	}
}));

//Note that if we pass in non-object parameters they will get sent to the constructor
//Object type parameters will apply value overrides to the instance
var customShape = new foo.bar.Shape(300, 400, {
	test:"this prop gets added to the instance"
});
console.log(customShape);
```

### Static:
``` javascript
OOP.namespace("foo.bar.Shape", OOP.construct({
	instance:{
		width:100,
		height:200,
	},

	static:{
		SOME_CONST:123,

		getArea:function(obj){
			return obj.width * obj.height;
		}
	}
}));

var instance = new foo.bar.Shape({
	width:300,
	height:400
});
console.log(foo.bar.Shape.SOME_CONST);
console.log(foo.bar.Shape.getArea(instance));
```

### Public / Private scope:
``` javascript
OOP.namespace("foo.bar.Shape", OOP.construct({
	instance:function(_private, _public){
		return {
			width:100,
			height:200
			_thisIsPrivate:"some message",

			getThisIsPrivate:function(){
				return _private._thisIsPrivate;
			}
		};
	}
}));

var defaultShape = new foo.bar.Shape();
console.log(defaultShape);
```
Note that when a function is passed to "instance" a public and private scope is created. Anything starting with an underscore '_' is private. You can use the _private and _public references passed into the function to call between scopes. Optionally "this" refers to the _public or _private scope respectively. You can also use these _public and _private variables to avoid creating event delegates for "this".

---

## Inheritance:
``` javascript
OOP.namespace("foo.bar.Shape", OOP.construct({
	instance:{
		width:100,
		height:200
	},

	static:{
		getArea:function(obj){
			return obj.width * obj.height;
		}
	}
}));

OOP.namespace("foo.bar.Triangle", OOP.inherit(foo.bar.Shape, OOP.construct({
	instance:{
		width:300,
		angles:[30, 60, 90]
	},

	static:{
		getArea:function(obj){
			return obj.width * obj.height * 0.5;
		}
	}
})));

var triangle = new foo.bar.Triangle();
console.log(OOP.isType(triangle, foo.bar.Triangle)); //true
console.log(OOP.isType(triangle, "foo.bar.Triangle")); //true
console.log(OOP.isType(triangle, foo.bar.Shape)); //true
console.log(triangle._interface); //Triangle instance
console.log(triangle._super); //Shape instance
console.log(triangle._super._interface); //Triangle instance
console.log(triangle._type); //"foo.bar.Triangle"
console.log(triangle._super._type); //"foo.bar.Shape"
```

---

## Events:
``` javascript
OOP.namespace("foo.bar.Shape", OOP.construct({
	instance:{
		width:100,
		height:200
	},
	events:true,

	static:{
		getArea:function(obj){
			return obj.width * obj.height;
		}
	}
}));

var instance = new foo.bar.Shape();
instance.addEventListener("test-event", function(evt, data){
	console.log("Got event", evt, data);
});

instance.dispatchEvent(new OOP.Event("test-event", 123));
```
Note that events fired from inherited classes (_super) will bubble up (they share the same _eventHandlers)

### Add events to any object
``` javascript
var myObj = {};
OOP.addEvents(myObj);

myObj.addEventListener("test-event", function(evt, data){
	console.log("Got event", evt, data);
});

myObj.dispatchEvent(new OOP.Event("test-event", 123));
```

---

## Clone
``` javascript
var obj = OOP.clone({foo:{bar:"foobar"}}); //Makes a deep copy - The foo objects will be different
var obj = OOP.clone({foo:{bar:"foobar"}}, false); //Makes a shallow copy - The foo objects will be the same reference
```

## Extend
``` javascript
var foo = {abc:123};
var bar = {def:{ghi:456}};

//Extend bar onto foo - deep by default meaning foo.def will not equal bar.def
OOP.extend(foo, bar);

//Extend bar onto foo - shallow meaning foo.def and bar.def will be the same reference
OOP.extend(foo, false, bar);

//Extend bar onto foo - shallow meaning foo.def and bar.def will be the same reference but the third object is deep again
OOP.extend(foo, false, bar, true, {jkl:{mno:789}});
```
Note the number of arguments is unlimited. When a boolean is encountered it sets the "deep" flag for subsequent objects. The first object found in the arguments is what gets extended (you could pass true/false as the first argument).

## Type checks
``` javascript
OOP.isType
OOP.isFunction
OOP.isArray
OOP.isObject
OOP.isString
OOP.isBoolean
OOP.isRegExp
```

## Full API
``` javascript
init:_methods.init,

//Class
namespace:_methods.namespace,
inherit:_methods.inherit,
createClass:_methods.createClass,
construct:_methods.construct,

//Core
clone:_methods.clone,
extend:_methods.extend,

//Type checks
isType:_methods.isType,
isFunction:_methods.isFunction,
isArray:_methods.isArray,
isObject:_methods.isObject,
isString:_methods.isString,
isBoolean:_methods.isBoolean,
isRegExp:_methods.isRegExp,

//Events
Event:_methods.event,

addEvents:_methods.addEvents,
removeEvents:_methods.removeEvents,

addEventListener:_methods.addEventListener,
on:_methods.addEventListener, //Alias

removeEventListener:_methods.removeEventListener,
off:_methods.removeEventListener, //Alias

dispatchEvent:_methods.dispatchEvent,
trigger:_methods.dispatchEvent, //Alias
emit:_methods.dispatchEvent //Alias
```