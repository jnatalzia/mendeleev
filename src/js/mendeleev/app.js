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

		// dmitri.atom.init(this.scene);
		this.atom = dmitri.atom.build(dmitri.elements[0]);
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


		// set camera
		// this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.camera = new THREE.PerspectiveCamera( 75, width / width, 0.1, 1000 );

		this.camera.position.z = width*0.05;
		if (width > 480) this.camera.position.z = width*0.025;

		// this.cameraControls = new THREE.OrbitControls(this.camera);
		// // this.cameraControls = new THREE.OrbitControls(this.camera, document.querySelector('#model'));
		// // this.cameraControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		// // this.cameraControls.target.set( 0, 40, 0);
		// this.cameraControls.maxDistance = 200;
		// this.cameraControls.minDistance = 5;
		// this.cameraControls.update();



		// add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    // var ambientLight = new THREE.AmbientLight(0xebebeb);
    // var ambientLight = new THREE.AmbientLight(0xc0c0c0);
    // var ambientLight = new THREE.AmbientLight(0x606060);
    this.scene.add(ambientLight);

    var spotLight = new THREE.SpotLight( 0xffffff );
    // var spotLight = new THREE.SpotLight( 0xaaaaaa );
    spotLight.position.y = 10;
    spotLight.position.z = 30;
    spotLight.castShadow = true;
    // spotLight.lookAt(sphere);
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
		};

		// this.cube.rotation.x += 0.0125;
		// this.cube.rotation.y += 0.0125;


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
		for (var i = 0; i < dmitri.elements.length; i++) {
			/* should probably do some regex here */
			if (search == dmitri.elements[i].name.toLowerCase()) {
				console.log('we have a match');
				dmitri.atom.build(i);
			}
		};
	}
};