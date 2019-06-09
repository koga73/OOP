//Encapsulate class to not pollute window namespace
(function(){
	//Imports - "var" can be replaced with "const" - kept as "var" for IE support
	var Models = Pong.Models;
	var DomRenderer = Pong.Renderers.DomRenderer;
	var InputManager = Pong.Managers.InputManager;
	var NormalTimer = Utils.NormalTimer;
	var MessageQueue = Utils.MessageQueue;
	
	//This returns a reference to the class. We are using the word "_class" as a shortcut to easily access static members
	var _class =
	namespace("Pong",
	construct({

		//Constants
		static:{
			ID_BOARD:"board",
			ID_SCORE1:"score1",
			ID_PADDLE1:"paddle1",
			ID_BALL:"ball",
			ID_SCORE2:"score2",
			ID_PADDLE2:"paddle2",

			BALL_DELAY:2500, //milliseconds
			SPEED_PADDLE:500, //Pixels-per-second
			SPEED_BALL:400, //Pixels-per-second
			PADDLE_ENERGY_FACTOR:0.15, //The amount of energy transfered from the paddle to the ball

			singleton:null,
			getSingleton:function(){
				if (!_class.singleton){
					//Pass in array since we want it to go to __constructor
					_class.singleton = new Pong(
						_class.ID_BOARD,
						_class.ID_SCORE1,
						_class.ID_PADDLE1,
						_class.ID_BALL,
						_class.ID_SCORE2,
						_class.ID_PADDLE2
					);
				}
				console.log(Pong._type + "::getSingleton - Singleton:", _class.singleton);
				return _class.singleton;
			}
		},

		//In general _public is optional since it's the same as "this" (except in the scope of a private method)
		//_public is useful if "this" has changed you can use "_public" instead of creating a delegate
		//_public must be used in the scope of private methods since "this" points to the private instance
		//Properties and methods starting with an underscore '_' are private
		instance:function(_private, _public){
			return {
				board:null,
				score1:null,
				paddle1:null,
				ball:null,
				score2:null,
				paddle2:null,

				normalTimer:null,
				inputManager:null,

				_renderer:null,
				_renderQueue:[],

				__construct:function(boardId, score1Id, paddle1Id, ballId, score2Id, paddle2Id){
					//Init game objects
					this.board = new Models.Object2D(boardId);
					this.score1 = new Models.Score(score1Id);
					this.paddle1 = new Models.Paddle(paddle1Id);
					this.ball = new Models.Object2D(ballId);
					this.score2 = new Models.Score(score2Id);
					this.paddle2 = new Models.Paddle(paddle2Id);

					//Init game timer
					this.normalTimer = new NormalTimer({
						paused:false,
						onTick:_private._onTick
					});
					this.inputManager = InputManager.getSingleton();

					//Init renderer
					_private._renderer = new DomRenderer();
					_private._renderQueue = [
						this.paddle1,
						this.ball,
						this.paddle2
					];

					//Listen for messages
					//"on" is an alias for "addEventListener"
					MessageQueue.on(MessageQueue.PLAYER1_DIRECTION, function(evt, direction){ _public.paddle1.moveY = _class.SPEED_PADDLE * direction; });
					MessageQueue.on(MessageQueue.PLAYER2_DIRECTION, function(evt, direction){ _public.paddle2.moveY = _class.SPEED_PADDLE * direction; });
					
					//Start
					this.resetBall();
				},

				//Delta is the time elapsed between ticks
				//Multiplying a movement value by delta makes the movement timebased rather than based on the clock cycle
				_onTick:function(delta){
					//Move
					var queueLen = _private._renderQueue.length;
					for (var i = 0; i < queueLen; i++){
						var obj2d = _private._renderQueue[i];
						obj2d.x += obj2d.moveX * delta;
						obj2d.y += obj2d.moveY * delta;
					}
					
					//Caches
					var board = _public.board;
					var score1 = _public.score1;
					var paddle1 = _public.paddle1;
					var ball = _public.ball;
					var score2 = _public.score2;
					var paddle2 = _public.paddle2;

					var ballHalfWidth = ball.width * 0.5;
					var ballHalfHeight = ball.height * 0.5;
					var paddleHalfHeight = paddle1.height * 0.5;
					
					//Ball collide with paddles
					if (ball.x - ballHalfWidth < paddle1.x + paddle1.width){
						if (ball.y + ballHalfHeight > paddle1.y - paddleHalfHeight && ball.y - ballHalfHeight < paddle1.y + paddleHalfHeight){
							//Bounce!
							ball.x = ballHalfWidth + paddle1.x + paddle1.width;
							ball.moveX *= -1;
							ball.moveY += paddle1.moveY * _class.PADDLE_ENERGY_FACTOR;
						}
					}
					if (ball.x + ballHalfWidth > paddle2.x - paddle2.width){
						if (ball.y + ballHalfHeight > paddle2.y - paddleHalfHeight && ball.y - ballHalfHeight < paddle2.y + paddleHalfHeight){
							//Bounce!
							ball.x = paddle2.x - paddle2.width - ballHalfWidth;
							ball.moveX *= -1;
							ball.moveY += paddle2.moveY * _class.PADDLE_ENERGY_FACTOR;
						}
					}

					//Ball collide with borders
					if (ball.x + ballHalfWidth < 0){
						//Player 2 scores!
						score2.value(score2.value() + 1);
						_public.resetBall();
					}
					if (ball.x - ballHalfWidth > board.width){
						//Player 1 scores!
						score1.value(score1.value() + 1);
						_public.resetBall();
					}
					if (ball.y - ballHalfHeight < 0){
						//Bounce!
						ball.y = ballHalfHeight;
						ball.moveY *= -1; //Bounce!
					}
					if (ball.y + ballHalfHeight > board.height){
						//Bounce!
						ball.y = board.height - ballHalfHeight;
						ball.moveY *= -1; //Bounce!
					}

					//Paddle collide with borders
					if (paddle1.y - paddleHalfHeight < 0){
						paddle1.y = paddleHalfHeight;
					}
					if (paddle1.y + paddleHalfHeight > board.height){
						paddle1.y = board.height - paddleHalfHeight;
					}
					if (paddle2.y - paddleHalfHeight < 0){
						paddle2.y = paddleHalfHeight;
					}
					if (paddle2.y + paddleHalfHeight > board.height){
						paddle2.y = board.height - paddleHalfHeight;
					}

					//Render
					_private._renderer.render(_private._renderQueue);
				},

				resetBall:function(){
					var board = this.board;
					var ball = this.ball;

					//Init ball angle - we don't want the angle to be vertical
					var startBallAngle = Math.random() * 180;
					startBallAngle = (startBallAngle >= 90) ? startBallAngle + 90 : startBallAngle;
					startBallAngle += 45;
					startBallAngle *= (Math.PI / 180); //To Radians

					ball.x = board.width * 0.5;
					ball.y = board.height * 0.5;
					ball.moveX = 0;
					ball.moveY = 0;

					//Delay
					var ballTimeout = setTimeout(function(){
						clearTimeout(ballTimeout);

						ball.moveX = Math.sin(startBallAngle) * _class.SPEED_BALL;
						ball.moveY = Math.cos(startBallAngle) * _class.SPEED_BALL;
					}, _class.BALL_DELAY);
				}
			};
		}

	}));
	_class.getSingleton();
})();