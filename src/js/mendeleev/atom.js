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
	orbitals: [],
	bohrTweenReady: false,
	returnTweenReady: false,
	tweens: [],

	// for animation
	step: 0,


	// for viewing
	bohr: false,
	orbits: false,
	vibrate: true,




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
		this.bohrTweenReady = false;	
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
		var nucleusGroup = [];

		// fringe case: hydrogen is the only one without a neutron
		if (this.neutrons.length == 0) nucleusGroup.push(this.protons[0]);
		else {
			for (var i = 0; i < this.neutrons.length; i++) {
				// push protons and neutrons to temporary nucleusGroup
				if (this.protons[i]) 
					nucleusGroup.push(this.protons[i]);
				nucleusGroup.push(this.neutrons[i]);
			};
		};

		// position the protons + neutrons
		for (var i = 0; i < nucleusGroup.length; i++) {
			var model = dmitri.models.nucleus[i];
			nucleusGroup[i].position.x = model.x;
			nucleusGroup[i].position.y = model.y;
			nucleusGroup[i].position.z = model.z;
		};



		this.atom.add(this.nucleus);
	},


	createElectrons: function(e) {

		// create electrons
		// Bohr position is given in models.js
		for (var i = 0; i < e.electrons; i++) {
			// electron
			var electron = new THREE.Mesh(dmitri.models.electron.geometry, dmitri.models.electron.material);
			electron.receiveShadow = true;
			this.electrons.push(electron);
			this.atom.add(electron);		
		};

		this.createOrbitals(e);
	},


	createOrbitals: function(e) {

		// create circle for each shell
		var radius = 10;
    var material = new THREE.LineBasicMaterial( { color: 0x000066 } );

    for (var i = 1; i < e.shells.length+1; i++) {
    	
    	var size = radius * i;
	    var geometry = new THREE.CircleGeometry(size, 32);

			// Remove center vertex
			geometry.vertices.shift();
			
			var circle = new THREE.Line(geometry, material);
			this.orbitals.push(circle);

			if (dmitri.orbits.checked) this.addOrbitals();

    };

	},
	addOrbitals: function() {
		for (var i = 0; i < this.orbitals.length; i++) this.atom.add(this.orbitals[i]);
	},
	removeOrbitals: function() {
		for (var i = 0; i < this.orbitals.length; i++) this.atom.remove(this.orbitals[i]);
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
	  for (var i = 0; i < e.shells.length; i++) {
			var li = document.createElement('li');
			li.innerHTML = e.shells[i];
			this.hud.electrons.appendChild(li);  	
	  };

	},


	prepBohrTweens: function() {

		for (var i = 0; i < this.electrons.length; i++) {

			var position = this.electrons[i].position;
			var target = dmitri.models.shells[i]; // Bohr position set in models.js
			
			new TWEEN.Tween( position )
				.easing( TWEEN.Easing.Circular.In )
				.to( target, 400 )
				.start();
		};

		// reset atom rotation
		new TWEEN.Tween( this.atom.rotation )
				// .delay( 1000 )
				.easing( TWEEN.Easing.Quadratic.Out )
				.to( {x: 0, y: 0, z: 0}, 400 )
				.start();

		this.bohrTweenReady = true;
	},



	animate: function() {


		if(this.bohr) {
			// tween to statc position
			if (!this.bohrTweenReady) {
				this.prepBohrTweens();
				this.step = 0; // reset this
			}
			else TWEEN.update();

		} else {
			// reset 
			this.bohrTweenReady = false;

			// this.step += 0.04;
			this.step += 0.08;

			var d = 10;
			for (var i = 0; i < this.electrons.length; i++) {
				this.electrons[i].position.x = d*(Math.cos(this.step));
				this.electrons[i].position.y = d*(Math.sin(this.step));
				

				if (i == 1) {
					this.electrons[i].position.x = -d*(Math.cos(this.step));
					this.electrons[i].position.y = -d*(Math.sin(this.step));
				}

				if (i == 2) {
					var nd = d + d;
					this.electrons[i].position.x = nd*(Math.cos(this.step-0.02));
					this.electrons[i].position.y = nd*(Math.sin(this.step-0.02));
				}

				if (i == 3) {
					var nd = d + d;
					this.electrons[i].position.x = -nd*(Math.cos(this.step-0.02));
					this.electrons[i].position.y = -nd*(Math.sin(this.step-0.02));
				}
				if (i == 4) {
					var nd = d + d;
					this.electrons[i].position.x = -nd*(Math.cos(this.step-0.02));
					this.electrons[i].position.z = nd*(Math.sin(this.step-0.02));
				}
			}; // en for loop


			this.atom.rotation.y += 0.025/2;
			this.atom.rotation.x += 0.025;

		}



		if (this.vibrate) {
			// vibrate nucleus
			var rate = 0.1125;
			this.nucleus.position.x = Math.random() * rate;
			this.nucleus.position.y = Math.random() * rate;

		}
		



	}

};