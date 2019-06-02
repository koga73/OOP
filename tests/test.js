#!/usr/bin/env node

//This file contains unit tests for NodeJS

const expect = require('chai').expect;

const OOP = require("../index");
//Optional - This adds the OOP methods into the global namespace
//If you don't do this then you will need to add "OOP" infront of methods such as "OOP.namespace" instead of just "namespace"
OOP.init();

describe("--- CLONE ---\n", function(){

	var srcObj = {
		foo:{
			bar:"foobar"
		}
	};

	//Makes a deep copy - The foo objects will be different
	var deepClone = clone(srcObj); //Deep by default
	
	//Makes a shallow copy - The foo objects will be the same reference
	var shallowClone = clone(srcObj, false);

	//Tests
	it("should create a deep clone of srcObj where the foo reference is unique", function(){
		console.log("srcObj:", srcObj);
		console.log("deepClone:", deepClone);

		expect(srcObj.foo).not.equal(deepClone.foo);
	});
	it("should create a shallow clone of srcObj where the foo reference is shared", function(){
		console.log();
		console.log("srcObj:", srcObj);
		console.log("shallowClone:", shallowClone);

		expect(srcObj.foo).equal(shallowClone.foo);
	});
});

describe("--- EXTEND ---\n", function(){

	/*
	//Not needed here because extend modifies the original object
	//In our case we want to pass in a new "foo" object each time for our tests
	var foo = {
		abc:123
	}
	*/
	var bar = {
		def:{
			ghi:456
		}
	};
	var third = {
		jkl:{
			mno:789
		}
	};

	//Extend bar onto foo - deep by default meaning foo.def will not equal bar.def
	var deepFooBar = extend({abc:123}, bar);

	//Extend bar onto foo - shallow meaning foo.def and bar.def will be the same reference
	var shallowFooBar = extend({abc:123}, false, bar);

	//Extend bar onto foo - shallow meaning foo.def and bar.def will be the same reference but the third object is deep again
	var thirdFooBar = extend({abc:123}, false, bar, true, third);

	//Tests
	it("should deep extend bar onto foo meaning foo.def will not equal bar.def", function(){
		console.log("foo:", {abc:123});
		console.log("bar:", bar);
		console.log("deepFooBar:", deepFooBar);

		expect(deepFooBar.def).not.equal(bar.def);
	});
	it("should shallow extend bar onto foo meaning foo.def and bar.def will be the same reference", function(){
		console.log();
		console.log("foo:", {abc:123});
		console.log("bar:", bar);
		console.log("shallowFooBar:", shallowFooBar);

		expect(shallowFooBar.def).equal(bar.def);
	});
	it("should shallow extend bar onto foo meaning foo.def and bar.def will be the same reference but the third object is deep again", function(){
		console.log();
		console.log("foo:", {abc:123});
		console.log("bar:", bar);
		console.log("thirdFooBar:", thirdFooBar);

		expect(thirdFooBar.def).equal(bar.def);
		expect(thirdFooBar.jkl).not.equal(third.jkl);
	});
});

describe("--- TYPE CHECKS ---\n", function(){
	//Tests
	it("should check isFunction", function(){
		expect(isFunction(function(){})).equal(true);
		expect(isFunction([])).equal(false);
	});
	it("should check isArray", function(){
		expect(isArray([])).equal(true);
		expect(isArray({})).equal(false);
	});
	it("should check isObject", function(){
		expect(isObject({})).equal(true);
		expect(isObject([])).equal(false);
	});
	it("should check isString", function(){
		expect(isString("")).equal(true);
		expect(isString({})).equal(false);
	});
	it("should check isBoolean", function(){
		expect(isBoolean(true)).equal(true);
		expect(isBoolean(false)).equal(true);
		expect(isBoolean(0)).equal(false);
	});
	it("should check isRegExp", function(){
		expect(isRegExp(/test/)).equal(true);
		expect(isRegExp({})).equal(false);
	});
});

