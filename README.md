# jQuery Factory
[![Build Status](https://img.shields.io/travis/peremenov/jquery-factory.svg)](https://travis-ci.org/peremenov/jquery-factory)
[![npm version](https://img.shields.io/npm/v/jquery-factory.svg)](https://www.npmjs.com/package/jquery-factory)
[![bower version](https://img.shields.io/bower/v/jquery-factory.svg)](http://bower.io/search/?q=jquery-factory)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/af063b6571ee43afa16b858e2ca0df0c)](https://www.codacy.com/app/peremenov/jquery-factory)
[![Dependency Status](https://www.versioneye.com/nodejs/jquery-factory/badge?style=flat)](https://www.versioneye.com/nodejs/jquery-factory/)

![](logo.png)

### [По-русски](https://github.com/peremenov/jquery-factory/blob/master/README.ru.md)

Super simple, lightweight and solid factory of jQuery plugins. It allows to follow classic JavaScript patterns instead of [jQuery's](https://learn.jquery.com/plugins/basic-plugin-creation/) while creating plugin.

## Features

- Support all modern browsers (including mobile browsers)
- Support Internet Explorer 7-8 (needs jQuery 1.8 or older)
- Support jQuery version from 1.6
- Support [Zepto](http://zeptojs.com/) (needs [data](https://github.com/madrobby/zepto/blob/master/src/data.js) module)
- Around 600 bytes compressed
- Efficient code re-usage when writing several plugins
- Support requirejs/webpack and amd
- Test mode

## Install

Bower

```bash
bower install --save jquery-factory
```

Npm

```bash
npm install --save jquery-factory
```

## Usage

### Usage with requirejs or webpack

```javascript
var $ = require('jquery')(window),
    newPlugin = require('jquery-factory')($);
```

### Usage in browser

```html
<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
<script src="/path/to/newPlugin.jquery.js"></script>
```

### Plugin creation `$.newPlugin(pluginName, Constr, callback)`

Produces new jQuery plugin in `$.fn` object with **Constr** function. Factory accepts string **pluginName**. If plugin with the same name is exists factory throws an error.

**pluginName** — name of creating plugin. Should not contain name of existing plugins and internal jQuery methods

**Constr** — constructor Function for new plugin.

**callback** — callback function (deprecated)

#### Constructor

**Constr** takes `$element`, `options` and `htmlData` arguments.

`$element` contains jQuery oblect of current element

`options` has any data passed while plugin init

`htmlData` has value of `data-<pluginname>` attribute (for example `<span data-plugin="myText"></span>`).

#### Methods

By default each created plugin has built-in `init`, `update` and `destroy` methods that could be redefined.

`init` method should contain event handlers attaching, initial data, adding classes, etc.

`update` method using for options update and changing instance state. Method will be called if plugin instance was already created on element.

`destroy` method for final destroying: handlers unattaching and plugin instance removing (using [`.removeData`](http://api.jquery.com/removeData/)).

You can append any method by adding it to prototype of constructor function.

#### Instances

Plugin instance stores with jQuery [`.data`](http://api.jquery.com/data/) method so you can get it for testing or other purposes.

You can enable test mode by giving **callback** argument to `$.newPlugin`. **callback** accepts plugin instance context and should return `true` to continue instance attaching or `false` to prevent it.

To check accessory of `$.fn.pluginName` use `__constr__` property with **Constr** to check plugin accessory:

```javascript
$('.element').data(pluginName) instanceof $.fn.pluginName.__constr__
```

### Examples

#### Empty plugin

Plugin that does nothing:

```javascript
(function($) {
  var Plugin = function() {}
  $.newPlugin('plugin', Plugin);
})(jQuery);
```
Usage:

```javascript
$('.element-set').plugin();
```

#### Element and option

Plugin accepts option and attached element. The **opt** class adding when attaching **plugin**.

```javascript
(function($) {
  var Plugin = function($el, opt) {
    this.$el = $el;
    this.opt = opt;
    
    this.$el.addClass(opt);
  }
  $.newPlugin('plugin', Plugin);
})(jQuery);
```

Usage:

```javascript
$('.element-set').plugin('some-class');

```

#### `init`, `update`, `destroy` methods and events

```javascript
(function($) {
  var clickHandler = function(e) {
    var self = e.data;
    e.preventDefault();
    // do something
  }
  
  var Plugin = function($el, opt) {
    this.$el = $el;
    this.opt = $.extend({
      text : ''
    }, opt);
    
    this.init();
  }
  
  // init handlers
  Plugin.prototype.init = function() {
    this.$el
      .on('click', this, clickHandler)
      .text(this.opt.text);
  }
  
  // updating text option
  Plugin.prototype.update = function(opt) {
    $.extend(this.opt, opt);
    this.$el.text(this.opt.text);
  }
  
  // destroy method
  Plugin.prototype.destroy = function() {
    this.$el
      .off('click', clickHandler)
      .removeData('plugin');
  }
  
  // custom method
  Plugin.prototype.smartMove = function() {
    this.$el
      .toggleClass('smart-class');
  }
  
  $.newPlugin('plugin', Plugin);
})(jQuery);
```

Usage:

```javascript
// creating
$('.element-set').plugin({
  text : 'This is new instance of "plugin"'
});

// updating
$('.element-set').plugin('update', {
  text : 'blah!'
});

// updating (other way)
$('.element-set').plugin({
  text : 'Blah-blah!'
});

// call custom method
$('.element-set').plugin('smartMove');

// destroying
$('.element-set').plugin('destroy');

```

More examples available in [tests](https://github.com/peremenov/jquery-factory/blob/master/test/tests.js)


## Todo

- Create plugin instances with `Object.create` (will loose compatibility with old browsers)
- More tests
- More examples
- Adapt (maybe fork?) for [BEM](https://en.bem.info) development process
- ~~Сompatibility tests with [Zepto](http://zeptojs.com)~~

## Contributing

You are welcomed to improve this small piece of software :)

## Author

- [Kir Peremenov](mailto:kirill@peremenov.ru)

## Thanks to

- [asg-3d](https://github.com/asg-3d)
- [KlonD90](https://github.com/KlonD90)
