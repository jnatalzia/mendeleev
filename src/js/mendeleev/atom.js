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
	electrons: [], 
	shells: undefined,
	orbitals: [],
	bohrTweenReady: false,
	returnTweenReady: false,
	tweens: [],

	// for animation
	step: 0,


	// for viewing
	bohr: false,
	orbits: false,




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
		var group = [];

		// fringe case: hydrogen is the only one without a neutron
		if (this.neutrons.length == 0) group.push(this.protons[0]);
		else {
			for (var i = 0; i < this.neutrons.length; i++) {
				// push protons and neutrons to temporary group
				if (this.protons[i]) 
					group.push(this.protons[i]);
				group.push(this.neutrons[i]);
			};

			// position the protons + neutrons
			var counter = 0; // an index
			var y = 0;	// position
			var limit;	// 4 or 5 per row

			if (group.length%2 == 0) limit = 4;
			else limit = 5;

			var r = group[0].geometry.radius;

			for (var i = 0; i < group.length; i++) {
				if (counter == 0) group[i].position.x = r;
				if (counter == 1) group[i].position.z = r;
				if (counter == 2) group[i].position.x = -r;
				if (counter == 3) group[i].position.z = -r;
				if (counter == 4) group[i].position.x = 0;

				group[i].position.y = y;

				// incrase counter
				counter++;
				if (counter > limit - 1) {
					counter = 0;
					y += r;
					this.nucleus.position.y -= y / 2;
					// this.nucleus.position.y -= y / 2;
				}
			};

			// center the nucleus
			// this.nucleus.position.y -= (r * y) / 2;
			// this.nucleus.position.z += (r * y) / 2;
		};


		this.atom.add(this.nucleus);
	},


	createElectrons: function(e) {

		var radius = 10;

		// create electrons
		for (var i = 0; i < e.electrons; i++) {
			// electron
			var electron = new THREE.Mesh(dmitri.models.electron.geometry, dmitri.models.electron.material);
			electron.receiveShadow = true;

			// store Bohr position
			if (i == 0) electron.userData._y = radius;
			if (i == 1) electron.userData._y = -radius;

			// shell 1
			if (i == 2) {};

			this.electrons.push(electron);
			this.atom.add(electron);		
		};

		
		// determine amount of electron shells
		this.shells = 1;
		if (this.electrons.length > 2) {
			if (this.electrons.length === 3) this.shells = 2; // fringe case: lithium
			this.shells += Math.floor(this.electrons.length/4);
		};
		// console.log(this.shells);


	},


	createOrbitals: function() {
		// add eletrons to shells
    var material = new THREE.LineBasicMaterial( { color: 0x000066 } );

    for (var i = 1; i < this.shells+1; i++) {
    	var size = radius * i;
	    var geometry = new THREE.CircleGeometry(size, 32);

			// Remove center vertex
			geometry.vertices.shift();
			// geometry.rotation.y = 45;
			var circle = new THREE.Line(geometry, material);
			// if (i == 2) circle.rotation.x = -0.5*Math.PI;
			this.orbitals.push(circle);
			// this.atom.add(circle);
    };
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


	prepBohrTweens: function() {

		for (var i = 0; i < this.electrons.length; i++) {

			var position = {x: this.electrons[i].position.x, y: this.electrons[i].position.y, z: this.electrons[i].position.z};
			var target = { x : 0, y: this.electrons[i].userData._y, z: 0 };

			var e = this.electrons[i];
			
			new TWEEN.Tween( e.position )
				// .delay( 1000 )
				.easing( TWEEN.Easing.Circular.In )
				.to( target, 400 )
				.start();

		};

		// reset atom rotation
		console.log(this.atom.rotation);
		new TWEEN.Tween( this.atom.rotation )
				// .delay( 1000 )
				.easing( TWEEN.Easing.Circular.In )
				.to( {x: 0, y: 0, z: 0}, 400 )
				.start();

		this.bohrTweenReady = true;
	},



	animate: function() {


		if(this.bohr) {
			// tween to statc position
			if (!this.bohrTweenReady) {
				this.prepBohrTweens();
				this.createOrbitals();
			}
			else TWEEN.update();

		} else {
			// reset 
			this.bohrTweenReady = false;

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
					var nd = d + d;
					this.electrons[i].position.x = 0 +( nd*(Math.cos(this.step-0.02)));
					this.electrons[i].position.y = 0 +( nd*(Math.sin(this.step-0.02)));
				}

				if (i == 3) {
					var nd = d + d;
					this.electrons[i].position.x = 0 +( -nd*(Math.cos(this.step-0.02)));
					this.electrons[i].position.y = 0 +( -nd*(Math.sin(this.step-0.02)));
				}
				if (i == 4) {
					var nd = d + d;
					this.electrons[i].position.x = 0 +( -nd*(Math.cos(this.step-0.02)));
					this.electrons[i].position.z = 0 +( nd*(Math.sin(this.step-0.02)));
				}
			}; // en for loop


			// vibrate nucleus
			var rate = 0.1125;
			this.nucleus.position.x = Math.random() * rate;
			this.nucleus.position.y = Math.random() * rate;


			this.atom.rotation.y += 0.025/2;
			this.atom.rotation.x += 0.025;

		}




		



	}

};