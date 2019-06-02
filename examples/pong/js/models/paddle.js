(function(){
	var _class = namespace("Pong.Models.Paddle", inherit(Pong.Models.Object2D, construct({
		static:{
			DEFAULT_WIDTH:32,
			DEFAULT_HEIGHT:128
		},

		instance:{
			__construct:function(){
				this.width = this.width || _class.DEFAULT_WIDTH;
				this.height = this.height || _class.DEFAULT_HEIGHT;
			}
		}
	})));
})();