'use strict';
var dmitri = dmitri || {};

dmitri.atom = {

	scene: undefined,
	elements: undefined,
	hud: {
		number: undefined,
		symbol: undefined,
		name: undefined,
		weight: undefined,
		electrons: undefined
	},

	// 3d model
	atom: undefined, // the 3D group
	nucleus: undefined,
	protons: [],
	neutrons: [],
	electrons: [], trails: [],
	particleSystem: undefined,

	// for animation
	step: 0,


	init: function(_elements, _DOM, _scene) {
		// get the Periodic table
		this.elements = _elements;

		// get DOM references
		this.hud.number = _DOM.querySelector('#number');
		this.hud.symbol = _DOM.querySelector('#symbol');
		this.hud.name = _DOM.querySelector('#name');
		this.hud.weight = _DOM.querySelector('#weight');
		this.hud.electrons = _DOM.querySelector('#electron-config');
		
		// set scene
		this.scene = _scene;
	},

	build: function(atomicNumber, raw) {
		
		var e = this.elements[atomicNumber - 1];		// adjust for actual array number
		if (raw) e = this.elements[atomicNumber];		// unless 'raw' mode

		// console.log('build: '+ e.name);
		// console.log(e);
		
		this.makeModel(e);
		this.makeHUD(e);
	},


	reset: function() {
		this.scene.remove(this.atom);
		this.protons = [];
		this.neutrons = [];
		this.electrons = [];
	},


	makeModel: function(e) {
		// reset things
		this.reset();

		this.atom = new THREE.Object3D();

		/* making an atom */
		this.createNucleus(e);
		this.createElectrons(e);


		this.scene.add(this.atom);
	},

	createNucleus: function(e) {

		this.nucleus = new THREE.Object3D();
		this.nucleus.position.set(0, 0, 0);


		/* create */
		// ----------------------------
		// protons
		for (var i = 0; i < e.protons; i++) {
			var proton = new THREE.Mesh(dmitri.models.proton.geometry, dmitri.models.proton.material);
			proton.receiveShadow = true;
			this.protons.push(proton);
			this.nucleus.add(proton);
		};

		// neutrons
		for (var i = 0; i < e.neutrons; i++) {
			var neutron = new THREE.Mesh(dmitri.models.neutron.geometry, dmitri.models.neutron.material);
			neutron.receiveShadow = true;
			this.neutrons.push(neutron);			
			this.nucleus.add(neutron);
		};



		// 2. determine geometric shape
		// ----------------------------
		// combine protons + neutrons into single array
		// alternating as much as posssible
		var group = [];

		for (var i = 0; i < this.protons.length; i++) {
			group.push(this.protons[i]);
			group.push(this.neutrons[i]);
		};


		

		// there are often more neutrons than protons
		var difference = this.neutrons.length - this.protons.length;
		if (difference > 0) {
			for (var i = 0; i < difference; i++) {
				group.push(this.neutrons[this.protons.length + i]);
			};			
		}


		// position the protons + neutrons
		var counter = 0; // an index
		var y = 0;	// position
		var limit;	// 4 or 5 per row

		if (group.length%2 == 0)
			limit = 4;
		else
			limit = 5;

		var r = group[0].geometry.radius;

		for (var i = 0; i < group.length; i++) {
			
			if (counter == 0) group[i].position.x = r;
			if (counter == 1) group[i].position.z = r;
			if (counter == 2) group[i].position.x = -r;
			if (counter == 3) group[i].position.z = -r;
			if (counter == 4) group[i].position.z = 0;

			group[i].position.y = y;

			// incrase counter
			counter++;
			if (counter > limit - 1) {
				counter = 0;
				y += r;
			}
		};


		// center the nucleus
		this.nucleus.position.x -= (r * y) / 2;
		this.nucleus.position.z += (r * y) / 2;



		this.atom.add(this.nucleus);
	},


	createElectrons: function(e) {

		for (var i = 0; i < e.electrons; i++) {
			// electron
			var electron = new THREE.Mesh(dmitri.models.electron.geometry, dmitri.models.electron.material);
			electron.receiveShadow = true;
			
			this.electrons.push(electron);
			this.atom.add(electron);
		};


		// create trail
		// ===================================
		
		// create the particle variables
		var particleCount = 20;
		var particles = new THREE.Geometry();
		var pMaterial = new THREE.ParticleBasicMaterial({
			color: 0xFFFFFF,
			size: 1,
			map: THREE.ImageUtils.loadTexture(
				"../../img/particle.png"
			),
			blending: THREE.AdditiveBlending,
			transparent: true
		});


		// now create the individual particles
		var rad = 0; 
		for (var p = 0; p < particleCount; p++) {

			// position in an arc
		  var pX = 10*(Math.cos(rad)),
		      pY = 10*(Math.sin(rad)),
		      pZ = 0;
		  
		  rad += 0.04;
			
		  var particle = new THREE.Vertex(
				new THREE.Vector3(pX, pY, pZ)
			);

			particle.velocity = new THREE.Vector3(
			  0,              // x
			  -Math.random(), // y: random vel
			  0);             // z

		  // add it to the geometry
		  particles.vertices.push(particle);
		}

		// // create the particle system
		this.particleSystem = new THREE.ParticleSystem(
		    particles,
		    pMaterial);

		// also update the particle system to
		// sort the particles which enables
		// the behaviour we want
		this.particleSystem.sortParticles = true;


		// // add it to the scene
		this.scene.add(this.particleSystem);







		// var trail = new dmitri.particle();

		// this.trails.push(trail);
		// console.log(this.trails);

	// game.enemies = []; // empty enemies from previous chamber
	// 	// make new enemies
	// 	for (var i = 0; i < _settings.enemies.length; i++) {
	// 																	// x, y, pattern, range (in game.units), {stats}
	// 		// game.enemies.push(new game.Enemy(x, y, 0, 4, obj)); // health, speed, strength
	// 		game.enemies.push(new game.Enemy(
	// 			_settings.enemies[i].x, 
	// 			_settings.enemies[i].y,
	// 			_settings.enemies[i].pattern,
	// 			_settings.enemies[i].range,
	// 			_settings.enemies[i].stats
	// 			));

	// 	};

	},


	makeHUD: function(e) {

		this.hud.number.innerHTML = e.number;
		this.hud.symbol.innerHTML = e.symbol;
		this.hud.name.innerHTML = e.name;
		this.hud.weight.innerHTML = e.weight;

		// electron config logic
		// clear all <li>s
		while( this.hud.electrons.childNodes.length >= 1 ) {
	    this.hud.electrons.removeChild( this.hud.electrons.lastChild );
	  }

	  // make and append <li>s
	  var configs = 1;
	  var text = [];

	  if (e.electrons <= 2) {
	  	configs = 1;
	  	text[0] = e.electrons; 
	  }
	  if (e.electrons <= 10 && e.electrons > 2) {
	  	configs = 2;
	  	text[0] = '2';
	  	text[1] = e.electrons - 2;
	  }
	  if (e.electrons <= 18 && e.electrons > 10) {
	  	configs = 3;
	  	text[0] = '2';
	  	text[1] = '8';
	  	text[2] = e.electrons - 10;
	  }

	  for (var i = 0; i < configs; i++) {
			var li = document.createElement('li');
			li.innerHTML = text[i];
			this.hud.electrons.appendChild(li);  	
	  };

	},


	animate: function() {

		// this.step += 0.04;
		this.step += 0.08;

		var d = 10;
		for (var i = 0; i < this.electrons.length; i++) {
			this.electrons[i].position.x = 0 +( d*(Math.cos(this.step)));
			this.electrons[i].position.y = 0 +( d*(Math.sin(this.step)));
			if (i == 1) {
				this.electrons[i].position.x = 0 +( -d*(Math.cos(this.step)));
				this.electrons[i].position.y = 0 +( -d*(Math.sin(this.step)));
			}
			if (i == 2) {
				var nd = d + d/2;
				this.electrons[i].position.x = 0 +( -nd*(Math.cos(this.step)));
				this.electrons[i].position.y = 0 +( -nd*(Math.sin(this.step)));
			}
		};

		this.nucleus.rotation.x += 0.125;
		// this.nucleus.rotation.z += 0.125;
		this.nucleus.rotation.y += 0.125;
		

		this.particleSystem.rotation.x += 0.0125;

		// var pCount = particleCount;
		// while (pCount--) {

		//   // get the particle
		//   var particle =
		//     particles.vertices[pCount];

		//   // check if we need to reset
		//   if (particle.position.y < -200) {
		//     particle.position.y = 200;
		//     particle.velocity.y = 0;
		//   }

		//   // update the velocity with
		//   // a splat of randomniz
		//   particle.velocity.y -= Math.random() * .1;

		//   // and the position
		//   particle.position.addSelf(
		//     particle.velocity);
		// }

		// // flag to the particle system
		// // that we've changed its vertices.
		// particleSystem.geometry.__dirtyVertices = true;






		
		// vibrate nucleus
		// var rate = 1;
		// for (var i = 0; i < this.protons.length; i++) {
			
		// 	this.protons[i].position.x = rate*(Math.sin(this.step));
		// 	this.protons[i].position.y = rate*(Math.cos(this.step));
		// 	this.protons[i].position.z = rate*(Math.sin(this.step));
		// 	// this.protons[i].position.x = Math.random() * rate;
		// 	// this.protons[i].position.y = Math.random() * rate;
		// 	// this.protons[i].position.z = Math.random() * rate;
		// };

		// for (var i = 0; i < this.neutrons.length; i++) {
		// 	this.neutrons[i].position.x = Math.random() * rate;
		// 	this.neutrons[i].position.y = Math.random() * rate;
		// 	// this.neutrons[i].position.z = Math.random() * rate;
		// };



		this.atom.rotation.y += 0.0125/2;
	}

};