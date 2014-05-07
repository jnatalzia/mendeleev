'use strict';
var dmitri = dmitri || {};

dmitri.table = {
	scene:undefined,
	elements:undefined,
	tableWidth:960,
	numCols:6,
	init:function(_scene)
	{
		console.log('testing something');
		this.scene = _scene;
		this.elements = dmitri.elements;

		//test
		for (var i =0; i < this.elements.length; i++)
		{
			var x = ((i%this.numCols)-3)*6;
			
			var y = Math.floor(i/this.numCols) * -10;

			var z = Math.floor(Math.random() * 5);


			var pos = {x:x,y:y,z:z};
			this.makeElement(i,true,pos);
		}
		
	},
	makeElement:function(atomicNumber, raw, position)
	{
		//var spriteAlignment = THREE.SpriteAlignment.topLeft;

		var spriteMaterial = this.createNormalMaterial(atomicNumber,raw);
		var sprite = new THREE.Sprite( spriteMaterial );

		sprite.scale.set(5,7,1.0);
		sprite.position.set(position.x,position.y,position.z);
		sprite.atomicNumber = atomicNumber;

		this.scene.add(sprite);
	},
	doMousedown:function(e)
	{
    	var projector = new THREE.Projector();
    	var camera = dmitri.app.camera;
        var tube;

        event.preventDefault();

        var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
        projector.unprojectVector(vector, camera);

        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        var arr = [];
        this.scene.traverse(function(e) { 
             if (e instanceof THREE.Sprite ) { 
                 arr.push(e);
             } 
            }); 


        var intersects = raycaster.intersectObjects(arr);

        if (intersects.length > 0) {
            var o = intersects[0].object;

            console.log(o.atomicNumber);

            o.material = this.createHighlightedMaterial(o.atomicNumber,true);

            o.isHighlighted = true;

            /*var newMat = new THREE.MeshBasicMaterial({color: 0xff0000});

            intersects[ 0 ].object.material = newMat;
            intersects[ 0 ].object.material.transparent = true;
            intersects[ 0 ].object.material.opacity = 0.5;

            var points = [];
            var origin = raycaster.ray.origin.clone();
            console.log(origin);
            points.push(new THREE.Vector3(-30, 39.8, 30));
            points.push(intersects[0].point);


            var mat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.6});
            var tubeGeometry = new THREE.TubeGeometry(new THREE.SplineCurve3(points), 60, 0.001);

            if (tube) scene.remove(tube);*/
        }
	},
	doMouseup: function(e)
	{
		var self = this;
		this.scene.traverse(function(e) { 
             if (e instanceof THREE.Sprite ) { 
             	if (e.isHighlighted)
             	{
             		//call that function
             		dmitri.app.updateAtom(e.atomicNumber,true);
             	}
                 e.material = self.createNormalMaterial(e.atomicNumber,true);
             } 
        }); 
	},
	createNormalMaterial:function(atomicNumber,raw)
	{
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

		return new THREE.SpriteMaterial( 
			{ map: texture, useScreenCoordinates: false} );
	},
	createHighlightedMaterial: function(atomicNumber, raw)
	{
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

		ctx.strokeStyle = "#66CEE3";
		ctx.font         = '200px RobotoLight';
		ctx.fillStyle = '#66CEE3';
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

		return spriteMaterial;
	}
};