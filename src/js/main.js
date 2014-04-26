'use strict';

/*
	Dmitri Ivanovich Mendeleev was a Russian chemist and inventor. 
	He formulated the Periodic Law, created his own version of the 
	periodic table of elements, and used it to correct the 
	properties of some already discovered elements and also to 
	predict the properties of elements yet to be discovered.
*/

var dmitri = dmitri || {};



// set app wide variables
// CONSTANTS of app
dmitri.KEYBOARD = {
	"KEY_LEFT": 37, 
	"KEY_UP": 38, 
	"KEY_RIGHT": 39, 
	"KEY_DOWN": 40,
	"KEY_SPACE": 32
};

// properties of app
dmitri.animationID = undefined;
dmitri.paused = false;

// key daemon array
dmitri.keydown = [];


document.onload = function() {
	console.log('hey man. you\'ll be alright. you\'ll go far kid.');
	// var queue = new createjs.LoadQueue(false);
	// 		queue.on("fileload", handleFileLoad, this);
	// 		queue.on("complete", complete, this);
	// 		queue.loadFile("js/lib/three.min.js");
	// 		queue.loadFile("js/lib/FirstPersonControls.js");
	// 		queue.loadFile("js/city.js");
	
	// function handleFileLoad(e){
	// 	console.log(e + " loaded");
	// }
	
	// function handleComplete(e){
	// 	dmitri.city.init();
	// }
	
	// // when the loading is complete, this function will be called
 // function complete(){
		
	// 	// set up event handlers
	// 	window.onblur = function(){
	// 		dmitri.paused = true;
	// 		cancelAnimationFrame(dmitri.animationID);
	// 		dmitri.keydown = []; // clear key daemon
	// 		// call update() so that our paused screen gets drawn
	// 		dmitri.city.update();
	// 	};
		
	// 	window.onfocus = function(){
	// 		dmitri.paused = false;
	// 		cancelAnimationFrame(dmitri.animationID);
	// 		// start the animation back up
	// 		dmitri.city.update();
	// 	};
		
	// 	// event listeners
	// 	window.addEventListener("keydown",function(e){
	// 		console.log("keydown=" + e.keyCode);
	// 		dmitri.keydown[e.keyCode] = true;
	// 	});
			
	// 	window.addEventListener("keyup",function(e){
	// 		console.log("keyup=" + e.keyCode);
	// 		dmitri.keydown[e.keyCode] = false;
	// 	});
		
		
	// 	// start game
	// 	dmitri.city.init();
	// } // end complete


}