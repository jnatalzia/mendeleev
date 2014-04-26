'use strict';
var dmitri = dmitri || {};

dmitri.atom = function() {
	
	function atom(_obj) {
		console.log('hello from: atom');
	}

}();

{
	scene: undefined,

	init: function(_scene) {
		this.scene = _scene;
		// code
	},

	build: function(atomicNumber) {
		console.log('build: '+ dmitri.elements[atomicNumber].name);

		var atom = dmitri.elements[atomicNumber];
		var models = dmitri.models;
		var build = {
			protons: [],
			neutrons: [],
			electrons: []
		};

		/* making an atom */
		for (var i = 0; i < atom.protons; i++) {
			// proton
			var proton = new THREE.Mesh(models.proton.geometry, models.proton.material);
			proton.receiveShadow = true;

			build.protons.push(proton);
		};

		for (var i = 0; i < atom.neutrons; i++) {
			// neutron
			var neutron = new THREE.Mesh(models.neutron.geometry, models.neutron.material);
			neutron.receiveShadow = true;
			neutron.position.y = 1.5;
			build.neutrons.push(neutron);			
		};

		for (var i = 0; i < atom.electrons; i++) {
			// electron
			var electron = new THREE.Mesh(models.electron.geometry, models.electron.material);
			electron.receiveShadow = true;
			electron.position.y = 10;
			build.electrons.push(electron);			
		};

		console.dir(build);
		return build;
	},

	animate: function() {
		
	}
}