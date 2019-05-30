const expect = require('chai').expect;

const OOP = require("./index");

describe("--- SIMPLE CLASS ---\n", function(){

	//Create namespaced class with instance and static methods
	OOP.namespace("foo.bar.Shape", OOP.construct({
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

		expect(OOP.isType(defaultShape, foo.bar.Shape)).equal(true);
		expect(OOP.isType(defaultShape, "foo.bar.Shape")).equal(true);
		expect(defaultShape._type).equal("foo.bar.Shape");
	});
	it("should create a custom foo.bar.Shape class with width and height parameters", function(){
		console.log("Custom shape:", customShape);

		expect(customShape.width).to.be.equal(300);
		expect(customShape.height).to.be.equal(400);

		expect(defaultShape).not.equal(customShape);
		expect(defaultShape.position).not.equal(customShape.position);
	});
});

describe("--- INHERITANCE ---\n", function(){

	//Create namespaced class with instance and static methods
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
	
	//Extend class
	OOP.namespace("foo.bar.Triangle", OOP.inherit(foo.bar.Shape, OOP.createClass(
		//Instance
		{
			angles:[30, 60, 90]
		},
		//Static
		{
			getArea:function(obj){
				return obj.width * obj.height * 0.5;
			}
		}
	)));
	
	var triangle = new foo.bar.Triangle({
		width:300
	});

	var triangleArea = foo.bar.Triangle.getArea(triangle);
	var shapeAreaDefault = foo.bar.Shape.getArea(triangle); //This is not the area of a triangle

	//Tests
	it("should create an inherited foo.bar.Triangle class", function(){
		console.log("Triangle:", triangle);

		expect(OOP.isType(triangle, foo.bar.Triangle)).equal(true);
		expect(OOP.isType(triangle, foo.bar.Shape)).equal(true);

		expect(triangle._interface).equal(triangle);
		expect(triangle._super._type).equal("foo.bar.Shape");
		expect(triangle._super._interface).equal(triangle);
		
		expect(triangle.width).not.equal(triangle._super.width);
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
		var static = OOP.namespace("foo.bar.Shape", OOP.construct({
			instance:{
				width:150,
				height:150,
	
				fireTestEvent:function(){
					//You could also use foo.bar.Shape.EVENT_TEST
					//123 is the optional event data
					this.dispatchEvent(new OOP.Event(static.EVENT_TEST, 123));
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
	OOP.addEvents(myObj);
	
	//Tests
	it("should create a default foo.bar.Shape class and fire an event", function(done){
		//In case event never fires
		this.timeout(1000);
		
		defaultShape.addEventListener(foo.bar.Shape.EVENT_TEST, function(evt, data){
			console.log("Got event", evt, data);
			expect(data).equal(123);
			done();
		});
		defaultShape.fireTestEvent();
	});
	it("should add events to a normal object", function(done){
		//In case event never fires
		this.timeout(1000);
		
		myObj.addEventListener("event_test", function(evt, data){
			console.log("Got event", evt, data);
			expect(data).equal(456);
			done();
		});
		myObj.dispatchEvent(new OOP.Event("event_test", 456));
	});
});