'use strict';

/*
	Dmitri Ivanovich Mendeleev was a Russian chemist and inventor. 
	He formulated the Periodic Law, created his own version of the 
	periodic table of elements, and used it to correct the 
	properties of some already discovered elements and also to 
	predict the properties of elements yet to be discovered.
*/

var dmitri = dmitri || {};
dmitri.elements = undefined;


// set app wide variables
// CONSTANTS of app
dmitri.KEYBOARD = {
	"KEY_LEFT": 37, 
	"KEY_UP": 38, 
	"KEY_RIGHT": 39, 
	"KEY_DOWN": 40,
	"KEY_SPACE": 32
};

// key daemon array
dmitri.keydown = [];

dmitri.search = undefined;

// properties of app
dmitri.animationID = undefined;
dmitri.paused = false;

dmitri.soundtrack = undefined;

dmitri.current = 0;


document.onload = function() {
	console.log("hey man. you\'ll be alright. you\'ll go far kid.");

	// load da things
	Modernizr.load({
		load: [
			// data
			'data/elements.json',
			// js
			// 'js/libs/three.min.js',
			'js/libs/controls/OrbitControls.js',
			'js/mendeleev/particles.js',
			'js/mendeleev/models.js',
			'js/mendeleev/atom.js',
			'js/mendeleev/app.js',
			'js/mendeleev/table.js',
			//'js/mendeleev/test,js'
			'js/mendeleev/utilities.js'
			// images
			// dmitri.IMAGES['smoke']	
		],

		complete: function() {
			
			/* event handlers */
			window.onblur = function() {
				// dmitri.paused = true;
				// cancelAnimationFrame(dmitri.animationID);
				dmitri.keydown = [];
				// dmitri.soundtrack.volume = 0.15;
				// dmitri.app.update();
			}
			window.onfocus = function() {
				// dmitri.paused = false;
				// cancelAnimationFrame(dmitri.animationID);
				// dmitri.soundtrack.volume = 0.8;
				// dmitri.app.update();
			}

			// keyup/down
			window.onkeydown = function(e) {
				dmitri.keydown[e.keyCode] = true;
			}
			window.onkeyup = function(e) {
				dmitri.keydown[e.keyCode] = false;
			}
			window.onmousedown = function(e)
			{
				dmitri.app.doMousedown(e);
			}
			window.onmouseup = function(e)
			{
				dmitri.app.doMouseup(e);
			}

			//mouseover for top bar
			//if possilbe do this a better way
			//iteration over elements of querySelectorAll was resulting in a return of 'noble-gas' everytime

			document.querySelector("li[data-id='alkali-metal']").addEventListener("mouseover",function(e){
				dmitri.table.highlightElements('alkali-metal');
			});
			document.querySelector("li[data-id='alkaline-earth-metal']").addEventListener("mouseover",function(e){
				dmitri.table.highlightElements('alkaline-earth-metal');
			});
			document.querySelector("li[data-id='alkali-metal']").addEventListener("mouseover",function(e){
				dmitri.table.highlightElements('alkali-metal');
			});
			document.querySelector("li[data-id='transition-metal']").addEventListener("mouseover",function(e){
				dmitri.table.highlightElements('transition-metal');
			});
			document.querySelector("li[data-id='post-transition-metal']").addEventListener("mouseover",function(e){
				dmitri.table.highlightElements('post-transition-metal');
			});
			document.querySelector("li[data-id='alkali-metal']").addEventListener("mouseover",function(e){
				dmitri.table.highlightElements('alkali-metal');
			});
			document.querySelector("li[data-id='metalloid']").addEventListener("mouseover",function(e){
				dmitri.table.highlightElements('metalloid');
			});
			document.querySelector("li[data-id='other-non-metal']").addEventListener("mouseover",function(e){
				dmitri.table.highlightElements('other-non-metal');
			});
			document.querySelector("li[data-id='halogen']").addEventListener("mouseover",function(e){
				dmitri.table.highlightElements('halogen');
			});
			document.querySelector("li[data-id='noble-gas']").addEventListener("mouseover",function(e){
				dmitri.table.highlightElements('noble-gas');
			});
			//mouseout
			var els = document.querySelectorAll("#key-wrapper ul li");

			for (var i = 0 ; i < els.length;i++)
			{
				var el = els[i];
				el.addEventListener('mouseout',function(e)
				{
					dmitri.table.unhighlightElements();
				});
			}

			/* sound stuff */

			// createjs.Sound.alternateExtensions = ["mp3"];
			// createjs.Sound.registerSound(dmitri.SOUNDS.introMusic);

			// createjs.Sound.addEventListener("fileload", handleFileLoad);

			// function handleFileLoad(e) {
			// 	console.log('pre-loaded sound: ', e.id, e.src);
			// }
				

			// search for an atom
			dmitri.search = document.querySelector('#search input');
			dmitri.search.onkeyup = dmitri.app.search;


			// show Bohr atomic model
			dmitri.bohr = document.querySelector('#bohr');
			dmitri.bohr.onchange = function() {
				if (dmitri.bohr.checked) dmitri.atom.bohr = true;
				else dmitri.atom.bohr = false;
			};

			// show orbits
			dmitri.orbits = document.querySelector('#show-orbits');
			dmitri.orbits.onchange = function() {
				if (dmitri.orbits.checked) dmitri.atom.addOrbitals();
				else dmitri.atom.removeOrbitals();
			}

			// vibrate nucleus
			dmitri.vibrate = document.querySelector('#vibrate-nucleus');
			dmitri.vibrate.onchange = function() {
				if (dmitri.vibrate.checked) dmitri.atom.vibrate = true;
				else dmitri.atom.vibrate = false;
			}


			/* start the app */
			dmitri.app.init();
		}
	});
}();