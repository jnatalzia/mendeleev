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
	protons: [],
	neutrons: [],
	electrons: [],

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


	makeModel: function(e) {
		// reset things
		this.scene.remove(this.atom);
		this.protons = [];
		this.neutrons = [];
		this.electrons = [];

		this.atom = new THREE.Object3D();
		var models = dmitri.models;	// make our life easier


		/* making an atom */

		// determine inner geometry
		// 1. made up of protons and neutrons
		for (var i = 0; i < e.protons; i++) {
			// proton
			var proton = new THREE.Mesh(models.proton.geometry, models.proton.material);
			proton.receiveShadow = true;
			this.atom.add(proton);

			this.protons.push(proton);
		};

		for (var i = 0; i < e.neutrons; i++) {
			// neutron
			var neutron = new THREE.Mesh(models.neutron.geometry, models.neutron.material);
			neutron.receiveShadow = true;
			this.atom.add(neutron);

			this.neutrons.push(neutron);			
		};

		// 2. determine geometric shape
		// protons + neutrons = geometric shape
		var points = this.protons.length + this.neutrons.length;
		console.log(points);

		// make a geometric shape with that many points

		// place protons/neutrons at points of the shape



		for (var i = 0; i < e.electrons; i++) {
			// electron
			var electron = new THREE.Mesh(models.electron.geometry, models.electron.material);
			electron.receiveShadow = true;
			electron.position.y = 10;
			this.electrons.push(electron);			

			this.atom.add(electron);
		};


		this.scene.add(this.atom);
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

		this.step += 0.04;

		for (var i = 0; i < this.electrons.length; i++) {
			this.electrons[i].position.x = 0+( 10*(Math.cos(this.step)));
			this.electrons[i].position.y = 0 +( 10*(Math.sin(this.step)));			
		};

		this.atom.rotation.y += 0.0125/2;
		// this.atom.rotation.x += 0.0125/2;
	}

};