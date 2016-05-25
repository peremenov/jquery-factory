var pluginNameFactory = 'testinstance';
var pluginNameInstance = 'testfactory';
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
    this.$el.removeData(pluginNameInstance);
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
  delete $[pluginNameFactory];

  assert.ok($.newPlugin instanceof Function, '$.newPlugin defined');

  assert.throws(function() {
    $.newPlugin();
  }, 'plugin name must be defined');

  assert.throws(function() {
    $.newPlugin(pluginFunc);
  }, 'plugin name must be string');

  $.newPlugin(pluginNameFactory, pluginFunc);

  assert.ok($.fn[pluginNameFactory] instanceof Function, 'new "test" plugin created');
  
  assert.ok($.fn[pluginNameFactory].__constr__ === pluginFunc, 'plugin has __constr__ property');

  assert.throws(function() {
    $.newPlugin(pluginNameFactory, $.noop);
  }, 'plugin "test" already exists');

  assert.ok( !($.fn[pluginNameFactory] instanceof $.noop), 'plugin with same name didn\'t not created');

  delete $[pluginNameFactory];
});

QUnit.test('Plugin instance', function(assert) {
  delete $[pluginNameInstance];

  $.newPlugin(pluginNameInstance, pluginFunc);
  
  $(testEl)[pluginNameInstance]('destroy');
  assert.ok($(testEl).data(pluginNameInstance) === undefined, 'destroyed (should not create new instance)');

  $(testEl)[pluginNameInstance]();
  assert.ok($(testEl).data(pluginNameInstance) instanceof pluginFunc, 'attached to jQuery element');
  assert.ok($(testEl).data(pluginNameInstance) instanceof $.fn[pluginNameInstance].__constr__, 'attached to jQuery element (via __constr__)');
  assert.ok($(testEl).data(pluginNameInstance).opt === undefined, 'has no options');

  $(testEl)[pluginNameInstance](pluginOptString);
  assert.ok($(testEl).data(pluginNameInstance).opt === pluginOptString, 'has string options');

  $(testEl)[pluginNameInstance](pluginOptArray);

  assert.equal($(testEl).data(pluginNameInstance).opt, pluginOptArray, 'has array options');

  $(testEl)[pluginNameInstance]('destroy');  
  $(testEl)[pluginNameInstance](pluginOptObject);

  assert.equal($(testEl).data(pluginNameInstance).opt, pluginOptObject, 'has object options');

  $(testEl)[pluginNameInstance]('update', pluginOptObject, pluginOptArray, pluginOptString);

  assert.equal($(testEl).data(pluginNameInstance).opt, pluginOptObject, 'updated, argument 1 (method 1)');
  assert.equal($(testEl).data(pluginNameInstance).opt2, pluginOptArray, 'updated, argument 2 (method 1)');
  assert.equal($(testEl).data(pluginNameInstance).opt3, pluginOptString, 'updated, argument 3 (method 1)');

  $(testEl)[pluginNameInstance](pluginOptString, pluginOptObject, pluginOptArray);

  assert.equal($(testEl).data(pluginNameInstance).opt, pluginOptString, 'updated, argument 1 (method 2)');
  assert.equal($(testEl).data(pluginNameInstance).opt2, pluginOptObject, 'updated, argument 2 (method 2)');
  assert.equal($(testEl).data(pluginNameInstance).opt3, pluginOptArray, 'updated, argument 3 (method 2)');

  $(testEl)[pluginNameInstance]('destroy');

  //////
  $(testWDataEl)[pluginNameInstance]();

  assert.equal($(testWDataEl).data(pluginNameInstance).old, testData, 'reads data placed to HTML');

  $(testWDataEl)[pluginNameInstance]('destroy');
  assert.equal($(testEl).data(pluginNameInstance), undefined, 'destroyed');

  delete $[pluginNameInstance];
});

