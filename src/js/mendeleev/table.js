'use strict';
var dmitri = dmitri || {};

dmitri.table = {
	//constants
	TABLE_COLORS:{
		"alkali-metal":"#EDCC68",
		"alkaline-earth-metal":"#EDEB68",
		"transition-metal":"#EDAC8A",
		"post-transition-metal":"#B18AED",
		"metalloid":"#8DE09B",
		"other-non-metal":"#A7EBD3",
		"halogen":"#747BE3",
		"noble-gas":"#96A1E3"
	},
	//properties
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
			var row = this.elements[i].position.row - 1;
			var col = this.elements[i].position.col - 1;

			var x = (6*col);
			
			var y = row * -8;

			//var z = Math.floor(Math.random() * 3);
			var z = 0;


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
		sprite.destination = position;
		sprite.isMoving = true;

		var randX = Math.floor(Math.random() * 100) + 0;
		var randY = Math.floor(Math.random() * 100) + 0;

		sprite.position.set(randX,randY,0);

		//custom properties
		sprite.atomicNumber = atomicNumber;
		sprite.normalMaterial = this.createNormalMaterial(atomicNumber,raw);
		sprite.highlightedMaterial = this.createHighlightedMaterial(atomicNumber,raw);
		sprite.blankMaterial = this.createBlankMaterial(atomicNumber,raw);

		this.scene.add(sprite);
	},
	highlightSingleElement:function(atomicNumber,raw)
	{
		//console.log('firing');
		var self = this;
		this.scene.traverse(function(e) { 
             if (e instanceof THREE.Sprite ) { 
             	//console.log(eltype + ", " + e.type);
             	var number = raw ?  atomicNumber+1: atomicNumber;

             	//console.log(e.atomicNumber)

             	if (e.atomicNumber == number)
             		e.material = e.normalMaterial;
             } 
        }); 
	},
	blankSingleElement:function(atomicNumber,raw)
	{
		var self = this;
		this.scene.traverse(function(e) { 
             if (e instanceof THREE.Sprite ) { 
             	//console.log(eltype + ", " + e.type);
             	var number = raw ?  atomicNumber+1: atomicNumber;

             	if (e.atomicNumber == number)
             		e.material = e.blankMaterial;
             } 
        }); 
	},
	blankElements:function()
	{
		var self = this;
		this.scene.traverse(function(e) { 
             if (e instanceof THREE.Sprite ) { 
                 e.material = e.blankMaterial;
             } 
        }); 
	},
	highlightElements:function(eltype)
	{
		var self = this;
		this.scene.traverse(function(e) { 
             if (e instanceof THREE.Sprite ) { 
             	//console.log(eltype + ", " + e.type);
             	var type = self.elements[e.atomicNumber].type;

             	if (type == eltype)
             	{
             		//e.material = self.createNormalMaterial(e.atomicNumber,true);
             	}
                 
             	else
             	 //e.material = self.createBlankMaterial(e.atomicNumber,true);
             	e.material = e.blankMaterial;
             } 
        }); 

       // console.log(eltype);
	},
	unhighlightElements:function()
	{
		//console.log('unhighlight');
		var self = this;
		this.scene.traverse(function(e) { 
             if (e instanceof THREE.Sprite ) { 
                 e.material = e.normalMaterial;
             } 
        }); 
	},
	update:function()
	{
		this.scene.traverse(function(e) { 
         if (e instanceof THREE.Sprite ) { 
             //move it
             if (dmitri.utilities.isCloseToDestination(e.position,e.destination))
             {
             	e.isMoving = false;
             }
             else
             	e.isMoving = true;

             if (e.isMoving)
             {
             	var maxSpeed = 1;

             	var idealVec = dmitri.utilities.getSubtractedVector(e.position,e.destination);

             	var dist = dmitri.utilities.getMagnitude(idealVec);

             	idealVec = dmitri.utilities.getNormalizedVector(idealVec);

             	//console.log(dist/80);
             	var speed = dist/50 * maxSpeed;

             	idealVec = dmitri.utilities.getScaledVector(idealVec,speed);

             	e.position.set(e.position.x+idealVec.x,e.position.y+idealVec.y,e.position.z);
             }
         } 
        });

	},
	doMousedown:function(e)
	{
    	var projector = new THREE.Projector();
    	var camera = dmitri.app.tableCamera;
        var tube;

        //e.preventDefault();

        //console.log(e.clientX)


        //var vector = new THREE.Vector3(( e.clientX  /  window.innerWidth ) * 2 - 1, -( e.clientY / window.innerHeight ) * 2 + 1, 0.5);
        var canvas = document.querySelector("#table");

        var offset = canvas.getBoundingClientRect();

        var vector = new THREE.Vector3(( (e.clientX - offset.left) / canvas.width ) * 2 - 1, -( (e.clientY - offset.top) / canvas.height ) * 2 + 1, 0.5);
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

            //console.log(o.atomicNumber);

            o.material = o.highlightedMaterial;

            o.isHighlighted = true;
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

             		document.querySelector(".front-canvas").className = "";
             		document.querySelector("#model").className = "front-canvas";
             		document.querySelector("#key-wrapper").className = "hide";

             		document.querySelector("#atom-back").className = "";

             		dmitri.app.state = dmitri.app.STATE_ATOM_VIEW;

             		e.isHighlighted = false;
             		e.material = e.normalMaterial;
             	}
                 
             } 
        }); 
	},
	createNormalMaterial:function(atomicNumber,raw)
	{
		var e = this.elements[atomicNumber - 1];
		if (raw) e = this.elements[atomicNumber];

		//get element info
		var name = e.name;
		var number = raw ? atomicNumber + 1 : atomicNumber;
		var symbol = e.symbol;
		var weight = e.weight;

		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");

		var color = this.TABLE_COLORS[e.type];

		canvas.width = 350;
		canvas.height = 500;

		ctx.fillStyle = "rgb(255,255,255)";
		ctx.globalAlpha = .1;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalAlpha = 1;

		ctx.strokeStyle = color;
		ctx.font         = '200px RobotoLight';
		ctx.fillStyle = color;
		ctx.textBaseline = 'middle';
		ctx.textAlign = "center";
		ctx.fillText  (symbol, canvas.width/2,canvas.height/2 - 20);

		ctx.lineWidth = 10;
		ctx.strokeRect(0,0,canvas.width,canvas.height);


		ctx.font = '24px RobotoLight';
		ctx.fillText  (name, canvas.width/2,canvas.height/2 + 120);

		ctx.fillText  (number, canvas.width - 30, 30);

		ctx.fillText(weight, canvas.width/2,canvas.height/2 + 150);

		var texture = new THREE.Texture(canvas) 
		texture.needsUpdate = true;

		return new THREE.SpriteMaterial( 
			{ map: texture, useScreenCoordinates: false} );
	},
	createBlankMaterial:function(atomicNumber,raw)
	{
		var e = this.elements[atomicNumber - 1];
		if (raw) e = this.elements[atomicNumber];

		//get element info
		var name = e.name;
		var number = raw ? atomicNumber + 1 : atomicNumber;
		var symbol = e.symbol;
		var weight = e.weight;

		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");

		var color = "#eee";

		canvas.width = 350;
		canvas.height = 500;

		ctx.fillStyle = "rgb(255,255,255)";
		ctx.globalAlpha = .1;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalAlpha = 1;

		ctx.strokeStyle = color;
		ctx.font         = '200px RobotoLight';
		ctx.fillStyle = color;
		ctx.textBaseline = 'middle';
		ctx.textAlign = "center";
		ctx.fillText  (symbol, canvas.width/2,canvas.height/2 - 20);

		ctx.lineWidth = 10;
		ctx.strokeRect(0,0,canvas.width,canvas.height);


		ctx.font = '24px RobotoLight';
		ctx.fillText  (name, canvas.width/2,canvas.height/2 + 120);

		ctx.fillText  (number, canvas.width - 30, 30);

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
		var number = raw ? atomicNumber + 1 : atomicNumber;
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

		ctx.fillText  (number, canvas.width - 30, 30);

		ctx.fillText(weight, canvas.width/2,canvas.height/2 + 150);

		var texture = new THREE.Texture(canvas) 
		texture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial( 
			{ map: texture, useScreenCoordinates: false} );

		return spriteMaterial;
	}
};