var dmitri = dmitri || {};

dmitri.utilities = {
	/* Method Purpose: Gets a normalized vector based on passed in vector*/
	getNormalizedVector: function (v1){
		var mag = this.getMagnitude(v1);
		return{
			x:v1.x/mag,
			y:v1.y/mag
		};
	},
	/* Method Purpose: Gets subtracted vector from v1 to v2*/
	getSubtractedVector:function (v1,v2){
		return {
			x: v2.x-v1.x,
			y: v2.y-v1.y
		};
	},
	/* Method Purpose: Gets the angle between two points*/
	angleFromPointToPoint:function (p1,p2)
	{
		var sub = this.getSubtractedVector(p1,p2);

		var angle = Math.atan2(sub.y,sub.x);

		if (angle < 0){
			angle = Math.abs(angle);
			angle = Math.PI*2 - angle;
			
		}
		//angle = Math.abs(angle - Math.PI);


		return angle;
	},
	/* Method Purpose: Gets a scaled vector*/
	getScaledVector:function (v1,scalar){
		return {
			x:v1.x*scalar,
			y:v1.y*scalar
		};
	},
	/* Method Purpose: Checks if a sprite is close to it's destination*/
	isCloseToDestination:function (pos,dest)
	{
		//console.log(pos+ ", " + dest);

		var sub = this.getSubtractedVector(pos,dest);
		var mag = this.getMagnitude(sub);
		if (mag <= .5)
		{
			return true;
		}
		else return false;
	},
	/* Method Purpose: Gets the magnitude of a vector*/
	getMagnitude:function (v1){
		return Math.sqrt((v1.x*v1.x)+(v1.y*v1.y));
	}
};