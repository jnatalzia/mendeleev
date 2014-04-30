'use strict';
var dmitri = dmitri || {};

dmitri.app = {

	// variable properties
	renderer: undefined,
	scene: undefined,
	camera: undefined,
	cameraControls: undefined,
	myobjects: [],
	paused: false,
	dt: 1/60,
	step: 0,
	atom: undefined,

	init: function() {
		// get data
		dmitri.elements = elements;


		this.setupThreeJS();

		this.atom = dmitri.atom;
		this.atom.init(elements, document.querySelector('#atom'), this.scene); // "elements" is from data/elements.json 
		this.atom.build(1); // hydrogen. build() uses atomic numbers

		this.update();
	},

	setupThreeJS: function() {


		// get screen size and base everything off of that
		var width = window.innerWidth;
		document.querySelector('#atom-wrapper').style.height= width+'px';



		// set renderer
		this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: document.querySelector('#model')});
		this.renderer.setSize( width, width );
		this.renderer.setClearColor(0x111111, 1.0);
		this.renderer.shadowMapEnabled = true;


		// set scene
		this.scene = new THREE.Scene();


		/* set camera */
		this.camera = new THREE.PerspectiveCamera( 75, width / width, 0.1, 1000 );
		// position
		this.camera.position.z = width*0.05;
		if (width > 480) this.camera.position.z = width*0.025;



		// add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    var spotLight = new THREE.SpotLight( 0xffffff );
		    spotLight.position.y = 10;
		    spotLight.position.z = 30;
		    spotLight.castShadow = true;
    // spotLight.lookAt(sphere);

    this.scene.add(ambientLight);    
    this.scene.add( spotLight );

	},
				
			
	update: function(){
		// schedule next animation frame
		dmitri.animationID = requestAnimationFrame(this.update.bind(this));
		
		// PAUSED?
		if (dmitri.paused){
			this.drawPauseScreen();
			return;
		 }
	
		// UPDATE
		// this.controls.update();
		// this.cameraControls.update();

		this.step += 0.04;
		for (var i = 0; i < this.atom.electrons.length; i++) {
			this.atom.electrons[i].position.x = 0+( 10*(Math.cos(this.step)));
			this.atom.electrons[i].position.y = 0 +( 10*(Math.sin(this.step)));			
			this.atom.electrons[i].rotation.x += 0.0125;
			// this.atom.electrons[i].position.z = 0 +( 1*(Math.sin(this.step)));			
		};

		// this.atom.atom.rotation.y += 0.0125/4;
		this.atom.atom.rotation.y += 0.0125/2;


		// DRAW	
		this.renderer.render(this.scene, this.camera);
	},
	

			

	
	drawPauseScreen: function(){
		// do something pause-like if you want
	},

	search: function(e) {
		// console.log(e);
		console.log(dmitri.search.value);
		var search = dmitri.search.value;

		var self = this;

		for (var i = 0; i < dmitri.elements.length; i++) {
			/* should probably do some regex here */
			if (search == dmitri.elements[i].name.toLowerCase()) {
				console.log('we have a match');	
				console.log(this);
				console.log(self);
				dmitri.app.atom.build(i, true);
				// this.atom.build(i, raw).bind(this);
			}
		};
	}
};