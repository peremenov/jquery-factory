(function(root, factory) {
  if ( typeof define === 'function' && define.amd ) {
    define([ 'jquery' ], factory);
  } else if ( typeof module == 'object' && module.exports ) {
    module.exports = function($) {
      return factory($);
    };
  } else {
    var $ = root.jQuery || root.Zepto;
    if ( !$ )
      throw new Error('jQuery or Zepto must be defined');
    $.newPlugin = factory($);
  }
})(this, function($, undefined) {
  'use strict';

  var noop = $.noop;
  /**
   * Default init options
   * @type {Object}
   */
  var defaultOptions = {
    ready: function() { return true; }
  };

  /**
   * Creates new plugin in `$.fn` object. If plugin/method exists factory throws error.
   * @param  {String} __pluginName plugin name must be unique relative to other plugins and internal jQuery methods
   * @param  {Function} Obj        plugin constructor Function
   * @param  {(Object|Function)} options    plugin options or callback Function
   * @return {Object}              returns plugin object itself
   */
  return function(__pluginName, Obj, options) {
    var ready;
    Obj = typeof Obj == 'function' ? Obj : noop;

    /**
     * Using for debugging, etc
     * @return {Boolean}  if true, stores new Object to data
     */
    if ( typeof options == 'function' ) {
      ready = options;
    } else {
      options = $.extend({}, defaultOptions, options);
      ready = options.ready;
    }

    /**
     * Throw error if plugin name is not defined
     */
    if ( !__pluginName || typeof __pluginName != 'string' ) {
      throw new Error('Expected plugin name');
    }

    /**
     * Checking for old plugin existence
     */
    if ( $.fn[__pluginName] !== undefined ) {
      throw new Error('Plugin "' + __pluginName + '" already exists');
    }

    /**
     * Object template with default methods
     */
    Obj.prototype = $.extend({
      destroy : noop,
      init:     noop,
      update:   noop
    }, Obj.prototype);

    /**
     * Creating new instance(s) for each given element
     * @return {jQuery}  returns jQuery object
     */
    var fn = $.fn[__pluginName] = function() {
      var args = [];
      /**
       * Using $.each because $.map function flatten arrays
       */
      $.each(arguments, function(index, arg) { args.push(arg); });

      var opt = args[0],
          params = args.slice(1);

      return this.each(function() {
        var $self = $(this),
            obj = $self.data(__pluginName),
            oldData;

        if ( obj instanceof Obj ) {
          if ( typeof opt == 'string' && typeof obj[opt] == 'function' )
            obj[opt].apply(obj, params);
          else
            obj.update.apply(obj, args);
        } else {
          /**
           * Don't init new plugin if calling destroy method
           */
          if ( opt != 'destroy' ) {
            /**
             * Data contains in element data-<__pluginName>
             */
            if ( obj !== undefined )
              oldData = obj;

            obj = new Obj($self, opt, oldData);
            
            if ( ready.call(obj) )
              $self.data(__pluginName, obj);
          }
        }
      });
    };

    fn.__constr__ = Obj;
    return fn;
  };
});
