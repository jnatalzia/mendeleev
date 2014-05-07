'use strict';
var dmitri = dmitri || {};

dmitri.particle = function() {

	// x, y, pattern, range
	function particle(_settings) {

		// set the particle material		
		this.material = undefined;

		// if (_settings.material) this.material = _settings.material;
		// else {

			this.material = new THREE.SpriteMaterial( {
				map: new THREE.Texture( generateSprite() ),
				blending: THREE.AdditiveBlending
			});

		// };


		// createa particle
		this.particle = new THREE.Sprite( this.material );

		this.particle.position.set( 0.5, 0.5, 0.5 )
		// this.particle.position.set( 0, 0, 0 )
		this.particle.scale.x = this.particle.scale.y = Math.random() * 32 + 16;

	};



	// FUNCTIONS
	// ===================================
	var p = particle.prototype;


	p.animate = function() {	

	};



	// private
	// ===================================
	function generateSprite() {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 16;
		canvas.height = 16;

		var context = canvas.getContext( '2d' );
		var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
		gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
		gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
		gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
		gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

		context.fillStyle = gradient;
		context.fillRect( 0, 0, canvas.width, canvas.height );

		return canvas;
	};


	return particle;
}();
