const expect = require('chai').expect;

const OOP = require("./index");

describe("Simple Class", function(){

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
	console.log("Default shape:", defaultShape);

	//Get area using static method
	var defaultArea = foo.bar.Shape.getArea(defaultShape);

	//Create instance using overrides
	var customShape = new foo.bar.Shape({
		width:300,
		height:400
	});
	console.log("Custom shape:", customShape);

	//Tests
	it("should create a default foo.bar.Shape class with width and height attributes", function(){
		expect(defaultShape.width).equal(100);
		expect(defaultShape.height).equal(200);
		expect(defaultArea).equal(20000);

		expect(OOP.isType(defaultShape, foo.bar.Shape)).equal(true);
		expect(OOP.isType(defaultShape, "foo.bar.Shape")).equal(true);
		expect(defaultShape._type).equal("foo.bar.Shape");
	});
	it("should create a custom foo.bar.Shape class with width and height parameters", function(){
		expect(customShape.width).to.be.equal(300);
		expect(customShape.height).to.be.equal(400);

		expect(defaultShape).not.equal(customShape);
		expect(defaultShape.position).not.equal(customShape.position);
	});
});