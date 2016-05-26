var window = require('jsdom').jsdom('<div />').defaultView,
		$ = require('jquery')(window),
		factory = require('..')($);

var assert = require('chai').assert;

var data = require('./tests-data.js');

describe('require test', function () {

	it('shoud has factory and create plugin', function() {
		assert.equal('function', typeof factory(data.pluginNameFactory, data.pluginFunc));
		assert.equal('function', typeof $.fn[data.pluginNameFactory]);
	});

});

require('./tests');