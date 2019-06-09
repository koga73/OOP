(function(){
	namespace("Pong.Renderers.DomRenderer",
	construct({

		instance:{
			render:function(queue){
				var queueLen = queue.length;
				for (var i = 0; i < queueLen; i++){
					var obj2d = queue[i];
					var obj2dRef = obj2d.ref;

					var currentX = obj2d.getComputed("left");
					var newX = obj2d.x;
					if (Math.abs(newX - currentX) > 1){ //Forget about rounding errors
						obj2dRef.style.left = newX + "px";
					}

					var currentY = obj2d.getComputed("top");
					var newY = obj2d.y;
					if (Math.abs(newY - currentY) > 1){ //Forget about rounding errors
						obj2dRef.style.top = newY + "px";
					}
				}
			}
		}
		
	}));
})();