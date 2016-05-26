/**
 * Check for node env
 */
if ( typeof require == 'function' ) {
  var fs = require('fs');
  var chai = require('chai');
  var data = require('./tests-data');
  var window = require('jsdom').jsdom(fs.readFileSync('./test/tests.html', { encoding: 'utf8' })).defaultView;
  var $ = require('jquery')(window);
  $.newPlugin = require('..')($);
}

var expect = chai.expect;
var assert = chai.assert;
var noop = function() {};

describe('Factory', function() {
  beforeEach(function() {
    delete $.fn[data.pluginNameFactory];
  });

  it('$.newPlugin defined', function() {
    $.newPlugin(data.pluginNameFactory, data.pluginFunc);
    assert.ok($.newPlugin instanceof Function);
  });

  it('plugin name must be defined', function() {
    assert.throws(function() {
      $.newPlugin();
    });
  });

  it('plugin name must be string', function() {
    assert.throws(function() {
      $.newPlugin(data.pluginFunc);
    });
  });

  it('new "' + data.pluginNameFactory + '" plugin created', function() {
    $.newPlugin(data.pluginNameFactory, data.pluginFunc);
    assert.ok($.fn[data.pluginNameFactory] instanceof Function);
  });
  
  it('plugin has __constr__ property', function() {
    $.newPlugin(data.pluginNameFactory, data.pluginFunc);
    assert.equal($.fn[data.pluginNameFactory].__constr__, data.pluginFunc);
  });

  it('plugin "' + data.pluginNameFactory + '" already exists', function() {
    $.newPlugin(data.pluginNameFactory, data.pluginFunc);
    assert.throws(function() {
      $.newPlugin(data.pluginNameFactory, noop);
    });
  });

  it('plugin with same name didn\'t not created', function() {
    $.newPlugin(data.pluginNameFactory, data.pluginFunc);
    assert.ok( !($.fn[data.pluginNameFactory] instanceof noop));
  });
});

describe('Plugin instance', function() {
  before(function() {
    $.newPlugin(data.pluginNameInstance, data.pluginFunc);
  });

  beforeEach(function() {
    $(data.testEl)[data.pluginNameInstance]();
  });

  afterEach(function() {
    $(data.testEl).removeData(data.pluginNameInstance);
  });
  
  it('destroyed (should not create new instance)', function() {
    $(data.testEl)[data.pluginNameInstance]('destroy');
    assert.equal($(data.testEl).data(data.pluginNameInstance), undefined);
  });

  it('checks attached instance', function() {
    assert.ok($(data.testEl).data(data.pluginNameInstance) instanceof data.pluginFunc, 'attached to jQuery element');
    assert.ok($(data.testEl).data(data.pluginNameInstance) instanceof $.fn[data.pluginNameInstance].__constr__, 'attached to jQuery element (via __constr__)');
    assert.equal($(data.testEl).data(data.pluginNameInstance).opt, undefined, 'has no options');
  });

  it('checks update string arguments', function() {
    $(data.testEl)[data.pluginNameInstance](data.pluginOptString);
    assert.ok($(data.testEl).data(data.pluginNameInstance).opt === data.pluginOptString, 'has string options');
  });

  it('checks update array arguments', function() {
    $(data.testEl)[data.pluginNameInstance](data.pluginOptArray);
    assert.equal($(data.testEl).data(data.pluginNameInstance).opt, data.pluginOptArray, 'has array options');
  });

  it('checks update object arguments', function() {
    $(data.testEl)[data.pluginNameInstance](data.pluginOptObject);
    assert.equal($(data.testEl).data(data.pluginNameInstance).opt, data.pluginOptObject, 'has object options');
  });

  it('checks update multiply arguments', function() {
    $(data.testEl)[data.pluginNameInstance]('update', data.pluginOptObject, data.pluginOptArray, data.pluginOptString);

    assert.equal($(data.testEl).data(data.pluginNameInstance).opt, data.pluginOptObject, 'updated, argument 1 (method 1)');
    assert.equal($(data.testEl).data(data.pluginNameInstance).opt2, data.pluginOptArray, 'updated, argument 2 (method 1)');
    assert.equal($(data.testEl).data(data.pluginNameInstance).opt3, data.pluginOptString, 'updated, argument 3 (method 1)');
  });

  it('checks update multiply arguments', function() {
    $(data.testEl)[data.pluginNameInstance](data.pluginOptString, data.pluginOptObject, data.pluginOptArray);

    assert.equal($(data.testEl).data(data.pluginNameInstance).opt, data.pluginOptString, 'updated, argument 1 (method 2)');
    assert.equal($(data.testEl).data(data.pluginNameInstance).opt2, data.pluginOptObject, 'updated, argument 2 (method 2)');
    assert.equal($(data.testEl).data(data.pluginNameInstance).opt3, data.pluginOptArray, 'updated, argument 3 (method 2)');
  });

  it('checks data placed to HTML', function() {
    $(data.testWDataEl)[data.pluginNameInstance]();
    assert.equal($(data.testWDataEl).data(data.pluginNameInstance).old, data.testData, 'reads data placed to HTML');
  });

  it('destroy instance', function() {
    $(data.testEl)[data.pluginNameInstance]('destroy');
    assert.equal($(data.testEl).data(data.pluginNameInstance), undefined, 'destroyed');
  });
});

