(function(){
	namespace("Pong.Models.Score",
	construct({

		instance:function(_private, _public){
			return {
				id:"",
				ref:null,
	
				_value:0,
	
				__construct:function(id){
					//Base classes should reference this._interface which points to the extended instance
					//Note that this._interface in __construct points to "this" because the extending class has not yet been created when this is called
					this._interface.id = id;
					this._interface.ref = document.getElementById(id);
					this.update();
				},
	
				//Getter/Setter
				value:function(value){
					if (typeof value !== typeof undefined){
						_private._value = value;
						this.update();
					}
					return _private._value;
				},
	
				update:function(){
					if (this.ref){
						this.ref.innerText = _private._value;
					}
				}
			}
		}
		
	}));
})();