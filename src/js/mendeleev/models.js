'use strict';
var dmitri = dmitri || {};

dmitri.models = {
	proton: {
		geometry: new THREE.SphereGeometry( 1, 32, 32 ),
		material: new THREE.MeshLambertMaterial( {color: 0xb92d19} )
	},
	neutron: {
		geometry: new THREE.SphereGeometry( 1, 32, 32 ),
		material: new THREE.MeshLambertMaterial( {color: 0xcccccc} )
	},
	electron: {
		geometry: new THREE.SphereGeometry( 0.3, 32, 32 ),
		material: new THREE.MeshLambertMaterial( {color: 0xaaaaff} )
	},
	nucleus: [
			{x: 0, y: 1, z: 0},
			{x: 1, y: 0, z: 0},
			{x: 0, y: -1, z: 0},
			{x: -1, y: 0, z: 0},
			{x: 0, y: 0, z: 1},
			{x: 0, y: 0, z : 0},
			{x: 0, y: 0, z: -1}, // -end 1st full set
			{x: -1, y: 1, z: 0},
			{x: 1, y: -1, z: 0},
			{x: -1, y: -1, z: 0},
			{x: 1, y: 1, z: 0}, 
			{x: -1, y: 1, z: -1},
			{x: 1, y: -1, z: 1},
			{x: -1, y: 1, z: 1},
			{x: 1, y: -1, z: -1},
			{x: -1, y: -1, z: -1},
			{x: 1, y:1, z: 1},
			{x: -1, y: -1, z: 1},
			{x: 1, y: 1, z: -1}, // -end 2nd set (19)
			{x: 0, y: 2, z: 0}, 
			{x: 0, y: -2, z: 0}, 
			{x: 2, y: 0, z: 0}, 
			{x: -2, y: 0, z: 0}, 
			{x: 0, y: 0, z: 2}, 
	],
	shells: [
		{x: 0,		y: 10,		z: 0}, // 1st shell
		{x: 0,		y: -10,		z: 0},

		{x: 20,		y: 0,			z: 0}, // 2nd shell
		{x: -20,	y: 0,			z: 0},
		{x: 0,		y: 20,		z: 0},
		{x: 0,		y: -20,		z: 0},
		{x: -14,	y: 14,		z: 0},
		{x: 14,		y: -14,		z: 0},
		{x: 14,		y: 14,		z: 0},
		{x: -14,	y: -14,		z: 0},

		{x: 0,		y: 30,		z: 0}, // 3rd shell
		{x: 0,		y: -30,		z: 0},
		{x: 30,		y: 0,			z: 0},
		{x: -30,	y: 0,			z: 0},
		{x: 0,		y: 10,		z: 0},
		{x: 0,		y: 10,		z: 0},
	]
};