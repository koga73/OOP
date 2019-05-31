(function(){
	namespace("Pong.Models.Object2D", construct({
		instance:{
			id:"",
			ref:null,
			x:0,
			y:0,
			width:0,
			height:0,
			moveX:0,
			moveY:0,

			__construct:function(id){
				//Base classes should reference this._interface which points to the extended instance
				//Note that this._interface in __construct points to "this" because the extending class has not yet been created when this is called
				this._interface.id = id;
				this._interface.ref = document.getElementById(id);
				
				this._interface.x = this._interface.getComputed("left");
				this._interface.y = this._interface.getComputed("top");
				this._interface.width = this._interface.getComputed("width");
				this._interface.height = this._interface.getComputed("height");
			},

			getComputed:function(prop, useInt){
				useInt = useInt === true;

				try {
					var value = window.getComputedStyle(this._interface.ref)[prop];
					if (useInt){
						value = parseInt(value);
					} else {
						value = parseFloat(value);
					}
					if (isNaN(value)){
						value = 0;
					}
					return value;
				} catch (err){
					return 0;
				}
			}
		}
	}));
})();