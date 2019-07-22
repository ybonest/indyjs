(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
}(function () { 'use strict';

	const Ind = require('./src/indy');

	console.log(99999);

	module.exports = Ind;

}));
