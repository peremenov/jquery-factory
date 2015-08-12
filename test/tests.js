var pluginName = 'test';
var pluginOptString = 'options';
var pluginOptObject = {
  string: 'This is a test',
  array : [ 1,2,'a']
};
var pluginOptArray  = [1,2,'b'];
var pluginFunc = function($el, opt, old) {
  this.$el = $el;
  this.opt = opt;
  this.old = old;

  this.destroy = function() {
    this.$el.removeData(pluginName);
  };

  this.update = function(opt, opt2, opt3) {
    this.opt = opt;
    this.opt2 = opt2;
    this.opt3 = opt3;
  }
};

var testEl = '#test';
var testWDataEl = '#test-w-data';
var testData = 'some useful data'; // the same as in HTML

QUnit.test('Factory', function(assert) {
  assert.ok($.newPlugin instanceof Function, '$.newPlugin defined');

  assert.throws(function() {
    $.newPlugin();
  }, 'plugin name must be defined');

  assert.throws(function() {
    $.newPlugin(pluginFunc);
  }, 'plugin name must be string');

  $.newPlugin(pluginName, pluginFunc);

  assert.ok($.fn[pluginName] instanceof Function, 'new "test" plugin created');
  
  assert.ok($.fn[pluginName].__constr__ === pluginFunc, 'plugin has __constr__ property');

  assert.throws(function() {
    $.newPlugin(pluginName, $.noop);
  }, 'plugin "test" already exists');

  assert.ok( !($.fn[pluginName] instanceof $.noop), 'plugin with same name didn\'t not created');
});

QUnit.test('Plugin instance', function(assert) {
  $(testEl).test('destroy');
  assert.ok($(testEl).data(pluginName) === undefined, 'destroyed (should not create new instance)');

  $(testEl).test();
  assert.ok($(testEl).data(pluginName) instanceof pluginFunc, 'attached to jQuery element');
  assert.ok($(testEl).data(pluginName) instanceof $.fn[pluginName].__constr__, 'attached to jQuery element (via __constr__)');
  assert.ok($(testEl).data(pluginName).opt === undefined, 'has no options');

  $(testEl).test(pluginOptString);
  assert.ok($(testEl).data(pluginName).opt === pluginOptString, 'has string options');

  $(testEl).test(pluginOptArray);

  assert.equal($(testEl).data(pluginName).opt, pluginOptArray, 'has array options');

  $(testEl).test('destroy');  
  $(testEl).test(pluginOptObject);

  assert.equal($(testEl).data(pluginName).opt, pluginOptObject, 'has object options');

  $(testEl).test('update', pluginOptObject, pluginOptArray, pluginOptString);

  assert.equal($(testEl).data(pluginName).opt, pluginOptObject, 'updated, argument 1 (method 1)');
  assert.equal($(testEl).data(pluginName).opt2, pluginOptArray, 'updated, argument 2 (method 1)');
  assert.equal($(testEl).data(pluginName).opt3, pluginOptString, 'updated, argument 3 (method 1)');

  $(testEl).test(pluginOptString, pluginOptObject, pluginOptArray);

  assert.equal($(testEl).data(pluginName).opt, pluginOptString, 'updated, argument 1 (method 2)');
  assert.equal($(testEl).data(pluginName).opt2, pluginOptObject, 'updated, argument 2 (method 2)');
  assert.equal($(testEl).data(pluginName).opt3, pluginOptArray, 'updated, argument 3 (method 2)');

  $(testEl).test('destroy');
  $(testWDataEl).test();

  assert.ok($(testWDataEl).data(pluginName).old === testData, 'reads data placed to HTML');

  $(testWDataEl).test('destroy');
  assert.ok($(testEl).data(pluginName) === undefined, 'destroyed');
});

