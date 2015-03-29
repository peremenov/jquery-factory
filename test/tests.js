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
};

var testEl = '#test';
var testWDataEl = '#test-w-data';
var testData = 'some useful data'; // the same as in HTML

QUnit.test('Factory tests', function(assert) {
  assert.ok($.newPlugin instanceof Function, '$.newPlugin defined');

  $.newPlugin(pluginName, pluginFunc);

  assert.ok($.fn[pluginName] instanceof Function, 'new "test" plugin created');
});

QUnit.test('Plugin instances', function(assert) {
  $(testEl).test(pluginOptString);

  assert.ok($(testEl).data(pluginName) instanceof pluginFunc, 'attached jQuery element');
  assert.ok($(testEl).data(pluginName).opt === pluginOptString, 'has string options');

  $(testEl).test('destroy');

  assert.ok($(testEl).data(pluginName) === undefined, 'destroyed');

  $(testEl).test(pluginOptArray);

  assert.equal($(testEl).data(pluginName).opt, pluginOptArray, 'has array options');

  $(testEl).test('destroy');  
  $(testEl).test(pluginOptObject);

  assert.equal($(testEl).data(pluginName).opt, pluginOptObject, 'has object options');

  $(testEl).test('destroy');
  $(testWDataEl).test();

  assert.ok($(testWDataEl).data(pluginName).old === testData, 'reads data placed to HTML');

  $(testWDataEl).test('destroy');
});

