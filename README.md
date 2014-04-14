##OOP##
*By: AJ Savino*
<p>
	OOP provides methods that when combined with JavaScript design patterns enables OOP functionality without the use prototype or jQuery. OOP also provides cross-browser event handling with a custom event model making it possible for any object dispatch and listen for events.
</p>
###**IMPLEMENTATION EXAMPLES:**###
<br/>
####**CLASSES**####
#####SIMPLE CLASS:#####
```JavaScript
	OOP.Namespace("Lib.Package.Foo", function(params){
		return OOP.Construct({
			a:10
		}, params);
	});
```
```JavaScript
	var foo = new Lib.Package.Foo({
		a:20
	});
```
#####ADVANCED CLASS:#####
```JavaScript
	OOP.Namespace("Lib.Package.Foo", function(params){
		var _vars = {
			a:0,
			b:0,
			
			_c:0,
		};

		var _methods = {
			func1:function(){
				console.log("Foo::func1 a: " + this._interface.a);
			},
			
			func2:funtion(){
				console.log("Foo::func2 b: " + this._interface.b);
				_methods._func3();
			},
			
			_func3:function(){
				console.log("Foo::_func3 c:" + _vars._c);
			}
		};

		return OOP.Construct({
			a:_vars.a,
			b:_vars.b,
			
			func1:_methods.func1,
			func2:_methods.func2
		}, params);
	});
```
```JavaScript
	var foo = new Lib.Package.Foo({
		a:10,
		b:50
	});
	foo.func1();
	foo.func2();
```
<br/>
<br/>
####**INHERITANCE**####
```JavaScript
	OOP.Namespace("Lib.Package.Bar", function(params){
		var _vars = {
			c:0
		};

		var _methods = {
			func1:function(){
				this._super.func1();
				console.log("Bar::func1 a: " + this._interface.a);
			},
			
			func2:funtion(){
				this._super.func2();
				console.log("Bar::func2 b: " + this._interface.b);
				_methods._func3();
			},
			
			_func3:function(){
				console.log("Bar::_func3 c:" + this._interface.c);
			}
		};

		return OOP.Construct(OOP.Extend(Lib.Package.Foo, {
			c:_vars.c,
			
			func1:_methods.func1,
			func2:_methods.func2
		}), params);
	});
```
```JavaScript
	var bar = new Lib.Package.Bar({
		a:10,
		b:50,
		c:20
	});
	bar.func1();
	bar.func2();
	
	console.log(bar._isType(Lib.Package.Foo)); //true
	console.log(bar._isType(Lib.Package.Bar)); //true
```
<br/>
<br/>
####**STATIC CLASSES**####
#####SIMPLE STATIC CLASS:#####
```JavaScript
	OOP.Namespace("Lib.Package.Foo", return OOP.Construct({
		a:10
	}));
```
```JavaScript
	console.log(Lib.Package.Foo.a); //10
```
#####ADVANCED STATIC CLASS:#####
```JavaScript
	OOP.Namespace("Lib.Package.Foo", (function(){ //Self-executing anonymous function
		var _vars = {
			a:10,
			
			_b:20
		};

		var _methods = {
			func1:function(){
				_methods._func2();
				console.log("Foo::func1 a: " + this._interface.a);
			},
			
			_func2:function(){
				console.log("Foo::_func2 _b:" + _vars._b);
			}
		};
		
		return OOP.Construct({
			a:_vars.a,
			
			func1:_methods.func1
		});
	})());
```
```JavaScript
	console.log(Lib.Package.Foo.a); //10
	Lib.Package.Foo.func1();
```
<br/>
<br/>
####**EVENTS**####
#####CLASS EVENTS:#####
```JavaScript
	OOP.Namespace("Lib.Package.EventTest", "event_test"); //Static
	OOP.Namespace("Lib.Package.Foo", function(params){
		var _methods = {
			func1:function(){
				this._interface.dispatchEvent(new OOP.Event(Lib.Package.EventTest, "testData"));
			}
		};
		
		return OOP.Construct({
			func1:_methods.func1
		}, params, true); //True adds event methods
	});
```
```JavaScript
	function handler_event(evt){
		console.log(evt._type); //event_test
		console.log(evt._data); //testData
	}
	var foo = new Lib.Package.Foo();
	foo.addEventListener(Lib.Package.EventTest, handler_event);
	foo.func1(); //Fires event
```
#####GENERAL EVENTS:#####
```JavaScript
	var obj = document.getElementById("#container");	//obj can be anything
	OOP.addEventListener(obj, "click", handler_click);	//Provides cross-browser event handling
```
<br/>
<br/>
###**API DOCUMENTATION:**###
|Method|Description|
|:------|:-----------|
|Namespace(namespace, obj)|Namespaces an object or function.<br/>Adds a _type property to the obj equal to the namespace.|
|Construct(obj, params, events)|Overwrites properties on obj with those of params.<br/>Adds an _isType method to obj<br/>Adds an _interface property to obj<br/>Adds a _type property to namespaced objects<br/>If events is true adds event methods to obj|
|Extend(obj, extendingObj)|Adds propertes on extendingObj from new obj if not there<br/>Adds _super property on extendingObj pointing to obj<br/>Updates _interface property on _super chain to point to extendingObj|
|Event(type, data)|Safe cross-browser event (use 'new OOP.Event()')|
|addEventListener(obj, types, handler)|Safe cross-browser way to listen for one or more events<br/>types can be comma delimeted to listen for multiple events|
|removeEventListener(obj, types, handler)&nbsp;&nbsp;&nbsp;|Safe cross-browser way to listen for one or more events<br/>types can be comma delimeted to listen for multiple events<br/>If no handler is passed all handlers for each event type will be removed|
|dispatchEvent(obj, event)|Safe cross-browser way to dispatch an event|
|isType(obj, type)|Returns true if the obj extends or is namespaced under the type|
<br/>
####**SPECIAL PROPERTIES:**####
<p>The following "special" properties get added by OOP. This section is to explain their use.</p>
|Property|Description|
|:------|:-----------|
|_type|This property gets added when calling OOP.Namespace as well as OOP.Construct and gets updated when calling OOP.Extend.<br/>The _type property contains the value of the current namespace.|
|_super|This property gets added when calling OOP.Extend.<br/>The _super property refers to an instance of the extended object.|
|_interface&nbsp;&nbsp;&nbsp;|This property gets added when calling OOP.Construct and gets updated when calling OOP.Extend.<br/>The _interface property points to the "current instance". Often times "this" points to the same object as "this._interface" HOWEVER it is important to use the _interface property any time you access a public property or method. This ensures that you are calling the method on the instance (extended or not)|
|_isType|This property gets added when calling OOP.Construct.<br/>Returns true if the obj extends or is namespaced under the type|