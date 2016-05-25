var expect = chai.expect;
var assert = chai.assert;

describe('Factory', function() {
  beforeEach(function() {
    delete $.fn[pluginNameFactory];
  });

  it('$.newPlugin defined', function() {
    $.newPlugin(pluginNameFactory, pluginFunc);
    assert.ok($.newPlugin instanceof Function);
  });

  it('plugin name must be defined', function() {
    assert.throws(function() {
      $.newPlugin();
    });
  });

  it('plugin name must be string', function() {
    assert.throws(function() {
      $.newPlugin(pluginFunc);
    });
  });

  it('new "' + pluginNameFactory + '" plugin created', function() {
    $.newPlugin(pluginNameFactory, pluginFunc);
    assert.ok($.fn[pluginNameFactory] instanceof Function);
  });
  
  it('plugin has __constr__ property', function() {
    $.newPlugin(pluginNameFactory, pluginFunc);
    assert.equal($.fn[pluginNameFactory].__constr__, pluginFunc);
  });

  it('plugin "' + pluginNameFactory + '" already exists', function() {
    $.newPlugin(pluginNameFactory, pluginFunc);
    assert.throws(function() {
      $.newPlugin(pluginNameFactory, $.noop);
    });
  });

  it('plugin with same name didn\'t not created', function() {
    $.newPlugin(pluginNameFactory, pluginFunc);
    assert.ok( !($.fn[pluginNameFactory] instanceof $.noop));
  });
});

describe('Plugin instance', function() {
  before(function() {
    $.newPlugin(pluginNameInstance, pluginFunc);
  });

  beforeEach(function() {
    $(testEl)[pluginNameInstance]();
  });

  afterEach(function() {
    $(testEl).removeData(pluginNameInstance);
  });
  
  it('destroyed (should not create new instance)', function() {
    $(testEl)[pluginNameInstance]('destroy');
    assert.equal($(testEl).data(pluginNameInstance), undefined);
  });

  it('checks attached instance', function() {
    assert.ok($(testEl).data(pluginNameInstance) instanceof pluginFunc, 'attached to jQuery element');
    assert.ok($(testEl).data(pluginNameInstance) instanceof $.fn[pluginNameInstance].__constr__, 'attached to jQuery element (via __constr__)');
    assert.equal($(testEl).data(pluginNameInstance).opt, undefined, 'has no options');
  });

  it('checks update string arguments', function() {
    $(testEl)[pluginNameInstance](pluginOptString);
    assert.ok($(testEl).data(pluginNameInstance).opt === pluginOptString, 'has string options');
  });

  it('checks update array arguments', function() {
    $(testEl)[pluginNameInstance](pluginOptArray);
    assert.equal($(testEl).data(pluginNameInstance).opt, pluginOptArray, 'has array options');
  });

  it('checks update object arguments', function() {
    $(testEl)[pluginNameInstance](pluginOptObject);
    assert.equal($(testEl).data(pluginNameInstance).opt, pluginOptObject, 'has object options');
  });

  it('checks update multiply arguments', function() {
    $(testEl)[pluginNameInstance]('update', pluginOptObject, pluginOptArray, pluginOptString);

    assert.equal($(testEl).data(pluginNameInstance).opt, pluginOptObject, 'updated, argument 1 (method 1)');
    assert.equal($(testEl).data(pluginNameInstance).opt2, pluginOptArray, 'updated, argument 2 (method 1)');
    assert.equal($(testEl).data(pluginNameInstance).opt3, pluginOptString, 'updated, argument 3 (method 1)');
  });

  it('checks update multiply arguments', function() {
    $(testEl)[pluginNameInstance](pluginOptString, pluginOptObject, pluginOptArray);

    assert.equal($(testEl).data(pluginNameInstance).opt, pluginOptString, 'updated, argument 1 (method 2)');
    assert.equal($(testEl).data(pluginNameInstance).opt2, pluginOptObject, 'updated, argument 2 (method 2)');
    assert.equal($(testEl).data(pluginNameInstance).opt3, pluginOptArray, 'updated, argument 3 (method 2)');
  });

  it('checks data placed to HTML', function() {
    $(testWDataEl)[pluginNameInstance]();
    assert.equal($(testWDataEl).data(pluginNameInstance).old, testData, 'reads data placed to HTML');
  });

  it('destroy instance', function() {
    $(testEl)[pluginNameInstance]('destroy');
    assert.equal($(testEl).data(pluginNameInstance), undefined, 'destroyed');
  });
});

