(function(){
	var _class =
	namespace("Utils.NormalTimer",
	construct({

		static:{
			FPS:60, //Frames-per-second for interval if requestAnimationFrame doesn't exist
		},

		instance:function(_private, _public){
			var constructTime = new Date().getTime();

			return {
				paused:true,

				_delta:0,
				_lastTime:constructTime,
				_startTime:constructTime,

				_renderInterval:0, //If requestAnimationFrame doesn't exist

				__construct:function(){
					if ("requestAnimationFrame" in window){
						requestAnimationFrame(_private._loop);
					} else {
						_private._renderInterval = setInterval(_private._loop, 1000 / _class.FPS);
					}
				},

				elapsed:function(){ //Getter
					return (new Date().getTime() - _private._startTime) * 0.001;
				},
			
				delta:function(){ //Getter
					return _private._delta;
				},
			
				tick:function(){
					var currentTime = new Date().getTime();
					_private._delta = (currentTime - _private._lastTime) * 0.001;
					_private._lastTime = currentTime;
					return _private._delta;
				},

				_loop:function(){
					var delta = _public.tick();
					if (!_public.paused && delta < 1){ //As to not "jump" when returning to page
						_public.onTick(delta);
					}
					if (!_private._renderInterval){
						requestAnimationFrame(_private._loop);
					}
				},
				
				onTick:function(delta){
					console.warn(_class._type + "::_onTick - override this method!", delta);
				}
			};
		}
		
	}));
})();