(function(){
	//This is just a global class to dispatch and listen for events
	namespace("Utils.MessageQueue",
	construct({

		static:{
			PLAYER1_DIRECTION:"player1_direction",
			PLAYER2_DIRECTION:"player2_direction",
		},
		staticEvents:true
		
	}));
})();