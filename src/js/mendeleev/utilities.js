var dmitri = dmitri || {};

dmitri.utilities = {

	getNormalizedVector: function (v1){
		var mag = this.getMagnitude(v1);
		return{
			x:v1.x/mag,
			y:v1.y/mag
		};
	},
	//from v1->v2 which means v2-v1
	getSubtractedVector:function (v1,v2){
		return {
			x: v2.x-v1.x,
			y: v2.y-v1.y
		};
	},
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
	getScaledVector:function (v1,scalar){
		return {
			x:v1.x*scalar,
			y:v1.y*scalar
		};
	},
	vectorToString:function (vector, digits) {
	  if (typeof digits === "undefined") {
		digits = 1;
	  }
	  return "(" + vector[0].toFixed(digits) + ", "
				 + vector[1].toFixed(digits) + ", "
				 + vector[2].toFixed(digits) + ")";
	},
	map:function (value, start1, stop1, start2, stop2) {
		if (value < start1) value = start1;
		else if (value > stop1) value = stop1;
	
		return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
	},
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
	getMagnitude:function (v1){
		return Math.sqrt((v1.x*v1.x)+(v1.y*v1.y));
	}
};