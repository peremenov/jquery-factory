# jQuery Factory

Super simple and solid factory for jQuery plugins. It allows to follow classic JavaScript patterns instead of  [jQuery's](https://learn.jquery.com/plugins/basic-plugin-creation/).

Example of plugin:

```javascript

(function($) {
  var __pluginName = 'newPluginName';

  var Obj = function($el, opt) {
    this.$el = $el;
    this.opt = $.extend({
      txt : ''
    }, opt);

    this.init();
  };

  Obj.prototype = {
    init : function() {
       
    },
    destroy : function() {
      this.$el.removeData(__pluginName);
    },
    update : function(opt) {
      this.opt = $.extend(this.opt, opt);
    }
  };
  
  $.newPlugin(__pluginName, Obj);
})(jQuery);

```
