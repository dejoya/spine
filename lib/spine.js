(function(exports){

var  spine = exports.spine = {}
    ,$
    ,_;

if(typeof require !== 'undefined'){

    // we're on the server
    spine.EventEmitter = require('events').EventEmitter;
    $ = require('jQuery').jQuery;
    _ = require('underscore')._;

} else {
    // on the client
    
    spine.EventEmitter = this.EventEmitter;
    _ = this._;
    $ = this.jQuery;
}


// HELPERS taken from Backbone

var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = extend;
    return child;
};

// Shared empty constructor function to aid in prototype-chain creation.
var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call `super()`.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
    } else {
        child = function(){ return parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`, for `instanceof`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
};





// application
spine.Application = function(options){

    this.options = options || {};
    this.initialize(options);
    
    this.emit('initialized', 'this is an event argument');
}

_.extend(spine.Application.prototype, spine.EventEmitter.prototype, {

    // override this
    initialize: function(){ return this; }

});


// view
spine.View = function(options){
    
    this.options = options || {};
    this._ensureElement(options);
    this.initialize(options);
}

_.extend(spine.View.prototype, spine.EventEmitter.prototype, {

    // should be overridden to inject content into this.el
    render: function(){ return this; }
    
    ,template: null
    
    ,el: null
    
    ,$el: null
    
    ,initialize: function(){ return this; }
    
    // make sure that some form of element is attached to this view
    ,_ensureElement: function(opts){

        if(_.isString(opts.el)){
            this.$el = $(opts.el);
        } else if(_.isElement(opts.el)){
            this.$el = $(opts.el);
        } else {
            this.$el = $('<div/>');    
        }
        
        this.el = this.$el[0];
    }

});


// model
spine.Model = function(options){ 
    
    this.options = options || {};
    this.initialize(options);
}

_.extend(spine.Model, spine.EventEmitter.prototype, {

    // override this
    initialize: function(){ return this; }
    
    // override this
    ,save: function(){ 
        if(this.validate() === true) {
             return this;
        } else {
            throw new Error('Model is invalid');    
        }
        return this;
    }
    
    // override this
    ,validate: function(){ return true; }
    
    // override this
    ,load: function(){ return this; }
    
    ,set: function(prop, val){
        var old = this[prop];
        this[prop] = val;
        this.emit('change', prop, old, this[prop]);
    }

});


// setup Backbone-like extend/new
spine.Application.extend = spine.View.extend = spine.Model.extend = extend;


})( (typeof exports === 'undefined') ? window : exports );