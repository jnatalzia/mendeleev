'use strict';
var dmitri = dmitri || {};

dmitri.app = function() {

	var init = function() {
		console.log('start app');
		dmitri.elements = elements;
		console.log(dmitri);
	}

	return {
		init: init
	};
}();