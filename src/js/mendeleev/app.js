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
	table:undefined,

	init: function() {
		// get data
		dmitri.elements = elements;


		this.setupThreeJS();

		this.atom = dmitri.atom;
		this.atom.init(elements, document.querySelector('#atom'), this.scene); // "elements" is from data/elements.json 
		this.atom.build(3); // hydrogen. build() uses atomic numbers

		this.createParticles();


		this.table = dmitri.table;
		this.table.init();

		this.update();
	},





  createParticles: function() {
    var material = new THREE.ParticleBasicMaterial();

    for (var x = -5; x < 5; x++) {
      for (var y = -5; y < 5; y++) {
        var particle = new THREE.Particle(material);
        particle.position.set(x * 10, y * 10, 0);
        this.scene.add(particle);
      }
    }
  },







	setupThreeJS: function() {


		// get screen size and base everything off of that
		var width = window.innerWidth;
		if (width > 540) width = 540;
		document.querySelector('#atom-wrapper').style.height= width+'px';
		document.querySelector('#atom-wrapper').style.width= width+'px';



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
		// this.camera.position.z = width*0.05;
		// if (width > 480) this.camera.position.z = width*0.025;
		this.camera.position.z = width*0.1;
		// if (width > 480) this.camera.position.z = width*0.035;
		if (width > 480) this.camera.position.z = width*0.05;



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
	
		this.atom.animate();

		// DRAW	
		this.renderer.render(this.scene, this.camera);
	},
	

			

	
	drawPauseScreen: function(){
		// do something pause-like if you want
	},

	search: function(e) {
		var search = dmitri.search.value;

		for (var i = 0; i < dmitri.elements.length; i++) {
			/* should probably do some regex here */
			if (search == dmitri.elements[i].name.toLowerCase()) {
				dmitri.app.atom.build(i, true);
			}
		};
	}
};