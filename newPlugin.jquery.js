(function($, undefined) {
  'use strict';

  if ( !$ )
    throw new Error('jQuery must be defined');

  var noop = $.noop;
  /**
   * Default init options
   * @type {Object}
   */
  var defaultOptions = {
    cb: function() { return true; },
    // should be Array or null
    public: null
  };

  /**
   * Creates plugin in $.fn object
   * @param  {String} __pluginName plugin name must be unique relative to other plugins and internal jQuery methods
   * @param  {Function} Obj        plugin constructor Function
   * @param  {(Object|Function)} options    plugin options or callback Function
   * @return {Object}              returns plugin object itself
   */
  return $.newPlugin = function(__pluginName, Obj, options) {
    var cb;
    Obj = Obj instanceof Function ? Obj : function() {};

    /**
     * Using for debugging, etc
     * @return {Boolean}  if true, stores new Object to data
     */
    if ( options instanceof Function ) {
      cb = options;
    } else {
      options = $.extend({}, defaultOptions, options);
      cb = options.cb;
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
          if ( typeof opt == 'string' && obj[opt] instanceof Function )
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
            
            if ( cb.call(obj) )
              $self.data(__pluginName, obj);
          }
        }
      });
    };

    fn.__constr__ = Obj;
    return fn;
  };
})( (typeof exports != 'undefined' && exports) || (typeof window != 'undefined' && window.jQuery) || {} );
