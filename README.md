# jQuery Factory

Super simple, lightweight and solid factory of jQuery plugins. It allows to follow classic JavaScript patterns instead of [jQuery's](https://learn.jquery.com/plugins/basic-plugin-creation/) while creating plugin.

## Features

- Support all modern browsers (including mobile browsers)
- Support Internet Explorer 6-8 (needs jQuery 1.8 or less)
- Support jQuery version from 1.6
- Around 600 bytes compressed
- Efficient code re-usage when writing several plugins
- Test mode

## Usage

### Install

```bash
bower install --save jquery-factory
```

### `$.newPlugin(pluginName, Constr, callback)`

Produces new jQuery plugin in `$.fn` object with **Constr**. Factory accepts string **pluginName**. If plugin with the same name is exists factory throws an error.

By default each created plugin has built-in `init`, `update` and `destroy` methods that could be redefined.

`init` method should contain event handlers attaching, initial data, adding classes, etc.

`update` method using for options update and changing instance state.

`destroy` method for final destroying: handlers unattaching and plugin instance removing (using [`.removeData`](http://api.jquery.com/removeData/)).

You can append any method by adding it to prototype of constructor function.

Plugin instances stores with jQuery [`.data`](http://api.jquery.com/data/) method so you can get plugin instance for testing or other purposes.

You can enable test mode by giving **callback** argument to `$.newPlugin`. **callback** accepts plugin instance context and should return `true` to continue instance attaching or `false` to prevent it.


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


## Todo

- Create plugin instances with `Object.create` (will loose compatibility with old browsers)
- More tests
- Publish to `npm`
- More examples
- Deploy tests to [travis.org](https://travis-ci.org)


## Contributing

You are welcomed to improve this small piece of software :)


## Author

- [Kir Peremenov](kirill@peremenov.ru)
