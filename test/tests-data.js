var pluginNameFactory = 'testfactory';
var pluginNameInstance = 'testinstance';
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

var data = {
  pluginNameFactory: pluginNameFactory,
  pluginNameInstance: pluginNameInstance,
  pluginOptString: pluginOptString,
  pluginOptObject: pluginOptObject,
  pluginOptArray: pluginOptArray,
  pluginFunc: pluginFunc,
  testEl: testEl,
  testWDataEl: testWDataEl,
  testData: testData
};


if ( typeof module == 'object')
  module.exports = data;