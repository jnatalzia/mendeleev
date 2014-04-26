'use strict';
var dmitri = dmitri || {};

dmitri.app = {

	// variable properties
	renderer: undefined,
	scene: undefined,
	camera: undefined,
	myobjects: [],
	paused: false,
	dt: 1/60,
	controls: undefined,
	cube: undefined,

	init: function() {
		dmitri.elements = elements;

		this.setupThreeJS();
		this.setupWorld();
		this.update();
	},

	setupThreeJS: function() {

		// set scene
		this.scene = new THREE.Scene();



		// set camera
		// this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.camera = new THREE.PerspectiveCamera( 75, 320 / 320, 0.1, 1000 );
		this.camera.position.z = 30;

		// set renderer
		this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: document.querySelector('#model')});
		this.renderer.setSize( 320, 320 );
		// this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.setClearColor(0x111111, 1.0);
		// this.renderer.setClearColor(0x222222, 1.0);
		// this.renderer.setClearColor(0xeeeeee, 1.0);
		this.renderer.shadowMapEnabled = true;


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

		// this.controls = new THREE.FirstPersonControls(this.camera);
		// this.controls.movementSpeed = 100;
		// this.controls.lookSpeed = 0.1;
		// this.controls.autoForward = false;
	},
	
	setupWorld: function() {

		var models = dmitri.models;

		/* making an atom */
		// proton
		var proton = new THREE.Mesh(models.proton.geometry, models.proton.material);
		proton.receiveShadow = true;
		// neutron
		var neutron = new THREE.Mesh(models.neutron.geometry, models.neutron.material);
		neutron.receiveShadow = true;
		neutron.position.y = 1.5;
		// electron
		var electron = new THREE.Mesh(models.electron.geometry, models.electron.material);
		electron.receiveShadow = true;
		electron.position.y = 10;

		this.scene.add(proton);
		this.scene.add(neutron);
		this.scene.add(electron);
	},



			
			
		update: function(){
			// schedule next animation frame
			app.animationID = requestAnimationFrame(this.update.bind(this));
			
		// PAUSED?
		if (app.paused){
			this.drawPauseScreen();
			return;
		 }
	
		// UPDATE
		// this.controls.update(this.dt);
		
			// this.cube.rotation.x += 0.0125;
			// this.cube.rotation.y += 0.0125;


		// DRAW	
		this.renderer.render(this.scene, this.camera);
					// requestAnimationFrame(render);


			// renderer.render(scene, camera);
	},
	

			

	
	drawPauseScreen: function(){
		// do something pause-like if you want
	}

};