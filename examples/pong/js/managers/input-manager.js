(function(){
	const MessageQueue = Pong.Utils.MessageQueue;

	//This returns a reference to the class. We are using the word "_class" as a shortcut to easily access static members 
	const _class = namespace("Pong.Managers.InputManager", construct({
		static:{
			KEY_CODE_W:87,
			KEY_CODE_S:83,
			KEY_CODE_ARROW_UP:38,
			KEY_CODE_ARROW_DOWN:40,

			singleton:null,

			getSingleton:function(){
				if (!_class.singleton){
					//Pass in array since we want it to go to __constructor
					_class.singleton = new Pong.Managers.InputManager();
				}
				return _class.singleton;
			}
		},

		//In general _public is optional since it's the same as "this"
		//However _public is useful if "this" scope is not correct you can use "_public" instead of creating a delegate
		instance:function(_private, _public){
			return {
				player1Controls:[
					_class.KEY_CODE_W,
					_class.KEY_CODE_S,
				],
				player2Controls:[
					_class.KEY_CODE_ARROW_UP,
					_class.KEY_CODE_ARROW_DOWN,
				],

				player1Up:false,
				player1Down:false,
				player2Up:false,
				player2Down:false,

				__construct:function(){
					this.init();
				},

				init:function(){
					document.addEventListener("keydown", _private._handler_key_down);
					document.addEventListener("keyup", _private._handler_key_up);
				},

				destroy:function(){
					document.removeEventListener("keydown", _private._handler_key_down);
					document.removeEventListener("keyup", _private._handler_key_up);
				},
				
				_handler_key_down:function(evt){
					switch (evt.keyCode){
						case _public.player1Controls[0]:
							if (!_public.player1Up){
								_public.player1Up = true;
								_private._emitDirection(1);
							}
							break;
						case _public.player1Controls[1]:
							if (!_public.player1Down){
								_public.player1Down = true;
								_private._emitDirection(1);
							}
							break;
						case _public.player2Controls[0]:
							if (!_public.player2Up){
								_public.player2Up = true;
								_private._emitDirection(2);
							}
							break;
						case _public.player2Controls[1]:
							if (!_public.player2Down){
								_public.player2Down = true;
								_private._emitDirection(2);
							}
							break;
					}
				},

				_handler_key_up:function(evt){
					switch (evt.keyCode){
						case _public.player1Controls[0]:
							if (_public.player1Up){
								_public.player1Up = false;
								_private._emitDirection(1);
							}
							break;
						case _public.player1Controls[1]:
							if (_public.player1Down){
								_public.player1Down = false;	
								_private._emitDirection(1);
							}
							break;
						case _public.player2Controls[0]:
							if (_public.player2Up){
								_public.player2Up = false;
								_private._emitDirection(2);
							}
							break;
						case _public.player2Controls[1]:
							if (_public.player2Down){
								_public.player2Down = false;
								_private._emitDirection(2);
							}
							break;
					}
				},

				//Direction ( 1 | 0 | -1 )
				_emitDirection:function(player){
					var direction = 0;
					switch (player){
						case 1:
							if (!_public.player1Up || !_public.player1Down){
								if (_public.player1Up){
									direction = -1;
								}
								if (_public.player1Down){
									direction = 1;
								}
							}
							MessageQueue.emit(new OOP.Event(MessageQueue.PLAYER1_DIRECTION, direction));
							break;
						case 2:
							if (!_public.player2Up || !_public.player2Down){
								if (_public.player2Up){
									direction = -1;
								}
								if (_public.player2Down){
									direction = 1;
								}
							}
							MessageQueue.emit(new OOP.Event(MessageQueue.PLAYER2_DIRECTION, direction));
							break;
					}
				}
			};
		},
		events:true
	}));
})();