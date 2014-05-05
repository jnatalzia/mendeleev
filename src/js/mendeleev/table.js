'use strict';
var dmitri = dmitri || {};

dmitri.table = {
	scene:undefined,
	elements:undefined,
	init:function(_scene)
	{
		console.log('testing something');
		this.scene = _scene;
		this.elements = dmitri.elements;

		//test
		this.makeElement(12);
	},
	makeElement:function(atomicNumber, raw)
	{
		//var spriteAlignment = THREE.SpriteAlignment.topLeft;

		var e = this.elements[atomicNumber - 1];
		if (raw) e = this.elements[atomicNumber];

		//get element info
		var name = e.name;
		var number = atomicNumber;
		var symbol = e.symbol;
		var weight = e.weight;

		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");

		canvas.width = 350;
		canvas.height = 500;

		ctx.fillStyle = "rgb(255,255,255)";
		ctx.globalAlpha = .1;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalAlpha = 1;

		ctx.strokeStyle = "#62CF6E";
		ctx.font         = '200px RobotoLight';
		ctx.fillStyle = '#62CF6E';
		ctx.textBaseline = 'middle';
		ctx.textAlign = "center";
		ctx.fillText  (symbol, canvas.width/2,canvas.height/2 - 20);

		ctx.lineWidth = 10;
		ctx.strokeRect(0,0,canvas.width,canvas.height);


		ctx.font = '24px RobotoLight';
		ctx.fillText  (name, canvas.width/2,canvas.height/2 + 120);

		ctx.fillText  (atomicNumber, canvas.width - 30, 30);

		ctx.fillText(weight, canvas.width/2,canvas.height/2 + 150);

		var texture = new THREE.Texture(canvas) 
		texture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial( 
			{ map: texture, useScreenCoordinates: false} );
		var sprite = new THREE.Sprite( spriteMaterial );

		sprite.scale.set(5,7,1.0);
		sprite.position.set(0,0,0);

		this.scene.add(sprite);
	}
};