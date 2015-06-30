(function($, window, undefined) {
  $.newPlugin = function(__pluginName, Obj, cb) {
    Obj = Obj || function() {};
      /**
       * Using for debugging, etc
       * @return {Boolean}  if true, stores new Object to data
       */
    cb = cb || function() { return true; };

    /**
     * Throw error if plugin name is not defined
     */
    if(!__pluginName || typeof __pluginName != 'string') {
      throw new Error('Expected plugin name');
    }

    /**
     * Checking for old plugin existence
     */
    if($.fn[__pluginName] !== undefined) {
      throw new Error('Plugin "' + __pluginName + '" already exists');
    }

    /**
     * Object template with default methods
     */
    Obj.prototype = $.extend({
      destroy : function() {},
      init :function() {},
      update : function() {}
    }, Obj.prototype);

    /**
     * Creating new instance(s) for each given element
     * @return {jQuery}  returns jQuery object
     */
    $.fn[__pluginName] = function() {
      var args = [];
      /**
       * Using $.each because $.map function flatten arrays
       */
      $.each(arguments, function(index, arg) { args.push(arg); });

      var opt  = args[0], params = args.slice(1)
      ;

      return this.each(function() {
        var $self = $(this), obj = $self.data(__pluginName), oldData
        ;

        if(obj instanceof Obj) {
          if(typeof opt == 'string' && typeof obj[opt] == 'function')
            obj[opt].apply(obj, params);
          else
            obj.update.apply(obj, args);
        } else {
          /**
           * Don't init new plugin if calling destroy method
           */
          if(opt != 'destroy') {
            /**
             * Data contains in element data-<__pluginName>
             */
            if(obj !== undefined)
              oldData = obj;

            obj = new Obj($self, opt, oldData);
            if( cb.call(obj) )
              $self.data(__pluginName, obj);
          }
        }
      });
    };
  };
})(jQuery, window);
