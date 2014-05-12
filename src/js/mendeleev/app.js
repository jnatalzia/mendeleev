'use strict';
var dmitri = dmitri || {};

dmitri.app = {

	// variable properties
	atomRenderer: undefined,
	tableRenderer:undefined,
	//different scenes
	scene: undefined,
	atomScene:undefined,
	tableScene:undefined,
	camera: undefined,
	tableCamera:undefined,
	cameraControls: undefined,
	myobjects: [],
	paused: false,
	dt: 1/60,
	step: 0,
	atom: undefined,
	table:undefined,
	//application states
	state:0,
	STATE_PERIODIC_TABLE:0,
	STATE_ATOM_VIEW:1,

	init: function() {
		// get data
		dmitri.elements = elements;


		this.setupThreeJS();

		this.table = dmitri.table;
		this.table.init(this.tableScene);


		this.atom = dmitri.atom;
		this.atom.init(elements, document.querySelector('#atom'), this.atomScene); // "elements" is from data/elements.json 
		this.atom.build(1); // hydrogen. build() uses atomic numbers


		this.update();
	},





  // createParticles: function() {
  //   var material = new THREE.ParticleBasicMaterial();

  //   for (var x = -5; x < 5; x++) {
  //     for (var y = -5; y < 5; y++) {
  //       var particle = new THREE.Particle(material);
  //       particle.position.set(x * 10, y * 10, 0);
  //       this.atomScene.add(particle);
  //     }
  //   }
  // },






	setupThreeJS: function() {


		// get screen size and base everything off of that
		var width = window.innerWidth;
		// if (width > 540) width = 540;
		// document.querySelector('#atom-wrapper').style.height= width+'px';
		// document.querySelector('#atom-wrapper').style.width= width+'px';

		// document.querySelector('#table-wrapper').style.height= width+'px';
		// document.querySelector('#table-wrapper').style.width= width+'px';
		// //set canvas size
		var canvas = document.querySelector('#model');
		var tablecanvas = document.querySelector('#table');



		// set renderer
		this.atomRenderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
		this.atomRenderer.setSize( window.innerWidth, window.innerHeight );
		this.atomRenderer.setClearColor(0x000014, 1.0);
		this.atomRenderer.shadowMapEnabled = true;

		this.tableRenderer = new THREE.WebGLRenderer({antialias: true, canvas: tablecanvas});
		this.tableRenderer.setSize( window.innerWidth, window.innerHeight );
		this.tableRenderer.setClearColor(0x000014, 1.0);
		this.tableRenderer.shadowMapEnabled = true;









		// set scene
		//this.scene = new THREE.Scene();
		this.atomScene = new THREE.Scene();
		this.atomScene.fog = new THREE.FogExp2(0x9db3b5, 0.002);

		this.tableScene = new THREE.Scene();


		/* set camera */
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		// position
		// this.camera.position.z = width*0.05;
		// if (width > 480) this.camera.position.z = width*0.025;
		this.camera.position.z = width*0.1;

		this.tableCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		// position
		// this.camera.position.z = width*0.05;
		// if (width > 480) this.camera.position.z = width*0.025;
		this.tableCamera.position.z = width*0.1;

		// if (width > 480) this.camera.position.z = width*0.035;
		if (width > 480) this.camera.position.z = width*0.05;

		// this.cameraControls = new THREE.OrbitControls(this.camera, document.querySelector("#atom-wrapper"));
		this.cameraControls = new THREE.OrbitControls(this.tableCamera, document.querySelector("#table-wrapper"));


		// add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x222222);
    // var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    var spotLight = new THREE.SpotLight( 0xffffff );
		    spotLight.position.y = 10;
		    spotLight.position.z = 30;
		    spotLight.castShadow = true;
    spotLight.lookAt(this.atomScene);
		var spotLight2 = new THREE.SpotLight( 0xffffff );
		    spotLight2.position.y = 10;
		    spotLight2.position.z = -30;
		    spotLight2.castShadow = true;
    spotLight2.lookAt(this.atomScene);
		var spotLight3 = new THREE.SpotLight( 0xffffff );
		    spotLight3.position.y = -10;
		    spotLight3.position.z = 30;
		    spotLight3.castShadow = true;
    spotLight3.lookAt(this.atomScene);

    this.atomScene.add(ambientLight);    
    this.atomScene.add(spotLight);
    this.atomScene.add(spotLight2);
    // this.atomScene.add( spotLight3 );

	},

	updateAtom: function(number,raw)
	{
		var atomicNumber = raw ? number + 1 : number;
		this.atom.build(atomicNumber);
		//this.state = this.STATE_ATOM_VIEW;
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
		this.atomRenderer.render(this.atomScene, this.camera);
		this.tableRenderer.render(this.tableScene, this.tableCamera)
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
	// doMousedown: function(event) {
	// 	if (this.state == this.STATE_PERIODIC_TABLE)
	// 	{
	// 		this.table.doMousedown(event);
	// 	}
 //  },
 //  doMouseup: function(e)
 //  {
 //  	if (this.state == this.STATE_PERIODIC_TABLE)
	// 	{
	// 	this.table.doMouseup(e);
	// 	}
 //  }
};