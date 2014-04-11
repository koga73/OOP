##OOP##
*By: AJ Savino*

###IMPLEMENTATION EXAMPLES###

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
A basic class

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
An extending class