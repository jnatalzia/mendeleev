'use strict';
var dmitri = dmitri || {};

dmitri.app = function() {

	var init = function() {
		console.log('start app');
		dmitri.data = elements;
		console.log(dmitri);
	}

	return {
		init: init
	};
}();