describe("--- SIMPLE CLASS ---\n", function(){

	//Create namespaced class with instance and static methods
	namespace("foo.bar.Shape", construct({
		instance:{
			width:100,
			height:200,
			position:{
				x:0,
				y:0
			}
		},

		static:{
			getArea:function(obj){
				return obj.width * obj.height;
			}
		}
	}));

	//Create instance using defaults
	var defaultShape = new foo.bar.Shape();
	
	//Get area using static method
	var defaultArea = foo.bar.Shape.getArea(defaultShape);

	//Create instance using overrides
	var customShape = new foo.bar.Shape({
		width:300,
		height:400
	});
	
	//Tests
	it("should create a default foo.bar.Shape class with width and height attributes", function(){
		console.log("Default shape:", defaultShape);

		expect(defaultShape.width).equal(100);
		expect(defaultShape.height).equal(200);
		expect(defaultArea).equal(20000);

		expect(isType(defaultShape, foo.bar.Shape)).equal(true);
		expect(isType(defaultShape, "foo.bar.Shape")).equal(true);
		expect(defaultShape._type).equal("foo.bar.Shape");
	});
	it("should create a custom foo.bar.Shape class with width and height parameters", function(){
		console.log();
		console.log("Custom shape:", customShape);

		expect(customShape.width).to.be.equal(300);
		expect(customShape.height).to.be.equal(400);

		expect(defaultShape).not.equal(customShape);
		expect(defaultShape.position).not.equal(customShape.position);
	});
});

describe("--- INHERITANCE ---\n", function(){

	//Create namespaced class with instance and static methods
	namespace("foo.bar.Shape", construct({
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
	
	//Extend class
	namespace("foo.bar.Triangle", inherit(foo.bar.Shape, construct({
		instance:{
			angles:[30, 60, 90]
		},
		
		static:{
			getArea:function(obj){
				return obj.width * obj.height * 0.5;
			}
		}
	})));
	
	var triangle = new foo.bar.Triangle({
		width:300
	});

	var triangleArea = foo.bar.Triangle.getArea(triangle);
	var shapeAreaDefault = foo.bar.Shape.getArea(triangle); //This is not the area of a triangle

	//Tests
	it("should create an inherited foo.bar.Triangle class", function(){
		console.log("Triangle:", triangle);

		expect(isType(triangle, foo.bar.Triangle)).equal(true);
		expect(isType(triangle, foo.bar.Shape)).equal(true);

		expect(triangle._interface).equal(triangle);
		expect(triangle._super._type).equal("foo.bar.Shape");
		expect(triangle._super._interface).equal(triangle);
		
		expect(triangle.height).equal(triangle._super.height);
		expect(triangleArea).equal(30000);
		expect(shapeAreaDefault).equal(60000);
	});
});

describe("--- EVENTS ---\n", function(){

	//Encapsulate class declaration since we only want the "static" variable accessible to the class
	(function(){
		//Create namespaced class with instance, static methods and events
		//Note: The var static is just a shortcut, not necessary
		var static = namespace("foo.bar.Shape", construct({
			instance:{
				width:150,
				height:150,
	
				fireTestEvent:function(){
					//You could also use foo.bar.Shape.EVENT_TEST
					//123 is the optional event data
					this.dispatchEvent(new Event(static.EVENT_TEST, 123));
				}
			},
			events:true,
			
			static:{
				EVENT_TEST:"event_test",
	
				getArea:function(obj){
					return obj.width * obj.height;
				}
			}
		}));
	})();
	
	var defaultShape = new foo.bar.Shape();

	//Add events to any object
	var myObj = {};
	addEvents(myObj);
	
	//Tests
	it("should create a default foo.bar.Shape class and fire an event", function(done){
		//In case event never fires
		this.timeout(1000);
		
		defaultShape.addEventListener(foo.bar.Shape.EVENT_TEST, function(evt, data){
			console.log("Got event:", evt, data);
			expect(data).equal(123);
			done();
		});
		defaultShape.fireTestEvent();
	});
	it("should add events to a normal object", function(done){
		console.log();
		//In case event never fires
		this.timeout(1000);
		
		myObj.addEventListener("event_test", function(evt, data){
			console.log("Got event:", evt, data);
			expect(data).equal(456);
			done();
		});
		myObj.dispatchEvent(new Event("event_test", 456));
	});
});