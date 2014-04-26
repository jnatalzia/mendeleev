'use strict';
var dmitri = dmitri || {};

dmitri.atom = {

	scene: undefined,

	protons: [],
	neutrons: [],
	electrons: [],

	init: function(_scene) {
		this.scene = _scene;
	},

	build: function(_atom) {
		console.log('build: '+ _atom.name);
		
		var models = dmitri.models;

		/* making an atom */
		for (var i = 0; i < _atom.protons; i++) {
			// proton
			var proton = new THREE.Mesh(models.proton.geometry, models.proton.material);
			proton.receiveShadow = true;
			this.scene.add(proton);

			this.protons.push(proton);
		};

		for (var i = 0; i < _atom.neutrons; i++) {
			// neutron
			var neutron = new THREE.Mesh(models.neutron.geometry, models.neutron.material);
			neutron.receiveShadow = true;
			neutron.position.y = 1.5;
			this.scene.add(neutron);

			this.neutrons.push(neutron);			
		};

		for (var i = 0; i < _atom.electrons; i++) {
			// electron
			var electron = new THREE.Mesh(models.electron.geometry, models.electron.material);
			electron.receiveShadow = true;
			electron.position.y = 10;
			this.electrons.push(electron);			

			this.scene.add(electron);
		};
	},

	render: function() {

		// for (var i = 0; i < this.protons; i++) {
		// 	// proton
		// 	var proton = new THREE.Mesh(models.proton.geometry, models.proton.material);
		// 	proton.receiveShadow = true;

		// 	this.protons.push(proton);
		// };

		// for (var i = 0; i < this.neutrons; i++) {
		// 	// neutron
		// 	var neutron = new THREE.Mesh(models.neutron.geometry, models.neutron.material);
		// 	neutron.receiveShadow = true;
		// 	neutron.position.y = 1.5;
		// 	this.neutrons.push(neutron);			
		// };

		// for (var i = 0; i < this.electrons; i++) {
		// 	// electron
		// 	var electron = new THREE.Mesh(models.electron.geometry, models.electron.material);
		// 	electron.receiveShadow = true;
		// 	electron.position.y = 10;
		// 	this.electrons.push(electron);			
		// };
		
	}

};