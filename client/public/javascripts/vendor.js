(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

(function(a){var b,c=function(){},d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(",");while(b=d.pop())a[b]=a[b]||c})(window.console=window.console||{});

;

/*!
 * jQuery JavaScript Library v1.7.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
    navigator = window.navigator,
    location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
        // The jQuery object is actually just the init constructor 'enhanced'
        return new jQuery.fn.init( selector, context, rootjQuery );
    },

    // Map over jQuery in case of overwrite
    _jQuery = window.jQuery,

    // Map over the $ in case of overwrite
    _$ = window.$,

    // A central reference to the root jQuery(document)
    rootjQuery,

    // A simple way to check for HTML strings or ID strings
    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

    // Check if a string has a non-whitespace character in it
    rnotwhite = /\S/,

    // Used for trimming whitespace
    trimLeft = /^\s+/,
    trimRight = /\s+$/,

    // Match a standalone tag
    rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

    // JSON RegExp
    rvalidchars = /^[\],:{}\s]*$/,
    rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
    rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
    rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

    // Useragent RegExp
    rwebkit = /(webkit)[ \/]([\w.]+)/,
    ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
    rmsie = /(msie) ([\w.]+)/,
    rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

    // Matches dashed string for camelizing
    rdashAlpha = /-([a-z]|[0-9])/ig,
    rmsPrefix = /^-ms-/,

    // Used by jQuery.camelCase as callback to replace()
    fcamelCase = function( all, letter ) {
        return ( letter + "" ).toUpperCase();
    },

    // Keep a UserAgent string for use with jQuery.browser
    userAgent = navigator.userAgent,

    // For matching the engine and version of the browser
    browserMatch,

    // The deferred used on DOM ready
    readyList,

    // The ready event handler
    DOMContentLoaded,

    // Save a reference to some core methods
    toString = Object.prototype.toString,
    hasOwn = Object.prototype.hasOwnProperty,
    push = Array.prototype.push,
    slice = Array.prototype.slice,
    trim = String.prototype.trim,
    indexOf = Array.prototype.indexOf,

    // [[Class]] -> type pairs
    class2type = {};

jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    init: function( selector, context, rootjQuery ) {
        var match, elem, ret, doc;

        // Handle $(""), $(null), or $(undefined)
        if ( !selector ) {
            return this;
        }

        // Handle $(DOMElement)
        if ( selector.nodeType ) {
            this.context = this[0] = selector;
            this.length = 1;
            return this;
        }

        // The body element only exists once, optimize finding it
        if ( selector === "body" && !context && document.body ) {
            this.context = document;
            this[0] = document.body;
            this.selector = selector;
            this.length = 1;
            return this;
        }

        // Handle HTML strings
        if ( typeof selector === "string" ) {
            // Are we dealing with HTML string or an ID?
            if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
                // Assume that strings that start and end with <> are HTML and skip the regex check
                match = [ null, selector, null ];

            } else {
                match = quickExpr.exec( selector );
            }

            // Verify a match, and that no context was specified for #id
            if ( match && (match[1] || !context) ) {

                // HANDLE: $(html) -> $(array)
                if ( match[1] ) {
                    context = context instanceof jQuery ? context[0] : context;
                    doc = ( context ? context.ownerDocument || context : document );

                    // If a single string is passed in and it's a single tag
                    // just do a createElement and skip the rest
                    ret = rsingleTag.exec( selector );

                    if ( ret ) {
                        if ( jQuery.isPlainObject( context ) ) {
                            selector = [ document.createElement( ret[1] ) ];
                            jQuery.fn.attr.call( selector, context, true );

                        } else {
                            selector = [ doc.createElement( ret[1] ) ];
                        }

                    } else {
                        ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
                        selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
                    }

                    return jQuery.merge( this, selector );

                // HANDLE: $("#id")
                } else {
                    elem = document.getElementById( match[2] );

                    // Check parentNode to catch when Blackberry 4.6 returns
                    // nodes that are no longer in the document #6963
                    if ( elem && elem.parentNode ) {
                        // Handle the case where IE and Opera return items
                        // by name instead of ID
                        if ( elem.id !== match[2] ) {
                            return rootjQuery.find( selector );
                        }

                        // Otherwise, we inject the element directly into the jQuery object
                        this.length = 1;
                        this[0] = elem;
                    }

                    this.context = document;
                    this.selector = selector;
                    return this;
                }

            // HANDLE: $(expr, $(...))
            } else if ( !context || context.jquery ) {
                return ( context || rootjQuery ).find( selector );

            // HANDLE: $(expr, context)
            // (which is just equivalent to: $(context).find(expr)
            } else {
                return this.constructor( context ).find( selector );
            }

        // HANDLE: $(function)
        // Shortcut for document ready
        } else if ( jQuery.isFunction( selector ) ) {
            return rootjQuery.ready( selector );
        }

        if ( selector.selector !== undefined ) {
            this.selector = selector.selector;
            this.context = selector.context;
        }

        return jQuery.makeArray( selector, this );
    },

    // Start with an empty selector
    selector: "",

    // The current version of jQuery being used
    jquery: "1.7.1",

    // The default length of a jQuery object is 0
    length: 0,

    // The number of elements contained in the matched element set
    size: function() {
        return this.length;
    },

    toArray: function() {
        return slice.call( this, 0 );
    },

    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function( num ) {
        return num == null ?

            // Return a 'clean' array
            this.toArray() :

            // Return just the object
            ( num < 0 ? this[ this.length + num ] : this[ num ] );
    },

    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    pushStack: function( elems, name, selector ) {
        // Build a new jQuery matched element set
        var ret = this.constructor();

        if ( jQuery.isArray( elems ) ) {
            push.apply( ret, elems );

        } else {
            jQuery.merge( ret, elems );
        }

        // Add the old object onto the stack (as a reference)
        ret.prevObject = this;

        ret.context = this.context;

        if ( name === "find" ) {
            ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
        } else if ( name ) {
            ret.selector = this.selector + "." + name + "(" + selector + ")";
        }

        // Return the newly-formed element set
        return ret;
    },

    // Execute a callback for every element in the matched set.
    // (You can seed the arguments with an array of args, but this is
    // only used internally.)
    each: function( callback, args ) {
        return jQuery.each( this, callback, args );
    },

    ready: function( fn ) {
        // Attach the listeners
        jQuery.bindReady();

        // Add the callback
        readyList.add( fn );

        return this;
    },

    eq: function( i ) {
        i = +i;
        return i === -1 ?
            this.slice( i ) :
            this.slice( i, i + 1 );
    },

    first: function() {
        return this.eq( 0 );
    },

    last: function() {
        return this.eq( -1 );
    },

    slice: function() {
        return this.pushStack( slice.apply( this, arguments ),
            "slice", slice.call(arguments).join(",") );
    },

    map: function( callback ) {
        return this.pushStack( jQuery.map(this, function( elem, i ) {
            return callback.call( elem, i, elem );
        }));
    },

    end: function() {
        return this.prevObject || this.constructor(null);
    },

    // For internal use only.
    // Behaves like an Array's method, not like a jQuery method.
    push: push,
    sort: [].sort,
    splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
        target = {};
    }

    // extend jQuery itself if only one argument is passed
    if ( length === i ) {
        target = this;
        --i;
    }

    for ( ; i < length; i++ ) {
        // Only deal with non-null/undefined values
        if ( (options = arguments[ i ]) != null ) {
            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : [];

                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[ name ] = jQuery.extend( deep, clone, copy );

                // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};

jQuery.extend({
    noConflict: function( deep ) {
        if ( window.$ === jQuery ) {
            window.$ = _$;
        }

        if ( deep && window.jQuery === jQuery ) {
            window.jQuery = _jQuery;
        }

        return jQuery;
    },

    // Is the DOM ready to be used? Set to true once it occurs.
    isReady: false,

    // A counter to track how many items to wait for before
    // the ready event fires. See #6781
    readyWait: 1,

    // Hold (or release) the ready event
    holdReady: function( hold ) {
        if ( hold ) {
            jQuery.readyWait++;
        } else {
            jQuery.ready( true );
        }
    },

    // Handle when the DOM is ready
    ready: function( wait ) {
        // Either a released hold or an DOMready/load event and not yet ready
        if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if ( !document.body ) {
                return setTimeout( jQuery.ready, 1 );
            }

            // Remember that the DOM is ready
            jQuery.isReady = true;

            // If a normal DOM Ready event fired, decrement, and wait if need be
            if ( wait !== true && --jQuery.readyWait > 0 ) {
                return;
            }

            // If there are functions bound, to execute
            readyList.fireWith( document, [ jQuery ] );

            // Trigger any bound ready events
            if ( jQuery.fn.trigger ) {
                jQuery( document ).trigger( "ready" ).off( "ready" );
            }
        }
    },

    bindReady: function() {
        if ( readyList ) {
            return;
        }

        readyList = jQuery.Callbacks( "once memory" );

        // Catch cases where $(document).ready() is called after the
        // browser event has already occurred.
        if ( document.readyState === "complete" ) {
            // Handle it asynchronously to allow scripts the opportunity to delay ready
            return setTimeout( jQuery.ready, 1 );
        }

        // Mozilla, Opera and webkit nightlies currently support this event
        if ( document.addEventListener ) {
            // Use the handy event callback
            document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

            // A fallback to window.onload, that will always work
            window.addEventListener( "load", jQuery.ready, false );

        // If IE event model is used
        } else if ( document.attachEvent ) {
            // ensure firing before onload,
            // maybe late but safe also for iframes
            document.attachEvent( "onreadystatechange", DOMContentLoaded );

            // A fallback to window.onload, that will always work
            window.attachEvent( "onload", jQuery.ready );

            // If IE and not a frame
            // continually check to see if the document is ready
            var toplevel = false;

            try {
                toplevel = window.frameElement == null;
            } catch(e) {}

            if ( document.documentElement.doScroll && toplevel ) {
                doScrollCheck();
            }
        }
    },

    // See test/unit/core.js for details concerning isFunction.
    // Since version 1.3, DOM methods and functions like alert
    // aren't supported. They return false on IE (#2968).
    isFunction: function( obj ) {
        return jQuery.type(obj) === "function";
    },

    isArray: Array.isArray || function( obj ) {
        return jQuery.type(obj) === "array";
    },

    // A crude way of determining if an object is a window
    isWindow: function( obj ) {
        return obj && typeof obj === "object" && "setInterval" in obj;
    },

    isNumeric: function( obj ) {
        return !isNaN( parseFloat(obj) ) && isFinite( obj );
    },

    type: function( obj ) {
        return obj == null ?
            String( obj ) :
            class2type[ toString.call(obj) ] || "object";
    },

    isPlainObject: function( obj ) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
            return false;
        }

        try {
            // Not own constructor property must be Object
            if ( obj.constructor &&
                !hasOwn.call(obj, "constructor") &&
                !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                return false;
            }
        } catch ( e ) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.

        var key;
        for ( key in obj ) {}

        return key === undefined || hasOwn.call( obj, key );
    },

    isEmptyObject: function( obj ) {
        for ( var name in obj ) {
            return false;
        }
        return true;
    },

    error: function( msg ) {
        throw new Error( msg );
    },

    parseJSON: function( data ) {
        if ( typeof data !== "string" || !data ) {
            return null;
        }

        // Make sure leading/trailing whitespace is removed (IE can't handle it)
        data = jQuery.trim( data );

        // Attempt to parse using the native JSON parser first
        if ( window.JSON && window.JSON.parse ) {
            return window.JSON.parse( data );
        }

        // Make sure the incoming data is actual JSON
        // Logic borrowed from http://json.org/json2.js
        if ( rvalidchars.test( data.replace( rvalidescape, "@" )
            .replace( rvalidtokens, "]" )
            .replace( rvalidbraces, "")) ) {

            return ( new Function( "return " + data ) )();

        }
        jQuery.error( "Invalid JSON: " + data );
    },

    // Cross-browser xml parsing
    parseXML: function( data ) {
        var xml, tmp;
        try {
            if ( window.DOMParser ) { // Standard
                tmp = new DOMParser();
                xml = tmp.parseFromString( data , "text/xml" );
            } else { // IE
                xml = new ActiveXObject( "Microsoft.XMLDOM" );
                xml.async = "false";
                xml.loadXML( data );
            }
        } catch( e ) {
            xml = undefined;
        }
        if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
            jQuery.error( "Invalid XML: " + data );
        }
        return xml;
    },

    noop: function() {},

    // Evaluates a script in a global context
    // Workarounds based on findings by Jim Driscoll
    // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
    globalEval: function( data ) {
        if ( data && rnotwhite.test( data ) ) {
            // We use execScript on Internet Explorer
            // We use an anonymous function so that context is window
            // rather than jQuery in Firefox
            ( window.execScript || function( data ) {
                window[ "eval" ].call( window, data );
            } )( data );
        }
    },

    // Convert dashed to camelCase; used by the css and data modules
    // Microsoft forgot to hump their vendor prefix (#9572)
    camelCase: function( string ) {
        return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
    },

    nodeName: function( elem, name ) {
        return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
    },

    // args is for internal usage only
    each: function( object, callback, args ) {
        var name, i = 0,
            length = object.length,
            isObj = length === undefined || jQuery.isFunction( object );

        if ( args ) {
            if ( isObj ) {
                for ( name in object ) {
                    if ( callback.apply( object[ name ], args ) === false ) {
                        break;
                    }
                }
            } else {
                for ( ; i < length; ) {
                    if ( callback.apply( object[ i++ ], args ) === false ) {
                        break;
                    }
                }
            }

        // A special, fast, case for the most common use of each
        } else {
            if ( isObj ) {
                for ( name in object ) {
                    if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
                        break;
                    }
                }
            } else {
                for ( ; i < length; ) {
                    if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
                        break;
                    }
                }
            }
        }

        return object;
    },

    // Use native String.trim function wherever possible
    trim: trim ?
        function( text ) {
            return text == null ?
                "" :
                trim.call( text );
        } :

        // Otherwise use our own trimming functionality
        function( text ) {
            return text == null ?
                "" :
                text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
        },

    // results is for internal usage only
    makeArray: function( array, results ) {
        var ret = results || [];

        if ( array != null ) {
            // The window, strings (and functions) also have 'length'
            // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
            var type = jQuery.type( array );

            if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
                push.call( ret, array );
            } else {
                jQuery.merge( ret, array );
            }
        }

        return ret;
    },

    inArray: function( elem, array, i ) {
        var len;

        if ( array ) {
            if ( indexOf ) {
                return indexOf.call( array, elem, i );
            }

            len = array.length;
            i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

            for ( ; i < len; i++ ) {
                // Skip accessing in sparse arrays
                if ( i in array && array[ i ] === elem ) {
                    return i;
                }
            }
        }

        return -1;
    },

    merge: function( first, second ) {
        var i = first.length,
            j = 0;

        if ( typeof second.length === "number" ) {
            for ( var l = second.length; j < l; j++ ) {
                first[ i++ ] = second[ j ];
            }

        } else {
            while ( second[j] !== undefined ) {
                first[ i++ ] = second[ j++ ];
            }
        }

        first.length = i;

        return first;
    },

    grep: function( elems, callback, inv ) {
        var ret = [], retVal;
        inv = !!inv;

        // Go through the array, only saving the items
        // that pass the validator function
        for ( var i = 0, length = elems.length; i < length; i++ ) {
            retVal = !!callback( elems[ i ], i );
            if ( inv !== retVal ) {
                ret.push( elems[ i ] );
            }
        }

        return ret;
    },

    // arg is for internal usage only
    map: function( elems, callback, arg ) {
        var value, key, ret = [],
            i = 0,
            length = elems.length,
            // jquery objects are treated as arrays
            isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

        // Go through the array, translating each of the items to their
        if ( isArray ) {
            for ( ; i < length; i++ ) {
                value = callback( elems[ i ], i, arg );

                if ( value != null ) {
                    ret[ ret.length ] = value;
                }
            }

        // Go through every key on the object,
        } else {
            for ( key in elems ) {
                value = callback( elems[ key ], key, arg );

                if ( value != null ) {
                    ret[ ret.length ] = value;
                }
            }
        }

        // Flatten any nested arrays
        return ret.concat.apply( [], ret );
    },

    // A global GUID counter for objects
    guid: 1,

    // Bind a function to a context, optionally partially applying any
    // arguments.
    proxy: function( fn, context ) {
        if ( typeof context === "string" ) {
            var tmp = fn[ context ];
            context = fn;
            fn = tmp;
        }

        // Quick check to determine if target is callable, in the spec
        // this throws a TypeError, but we will just return undefined.
        if ( !jQuery.isFunction( fn ) ) {
            return undefined;
        }

        // Simulated bind
        var args = slice.call( arguments, 2 ),
            proxy = function() {
                return fn.apply( context, args.concat( slice.call( arguments ) ) );
            };

        // Set the guid of unique handler to the same of original handler, so it can be removed
        proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

        return proxy;
    },

    // Mutifunctional method to get and set values to a collection
    // The value/s can optionally be executed if it's a function
    access: function( elems, key, value, exec, fn, pass ) {
        var length = elems.length;

        // Setting many attributes
        if ( typeof key === "object" ) {
            for ( var k in key ) {
                jQuery.access( elems, k, key[k], exec, fn, value );
            }
            return elems;
        }

        // Setting one attribute
        if ( value !== undefined ) {
            // Optionally, function values get executed if exec is true
            exec = !pass && exec && jQuery.isFunction(value);

            for ( var i = 0; i < length; i++ ) {
                fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
            }

            return elems;
        }

        // Getting an attribute
        return length ? fn( elems[0], key ) : undefined;
    },

    now: function() {
        return ( new Date() ).getTime();
    },

    // Use of jQuery.browser is frowned upon.
    // More details: http://docs.jquery.com/Utilities/jQuery.browser
    uaMatch: function( ua ) {
        ua = ua.toLowerCase();

        var match = rwebkit.exec( ua ) ||
            ropera.exec( ua ) ||
            rmsie.exec( ua ) ||
            ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
            [];

        return { browser: match[1] || "", version: match[2] || "0" };
    },

    sub: function() {
        function jQuerySub( selector, context ) {
            return new jQuerySub.fn.init( selector, context );
        }
        jQuery.extend( true, jQuerySub, this );
        jQuerySub.superclass = this;
        jQuerySub.fn = jQuerySub.prototype = this();
        jQuerySub.fn.constructor = jQuerySub;
        jQuerySub.sub = this.sub;
        jQuerySub.fn.init = function init( selector, context ) {
            if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
                context = jQuerySub( context );
            }

            return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
        };
        jQuerySub.fn.init.prototype = jQuerySub.fn;
        var rootjQuerySub = jQuerySub(document);
        return jQuerySub;
    },

    browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
    jQuery.browser[ browserMatch.browser ] = true;
    jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
    jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
    trimLeft = /^[\s\xA0]+/;
    trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
    DOMContentLoaded = function() {
        document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
        jQuery.ready();
    };

} else if ( document.attachEvent ) {
    DOMContentLoaded = function() {
        // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
        if ( document.readyState === "complete" ) {
            document.detachEvent( "onreadystatechange", DOMContentLoaded );
            jQuery.ready();
        }
    };
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
    if ( jQuery.isReady ) {
        return;
    }

    try {
        // If IE is used, use the trick by Diego Perini
        // http://javascript.nwbox.com/IEContentLoaded/
        document.documentElement.doScroll("left");
    } catch(e) {
        setTimeout( doScrollCheck, 1 );
        return;
    }

    // and execute any waiting functions
    jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
    var object = flagsCache[ flags ] = {},
        i, length;
    flags = flags.split( /\s+/ );
    for ( i = 0, length = flags.length; i < length; i++ ) {
        object[ flags[i] ] = true;
    }
    return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *  flags:  an optional list of space-separated flags that will change how
 *          the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *  once:           will ensure the callback list can only be fired once (like a Deferred)
 *
 *  memory:         will keep track of previous values and will call any callback added
 *                  after the list has been fired right away with the latest "memorized"
 *                  values (like a Deferred)
 *
 *  unique:         will ensure a callback can only be added once (no duplicate in the list)
 *
 *  stopOnFalse:    interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

    // Convert flags from String-formatted to Object-formatted
    // (we check in cache first)
    flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

    var // Actual callback list
        list = [],
        // Stack of fire calls for repeatable lists
        stack = [],
        // Last fire value (for non-forgettable lists)
        memory,
        // Flag to know if list is currently firing
        firing,
        // First callback to fire (used internally by add and fireWith)
        firingStart,
        // End of the loop when firing
        firingLength,
        // Index of currently firing callback (modified by remove if needed)
        firingIndex,
        // Add one or several callbacks to the list
        add = function( args ) {
            var i,
                length,
                elem,
                type,
                actual;
            for ( i = 0, length = args.length; i < length; i++ ) {
                elem = args[ i ];
                type = jQuery.type( elem );
                if ( type === "array" ) {
                    // Inspect recursively
                    add( elem );
                } else if ( type === "function" ) {
                    // Add if not in unique mode and callback is not in
                    if ( !flags.unique || !self.has( elem ) ) {
                        list.push( elem );
                    }
                }
            }
        },
        // Fire callbacks
        fire = function( context, args ) {
            args = args || [];
            memory = !flags.memory || [ context, args ];
            firing = true;
            firingIndex = firingStart || 0;
            firingStart = 0;
            firingLength = list.length;
            for ( ; list && firingIndex < firingLength; firingIndex++ ) {
                if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
                    memory = true; // Mark as halted
                    break;
                }
            }
            firing = false;
            if ( list ) {
                if ( !flags.once ) {
                    if ( stack && stack.length ) {
                        memory = stack.shift();
                        self.fireWith( memory[ 0 ], memory[ 1 ] );
                    }
                } else if ( memory === true ) {
                    self.disable();
                } else {
                    list = [];
                }
            }
        },
        // Actual Callbacks object
        self = {
            // Add a callback or a collection of callbacks to the list
            add: function() {
                if ( list ) {
                    var length = list.length;
                    add( arguments );
                    // Do we need to add the callbacks to the
                    // current firing batch?
                    if ( firing ) {
                        firingLength = list.length;
                    // With memory, if we're not firing then
                    // we should call right away, unless previous
                    // firing was halted (stopOnFalse)
                    } else if ( memory && memory !== true ) {
                        firingStart = length;
                        fire( memory[ 0 ], memory[ 1 ] );
                    }
                }
                return this;
            },
            // Remove a callback from the list
            remove: function() {
                if ( list ) {
                    var args = arguments,
                        argIndex = 0,
                        argLength = args.length;
                    for ( ; argIndex < argLength ; argIndex++ ) {
                        for ( var i = 0; i < list.length; i++ ) {
                            if ( args[ argIndex ] === list[ i ] ) {
                                // Handle firingIndex and firingLength
                                if ( firing ) {
                                    if ( i <= firingLength ) {
                                        firingLength--;
                                        if ( i <= firingIndex ) {
                                            firingIndex--;
                                        }
                                    }
                                }
                                // Remove the element
                                list.splice( i--, 1 );
                                // If we have some unicity property then
                                // we only need to do this once
                                if ( flags.unique ) {
                                    break;
                                }
                            }
                        }
                    }
                }
                return this;
            },
            // Control if a given callback is in the list
            has: function( fn ) {
                if ( list ) {
                    var i = 0,
                        length = list.length;
                    for ( ; i < length; i++ ) {
                        if ( fn === list[ i ] ) {
                            return true;
                        }
                    }
                }
                return false;
            },
            // Remove all callbacks from the list
            empty: function() {
                list = [];
                return this;
            },
            // Have the list do nothing anymore
            disable: function() {
                list = stack = memory = undefined;
                return this;
            },
            // Is it disabled?
            disabled: function() {
                return !list;
            },
            // Lock the list in its current state
            lock: function() {
                stack = undefined;
                if ( !memory || memory === true ) {
                    self.disable();
                }
                return this;
            },
            // Is it locked?
            locked: function() {
                return !stack;
            },
            // Call all callbacks with the given context and arguments
            fireWith: function( context, args ) {
                if ( stack ) {
                    if ( firing ) {
                        if ( !flags.once ) {
                            stack.push( [ context, args ] );
                        }
                    } else if ( !( flags.once && memory ) ) {
                        fire( context, args );
                    }
                }
                return this;
            },
            // Call all the callbacks with the given arguments
            fire: function() {
                self.fireWith( this, arguments );
                return this;
            },
            // To know if the callbacks have already been called at least once
            fired: function() {
                return !!memory;
            }
        };

    return self;
};




var // Static reference to slice
    sliceDeferred = [].slice;

jQuery.extend({

    Deferred: function( func ) {
        var doneList = jQuery.Callbacks( "once memory" ),
            failList = jQuery.Callbacks( "once memory" ),
            progressList = jQuery.Callbacks( "memory" ),
            state = "pending",
            lists = {
                resolve: doneList,
                reject: failList,
                notify: progressList
            },
            promise = {
                done: doneList.add,
                fail: failList.add,
                progress: progressList.add,

                state: function() {
                    return state;
                },

                // Deprecated
                isResolved: doneList.fired,
                isRejected: failList.fired,

                then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
                    deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
                    return this;
                },
                always: function() {
                    deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
                    return this;
                },
                pipe: function( fnDone, fnFail, fnProgress ) {
                    return jQuery.Deferred(function( newDefer ) {
                        jQuery.each( {
                            done: [ fnDone, "resolve" ],
                            fail: [ fnFail, "reject" ],
                            progress: [ fnProgress, "notify" ]
                        }, function( handler, data ) {
                            var fn = data[ 0 ],
                                action = data[ 1 ],
                                returned;
                            if ( jQuery.isFunction( fn ) ) {
                                deferred[ handler ](function() {
                                    returned = fn.apply( this, arguments );
                                    if ( returned && jQuery.isFunction( returned.promise ) ) {
                                        returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
                                    } else {
                                        newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
                                    }
                                });
                            } else {
                                deferred[ handler ]( newDefer[ action ] );
                            }
                        });
                    }).promise();
                },
                // Get a promise for this deferred
                // If obj is provided, the promise aspect is added to the object
                promise: function( obj ) {
                    if ( obj == null ) {
                        obj = promise;
                    } else {
                        for ( var key in promise ) {
                            obj[ key ] = promise[ key ];
                        }
                    }
                    return obj;
                }
            },
            deferred = promise.promise({}),
            key;

        for ( key in lists ) {
            deferred[ key ] = lists[ key ].fire;
            deferred[ key + "With" ] = lists[ key ].fireWith;
        }

        // Handle state
        deferred.done( function() {
            state = "resolved";
        }, failList.disable, progressList.lock ).fail( function() {
            state = "rejected";
        }, doneList.disable, progressList.lock );

        // Call given func if any
        if ( func ) {
            func.call( deferred, deferred );
        }

        // All done!
        return deferred;
    },

    // Deferred helper
    when: function( firstParam ) {
        var args = sliceDeferred.call( arguments, 0 ),
            i = 0,
            length = args.length,
            pValues = new Array( length ),
            count = length,
            pCount = length,
            deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
                firstParam :
                jQuery.Deferred(),
            promise = deferred.promise();
        function resolveFunc( i ) {
            return function( value ) {
                args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
                if ( !( --count ) ) {
                    deferred.resolveWith( deferred, args );
                }
            };
        }
        function progressFunc( i ) {
            return function( value ) {
                pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
                deferred.notifyWith( promise, pValues );
            };
        }
        if ( length > 1 ) {
            for ( ; i < length; i++ ) {
                if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
                    args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
                } else {
                    --count;
                }
            }
            if ( !count ) {
                deferred.resolveWith( deferred, args );
            }
        } else if ( deferred !== firstParam ) {
            deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
        }
        return promise;
    }
});




jQuery.support = (function() {

    var support,
        all,
        a,
        select,
        opt,
        input,
        marginDiv,
        fragment,
        tds,
        events,
        eventName,
        i,
        isSupported,
        div = document.createElement( "div" ),
        documentElement = document.documentElement;

    // Preliminary tests
    div.setAttribute("className", "t");
    div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

    all = div.getElementsByTagName( "*" );
    a = div.getElementsByTagName( "a" )[ 0 ];

    // Can't get basic test support
    if ( !all || !all.length || !a ) {
        return {};
    }

    // First batch of supports tests
    select = document.createElement( "select" );
    opt = select.appendChild( document.createElement("option") );
    input = div.getElementsByTagName( "input" )[ 0 ];

    support = {
        // IE strips leading whitespace when .innerHTML is used
        leadingWhitespace: ( div.firstChild.nodeType === 3 ),

        // Make sure that tbody elements aren't automatically inserted
        // IE will insert them into empty tables
        tbody: !div.getElementsByTagName("tbody").length,

        // Make sure that link elements get serialized correctly by innerHTML
        // This requires a wrapper element in IE
        htmlSerialize: !!div.getElementsByTagName("link").length,

        // Get the style information from getAttribute
        // (IE uses .cssText instead)
        style: /top/.test( a.getAttribute("style") ),

        // Make sure that URLs aren't manipulated
        // (IE normalizes it by default)
        hrefNormalized: ( a.getAttribute("href") === "/a" ),

        // Make sure that element opacity exists
        // (IE uses filter instead)
        // Use a regex to work around a WebKit issue. See #5145
        opacity: /^0.55/.test( a.style.opacity ),

        // Verify style float existence
        // (IE uses styleFloat instead of cssFloat)
        cssFloat: !!a.style.cssFloat,

        // Make sure that if no value is specified for a checkbox
        // that it defaults to "on".
        // (WebKit defaults to "" instead)
        checkOn: ( input.value === "on" ),

        // Make sure that a selected-by-default option has a working selected property.
        // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
        optSelected: opt.selected,

        // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
        getSetAttribute: div.className !== "t",

        // Tests for enctype support on a form(#6743)
        enctype: !!document.createElement("form").enctype,

        // Makes sure cloning an html5 element does not cause problems
        // Where outerHTML is undefined, this still works
        html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

        // Will be defined later
        submitBubbles: true,
        changeBubbles: true,
        focusinBubbles: false,
        deleteExpando: true,
        noCloneEvent: true,
        inlineBlockNeedsLayout: false,
        shrinkWrapBlocks: false,
        reliableMarginRight: true
    };

    // Make sure checked status is properly cloned
    input.checked = true;
    support.noCloneChecked = input.cloneNode( true ).checked;

    // Make sure that the options inside disabled selects aren't marked as disabled
    // (WebKit marks them as disabled)
    select.disabled = true;
    support.optDisabled = !opt.disabled;

    // Test to see if it's possible to delete an expando from an element
    // Fails in Internet Explorer
    try {
        delete div.test;
    } catch( e ) {
        support.deleteExpando = false;
    }

    if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
        div.attachEvent( "onclick", function() {
            // Cloning a node shouldn't copy over any
            // bound event handlers (IE does this)
            support.noCloneEvent = false;
        });
        div.cloneNode( true ).fireEvent( "onclick" );
    }

    // Check if a radio maintains its value
    // after being appended to the DOM
    input = document.createElement("input");
    input.value = "t";
    input.setAttribute("type", "radio");
    support.radioValue = input.value === "t";

    input.setAttribute("checked", "checked");
    div.appendChild( input );
    fragment = document.createDocumentFragment();
    fragment.appendChild( div.lastChild );

    // WebKit doesn't clone checked state correctly in fragments
    support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

    // Check if a disconnected checkbox will retain its checked
    // value of true after appended to the DOM (IE6/7)
    support.appendChecked = input.checked;

    fragment.removeChild( input );
    fragment.appendChild( div );

    div.innerHTML = "";

    // Check if div with explicit width and no margin-right incorrectly
    // gets computed margin-right based on width of container. For more
    // info see bug #3333
    // Fails in WebKit before Feb 2011 nightlies
    // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
    if ( window.getComputedStyle ) {
        marginDiv = document.createElement( "div" );
        marginDiv.style.width = "0";
        marginDiv.style.marginRight = "0";
        div.style.width = "2px";
        div.appendChild( marginDiv );
        support.reliableMarginRight =
            ( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
    }

    // Technique from Juriy Zaytsev
    // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
    // We only care about the case where non-standard event systems
    // are used, namely in IE. Short-circuiting here helps us to
    // avoid an eval call (in setAttribute) which can cause CSP
    // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
    if ( div.attachEvent ) {
        for( i in {
            submit: 1,
            change: 1,
            focusin: 1
        }) {
            eventName = "on" + i;
            isSupported = ( eventName in div );
            if ( !isSupported ) {
                div.setAttribute( eventName, "return;" );
                isSupported = ( typeof div[ eventName ] === "function" );
            }
            support[ i + "Bubbles" ] = isSupported;
        }
    }

    fragment.removeChild( div );

    // Null elements to avoid leaks in IE
    fragment = select = opt = marginDiv = div = input = null;

    // Run tests that need a body at doc ready
    jQuery(function() {
        var container, outer, inner, table, td, offsetSupport,
            conMarginTop, ptlm, vb, style, html,
            body = document.getElementsByTagName("body")[0];

        if ( !body ) {
            // Return for frameset docs that don't have a body
            return;
        }

        conMarginTop = 1;
        ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
        vb = "visibility:hidden;border:0;";
        style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
        html = "<div " + style + "><div></div></div>" +
            "<table " + style + " cellpadding='0' cellspacing='0'>" +
            "<tr><td></td></tr></table>";

        container = document.createElement("div");
        container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
        body.insertBefore( container, body.firstChild );

        // Construct the test element
        div = document.createElement("div");
        container.appendChild( div );

        // Check if table cells still have offsetWidth/Height when they are set
        // to display:none and there are still other visible table cells in a
        // table row; if so, offsetWidth/Height are not reliable for use when
        // determining if an element has been hidden directly using
        // display:none (it is still safe to use offsets if a parent element is
        // hidden; don safety goggles and see bug #4512 for more information).
        // (only IE 8 fails this test)
        div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
        tds = div.getElementsByTagName( "td" );
        isSupported = ( tds[ 0 ].offsetHeight === 0 );

        tds[ 0 ].style.display = "";
        tds[ 1 ].style.display = "none";

        // Check if empty table cells still have offsetWidth/Height
        // (IE <= 8 fail this test)
        support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

        // Figure out if the W3C box model works as expected
        div.innerHTML = "";
        div.style.width = div.style.paddingLeft = "1px";
        jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

        if ( typeof div.style.zoom !== "undefined" ) {
            // Check if natively block-level elements act like inline-block
            // elements when setting their display to 'inline' and giving
            // them layout
            // (IE < 8 does this)
            div.style.display = "inline";
            div.style.zoom = 1;
            support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

            // Check if elements with layout shrink-wrap their children
            // (IE 6 does this)
            div.style.display = "";
            div.innerHTML = "<div style='width:4px;'></div>";
            support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
        }

        div.style.cssText = ptlm + vb;
        div.innerHTML = html;

        outer = div.firstChild;
        inner = outer.firstChild;
        td = outer.nextSibling.firstChild.firstChild;

        offsetSupport = {
            doesNotAddBorder: ( inner.offsetTop !== 5 ),
            doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
        };

        inner.style.position = "fixed";
        inner.style.top = "20px";

        // safari subtracts parent border width here which is 5px
        offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
        inner.style.position = inner.style.top = "";

        outer.style.overflow = "hidden";
        outer.style.position = "relative";

        offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
        offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

        body.removeChild( container );
        div  = container = null;

        jQuery.extend( support, offsetSupport );
    });

    return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
    rmultiDash = /([A-Z])/g;

jQuery.extend({
    cache: {},

    // Please use with caution
    uuid: 0,

    // Unique for each copy of jQuery on the page
    // Non-digits removed to match rinlinejQuery
    expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

    // The following elements throw uncatchable exceptions if you
    // attempt to add expando properties to them.
    noData: {
        "embed": true,
        // Ban all objects except for Flash (which handle expandos)
        "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
        "applet": true
    },

    hasData: function( elem ) {
        elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
        return !!elem && !isEmptyDataObject( elem );
    },

    data: function( elem, name, data, pvt /* Internal Use Only */ ) {
        if ( !jQuery.acceptData( elem ) ) {
            return;
        }

        var privateCache, thisCache, ret,
            internalKey = jQuery.expando,
            getByName = typeof name === "string",

            // We have to handle DOM nodes and JS objects differently because IE6-7
            // can't GC object references properly across the DOM-JS boundary
            isNode = elem.nodeType,

            // Only DOM nodes need the global jQuery cache; JS object data is
            // attached directly to the object so GC can occur automatically
            cache = isNode ? jQuery.cache : elem,

            // Only defining an ID for JS objects if its cache already exists allows
            // the code to shortcut on the same path as a DOM node with no cache
            id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
            isEvents = name === "events";

        // Avoid doing any more work than we need to when trying to get data on an
        // object that has no data at all
        if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
            return;
        }

        if ( !id ) {
            // Only DOM nodes need a new unique ID for each element since their data
            // ends up in the global cache
            if ( isNode ) {
                elem[ internalKey ] = id = ++jQuery.uuid;
            } else {
                id = internalKey;
            }
        }

        if ( !cache[ id ] ) {
            cache[ id ] = {};

            // Avoids exposing jQuery metadata on plain JS objects when the object
            // is serialized using JSON.stringify
            if ( !isNode ) {
                cache[ id ].toJSON = jQuery.noop;
            }
        }

        // An object can be passed to jQuery.data instead of a key/value pair; this gets
        // shallow copied over onto the existing cache
        if ( typeof name === "object" || typeof name === "function" ) {
            if ( pvt ) {
                cache[ id ] = jQuery.extend( cache[ id ], name );
            } else {
                cache[ id ].data = jQuery.extend( cache[ id ].data, name );
            }
        }

        privateCache = thisCache = cache[ id ];

        // jQuery data() is stored in a separate object inside the object's internal data
        // cache in order to avoid key collisions between internal data and user-defined
        // data.
        if ( !pvt ) {
            if ( !thisCache.data ) {
                thisCache.data = {};
            }

            thisCache = thisCache.data;
        }

        if ( data !== undefined ) {
            thisCache[ jQuery.camelCase( name ) ] = data;
        }

        // Users should not attempt to inspect the internal events object using jQuery.data,
        // it is undocumented and subject to change. But does anyone listen? No.
        if ( isEvents && !thisCache[ name ] ) {
            return privateCache.events;
        }

        // Check for both converted-to-camel and non-converted data property names
        // If a data property was specified
        if ( getByName ) {

            // First Try to find as-is property data
            ret = thisCache[ name ];

            // Test for null|undefined property data
            if ( ret == null ) {

                // Try to find the camelCased property
                ret = thisCache[ jQuery.camelCase( name ) ];
            }
        } else {
            ret = thisCache;
        }

        return ret;
    },

    removeData: function( elem, name, pvt /* Internal Use Only */ ) {
        if ( !jQuery.acceptData( elem ) ) {
            return;
        }

        var thisCache, i, l,

            // Reference to internal data cache key
            internalKey = jQuery.expando,

            isNode = elem.nodeType,

            // See jQuery.data for more information
            cache = isNode ? jQuery.cache : elem,

            // See jQuery.data for more information
            id = isNode ? elem[ internalKey ] : internalKey;

        // If there is already no cache entry for this object, there is no
        // purpose in continuing
        if ( !cache[ id ] ) {
            return;
        }

        if ( name ) {

            thisCache = pvt ? cache[ id ] : cache[ id ].data;

            if ( thisCache ) {

                // Support array or space separated string names for data keys
                if ( !jQuery.isArray( name ) ) {

                    // try the string as a key before any manipulation
                    if ( name in thisCache ) {
                        name = [ name ];
                    } else {

                        // split the camel cased version by spaces unless a key with the spaces exists
                        name = jQuery.camelCase( name );
                        if ( name in thisCache ) {
                            name = [ name ];
                        } else {
                            name = name.split( " " );
                        }
                    }
                }

                for ( i = 0, l = name.length; i < l; i++ ) {
                    delete thisCache[ name[i] ];
                }

                // If there is no data left in the cache, we want to continue
                // and let the cache object itself get destroyed
                if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
                    return;
                }
            }
        }

        // See jQuery.data for more information
        if ( !pvt ) {
            delete cache[ id ].data;

            // Don't destroy the parent cache unless the internal data object
            // had been the only thing left in it
            if ( !isEmptyDataObject(cache[ id ]) ) {
                return;
            }
        }

        // Browsers that fail expando deletion also refuse to delete expandos on
        // the window, but it will allow it on all other JS objects; other browsers
        // don't care
        // Ensure that `cache` is not a window object #10080
        if ( jQuery.support.deleteExpando || !cache.setInterval ) {
            delete cache[ id ];
        } else {
            cache[ id ] = null;
        }

        // We destroyed the cache and need to eliminate the expando on the node to avoid
        // false lookups in the cache for entries that no longer exist
        if ( isNode ) {
            // IE does not allow us to delete expando properties from nodes,
            // nor does it have a removeAttribute function on Document nodes;
            // we must handle all of these cases
            if ( jQuery.support.deleteExpando ) {
                delete elem[ internalKey ];
            } else if ( elem.removeAttribute ) {
                elem.removeAttribute( internalKey );
            } else {
                elem[ internalKey ] = null;
            }
        }
    },

    // For internal use only.
    _data: function( elem, name, data ) {
        return jQuery.data( elem, name, data, true );
    },

    // A method for determining if a DOM node can handle the data expando
    acceptData: function( elem ) {
        if ( elem.nodeName ) {
            var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

            if ( match ) {
                return !(match === true || elem.getAttribute("classid") !== match);
            }
        }

        return true;
    }
});

jQuery.fn.extend({
    data: function( key, value ) {
        var parts, attr, name,
            data = null;

        if ( typeof key === "undefined" ) {
            if ( this.length ) {
                data = jQuery.data( this[0] );

                if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
                    attr = this[0].attributes;
                    for ( var i = 0, l = attr.length; i < l; i++ ) {
                        name = attr[i].name;

                        if ( name.indexOf( "data-" ) === 0 ) {
                            name = jQuery.camelCase( name.substring(5) );

                            dataAttr( this[0], name, data[ name ] );
                        }
                    }
                    jQuery._data( this[0], "parsedAttrs", true );
                }
            }

            return data;

        } else if ( typeof key === "object" ) {
            return this.each(function() {
                jQuery.data( this, key );
            });
        }

        parts = key.split(".");
        parts[1] = parts[1] ? "." + parts[1] : "";

        if ( value === undefined ) {
            data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

            // Try to fetch any internally stored data first
            if ( data === undefined && this.length ) {
                data = jQuery.data( this[0], key );
                data = dataAttr( this[0], key, data );
            }

            return data === undefined && parts[1] ?
                this.data( parts[0] ) :
                data;

        } else {
            return this.each(function() {
                var self = jQuery( this ),
                    args = [ parts[0], value ];

                self.triggerHandler( "setData" + parts[1] + "!", args );
                jQuery.data( this, key, value );
                self.triggerHandler( "changeData" + parts[1] + "!", args );
            });
        }
    },

    removeData: function( key ) {
        return this.each(function() {
            jQuery.removeData( this, key );
        });
    }
});

function dataAttr( elem, key, data ) {
    // If nothing was found internally, try to fetch any
    // data from the HTML5 data-* attribute
    if ( data === undefined && elem.nodeType === 1 ) {

        var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

        data = elem.getAttribute( name );

        if ( typeof data === "string" ) {
            try {
                data = data === "true" ? true :
                data === "false" ? false :
                data === "null" ? null :
                jQuery.isNumeric( data ) ? parseFloat( data ) :
                    rbrace.test( data ) ? jQuery.parseJSON( data ) :
                    data;
            } catch( e ) {}

            // Make sure we set the data so it isn't changed later
            jQuery.data( elem, key, data );

        } else {
            data = undefined;
        }
    }

    return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
    for ( var name in obj ) {

        // if the public data object is empty, the private is still empty
        if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
            continue;
        }
        if ( name !== "toJSON" ) {
            return false;
        }
    }

    return true;
}




function handleQueueMarkDefer( elem, type, src ) {
    var deferDataKey = type + "defer",
        queueDataKey = type + "queue",
        markDataKey = type + "mark",
        defer = jQuery._data( elem, deferDataKey );
    if ( defer &&
        ( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
        ( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
        // Give room for hard-coded callbacks to fire first
        // and eventually mark/queue something else on the element
        setTimeout( function() {
            if ( !jQuery._data( elem, queueDataKey ) &&
                !jQuery._data( elem, markDataKey ) ) {
                jQuery.removeData( elem, deferDataKey, true );
                defer.fire();
            }
        }, 0 );
    }
}

jQuery.extend({

    _mark: function( elem, type ) {
        if ( elem ) {
            type = ( type || "fx" ) + "mark";
            jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
        }
    },

    _unmark: function( force, elem, type ) {
        if ( force !== true ) {
            type = elem;
            elem = force;
            force = false;
        }
        if ( elem ) {
            type = type || "fx";
            var key = type + "mark",
                count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
            if ( count ) {
                jQuery._data( elem, key, count );
            } else {
                jQuery.removeData( elem, key, true );
                handleQueueMarkDefer( elem, type, "mark" );
            }
        }
    },

    queue: function( elem, type, data ) {
        var q;
        if ( elem ) {
            type = ( type || "fx" ) + "queue";
            q = jQuery._data( elem, type );

            // Speed up dequeue by getting out quickly if this is just a lookup
            if ( data ) {
                if ( !q || jQuery.isArray(data) ) {
                    q = jQuery._data( elem, type, jQuery.makeArray(data) );
                } else {
                    q.push( data );
                }
            }
            return q || [];
        }
    },

    dequeue: function( elem, type ) {
        type = type || "fx";

        var queue = jQuery.queue( elem, type ),
            fn = queue.shift(),
            hooks = {};

        // If the fx queue is dequeued, always remove the progress sentinel
        if ( fn === "inprogress" ) {
            fn = queue.shift();
        }

        if ( fn ) {
            // Add a progress sentinel to prevent the fx queue from being
            // automatically dequeued
            if ( type === "fx" ) {
                queue.unshift( "inprogress" );
            }

            jQuery._data( elem, type + ".run", hooks );
            fn.call( elem, function() {
                jQuery.dequeue( elem, type );
            }, hooks );
        }

        if ( !queue.length ) {
            jQuery.removeData( elem, type + "queue " + type + ".run", true );
            handleQueueMarkDefer( elem, type, "queue" );
        }
    }
});

jQuery.fn.extend({
    queue: function( type, data ) {
        if ( typeof type !== "string" ) {
            data = type;
            type = "fx";
        }

        if ( data === undefined ) {
            return jQuery.queue( this[0], type );
        }
        return this.each(function() {
            var queue = jQuery.queue( this, type, data );

            if ( type === "fx" && queue[0] !== "inprogress" ) {
                jQuery.dequeue( this, type );
            }
        });
    },
    dequeue: function( type ) {
        return this.each(function() {
            jQuery.dequeue( this, type );
        });
    },
    // Based off of the plugin by Clint Helfers, with permission.
    // http://blindsignals.com/index.php/2009/07/jquery-delay/
    delay: function( time, type ) {
        time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
        type = type || "fx";

        return this.queue( type, function( next, hooks ) {
            var timeout = setTimeout( next, time );
            hooks.stop = function() {
                clearTimeout( timeout );
            };
        });
    },
    clearQueue: function( type ) {
        return this.queue( type || "fx", [] );
    },
    // Get a promise resolved when queues of a certain type
    // are emptied (fx is the type by default)
    promise: function( type, object ) {
        if ( typeof type !== "string" ) {
            object = type;
            type = undefined;
        }
        type = type || "fx";
        var defer = jQuery.Deferred(),
            elements = this,
            i = elements.length,
            count = 1,
            deferDataKey = type + "defer",
            queueDataKey = type + "queue",
            markDataKey = type + "mark",
            tmp;
        function resolve() {
            if ( !( --count ) ) {
                defer.resolveWith( elements, [ elements ] );
            }
        }
        while( i-- ) {
            if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
                    ( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
                        jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
                    jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
                count++;
                tmp.add( resolve );
            }
        }
        resolve();
        return defer.promise();
    }
});




var rclass = /[\n\t\r]/g,
    rspace = /\s+/,
    rreturn = /\r/g,
    rtype = /^(?:button|input)$/i,
    rfocusable = /^(?:button|input|object|select|textarea)$/i,
    rclickable = /^a(?:rea)?$/i,
    rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
    getSetAttribute = jQuery.support.getSetAttribute,
    nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
    attr: function( name, value ) {
        return jQuery.access( this, name, value, true, jQuery.attr );
    },

    removeAttr: function( name ) {
        return this.each(function() {
            jQuery.removeAttr( this, name );
        });
    },

    prop: function( name, value ) {
        return jQuery.access( this, name, value, true, jQuery.prop );
    },

    removeProp: function( name ) {
        name = jQuery.propFix[ name ] || name;
        return this.each(function() {
            // try/catch handles cases where IE balks (such as removing a property on window)
            try {
                this[ name ] = undefined;
                delete this[ name ];
            } catch( e ) {}
        });
    },

    addClass: function( value ) {
        var classNames, i, l, elem,
            setClass, c, cl;

        if ( jQuery.isFunction( value ) ) {
            return this.each(function( j ) {
                jQuery( this ).addClass( value.call(this, j, this.className) );
            });
        }

        if ( value && typeof value === "string" ) {
            classNames = value.split( rspace );

            for ( i = 0, l = this.length; i < l; i++ ) {
                elem = this[ i ];

                if ( elem.nodeType === 1 ) {
                    if ( !elem.className && classNames.length === 1 ) {
                        elem.className = value;

                    } else {
                        setClass = " " + elem.className + " ";

                        for ( c = 0, cl = classNames.length; c < cl; c++ ) {
                            if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
                                setClass += classNames[ c ] + " ";
                            }
                        }
                        elem.className = jQuery.trim( setClass );
                    }
                }
            }
        }

        return this;
    },

    removeClass: function( value ) {
        var classNames, i, l, elem, className, c, cl;

        if ( jQuery.isFunction( value ) ) {
            return this.each(function( j ) {
                jQuery( this ).removeClass( value.call(this, j, this.className) );
            });
        }

        if ( (value && typeof value === "string") || value === undefined ) {
            classNames = ( value || "" ).split( rspace );

            for ( i = 0, l = this.length; i < l; i++ ) {
                elem = this[ i ];

                if ( elem.nodeType === 1 && elem.className ) {
                    if ( value ) {
                        className = (" " + elem.className + " ").replace( rclass, " " );
                        for ( c = 0, cl = classNames.length; c < cl; c++ ) {
                            className = className.replace(" " + classNames[ c ] + " ", " ");
                        }
                        elem.className = jQuery.trim( className );

                    } else {
                        elem.className = "";
                    }
                }
            }
        }

        return this;
    },

    toggleClass: function( value, stateVal ) {
        var type = typeof value,
            isBool = typeof stateVal === "boolean";

        if ( jQuery.isFunction( value ) ) {
            return this.each(function( i ) {
                jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
            });
        }

        return this.each(function() {
            if ( type === "string" ) {
                // toggle individual class names
                var className,
                    i = 0,
                    self = jQuery( this ),
                    state = stateVal,
                    classNames = value.split( rspace );

                while ( (className = classNames[ i++ ]) ) {
                    // check each className given, space seperated list
                    state = isBool ? state : !self.hasClass( className );
                    self[ state ? "addClass" : "removeClass" ]( className );
                }

            } else if ( type === "undefined" || type === "boolean" ) {
                if ( this.className ) {
                    // store className if set
                    jQuery._data( this, "__className__", this.className );
                }

                // toggle whole className
                this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
            }
        });
    },

    hasClass: function( selector ) {
        var className = " " + selector + " ",
            i = 0,
            l = this.length;
        for ( ; i < l; i++ ) {
            if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
                return true;
            }
        }

        return false;
    },

    val: function( value ) {
        var hooks, ret, isFunction,
            elem = this[0];

        if ( !arguments.length ) {
            if ( elem ) {
                hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

                if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
                    return ret;
                }

                ret = elem.value;

                return typeof ret === "string" ?
                    // handle most common string cases
                    ret.replace(rreturn, "") :
                    // handle cases where value is null/undef or number
                    ret == null ? "" : ret;
            }

            return;
        }

        isFunction = jQuery.isFunction( value );

        return this.each(function( i ) {
            var self = jQuery(this), val;

            if ( this.nodeType !== 1 ) {
                return;
            }

            if ( isFunction ) {
                val = value.call( this, i, self.val() );
            } else {
                val = value;
            }

            // Treat null/undefined as ""; convert numbers to string
            if ( val == null ) {
                val = "";
            } else if ( typeof val === "number" ) {
                val += "";
            } else if ( jQuery.isArray( val ) ) {
                val = jQuery.map(val, function ( value ) {
                    return value == null ? "" : value + "";
                });
            }

            hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

            // If set returns undefined, fall back to normal setting
            if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
                this.value = val;
            }
        });
    }
});

jQuery.extend({
    valHooks: {
        option: {
            get: function( elem ) {
                // attributes.value is undefined in Blackberry 4.7 but
                // uses .value. See #6932
                var val = elem.attributes.value;
                return !val || val.specified ? elem.value : elem.text;
            }
        },
        select: {
            get: function( elem ) {
                var value, i, max, option,
                    index = elem.selectedIndex,
                    values = [],
                    options = elem.options,
                    one = elem.type === "select-one";

                // Nothing was selected
                if ( index < 0 ) {
                    return null;
                }

                // Loop through all the selected options
                i = one ? index : 0;
                max = one ? index + 1 : options.length;
                for ( ; i < max; i++ ) {
                    option = options[ i ];

                    // Don't return options that are disabled or in a disabled optgroup
                    if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
                            (!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

                        // Get the specific value for the option
                        value = jQuery( option ).val();

                        // We don't need an array for one selects
                        if ( one ) {
                            return value;
                        }

                        // Multi-Selects return an array
                        values.push( value );
                    }
                }

                // Fixes Bug #2551 -- select.val() broken in IE after form.reset()
                if ( one && !values.length && options.length ) {
                    return jQuery( options[ index ] ).val();
                }

                return values;
            },

            set: function( elem, value ) {
                var values = jQuery.makeArray( value );

                jQuery(elem).find("option").each(function() {
                    this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
                });

                if ( !values.length ) {
                    elem.selectedIndex = -1;
                }
                return values;
            }
        }
    },

    attrFn: {
        val: true,
        css: true,
        html: true,
        text: true,
        data: true,
        width: true,
        height: true,
        offset: true
    },

    attr: function( elem, name, value, pass ) {
        var ret, hooks, notxml,
            nType = elem.nodeType;

        // don't get/set attributes on text, comment and attribute nodes
        if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
            return;
        }

        if ( pass && name in jQuery.attrFn ) {
            return jQuery( elem )[ name ]( value );
        }

        // Fallback to prop when attributes are not supported
        if ( typeof elem.getAttribute === "undefined" ) {
            return jQuery.prop( elem, name, value );
        }

        notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

        // All attributes are lowercase
        // Grab necessary hook if one is defined
        if ( notxml ) {
            name = name.toLowerCase();
            hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
        }

        if ( value !== undefined ) {

            if ( value === null ) {
                jQuery.removeAttr( elem, name );
                return;

            } else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
                return ret;

            } else {
                elem.setAttribute( name, "" + value );
                return value;
            }

        } else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
            return ret;

        } else {

            ret = elem.getAttribute( name );

            // Non-existent attributes return null, we normalize to undefined
            return ret === null ?
                undefined :
                ret;
        }
    },

    removeAttr: function( elem, value ) {
        var propName, attrNames, name, l,
            i = 0;

        if ( value && elem.nodeType === 1 ) {
            attrNames = value.toLowerCase().split( rspace );
            l = attrNames.length;

            for ( ; i < l; i++ ) {
                name = attrNames[ i ];

                if ( name ) {
                    propName = jQuery.propFix[ name ] || name;

                    // See #9699 for explanation of this approach (setting first, then removal)
                    jQuery.attr( elem, name, "" );
                    elem.removeAttribute( getSetAttribute ? name : propName );

                    // Set corresponding property to false for boolean attributes
                    if ( rboolean.test( name ) && propName in elem ) {
                        elem[ propName ] = false;
                    }
                }
            }
        }
    },

    attrHooks: {
        type: {
            set: function( elem, value ) {
                // We can't allow the type property to be changed (since it causes problems in IE)
                if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
                    jQuery.error( "type property can't be changed" );
                } else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
                    // Setting the type on a radio button after the value resets the value in IE6-9
                    // Reset value to it's default in case type is set after value
                    // This is for element creation
                    var val = elem.value;
                    elem.setAttribute( "type", value );
                    if ( val ) {
                        elem.value = val;
                    }
                    return value;
                }
            }
        },
        // Use the value property for back compat
        // Use the nodeHook for button elements in IE6/7 (#1954)
        value: {
            get: function( elem, name ) {
                if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
                    return nodeHook.get( elem, name );
                }
                return name in elem ?
                    elem.value :
                    null;
            },
            set: function( elem, value, name ) {
                if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
                    return nodeHook.set( elem, value, name );
                }
                // Does not return so that setAttribute is also used
                elem.value = value;
            }
        }
    },

    propFix: {
        tabindex: "tabIndex",
        readonly: "readOnly",
        "for": "htmlFor",
        "class": "className",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        cellpadding: "cellPadding",
        rowspan: "rowSpan",
        colspan: "colSpan",
        usemap: "useMap",
        frameborder: "frameBorder",
        contenteditable: "contentEditable"
    },

    prop: function( elem, name, value ) {
        var ret, hooks, notxml,
            nType = elem.nodeType;

        // don't get/set properties on text, comment and attribute nodes
        if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
            return;
        }

        notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

        if ( notxml ) {
            // Fix name and attach hooks
            name = jQuery.propFix[ name ] || name;
            hooks = jQuery.propHooks[ name ];
        }

        if ( value !== undefined ) {
            if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
                return ret;

            } else {
                return ( elem[ name ] = value );
            }

        } else {
            if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
                return ret;

            } else {
                return elem[ name ];
            }
        }
    },

    propHooks: {
        tabIndex: {
            get: function( elem ) {
                // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                var attributeNode = elem.getAttributeNode("tabindex");

                return attributeNode && attributeNode.specified ?
                    parseInt( attributeNode.value, 10 ) :
                    rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
                        0 :
                        undefined;
            }
        }
    }
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
    get: function( elem, name ) {
        // Align boolean attributes with corresponding properties
        // Fall back to attribute presence where some booleans are not supported
        var attrNode,
            property = jQuery.prop( elem, name );
        return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
            name.toLowerCase() :
            undefined;
    },
    set: function( elem, value, name ) {
        var propName;
        if ( value === false ) {
            // Remove boolean attributes when set to false
            jQuery.removeAttr( elem, name );
        } else {
            // value is true since we know at this point it's type boolean and not false
            // Set boolean attributes to the same name and set the DOM property
            propName = jQuery.propFix[ name ] || name;
            if ( propName in elem ) {
                // Only set the IDL specifically if it already exists on the element
                elem[ propName ] = true;
            }

            elem.setAttribute( name, name.toLowerCase() );
        }
        return name;
    }
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

    fixSpecified = {
        name: true,
        id: true
    };

    // Use this for any attribute in IE6/7
    // This fixes almost every IE6/7 issue
    nodeHook = jQuery.valHooks.button = {
        get: function( elem, name ) {
            var ret;
            ret = elem.getAttributeNode( name );
            return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
                ret.nodeValue :
                undefined;
        },
        set: function( elem, value, name ) {
            // Set the existing or create a new attribute node
            var ret = elem.getAttributeNode( name );
            if ( !ret ) {
                ret = document.createAttribute( name );
                elem.setAttributeNode( ret );
            }
            return ( ret.nodeValue = value + "" );
        }
    };

    // Apply the nodeHook to tabindex
    jQuery.attrHooks.tabindex.set = nodeHook.set;

    // Set width and height to auto instead of 0 on empty string( Bug #8150 )
    // This is for removals
    jQuery.each([ "width", "height" ], function( i, name ) {
        jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
            set: function( elem, value ) {
                if ( value === "" ) {
                    elem.setAttribute( name, "auto" );
                    return value;
                }
            }
        });
    });

    // Set contenteditable to false on removals(#10429)
    // Setting to empty string throws an error as an invalid value
    jQuery.attrHooks.contenteditable = {
        get: nodeHook.get,
        set: function( elem, value, name ) {
            if ( value === "" ) {
                value = "false";
            }
            nodeHook.set( elem, value, name );
        }
    };
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
    jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
        jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
            get: function( elem ) {
                var ret = elem.getAttribute( name, 2 );
                return ret === null ? undefined : ret;
            }
        });
    });
}

if ( !jQuery.support.style ) {
    jQuery.attrHooks.style = {
        get: function( elem ) {
            // Return undefined in the case of empty string
            // Normalize to lowercase since IE uppercases css property names
            return elem.style.cssText.toLowerCase() || undefined;
        },
        set: function( elem, value ) {
            return ( elem.style.cssText = "" + value );
        }
    };
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
    jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
        get: function( elem ) {
            var parent = elem.parentNode;

            if ( parent ) {
                parent.selectedIndex;

                // Make sure that it also works with optgroups, see #5701
                if ( parent.parentNode ) {
                    parent.parentNode.selectedIndex;
                }
            }
            return null;
        }
    });
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
    jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
    jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[ this ] = {
            get: function( elem ) {
                // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                return elem.getAttribute("value") === null ? "on" : elem.value;
            }
        };
    });
}
jQuery.each([ "radio", "checkbox" ], function() {
    jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
        set: function( elem, value ) {
            if ( jQuery.isArray( value ) ) {
                return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
            }
        }
    });
});




var rformElems = /^(?:textarea|input|select)$/i,
    rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
    rhoverHack = /\bhover(\.\S+)?\b/,
    rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|contextmenu)|click/,
    rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
    quickParse = function( selector ) {
        var quick = rquickIs.exec( selector );
        if ( quick ) {
            //   0  1    2   3
            // [ _, tag, id, class ]
            quick[1] = ( quick[1] || "" ).toLowerCase();
            quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
        }
        return quick;
    },
    quickIs = function( elem, m ) {
        var attrs = elem.attributes || {};
        return (
            (!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
            (!m[2] || (attrs.id || {}).value === m[2]) &&
            (!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
        );
    },
    hoverHack = function( events ) {
        return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
    };

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

    add: function( elem, types, handler, data, selector ) {

        var elemData, eventHandle, events,
            t, tns, type, namespaces, handleObj,
            handleObjIn, quick, handlers, special;

        // Don't attach events to noData or text/comment nodes (allow plain objects tho)
        if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
            return;
        }

        // Caller can pass in an object of custom data in lieu of the handler
        if ( handler.handler ) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
        }

        // Make sure that the handler has a unique ID, used to find/remove it later
        if ( !handler.guid ) {
            handler.guid = jQuery.guid++;
        }

        // Init the element's event structure and main handler, if this is the first
        events = elemData.events;
        if ( !events ) {
            elemData.events = events = {};
        }
        eventHandle = elemData.handle;
        if ( !eventHandle ) {
            elemData.handle = eventHandle = function( e ) {
                // Discard the second event of a jQuery.event.trigger() and
                // when an event is called after a page has unloaded
                return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
                    jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
                    undefined;
            };
            // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
            eventHandle.elem = elem;
        }

        // Handle multiple events separated by a space
        // jQuery(...).bind("mouseover mouseout", fn);
        types = jQuery.trim( hoverHack(types) ).split( " " );
        for ( t = 0; t < types.length; t++ ) {

            tns = rtypenamespace.exec( types[t] ) || [];
            type = tns[1];
            namespaces = ( tns[2] || "" ).split( "." ).sort();

            // If event changes its type, use the special event handlers for the changed type
            special = jQuery.event.special[ type ] || {};

            // If selector defined, determine special event api type, otherwise given type
            type = ( selector ? special.delegateType : special.bindType ) || type;

            // Update special based on newly reset type
            special = jQuery.event.special[ type ] || {};

            // handleObj is passed to all event handlers
            handleObj = jQuery.extend({
                type: type,
                origType: tns[1],
                data: data,
                handler: handler,
                guid: handler.guid,
                selector: selector,
                quick: quickParse( selector ),
                namespace: namespaces.join(".")
            }, handleObjIn );

            // Init the event handler queue if we're the first
            handlers = events[ type ];
            if ( !handlers ) {
                handlers = events[ type ] = [];
                handlers.delegateCount = 0;

                // Only use addEventListener/attachEvent if the special events handler returns false
                if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
                    // Bind the global event handler to the element
                    if ( elem.addEventListener ) {
                        elem.addEventListener( type, eventHandle, false );

                    } else if ( elem.attachEvent ) {
                        elem.attachEvent( "on" + type, eventHandle );
                    }
                }
            }

            if ( special.add ) {
                special.add.call( elem, handleObj );

                if ( !handleObj.handler.guid ) {
                    handleObj.handler.guid = handler.guid;
                }
            }

            // Add to the element's handler list, delegates in front
            if ( selector ) {
                handlers.splice( handlers.delegateCount++, 0, handleObj );
            } else {
                handlers.push( handleObj );
            }

            // Keep track of which events have ever been used, for event optimization
            jQuery.event.global[ type ] = true;
        }

        // Nullify elem to prevent memory leaks in IE
        elem = null;
    },

    global: {},

    // Detach an event or set of events from an element
    remove: function( elem, types, handler, selector, mappedTypes ) {

        var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
            t, tns, type, origType, namespaces, origCount,
            j, events, special, handle, eventType, handleObj;

        if ( !elemData || !(events = elemData.events) ) {
            return;
        }

        // Once for each type.namespace in types; type may be omitted
        types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
        for ( t = 0; t < types.length; t++ ) {
            tns = rtypenamespace.exec( types[t] ) || [];
            type = origType = tns[1];
            namespaces = tns[2];

            // Unbind all events (on this namespace, if provided) for the element
            if ( !type ) {
                for ( type in events ) {
                    jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
                }
                continue;
            }

            special = jQuery.event.special[ type ] || {};
            type = ( selector? special.delegateType : special.bindType ) || type;
            eventType = events[ type ] || [];
            origCount = eventType.length;
            namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

            // Remove matching events
            for ( j = 0; j < eventType.length; j++ ) {
                handleObj = eventType[ j ];

                if ( ( mappedTypes || origType === handleObj.origType ) &&
                     ( !handler || handler.guid === handleObj.guid ) &&
                     ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
                     ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
                    eventType.splice( j--, 1 );

                    if ( handleObj.selector ) {
                        eventType.delegateCount--;
                    }
                    if ( special.remove ) {
                        special.remove.call( elem, handleObj );
                    }
                }
            }

            // Remove generic event handler if we removed something and no more handlers exist
            // (avoids potential for endless recursion during removal of special event handlers)
            if ( eventType.length === 0 && origCount !== eventType.length ) {
                if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
                    jQuery.removeEvent( elem, type, elemData.handle );
                }

                delete events[ type ];
            }
        }

        // Remove the expando if it's no longer used
        if ( jQuery.isEmptyObject( events ) ) {
            handle = elemData.handle;
            if ( handle ) {
                handle.elem = null;
            }

            // removeData also checks for emptiness and clears the expando if empty
            // so use it instead of delete
            jQuery.removeData( elem, [ "events", "handle" ], true );
        }
    },

    // Events that are safe to short-circuit if no handlers are attached.
    // Native DOM events should not be added, they may have inline handlers.
    customEvent: {
        "getData": true,
        "setData": true,
        "changeData": true
    },

    trigger: function( event, data, elem, onlyHandlers ) {
        // Don't do events on text and comment nodes
        if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
            return;
        }

        // Event object or event type
        var type = event.type || event,
            namespaces = [],
            cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

        // focus/blur morphs to focusin/out; ensure we're not firing them right now
        if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
            return;
        }

        if ( type.indexOf( "!" ) >= 0 ) {
            // Exclusive events trigger only for the exact event (no namespaces)
            type = type.slice(0, -1);
            exclusive = true;
        }

        if ( type.indexOf( "." ) >= 0 ) {
            // Namespaced trigger; create a regexp to match event type in handle()
            namespaces = type.split(".");
            type = namespaces.shift();
            namespaces.sort();
        }

        if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
            // No jQuery handlers for this event type, and it can't have inline handlers
            return;
        }

        // Caller can pass in an Event, Object, or just an event type string
        event = typeof event === "object" ?
            // jQuery.Event object
            event[ jQuery.expando ] ? event :
            // Object literal
            new jQuery.Event( type, event ) :
            // Just the event type (string)
            new jQuery.Event( type );

        event.type = type;
        event.isTrigger = true;
        event.exclusive = exclusive;
        event.namespace = namespaces.join( "." );
        event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
        ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

        // Handle a global trigger
        if ( !elem ) {

            // TODO: Stop taunting the data cache; remove global events and always attach to document
            cache = jQuery.cache;
            for ( i in cache ) {
                if ( cache[ i ].events && cache[ i ].events[ type ] ) {
                    jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
                }
            }
            return;
        }

        // Clean up the event in case it is being reused
        event.result = undefined;
        if ( !event.target ) {
            event.target = elem;
        }

        // Clone any incoming data and prepend the event, creating the handler arg list
        data = data != null ? jQuery.makeArray( data ) : [];
        data.unshift( event );

        // Allow special events to draw outside the lines
        special = jQuery.event.special[ type ] || {};
        if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
            return;
        }

        // Determine event propagation path in advance, per W3C events spec (#9951)
        // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
        eventPath = [[ elem, special.bindType || type ]];
        if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

            bubbleType = special.delegateType || type;
            cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
            old = null;
            for ( ; cur; cur = cur.parentNode ) {
                eventPath.push([ cur, bubbleType ]);
                old = cur;
            }

            // Only add window if we got to document (e.g., not plain obj or detached DOM)
            if ( old && old === elem.ownerDocument ) {
                eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
            }
        }

        // Fire handlers on the event path
        for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

            cur = eventPath[i][0];
            event.type = eventPath[i][1];

            handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
            if ( handle ) {
                handle.apply( cur, data );
            }
            // Note that this is a bare JS function and not a jQuery handler
            handle = ontype && cur[ ontype ];
            if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
                event.preventDefault();
            }
        }
        event.type = type;

        // If nobody prevented the default action, do it now
        if ( !onlyHandlers && !event.isDefaultPrevented() ) {

            if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
                !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

                // Call a native DOM method on the target with the same name name as the event.
                // Can't use an .isFunction() check here because IE6/7 fails that test.
                // Don't do default actions on window, that's where global variables be (#6170)
                // IE<9 dies on focus/blur to hidden element (#1486)
                if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

                    // Don't re-trigger an onFOO event when we call its FOO() method
                    old = elem[ ontype ];

                    if ( old ) {
                        elem[ ontype ] = null;
                    }

                    // Prevent re-triggering of the same event, since we already bubbled it above
                    jQuery.event.triggered = type;
                    elem[ type ]();
                    jQuery.event.triggered = undefined;

                    if ( old ) {
                        elem[ ontype ] = old;
                    }
                }
            }
        }

        return event.result;
    },

    dispatch: function( event ) {

        // Make a writable jQuery.Event from the native event object
        event = jQuery.event.fix( event || window.event );

        var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
            delegateCount = handlers.delegateCount,
            args = [].slice.call( arguments, 0 ),
            run_all = !event.exclusive && !event.namespace,
            handlerQueue = [],
            i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

        // Use the fix-ed jQuery.Event rather than the (read-only) native event
        args[0] = event;
        event.delegateTarget = this;

        // Determine handlers that should run if there are delegated events
        // Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
        if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

            // Pregenerate a single jQuery object for reuse with .is()
            jqcur = jQuery(this);
            jqcur.context = this.ownerDocument || this;

            for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
                selMatch = {};
                matches = [];
                jqcur[0] = cur;
                for ( i = 0; i < delegateCount; i++ ) {
                    handleObj = handlers[ i ];
                    sel = handleObj.selector;

                    if ( selMatch[ sel ] === undefined ) {
                        selMatch[ sel ] = (
                            handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
                        );
                    }
                    if ( selMatch[ sel ] ) {
                        matches.push( handleObj );
                    }
                }
                if ( matches.length ) {
                    handlerQueue.push({ elem: cur, matches: matches });
                }
            }
        }

        // Add the remaining (directly-bound) handlers
        if ( handlers.length > delegateCount ) {
            handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
        }

        // Run delegates first; they may want to stop propagation beneath us
        for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
            matched = handlerQueue[ i ];
            event.currentTarget = matched.elem;

            for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
                handleObj = matched.matches[ j ];

                // Triggered event must either 1) be non-exclusive and have no namespace, or
                // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

                    event.data = handleObj.data;
                    event.handleObj = handleObj;

                    ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
                            .apply( matched.elem, args );

                    if ( ret !== undefined ) {
                        event.result = ret;
                        if ( ret === false ) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }
                }
            }
        }

        return event.result;
    },

    // Includes some event props shared by KeyEvent and MouseEvent
    // *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
    props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

    fixHooks: {},

    keyHooks: {
        props: "char charCode key keyCode".split(" "),
        filter: function( event, original ) {

            // Add which for key events
            if ( event.which == null ) {
                event.which = original.charCode != null ? original.charCode : original.keyCode;
            }

            return event;
        }
    },

    mouseHooks: {
        props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
        filter: function( event, original ) {
            var eventDoc, doc, body,
                button = original.button,
                fromElement = original.fromElement;

            // Calculate pageX/Y if missing and clientX/Y available
            if ( event.pageX == null && original.clientX != null ) {
                eventDoc = event.target.ownerDocument || document;
                doc = eventDoc.documentElement;
                body = eventDoc.body;

                event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
            }

            // Add relatedTarget, if necessary
            if ( !event.relatedTarget && fromElement ) {
                event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            // Note: button is not normalized, so don't use it
            if ( !event.which && button !== undefined ) {
                event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
            }

            return event;
        }
    },

    fix: function( event ) {
        if ( event[ jQuery.expando ] ) {
            return event;
        }

        // Create a writable copy of the event object and normalize some properties
        var i, prop,
            originalEvent = event,
            fixHook = jQuery.event.fixHooks[ event.type ] || {},
            copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

        event = jQuery.Event( originalEvent );

        for ( i = copy.length; i; ) {
            prop = copy[ --i ];
            event[ prop ] = originalEvent[ prop ];
        }

        // Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
        if ( !event.target ) {
            event.target = originalEvent.srcElement || document;
        }

        // Target should not be a text node (#504, Safari)
        if ( event.target.nodeType === 3 ) {
            event.target = event.target.parentNode;
        }

        // For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
        if ( event.metaKey === undefined ) {
            event.metaKey = event.ctrlKey;
        }

        return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
    },

    special: {
        ready: {
            // Make sure the ready event is setup
            setup: jQuery.bindReady
        },

        load: {
            // Prevent triggered image.load events from bubbling to window.load
            noBubble: true
        },

        focus: {
            delegateType: "focusin"
        },
        blur: {
            delegateType: "focusout"
        },

        beforeunload: {
            setup: function( data, namespaces, eventHandle ) {
                // We only want to do this special case on windows
                if ( jQuery.isWindow( this ) ) {
                    this.onbeforeunload = eventHandle;
                }
            },

            teardown: function( namespaces, eventHandle ) {
                if ( this.onbeforeunload === eventHandle ) {
                    this.onbeforeunload = null;
                }
            }
        }
    },

    simulate: function( type, elem, event, bubble ) {
        // Piggyback on a donor event to simulate a different one.
        // Fake originalEvent to avoid donor's stopPropagation, but if the
        // simulated event prevents default then we do the same on the donor.
        var e = jQuery.extend(
            new jQuery.Event(),
            event,
            { type: type,
                isSimulated: true,
                originalEvent: {}
            }
        );
        if ( bubble ) {
            jQuery.event.trigger( e, null, elem );
        } else {
            jQuery.event.dispatch.call( elem, e );
        }
        if ( e.isDefaultPrevented() ) {
            event.preventDefault();
        }
    }
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
    function( elem, type, handle ) {
        if ( elem.removeEventListener ) {
            elem.removeEventListener( type, handle, false );
        }
    } :
    function( elem, type, handle ) {
        if ( elem.detachEvent ) {
            elem.detachEvent( "on" + type, handle );
        }
    };

jQuery.Event = function( src, props ) {
    // Allow instantiation without the 'new' keyword
    if ( !(this instanceof jQuery.Event) ) {
        return new jQuery.Event( src, props );
    }

    // Event object
    if ( src && src.type ) {
        this.originalEvent = src;
        this.type = src.type;

        // Events bubbling up the document may have been marked as prevented
        // by a handler lower down the tree; reflect the correct value.
        this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
            src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

    // Event type
    } else {
        this.type = src;
    }

    // Put explicitly provided properties onto the event object
    if ( props ) {
        jQuery.extend( this, props );
    }

    // Create a timestamp if incoming event doesn't have one
    this.timeStamp = src && src.timeStamp || jQuery.now();

    // Mark it as fixed
    this[ jQuery.expando ] = true;
};

function returnFalse() {
    return false;
}
function returnTrue() {
    return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
    preventDefault: function() {
        this.isDefaultPrevented = returnTrue;

        var e = this.originalEvent;
        if ( !e ) {
            return;
        }

        // if preventDefault exists run it on the original event
        if ( e.preventDefault ) {
            e.preventDefault();

        // otherwise set the returnValue property of the original event to false (IE)
        } else {
            e.returnValue = false;
        }
    },
    stopPropagation: function() {
        this.isPropagationStopped = returnTrue;

        var e = this.originalEvent;
        if ( !e ) {
            return;
        }
        // if stopPropagation exists run it on the original event
        if ( e.stopPropagation ) {
            e.stopPropagation();
        }
        // otherwise set the cancelBubble property of the original event to true (IE)
        e.cancelBubble = true;
    },
    stopImmediatePropagation: function() {
        this.isImmediatePropagationStopped = returnTrue;
        this.stopPropagation();
    },
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
}, function( orig, fix ) {
    jQuery.event.special[ orig ] = {
        delegateType: fix,
        bindType: fix,

        handle: function( event ) {
            var target = this,
                related = event.relatedTarget,
                handleObj = event.handleObj,
                selector = handleObj.selector,
                ret;

            // For mousenter/leave call the handler if related is outside the target.
            // NB: No relatedTarget if the mouse left/entered the browser window
            if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
                event.type = handleObj.origType;
                ret = handleObj.handler.apply( this, arguments );
                event.type = fix;
            }
            return ret;
        }
    };
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

    jQuery.event.special.submit = {
        setup: function() {
            // Only need this for delegated form submit events
            if ( jQuery.nodeName( this, "form" ) ) {
                return false;
            }

            // Lazy-add a submit handler when a descendant form may potentially be submitted
            jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
                // Node name check avoids a VML-related crash in IE (#9807)
                var elem = e.target,
                    form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
                if ( form && !form._submit_attached ) {
                    jQuery.event.add( form, "submit._submit", function( event ) {
                        // If form was submitted by the user, bubble the event up the tree
                        if ( this.parentNode && !event.isTrigger ) {
                            jQuery.event.simulate( "submit", this.parentNode, event, true );
                        }
                    });
                    form._submit_attached = true;
                }
            });
            // return undefined since we don't need an event listener
        },

        teardown: function() {
            // Only need this for delegated form submit events
            if ( jQuery.nodeName( this, "form" ) ) {
                return false;
            }

            // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
            jQuery.event.remove( this, "._submit" );
        }
    };
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

    jQuery.event.special.change = {

        setup: function() {

            if ( rformElems.test( this.nodeName ) ) {
                // IE doesn't fire change on a check/radio until blur; trigger it on click
                // after a propertychange. Eat the blur-change in special.change.handle.
                // This still fires onchange a second time for check/radio after blur.
                if ( this.type === "checkbox" || this.type === "radio" ) {
                    jQuery.event.add( this, "propertychange._change", function( event ) {
                        if ( event.originalEvent.propertyName === "checked" ) {
                            this._just_changed = true;
                        }
                    });
                    jQuery.event.add( this, "click._change", function( event ) {
                        if ( this._just_changed && !event.isTrigger ) {
                            this._just_changed = false;
                            jQuery.event.simulate( "change", this, event, true );
                        }
                    });
                }
                return false;
            }
            // Delegated event; lazy-add a change handler on descendant inputs
            jQuery.event.add( this, "beforeactivate._change", function( e ) {
                var elem = e.target;

                if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
                    jQuery.event.add( elem, "change._change", function( event ) {
                        if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
                            jQuery.event.simulate( "change", this.parentNode, event, true );
                        }
                    });
                    elem._change_attached = true;
                }
            });
        },

        handle: function( event ) {
            var elem = event.target;

            // Swallow native change events from checkbox/radio, we already triggered them above
            if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
                return event.handleObj.handler.apply( this, arguments );
            }
        },

        teardown: function() {
            jQuery.event.remove( this, "._change" );

            return rformElems.test( this.nodeName );
        }
    };
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
    jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

        // Attach a single capturing handler while someone wants focusin/focusout
        var attaches = 0,
            handler = function( event ) {
                jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
            };

        jQuery.event.special[ fix ] = {
            setup: function() {
                if ( attaches++ === 0 ) {
                    document.addEventListener( orig, handler, true );
                }
            },
            teardown: function() {
                if ( --attaches === 0 ) {
                    document.removeEventListener( orig, handler, true );
                }
            }
        };
    });
}

jQuery.fn.extend({

    on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
        var origFn, type;

        // Types can be a map of types/handlers
        if ( typeof types === "object" ) {
            // ( types-Object, selector, data )
            if ( typeof selector !== "string" ) {
                // ( types-Object, data )
                data = selector;
                selector = undefined;
            }
            for ( type in types ) {
                this.on( type, selector, data, types[ type ], one );
            }
            return this;
        }

        if ( data == null && fn == null ) {
            // ( types, fn )
            fn = selector;
            data = selector = undefined;
        } else if ( fn == null ) {
            if ( typeof selector === "string" ) {
                // ( types, selector, fn )
                fn = data;
                data = undefined;
            } else {
                // ( types, data, fn )
                fn = data;
                data = selector;
                selector = undefined;
            }
        }
        if ( fn === false ) {
            fn = returnFalse;
        } else if ( !fn ) {
            return this;
        }

        if ( one === 1 ) {
            origFn = fn;
            fn = function( event ) {
                // Can use an empty set, since event contains the info
                jQuery().off( event );
                return origFn.apply( this, arguments );
            };
            // Use same guid so caller can remove using origFn
            fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
        }
        return this.each( function() {
            jQuery.event.add( this, types, fn, data, selector );
        });
    },
    one: function( types, selector, data, fn ) {
        return this.on.call( this, types, selector, data, fn, 1 );
    },
    off: function( types, selector, fn ) {
        if ( types && types.preventDefault && types.handleObj ) {
            // ( event )  dispatched jQuery.Event
            var handleObj = types.handleObj;
            jQuery( types.delegateTarget ).off(
                handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
                handleObj.selector,
                handleObj.handler
            );
            return this;
        }
        if ( typeof types === "object" ) {
            // ( types-object [, selector] )
            for ( var type in types ) {
                this.off( type, selector, types[ type ] );
            }
            return this;
        }
        if ( selector === false || typeof selector === "function" ) {
            // ( types [, fn] )
            fn = selector;
            selector = undefined;
        }
        if ( fn === false ) {
            fn = returnFalse;
        }
        return this.each(function() {
            jQuery.event.remove( this, types, fn, selector );
        });
    },

    bind: function( types, data, fn ) {
        return this.on( types, null, data, fn );
    },
    unbind: function( types, fn ) {
        return this.off( types, null, fn );
    },

    live: function( types, data, fn ) {
        jQuery( this.context ).on( types, this.selector, data, fn );
        return this;
    },
    die: function( types, fn ) {
        jQuery( this.context ).off( types, this.selector || "**", fn );
        return this;
    },

    delegate: function( selector, types, data, fn ) {
        return this.on( types, selector, data, fn );
    },
    undelegate: function( selector, types, fn ) {
        // ( namespace ) or ( selector, types [, fn] )
        return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
    },

    trigger: function( type, data ) {
        return this.each(function() {
            jQuery.event.trigger( type, data, this );
        });
    },
    triggerHandler: function( type, data ) {
        if ( this[0] ) {
            return jQuery.event.trigger( type, data, this[0], true );
        }
    },

    toggle: function( fn ) {
        // Save reference to arguments for access in closure
        var args = arguments,
            guid = fn.guid || jQuery.guid++,
            i = 0,
            toggler = function( event ) {
                // Figure out which function to execute
                var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
                jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

                // Make sure that clicks stop
                event.preventDefault();

                // and execute the function
                return args[ lastToggle ].apply( this, arguments ) || false;
            };

        // link all the functions, so any of them can unbind this click handler
        toggler.guid = guid;
        while ( i < args.length ) {
            args[ i++ ].guid = guid;
        }

        return this.click( toggler );
    },

    hover: function( fnOver, fnOut ) {
        return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    }
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

    // Handle event binding
    jQuery.fn[ name ] = function( data, fn ) {
        if ( fn == null ) {
            fn = data;
            data = null;
        }

        return arguments.length > 0 ?
            this.on( name, null, data, fn ) :
            this.trigger( name );
    };

    if ( jQuery.attrFn ) {
        jQuery.attrFn[ name ] = true;
    }

    if ( rkeyEvent.test( name ) ) {
        jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
    }

    if ( rmouseEvent.test( name ) ) {
        jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
    }
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
    expando = "sizcache" + (Math.random() + '').replace('.', ''),
    done = 0,
    toString = Object.prototype.toString,
    hasDuplicate = false,
    baseHasDuplicate = true,
    rBackslash = /\\/g,
    rReturn = /\r\n/g,
    rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
    baseHasDuplicate = false;
    return 0;
});

var Sizzle = function( selector, context, results, seed ) {
    results = results || [];
    context = context || document;

    var origContext = context;

    if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
        return [];
    }
    
    if ( !selector || typeof selector !== "string" ) {
        return results;
    }

    var m, set, checkSet, extra, ret, cur, pop, i,
        prune = true,
        contextXML = Sizzle.isXML( context ),
        parts = [],
        soFar = selector;
    
    // Reset the position of the chunker regexp (start from head)
    do {
        chunker.exec( "" );
        m = chunker.exec( soFar );

        if ( m ) {
            soFar = m[3];
        
            parts.push( m[1] );
        
            if ( m[2] ) {
                extra = m[3];
                break;
            }
        }
    } while ( m );

    if ( parts.length > 1 && origPOS.exec( selector ) ) {

        if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
            set = posProcess( parts[0] + parts[1], context, seed );

        } else {
            set = Expr.relative[ parts[0] ] ?
                [ context ] :
                Sizzle( parts.shift(), context );

            while ( parts.length ) {
                selector = parts.shift();

                if ( Expr.relative[ selector ] ) {
                    selector += parts.shift();
                }
                
                set = posProcess( selector, set, seed );
            }
        }

    } else {
        // Take a shortcut and set the context if the root selector is an ID
        // (but not if it'll be faster if the inner selector is an ID)
        if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
                Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

            ret = Sizzle.find( parts.shift(), context, contextXML );
            context = ret.expr ?
                Sizzle.filter( ret.expr, ret.set )[0] :
                ret.set[0];
        }

        if ( context ) {
            ret = seed ?
                { expr: parts.pop(), set: makeArray(seed) } :
                Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

            set = ret.expr ?
                Sizzle.filter( ret.expr, ret.set ) :
                ret.set;

            if ( parts.length > 0 ) {
                checkSet = makeArray( set );

            } else {
                prune = false;
            }

            while ( parts.length ) {
                cur = parts.pop();
                pop = cur;

                if ( !Expr.relative[ cur ] ) {
                    cur = "";
                } else {
                    pop = parts.pop();
                }

                if ( pop == null ) {
                    pop = context;
                }

                Expr.relative[ cur ]( checkSet, pop, contextXML );
            }

        } else {
            checkSet = parts = [];
        }
    }

    if ( !checkSet ) {
        checkSet = set;
    }

    if ( !checkSet ) {
        Sizzle.error( cur || selector );
    }

    if ( toString.call(checkSet) === "[object Array]" ) {
        if ( !prune ) {
            results.push.apply( results, checkSet );

        } else if ( context && context.nodeType === 1 ) {
            for ( i = 0; checkSet[i] != null; i++ ) {
                if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
                    results.push( set[i] );
                }
            }

        } else {
            for ( i = 0; checkSet[i] != null; i++ ) {
                if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
                    results.push( set[i] );
                }
            }
        }

    } else {
        makeArray( checkSet, results );
    }

    if ( extra ) {
        Sizzle( extra, origContext, results, seed );
        Sizzle.uniqueSort( results );
    }

    return results;
};

Sizzle.uniqueSort = function( results ) {
    if ( sortOrder ) {
        hasDuplicate = baseHasDuplicate;
        results.sort( sortOrder );

        if ( hasDuplicate ) {
            for ( var i = 1; i < results.length; i++ ) {
                if ( results[i] === results[ i - 1 ] ) {
                    results.splice( i--, 1 );
                }
            }
        }
    }

    return results;
};

Sizzle.matches = function( expr, set ) {
    return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
    return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
    var set, i, len, match, type, left;

    if ( !expr ) {
        return [];
    }

    for ( i = 0, len = Expr.order.length; i < len; i++ ) {
        type = Expr.order[i];
        
        if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
            left = match[1];
            match.splice( 1, 1 );

            if ( left.substr( left.length - 1 ) !== "\\" ) {
                match[1] = (match[1] || "").replace( rBackslash, "" );
                set = Expr.find[ type ]( match, context, isXML );

                if ( set != null ) {
                    expr = expr.replace( Expr.match[ type ], "" );
                    break;
                }
            }
        }
    }

    if ( !set ) {
        set = typeof context.getElementsByTagName !== "undefined" ?
            context.getElementsByTagName( "*" ) :
            [];
    }

    return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
    var match, anyFound,
        type, found, item, filter, left,
        i, pass,
        old = expr,
        result = [],
        curLoop = set,
        isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

    while ( expr && set.length ) {
        for ( type in Expr.filter ) {
            if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
                filter = Expr.filter[ type ];
                left = match[1];

                anyFound = false;

                match.splice(1,1);

                if ( left.substr( left.length - 1 ) === "\\" ) {
                    continue;
                }

                if ( curLoop === result ) {
                    result = [];
                }

                if ( Expr.preFilter[ type ] ) {
                    match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

                    if ( !match ) {
                        anyFound = found = true;

                    } else if ( match === true ) {
                        continue;
                    }
                }

                if ( match ) {
                    for ( i = 0; (item = curLoop[i]) != null; i++ ) {
                        if ( item ) {
                            found = filter( item, match, i, curLoop );
                            pass = not ^ found;

                            if ( inplace && found != null ) {
                                if ( pass ) {
                                    anyFound = true;

                                } else {
                                    curLoop[i] = false;
                                }

                            } else if ( pass ) {
                                result.push( item );
                                anyFound = true;
                            }
                        }
                    }
                }

                if ( found !== undefined ) {
                    if ( !inplace ) {
                        curLoop = result;
                    }

                    expr = expr.replace( Expr.match[ type ], "" );

                    if ( !anyFound ) {
                        return [];
                    }

                    break;
                }
            }
        }

        // Improper expression
        if ( expr === old ) {
            if ( anyFound == null ) {
                Sizzle.error( expr );

            } else {
                break;
            }
        }

        old = expr;
    }

    return curLoop;
};

Sizzle.error = function( msg ) {
    throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
        nodeType = elem.nodeType,
        ret = "";

    if ( nodeType ) {
        if ( nodeType === 1 || nodeType === 9 ) {
            // Use textContent || innerText for elements
            if ( typeof elem.textContent === 'string' ) {
                return elem.textContent;
            } else if ( typeof elem.innerText === 'string' ) {
                // Replace IE's carriage returns
                return elem.innerText.replace( rReturn, '' );
            } else {
                // Traverse it's children
                for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
                    ret += getText( elem );
                }
            }
        } else if ( nodeType === 3 || nodeType === 4 ) {
            return elem.nodeValue;
        }
    } else {

        // If no nodeType, this is expected to be an array
        for ( i = 0; (node = elem[i]); i++ ) {
            // Do not traverse comment nodes
            if ( node.nodeType !== 8 ) {
                ret += getText( node );
            }
        }
    }
    return ret;
};

var Expr = Sizzle.selectors = {
    order: [ "ID", "NAME", "TAG" ],

    match: {
        ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
        CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
        NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
        ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
        TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
        CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
        POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
        PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
    },

    leftMatch: {},

    attrMap: {
        "class": "className",
        "for": "htmlFor"
    },

    attrHandle: {
        href: function( elem ) {
            return elem.getAttribute( "href" );
        },
        type: function( elem ) {
            return elem.getAttribute( "type" );
        }
    },

    relative: {
        "+": function(checkSet, part){
            var isPartStr = typeof part === "string",
                isTag = isPartStr && !rNonWord.test( part ),
                isPartStrNotTag = isPartStr && !isTag;

            if ( isTag ) {
                part = part.toLowerCase();
            }

            for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
                if ( (elem = checkSet[i]) ) {
                    while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

                    checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
                        elem || false :
                        elem === part;
                }
            }

            if ( isPartStrNotTag ) {
                Sizzle.filter( part, checkSet, true );
            }
        },

        ">": function( checkSet, part ) {
            var elem,
                isPartStr = typeof part === "string",
                i = 0,
                l = checkSet.length;

            if ( isPartStr && !rNonWord.test( part ) ) {
                part = part.toLowerCase();

                for ( ; i < l; i++ ) {
                    elem = checkSet[i];

                    if ( elem ) {
                        var parent = elem.parentNode;
                        checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                    }
                }

            } else {
                for ( ; i < l; i++ ) {
                    elem = checkSet[i];

                    if ( elem ) {
                        checkSet[i] = isPartStr ?
                            elem.parentNode :
                            elem.parentNode === part;
                    }
                }

                if ( isPartStr ) {
                    Sizzle.filter( part, checkSet, true );
                }
            }
        },

        "": function(checkSet, part, isXML){
            var nodeCheck,
                doneName = done++,
                checkFn = dirCheck;

            if ( typeof part === "string" && !rNonWord.test( part ) ) {
                part = part.toLowerCase();
                nodeCheck = part;
                checkFn = dirNodeCheck;
            }

            checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
        },

        "~": function( checkSet, part, isXML ) {
            var nodeCheck,
                doneName = done++,
                checkFn = dirCheck;

            if ( typeof part === "string" && !rNonWord.test( part ) ) {
                part = part.toLowerCase();
                nodeCheck = part;
                checkFn = dirNodeCheck;
            }

            checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
        }
    },

    find: {
        ID: function( match, context, isXML ) {
            if ( typeof context.getElementById !== "undefined" && !isXML ) {
                var m = context.getElementById(match[1]);
                // Check parentNode to catch when Blackberry 4.6 returns
                // nodes that are no longer in the document #6963
                return m && m.parentNode ? [m] : [];
            }
        },

        NAME: function( match, context ) {
            if ( typeof context.getElementsByName !== "undefined" ) {
                var ret = [],
                    results = context.getElementsByName( match[1] );

                for ( var i = 0, l = results.length; i < l; i++ ) {
                    if ( results[i].getAttribute("name") === match[1] ) {
                        ret.push( results[i] );
                    }
                }

                return ret.length === 0 ? null : ret;
            }
        },

        TAG: function( match, context ) {
            if ( typeof context.getElementsByTagName !== "undefined" ) {
                return context.getElementsByTagName( match[1] );
            }
        }
    },
    preFilter: {
        CLASS: function( match, curLoop, inplace, result, not, isXML ) {
            match = " " + match[1].replace( rBackslash, "" ) + " ";

            if ( isXML ) {
                return match;
            }

            for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
                if ( elem ) {
                    if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
                        if ( !inplace ) {
                            result.push( elem );
                        }

                    } else if ( inplace ) {
                        curLoop[i] = false;
                    }
                }
            }

            return false;
        },

        ID: function( match ) {
            return match[1].replace( rBackslash, "" );
        },

        TAG: function( match, curLoop ) {
            return match[1].replace( rBackslash, "" ).toLowerCase();
        },

        CHILD: function( match ) {
            if ( match[1] === "nth" ) {
                if ( !match[2] ) {
                    Sizzle.error( match[0] );
                }

                match[2] = match[2].replace(/^\+|\s*/g, '');

                // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
                var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
                    match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
                    !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

                // calculate the numbers (first)n+(last) including if they are negative
                match[2] = (test[1] + (test[2] || 1)) - 0;
                match[3] = test[3] - 0;
            }
            else if ( match[2] ) {
                Sizzle.error( match[0] );
            }

            // TODO: Move to normal caching system
            match[0] = done++;

            return match;
        },

        ATTR: function( match, curLoop, inplace, result, not, isXML ) {
            var name = match[1] = match[1].replace( rBackslash, "" );
            
            if ( !isXML && Expr.attrMap[name] ) {
                match[1] = Expr.attrMap[name];
            }

            // Handle if an un-quoted value was used
            match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

            if ( match[2] === "~=" ) {
                match[4] = " " + match[4] + " ";
            }

            return match;
        },

        PSEUDO: function( match, curLoop, inplace, result, not ) {
            if ( match[1] === "not" ) {
                // If we're dealing with a complex expression, or a simple one
                if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
                    match[3] = Sizzle(match[3], null, null, curLoop);

                } else {
                    var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

                    if ( !inplace ) {
                        result.push.apply( result, ret );
                    }

                    return false;
                }

            } else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
                return true;
            }
            
            return match;
        },

        POS: function( match ) {
            match.unshift( true );

            return match;
        }
    },
    
    filters: {
        enabled: function( elem ) {
            return elem.disabled === false && elem.type !== "hidden";
        },

        disabled: function( elem ) {
            return elem.disabled === true;
        },

        checked: function( elem ) {
            return elem.checked === true;
        },
        
        selected: function( elem ) {
            // Accessing this property makes selected-by-default
            // options in Safari work properly
            if ( elem.parentNode ) {
                elem.parentNode.selectedIndex;
            }
            
            return elem.selected === true;
        },

        parent: function( elem ) {
            return !!elem.firstChild;
        },

        empty: function( elem ) {
            return !elem.firstChild;
        },

        has: function( elem, i, match ) {
            return !!Sizzle( match[3], elem ).length;
        },

        header: function( elem ) {
            return (/h\d/i).test( elem.nodeName );
        },

        text: function( elem ) {
            var attr = elem.getAttribute( "type" ), type = elem.type;
            // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
            // use getAttribute instead to test this case
            return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
        },

        radio: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
        },

        checkbox: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
        },

        file: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
        },

        password: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
        },

        submit: function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return (name === "input" || name === "button") && "submit" === elem.type;
        },

        image: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
        },

        reset: function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return (name === "input" || name === "button") && "reset" === elem.type;
        },

        button: function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && "button" === elem.type || name === "button";
        },

        input: function( elem ) {
            return (/input|select|textarea|button/i).test( elem.nodeName );
        },

        focus: function( elem ) {
            return elem === elem.ownerDocument.activeElement;
        }
    },
    setFilters: {
        first: function( elem, i ) {
            return i === 0;
        },

        last: function( elem, i, match, array ) {
            return i === array.length - 1;
        },

        even: function( elem, i ) {
            return i % 2 === 0;
        },

        odd: function( elem, i ) {
            return i % 2 === 1;
        },

        lt: function( elem, i, match ) {
            return i < match[3] - 0;
        },

        gt: function( elem, i, match ) {
            return i > match[3] - 0;
        },

        nth: function( elem, i, match ) {
            return match[3] - 0 === i;
        },

        eq: function( elem, i, match ) {
            return match[3] - 0 === i;
        }
    },
    filter: {
        PSEUDO: function( elem, match, i, array ) {
            var name = match[1],
                filter = Expr.filters[ name ];

            if ( filter ) {
                return filter( elem, i, match, array );

            } else if ( name === "contains" ) {
                return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

            } else if ( name === "not" ) {
                var not = match[3];

                for ( var j = 0, l = not.length; j < l; j++ ) {
                    if ( not[j] === elem ) {
                        return false;
                    }
                }

                return true;

            } else {
                Sizzle.error( name );
            }
        },

        CHILD: function( elem, match ) {
            var first, last,
                doneName, parent, cache,
                count, diff,
                type = match[1],
                node = elem;

            switch ( type ) {
                case "only":
                case "first":
                    while ( (node = node.previousSibling) )  {
                        if ( node.nodeType === 1 ) { 
                            return false; 
                        }
                    }

                    if ( type === "first" ) { 
                        return true; 
                    }

                    node = elem;

                case "last":
                    while ( (node = node.nextSibling) )  {
                        if ( node.nodeType === 1 ) { 
                            return false; 
                        }
                    }

                    return true;

                case "nth":
                    first = match[2];
                    last = match[3];

                    if ( first === 1 && last === 0 ) {
                        return true;
                    }
                    
                    doneName = match[0];
                    parent = elem.parentNode;
    
                    if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
                        count = 0;
                        
                        for ( node = parent.firstChild; node; node = node.nextSibling ) {
                            if ( node.nodeType === 1 ) {
                                node.nodeIndex = ++count;
                            }
                        } 

                        parent[ expando ] = doneName;
                    }
                    
                    diff = elem.nodeIndex - last;

                    if ( first === 0 ) {
                        return diff === 0;

                    } else {
                        return ( diff % first === 0 && diff / first >= 0 );
                    }
            }
        },

        ID: function( elem, match ) {
            return elem.nodeType === 1 && elem.getAttribute("id") === match;
        },

        TAG: function( elem, match ) {
            return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
        },
        
        CLASS: function( elem, match ) {
            return (" " + (elem.className || elem.getAttribute("class")) + " ")
                .indexOf( match ) > -1;
        },

        ATTR: function( elem, match ) {
            var name = match[1],
                result = Sizzle.attr ?
                    Sizzle.attr( elem, name ) :
                    Expr.attrHandle[ name ] ?
                    Expr.attrHandle[ name ]( elem ) :
                    elem[ name ] != null ?
                        elem[ name ] :
                        elem.getAttribute( name ),
                value = result + "",
                type = match[2],
                check = match[4];

            return result == null ?
                type === "!=" :
                !type && Sizzle.attr ?
                result != null :
                type === "=" ?
                value === check :
                type === "*=" ?
                value.indexOf(check) >= 0 :
                type === "~=" ?
                (" " + value + " ").indexOf(check) >= 0 :
                !check ?
                value && result !== false :
                type === "!=" ?
                value !== check :
                type === "^=" ?
                value.indexOf(check) === 0 :
                type === "$=" ?
                value.substr(value.length - check.length) === check :
                type === "|=" ?
                value === check || value.substr(0, check.length + 1) === check + "-" :
                false;
        },

        POS: function( elem, match, i, array ) {
            var name = match[2],
                filter = Expr.setFilters[ name ];

            if ( filter ) {
                return filter( elem, i, match, array );
            }
        }
    }
};

var origPOS = Expr.match.POS,
    fescape = function(all, num){
        return "\\" + (num - 0 + 1);
    };

for ( var type in Expr.match ) {
    Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
    Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
    array = Array.prototype.slice.call( array, 0 );

    if ( results ) {
        results.push.apply( results, array );
        return results;
    }
    
    return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
    Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
    makeArray = function( array, results ) {
        var i = 0,
            ret = results || [];

        if ( toString.call(array) === "[object Array]" ) {
            Array.prototype.push.apply( ret, array );

        } else {
            if ( typeof array.length === "number" ) {
                for ( var l = array.length; i < l; i++ ) {
                    ret.push( array[i] );
                }

            } else {
                for ( ; array[i]; i++ ) {
                    ret.push( array[i] );
                }
            }
        }

        return ret;
    };
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
    sortOrder = function( a, b ) {
        if ( a === b ) {
            hasDuplicate = true;
            return 0;
        }

        if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
            return a.compareDocumentPosition ? -1 : 1;
        }

        return a.compareDocumentPosition(b) & 4 ? -1 : 1;
    };

} else {
    sortOrder = function( a, b ) {
        // The nodes are identical, we can exit early
        if ( a === b ) {
            hasDuplicate = true;
            return 0;

        // Fallback to using sourceIndex (in IE) if it's available on both nodes
        } else if ( a.sourceIndex && b.sourceIndex ) {
            return a.sourceIndex - b.sourceIndex;
        }

        var al, bl,
            ap = [],
            bp = [],
            aup = a.parentNode,
            bup = b.parentNode,
            cur = aup;

        // If the nodes are siblings (or identical) we can do a quick check
        if ( aup === bup ) {
            return siblingCheck( a, b );

        // If no parents were found then the nodes are disconnected
        } else if ( !aup ) {
            return -1;

        } else if ( !bup ) {
            return 1;
        }

        // Otherwise they're somewhere else in the tree so we need
        // to build up a full list of the parentNodes for comparison
        while ( cur ) {
            ap.unshift( cur );
            cur = cur.parentNode;
        }

        cur = bup;

        while ( cur ) {
            bp.unshift( cur );
            cur = cur.parentNode;
        }

        al = ap.length;
        bl = bp.length;

        // Start walking down the tree looking for a discrepancy
        for ( var i = 0; i < al && i < bl; i++ ) {
            if ( ap[i] !== bp[i] ) {
                return siblingCheck( ap[i], bp[i] );
            }
        }

        // We ended someplace up the tree so do a sibling check
        return i === al ?
            siblingCheck( a, bp[i], -1 ) :
            siblingCheck( ap[i], b, 1 );
    };

    siblingCheck = function( a, b, ret ) {
        if ( a === b ) {
            return ret;
        }

        var cur = a.nextSibling;

        while ( cur ) {
            if ( cur === b ) {
                return -1;
            }

            cur = cur.nextSibling;
        }

        return 1;
    };
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
    // We're going to inject a fake input element with a specified name
    var form = document.createElement("div"),
        id = "script" + (new Date()).getTime(),
        root = document.documentElement;

    form.innerHTML = "<a name='" + id + "'/>";

    // Inject it into the root element, check its status, and remove it quickly
    root.insertBefore( form, root.firstChild );

    // The workaround has to do additional checks after a getElementById
    // Which slows things down for other browsers (hence the branching)
    if ( document.getElementById( id ) ) {
        Expr.find.ID = function( match, context, isXML ) {
            if ( typeof context.getElementById !== "undefined" && !isXML ) {
                var m = context.getElementById(match[1]);

                return m ?
                    m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
                        [m] :
                        undefined :
                    [];
            }
        };

        Expr.filter.ID = function( elem, match ) {
            var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

            return elem.nodeType === 1 && node && node.nodeValue === match;
        };
    }

    root.removeChild( form );

    // release memory in IE
    root = form = null;
})();

(function(){
    // Check to see if the browser returns only elements
    // when doing getElementsByTagName("*")

    // Create a fake element
    var div = document.createElement("div");
    div.appendChild( document.createComment("") );

    // Make sure no comments are found
    if ( div.getElementsByTagName("*").length > 0 ) {
        Expr.find.TAG = function( match, context ) {
            var results = context.getElementsByTagName( match[1] );

            // Filter out possible comments
            if ( match[1] === "*" ) {
                var tmp = [];

                for ( var i = 0; results[i]; i++ ) {
                    if ( results[i].nodeType === 1 ) {
                        tmp.push( results[i] );
                    }
                }

                results = tmp;
            }

            return results;
        };
    }

    // Check to see if an attribute returns normalized href attributes
    div.innerHTML = "<a href='#'></a>";

    if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
            div.firstChild.getAttribute("href") !== "#" ) {

        Expr.attrHandle.href = function( elem ) {
            return elem.getAttribute( "href", 2 );
        };
    }

    // release memory in IE
    div = null;
})();

if ( document.querySelectorAll ) {
    (function(){
        var oldSizzle = Sizzle,
            div = document.createElement("div"),
            id = "__sizzle__";

        div.innerHTML = "<p class='TEST'></p>";

        // Safari can't handle uppercase or unicode characters when
        // in quirks mode.
        if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
            return;
        }
    
        Sizzle = function( query, context, extra, seed ) {
            context = context || document;

            // Only use querySelectorAll on non-XML documents
            // (ID selectors don't work in non-HTML documents)
            if ( !seed && !Sizzle.isXML(context) ) {
                // See if we find a selector to speed up
                var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
                
                if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
                    // Speed-up: Sizzle("TAG")
                    if ( match[1] ) {
                        return makeArray( context.getElementsByTagName( query ), extra );
                    
                    // Speed-up: Sizzle(".CLASS")
                    } else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
                        return makeArray( context.getElementsByClassName( match[2] ), extra );
                    }
                }
                
                if ( context.nodeType === 9 ) {
                    // Speed-up: Sizzle("body")
                    // The body element only exists once, optimize finding it
                    if ( query === "body" && context.body ) {
                        return makeArray( [ context.body ], extra );
                        
                    // Speed-up: Sizzle("#ID")
                    } else if ( match && match[3] ) {
                        var elem = context.getElementById( match[3] );

                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if ( elem && elem.parentNode ) {
                            // Handle the case where IE and Opera return items
                            // by name instead of ID
                            if ( elem.id === match[3] ) {
                                return makeArray( [ elem ], extra );
                            }
                            
                        } else {
                            return makeArray( [], extra );
                        }
                    }
                    
                    try {
                        return makeArray( context.querySelectorAll(query), extra );
                    } catch(qsaError) {}

                // qSA works strangely on Element-rooted queries
                // We can work around this by specifying an extra ID on the root
                // and working up from there (Thanks to Andrew Dupont for the technique)
                // IE 8 doesn't work on object elements
                } else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                    var oldContext = context,
                        old = context.getAttribute( "id" ),
                        nid = old || id,
                        hasParent = context.parentNode,
                        relativeHierarchySelector = /^\s*[+~]/.test( query );

                    if ( !old ) {
                        context.setAttribute( "id", nid );
                    } else {
                        nid = nid.replace( /'/g, "\\$&" );
                    }
                    if ( relativeHierarchySelector && hasParent ) {
                        context = context.parentNode;
                    }

                    try {
                        if ( !relativeHierarchySelector || hasParent ) {
                            return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
                        }

                    } catch(pseudoError) {
                    } finally {
                        if ( !old ) {
                            oldContext.removeAttribute( "id" );
                        }
                    }
                }
            }
        
            return oldSizzle(query, context, extra, seed);
        };

        for ( var prop in oldSizzle ) {
            Sizzle[ prop ] = oldSizzle[ prop ];
        }

        // release memory in IE
        div = null;
    })();
}

(function(){
    var html = document.documentElement,
        matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

    if ( matches ) {
        // Check to see if it's possible to do matchesSelector
        // on a disconnected node (IE 9 fails this)
        var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
            pseudoWorks = false;

        try {
            // This should fail with an exception
            // Gecko does not error, returns false instead
            matches.call( document.documentElement, "[test!='']:sizzle" );
    
        } catch( pseudoError ) {
            pseudoWorks = true;
        }

        Sizzle.matchesSelector = function( node, expr ) {
            // Make sure that attribute selectors are quoted
            expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

            if ( !Sizzle.isXML( node ) ) {
                try { 
                    if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
                        var ret = matches.call( node, expr );

                        // IE 9's matchesSelector returns false on disconnected nodes
                        if ( ret || !disconnectedMatch ||
                                // As well, disconnected nodes are said to be in a document
                                // fragment in IE 9, so check for that
                                node.document && node.document.nodeType !== 11 ) {
                            return ret;
                        }
                    }
                } catch(e) {}
            }

            return Sizzle(expr, null, null, [node]).length > 0;
        };
    }
})();

(function(){
    var div = document.createElement("div");

    div.innerHTML = "<div class='test e'></div><div class='test'></div>";

    // Opera can't find a second classname (in 9.6)
    // Also, make sure that getElementsByClassName actually exists
    if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
        return;
    }

    // Safari caches class attributes, doesn't catch changes (in 3.2)
    div.lastChild.className = "e";

    if ( div.getElementsByClassName("e").length === 1 ) {
        return;
    }
    
    Expr.order.splice(1, 0, "CLASS");
    Expr.find.CLASS = function( match, context, isXML ) {
        if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
            return context.getElementsByClassName(match[1]);
        }
    };

    // release memory in IE
    div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
    for ( var i = 0, l = checkSet.length; i < l; i++ ) {
        var elem = checkSet[i];

        if ( elem ) {
            var match = false;

            elem = elem[dir];

            while ( elem ) {
                if ( elem[ expando ] === doneName ) {
                    match = checkSet[elem.sizset];
                    break;
                }

                if ( elem.nodeType === 1 && !isXML ){
                    elem[ expando ] = doneName;
                    elem.sizset = i;
                }

                if ( elem.nodeName.toLowerCase() === cur ) {
                    match = elem;
                    break;
                }

                elem = elem[dir];
            }

            checkSet[i] = match;
        }
    }
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
    for ( var i = 0, l = checkSet.length; i < l; i++ ) {
        var elem = checkSet[i];

        if ( elem ) {
            var match = false;
            
            elem = elem[dir];

            while ( elem ) {
                if ( elem[ expando ] === doneName ) {
                    match = checkSet[elem.sizset];
                    break;
                }

                if ( elem.nodeType === 1 ) {
                    if ( !isXML ) {
                        elem[ expando ] = doneName;
                        elem.sizset = i;
                    }

                    if ( typeof cur !== "string" ) {
                        if ( elem === cur ) {
                            match = true;
                            break;
                        }

                    } else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
                        match = elem;
                        break;
                    }
                }

                elem = elem[dir];
            }

            checkSet[i] = match;
        }
    }
}

if ( document.documentElement.contains ) {
    Sizzle.contains = function( a, b ) {
        return a !== b && (a.contains ? a.contains(b) : true);
    };

} else if ( document.documentElement.compareDocumentPosition ) {
    Sizzle.contains = function( a, b ) {
        return !!(a.compareDocumentPosition(b) & 16);
    };

} else {
    Sizzle.contains = function() {
        return false;
    };
}

Sizzle.isXML = function( elem ) {
    // documentElement is verified for cases where it doesn't yet exist
    // (such as loading iframes in IE - #4833) 
    var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

    return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
    var match,
        tmpSet = [],
        later = "",
        root = context.nodeType ? [context] : context;

    // Position selectors must be done after the filter
    // And so must :not(positional) so we move all PSEUDOs to the end
    while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
        later += match[0];
        selector = selector.replace( Expr.match.PSEUDO, "" );
    }

    selector = Expr.relative[selector] ? selector + "*" : selector;

    for ( var i = 0, l = root.length; i < l; i++ ) {
        Sizzle( selector, root[i], tmpSet, seed );
    }

    return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
    rparentsprev = /^(?:parents|prevUntil|prevAll)/,
    // Note: This RegExp should be improved, or likely pulled from Sizzle
    rmultiselector = /,/,
    isSimple = /^.[^:#\[\.,]*$/,
    slice = Array.prototype.slice,
    POS = jQuery.expr.match.POS,
    // methods guaranteed to produce a unique set when starting from a unique set
    guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
    };

jQuery.fn.extend({
    find: function( selector ) {
        var self = this,
            i, l;

        if ( typeof selector !== "string" ) {
            return jQuery( selector ).filter(function() {
                for ( i = 0, l = self.length; i < l; i++ ) {
                    if ( jQuery.contains( self[ i ], this ) ) {
                        return true;
                    }
                }
            });
        }

        var ret = this.pushStack( "", "find", selector ),
            length, n, r;

        for ( i = 0, l = this.length; i < l; i++ ) {
            length = ret.length;
            jQuery.find( selector, this[i], ret );

            if ( i > 0 ) {
                // Make sure that the results are unique
                for ( n = length; n < ret.length; n++ ) {
                    for ( r = 0; r < length; r++ ) {
                        if ( ret[r] === ret[n] ) {
                            ret.splice(n--, 1);
                            break;
                        }
                    }
                }
            }
        }

        return ret;
    },

    has: function( target ) {
        var targets = jQuery( target );
        return this.filter(function() {
            for ( var i = 0, l = targets.length; i < l; i++ ) {
                if ( jQuery.contains( this, targets[i] ) ) {
                    return true;
                }
            }
        });
    },

    not: function( selector ) {
        return this.pushStack( winnow(this, selector, false), "not", selector);
    },

    filter: function( selector ) {
        return this.pushStack( winnow(this, selector, true), "filter", selector );
    },

    is: function( selector ) {
        return !!selector && ( 
            typeof selector === "string" ?
                // If this is a positional selector, check membership in the returned set
                // so $("p:first").is("p:last") won't return true for a doc with two "p".
                POS.test( selector ) ? 
                    jQuery( selector, this.context ).index( this[0] ) >= 0 :
                    jQuery.filter( selector, this ).length > 0 :
                this.filter( selector ).length > 0 );
    },

    closest: function( selectors, context ) {
        var ret = [], i, l, cur = this[0];
        
        // Array (deprecated as of jQuery 1.7)
        if ( jQuery.isArray( selectors ) ) {
            var level = 1;

            while ( cur && cur.ownerDocument && cur !== context ) {
                for ( i = 0; i < selectors.length; i++ ) {

                    if ( jQuery( cur ).is( selectors[ i ] ) ) {
                        ret.push({ selector: selectors[ i ], elem: cur, level: level });
                    }
                }

                cur = cur.parentNode;
                level++;
            }

            return ret;
        }

        // String
        var pos = POS.test( selectors ) || typeof selectors !== "string" ?
                jQuery( selectors, context || this.context ) :
                0;

        for ( i = 0, l = this.length; i < l; i++ ) {
            cur = this[i];

            while ( cur ) {
                if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
                    ret.push( cur );
                    break;

                } else {
                    cur = cur.parentNode;
                    if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
                        break;
                    }
                }
            }
        }

        ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

        return this.pushStack( ret, "closest", selectors );
    },

    // Determine the position of an element within
    // the matched set of elements
    index: function( elem ) {

        // No argument, return index in parent
        if ( !elem ) {
            return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
        }

        // index in selector
        if ( typeof elem === "string" ) {
            return jQuery.inArray( this[0], jQuery( elem ) );
        }

        // Locate the position of the desired element
        return jQuery.inArray(
            // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem, this );
    },

    add: function( selector, context ) {
        var set = typeof selector === "string" ?
                jQuery( selector, context ) :
                jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
            all = jQuery.merge( this.get(), set );

        return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
            all :
            jQuery.unique( all ) );
    },

    andSelf: function() {
        return this.add( this.prevObject );
    }
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
    return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
    parent: function( elem ) {
        var parent = elem.parentNode;
        return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function( elem ) {
        return jQuery.dir( elem, "parentNode" );
    },
    parentsUntil: function( elem, i, until ) {
        return jQuery.dir( elem, "parentNode", until );
    },
    next: function( elem ) {
        return jQuery.nth( elem, 2, "nextSibling" );
    },
    prev: function( elem ) {
        return jQuery.nth( elem, 2, "previousSibling" );
    },
    nextAll: function( elem ) {
        return jQuery.dir( elem, "nextSibling" );
    },
    prevAll: function( elem ) {
        return jQuery.dir( elem, "previousSibling" );
    },
    nextUntil: function( elem, i, until ) {
        return jQuery.dir( elem, "nextSibling", until );
    },
    prevUntil: function( elem, i, until ) {
        return jQuery.dir( elem, "previousSibling", until );
    },
    siblings: function( elem ) {
        return jQuery.sibling( elem.parentNode.firstChild, elem );
    },
    children: function( elem ) {
        return jQuery.sibling( elem.firstChild );
    },
    contents: function( elem ) {
        return jQuery.nodeName( elem, "iframe" ) ?
            elem.contentDocument || elem.contentWindow.document :
            jQuery.makeArray( elem.childNodes );
    }
}, function( name, fn ) {
    jQuery.fn[ name ] = function( until, selector ) {
        var ret = jQuery.map( this, fn, until );

        if ( !runtil.test( name ) ) {
            selector = until;
        }

        if ( selector && typeof selector === "string" ) {
            ret = jQuery.filter( selector, ret );
        }

        ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

        if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
            ret = ret.reverse();
        }

        return this.pushStack( ret, name, slice.call( arguments ).join(",") );
    };
});

jQuery.extend({
    filter: function( expr, elems, not ) {
        if ( not ) {
            expr = ":not(" + expr + ")";
        }

        return elems.length === 1 ?
            jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
            jQuery.find.matches(expr, elems);
    },

    dir: function( elem, dir, until ) {
        var matched = [],
            cur = elem[ dir ];

        while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
            if ( cur.nodeType === 1 ) {
                matched.push( cur );
            }
            cur = cur[dir];
        }
        return matched;
    },

    nth: function( cur, result, dir, elem ) {
        result = result || 1;
        var num = 0;

        for ( ; cur; cur = cur[dir] ) {
            if ( cur.nodeType === 1 && ++num === result ) {
                break;
            }
        }

        return cur;
    },

    sibling: function( n, elem ) {
        var r = [];

        for ( ; n; n = n.nextSibling ) {
            if ( n.nodeType === 1 && n !== elem ) {
                r.push( n );
            }
        }

        return r;
    }
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

    // Can't pass null or undefined to indexOf in Firefox 4
    // Set to 0 to skip string check
    qualifier = qualifier || 0;

    if ( jQuery.isFunction( qualifier ) ) {
        return jQuery.grep(elements, function( elem, i ) {
            var retVal = !!qualifier.call( elem, i, elem );
            return retVal === keep;
        });

    } else if ( qualifier.nodeType ) {
        return jQuery.grep(elements, function( elem, i ) {
            return ( elem === qualifier ) === keep;
        });

    } else if ( typeof qualifier === "string" ) {
        var filtered = jQuery.grep(elements, function( elem ) {
            return elem.nodeType === 1;
        });

        if ( isSimple.test( qualifier ) ) {
            return jQuery.filter(qualifier, filtered, !keep);
        } else {
            qualifier = jQuery.filter( qualifier, filtered );
        }
    }

    return jQuery.grep(elements, function( elem, i ) {
        return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
    });
}




function createSafeFragment( document ) {
    var list = nodeNames.split( "|" ),
    safeFrag = document.createDocumentFragment();

    if ( safeFrag.createElement ) {
        while ( list.length ) {
            safeFrag.createElement(
                list.pop()
            );
        }
    }
    return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
        "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
    rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
    rleadingWhitespace = /^\s+/,
    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rtagName = /<([\w:]+)/,
    rtbody = /<tbody/i,
    rhtml = /<|&#?\w+;/,
    rnoInnerhtml = /<(?:script|style)/i,
    rnocache = /<(?:script|object|embed|option|style)/i,
    rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
    // checked="checked" or checked
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    rscriptType = /\/(java|ecma)script/i,
    rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
    wrapMap = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        area: [ 1, "<map>", "</map>" ],
        _default: [ 0, "", "" ]
    },
    safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
    wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
    text: function( text ) {
        if ( jQuery.isFunction(text) ) {
            return this.each(function(i) {
                var self = jQuery( this );

                self.text( text.call(this, i, self.text()) );
            });
        }

        if ( typeof text !== "object" && text !== undefined ) {
            return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
        }

        return jQuery.text( this );
    },

    wrapAll: function( html ) {
        if ( jQuery.isFunction( html ) ) {
            return this.each(function(i) {
                jQuery(this).wrapAll( html.call(this, i) );
            });
        }

        if ( this[0] ) {
            // The elements to wrap the target around
            var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

            if ( this[0].parentNode ) {
                wrap.insertBefore( this[0] );
            }

            wrap.map(function() {
                var elem = this;

                while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
                    elem = elem.firstChild;
                }

                return elem;
            }).append( this );
        }

        return this;
    },

    wrapInner: function( html ) {
        if ( jQuery.isFunction( html ) ) {
            return this.each(function(i) {
                jQuery(this).wrapInner( html.call(this, i) );
            });
        }

        return this.each(function() {
            var self = jQuery( this ),
                contents = self.contents();

            if ( contents.length ) {
                contents.wrapAll( html );

            } else {
                self.append( html );
            }
        });
    },

    wrap: function( html ) {
        var isFunction = jQuery.isFunction( html );

        return this.each(function(i) {
            jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
        });
    },

    unwrap: function() {
        return this.parent().each(function() {
            if ( !jQuery.nodeName( this, "body" ) ) {
                jQuery( this ).replaceWith( this.childNodes );
            }
        }).end();
    },

    append: function() {
        return this.domManip(arguments, true, function( elem ) {
            if ( this.nodeType === 1 ) {
                this.appendChild( elem );
            }
        });
    },

    prepend: function() {
        return this.domManip(arguments, true, function( elem ) {
            if ( this.nodeType === 1 ) {
                this.insertBefore( elem, this.firstChild );
            }
        });
    },

    before: function() {
        if ( this[0] && this[0].parentNode ) {
            return this.domManip(arguments, false, function( elem ) {
                this.parentNode.insertBefore( elem, this );
            });
        } else if ( arguments.length ) {
            var set = jQuery.clean( arguments );
            set.push.apply( set, this.toArray() );
            return this.pushStack( set, "before", arguments );
        }
    },

    after: function() {
        if ( this[0] && this[0].parentNode ) {
            return this.domManip(arguments, false, function( elem ) {
                this.parentNode.insertBefore( elem, this.nextSibling );
            });
        } else if ( arguments.length ) {
            var set = this.pushStack( this, "after", arguments );
            set.push.apply( set, jQuery.clean(arguments) );
            return set;
        }
    },

    // keepData is for internal use only--do not document
    remove: function( selector, keepData ) {
        for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
            if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
                if ( !keepData && elem.nodeType === 1 ) {
                    jQuery.cleanData( elem.getElementsByTagName("*") );
                    jQuery.cleanData( [ elem ] );
                }

                if ( elem.parentNode ) {
                    elem.parentNode.removeChild( elem );
                }
            }
        }

        return this;
    },

    empty: function() {
        for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
            // Remove element nodes and prevent memory leaks
            if ( elem.nodeType === 1 ) {
                jQuery.cleanData( elem.getElementsByTagName("*") );
            }

            // Remove any remaining nodes
            while ( elem.firstChild ) {
                elem.removeChild( elem.firstChild );
            }
        }

        return this;
    },

    clone: function( dataAndEvents, deepDataAndEvents ) {
        dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
        deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

        return this.map( function () {
            return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
        });
    },

    html: function( value ) {
        if ( value === undefined ) {
            return this[0] && this[0].nodeType === 1 ?
                this[0].innerHTML.replace(rinlinejQuery, "") :
                null;

        // See if we can take a shortcut and just use innerHTML
        } else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
            (jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
            !wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

            value = value.replace(rxhtmlTag, "<$1></$2>");

            try {
                for ( var i = 0, l = this.length; i < l; i++ ) {
                    // Remove element nodes and prevent memory leaks
                    if ( this[i].nodeType === 1 ) {
                        jQuery.cleanData( this[i].getElementsByTagName("*") );
                        this[i].innerHTML = value;
                    }
                }

            // If using innerHTML throws an exception, use the fallback method
            } catch(e) {
                this.empty().append( value );
            }

        } else if ( jQuery.isFunction( value ) ) {
            this.each(function(i){
                var self = jQuery( this );

                self.html( value.call(this, i, self.html()) );
            });

        } else {
            this.empty().append( value );
        }

        return this;
    },

    replaceWith: function( value ) {
        if ( this[0] && this[0].parentNode ) {
            // Make sure that the elements are removed from the DOM before they are inserted
            // this can help fix replacing a parent with child elements
            if ( jQuery.isFunction( value ) ) {
                return this.each(function(i) {
                    var self = jQuery(this), old = self.html();
                    self.replaceWith( value.call( this, i, old ) );
                });
            }

            if ( typeof value !== "string" ) {
                value = jQuery( value ).detach();
            }

            return this.each(function() {
                var next = this.nextSibling,
                    parent = this.parentNode;

                jQuery( this ).remove();

                if ( next ) {
                    jQuery(next).before( value );
                } else {
                    jQuery(parent).append( value );
                }
            });
        } else {
            return this.length ?
                this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
                this;
        }
    },

    detach: function( selector ) {
        return this.remove( selector, true );
    },

    domManip: function( args, table, callback ) {
        var results, first, fragment, parent,
            value = args[0],
            scripts = [];

        // We can't cloneNode fragments that contain checked, in WebKit
        if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
            return this.each(function() {
                jQuery(this).domManip( args, table, callback, true );
            });
        }

        if ( jQuery.isFunction(value) ) {
            return this.each(function(i) {
                var self = jQuery(this);
                args[0] = value.call(this, i, table ? self.html() : undefined);
                self.domManip( args, table, callback );
            });
        }

        if ( this[0] ) {
            parent = value && value.parentNode;

            // If we're in a fragment, just use that instead of building a new one
            if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
                results = { fragment: parent };

            } else {
                results = jQuery.buildFragment( args, this, scripts );
            }

            fragment = results.fragment;

            if ( fragment.childNodes.length === 1 ) {
                first = fragment = fragment.firstChild;
            } else {
                first = fragment.firstChild;
            }

            if ( first ) {
                table = table && jQuery.nodeName( first, "tr" );

                for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
                    callback.call(
                        table ?
                            root(this[i], first) :
                            this[i],
                        // Make sure that we do not leak memory by inadvertently discarding
                        // the original fragment (which might have attached data) instead of
                        // using it; in addition, use the original fragment object for the last
                        // item instead of first because it can end up being emptied incorrectly
                        // in certain situations (Bug #8070).
                        // Fragments from the fragment cache must always be cloned and never used
                        // in place.
                        results.cacheable || ( l > 1 && i < lastIndex ) ?
                            jQuery.clone( fragment, true, true ) :
                            fragment
                    );
                }
            }

            if ( scripts.length ) {
                jQuery.each( scripts, evalScript );
            }
        }

        return this;
    }
});

function root( elem, cur ) {
    return jQuery.nodeName(elem, "table") ?
        (elem.getElementsByTagName("tbody")[0] ||
        elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
        elem;
}

function cloneCopyEvent( src, dest ) {

    if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
        return;
    }

    var type, i, l,
        oldData = jQuery._data( src ),
        curData = jQuery._data( dest, oldData ),
        events = oldData.events;

    if ( events ) {
        delete curData.handle;
        curData.events = {};

        for ( type in events ) {
            for ( i = 0, l = events[ type ].length; i < l; i++ ) {
                jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
            }
        }
    }

    // make the cloned public data object a copy from the original
    if ( curData.data ) {
        curData.data = jQuery.extend( {}, curData.data );
    }
}

function cloneFixAttributes( src, dest ) {
    var nodeName;

    // We do not need to do anything for non-Elements
    if ( dest.nodeType !== 1 ) {
        return;
    }

    // clearAttributes removes the attributes, which we don't want,
    // but also removes the attachEvent events, which we *do* want
    if ( dest.clearAttributes ) {
        dest.clearAttributes();
    }

    // mergeAttributes, in contrast, only merges back on the
    // original attributes, not the events
    if ( dest.mergeAttributes ) {
        dest.mergeAttributes( src );
    }

    nodeName = dest.nodeName.toLowerCase();

    // IE6-8 fail to clone children inside object elements that use
    // the proprietary classid attribute value (rather than the type
    // attribute) to identify the type of content to display
    if ( nodeName === "object" ) {
        dest.outerHTML = src.outerHTML;

    } else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
        // IE6-8 fails to persist the checked state of a cloned checkbox
        // or radio button. Worse, IE6-7 fail to give the cloned element
        // a checked appearance if the defaultChecked value isn't also set
        if ( src.checked ) {
            dest.defaultChecked = dest.checked = src.checked;
        }

        // IE6-7 get confused and end up setting the value of a cloned
        // checkbox/radio button to an empty string instead of "on"
        if ( dest.value !== src.value ) {
            dest.value = src.value;
        }

    // IE6-8 fails to return the selected option to the default selected
    // state when cloning options
    } else if ( nodeName === "option" ) {
        dest.selected = src.defaultSelected;

    // IE6-8 fails to set the defaultValue to the correct value when
    // cloning other types of input fields
    } else if ( nodeName === "input" || nodeName === "textarea" ) {
        dest.defaultValue = src.defaultValue;
    }

    // Event data gets referenced instead of copied if the expando
    // gets copied too
    dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
    var fragment, cacheable, cacheresults, doc,
    first = args[ 0 ];

    // nodes may contain either an explicit document object,
    // a jQuery collection or context object.
    // If nodes[0] contains a valid object to assign to doc
    if ( nodes && nodes[0] ) {
        doc = nodes[0].ownerDocument || nodes[0];
    }

    // Ensure that an attr object doesn't incorrectly stand in as a document object
    // Chrome and Firefox seem to allow this to occur and will throw exception
    // Fixes #8950
    if ( !doc.createDocumentFragment ) {
        doc = document;
    }

    // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
    // Cloning options loses the selected state, so don't cache them
    // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
    // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
    // Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
    if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
        first.charAt(0) === "<" && !rnocache.test( first ) &&
        (jQuery.support.checkClone || !rchecked.test( first )) &&
        (jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

        cacheable = true;

        cacheresults = jQuery.fragments[ first ];
        if ( cacheresults && cacheresults !== 1 ) {
            fragment = cacheresults;
        }
    }

    if ( !fragment ) {
        fragment = doc.createDocumentFragment();
        jQuery.clean( args, doc, fragment, scripts );
    }

    if ( cacheable ) {
        jQuery.fragments[ first ] = cacheresults ? fragment : 1;
    }

    return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
}, function( name, original ) {
    jQuery.fn[ name ] = function( selector ) {
        var ret = [],
            insert = jQuery( selector ),
            parent = this.length === 1 && this[0].parentNode;

        if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
            insert[ original ]( this[0] );
            return this;

        } else {
            for ( var i = 0, l = insert.length; i < l; i++ ) {
                var elems = ( i > 0 ? this.clone(true) : this ).get();
                jQuery( insert[i] )[ original ]( elems );
                ret = ret.concat( elems );
            }

            return this.pushStack( ret, name, insert.selector );
        }
    };
});

function getAll( elem ) {
    if ( typeof elem.getElementsByTagName !== "undefined" ) {
        return elem.getElementsByTagName( "*" );

    } else if ( typeof elem.querySelectorAll !== "undefined" ) {
        return elem.querySelectorAll( "*" );

    } else {
        return [];
    }
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
    if ( elem.type === "checkbox" || elem.type === "radio" ) {
        elem.defaultChecked = elem.checked;
    }
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
    var nodeName = ( elem.nodeName || "" ).toLowerCase();
    if ( nodeName === "input" ) {
        fixDefaultChecked( elem );
    // Skip scripts, get other children
    } else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
        jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
    }
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
    var div = document.createElement( "div" );
    safeFragment.appendChild( div );

    div.innerHTML = elem.outerHTML;
    return div.firstChild;
}

jQuery.extend({
    clone: function( elem, dataAndEvents, deepDataAndEvents ) {
        var srcElements,
            destElements,
            i,
            // IE<=8 does not properly clone detached, unknown element nodes
            clone = jQuery.support.html5Clone || !rnoshimcache.test( "<" + elem.nodeName ) ?
                elem.cloneNode( true ) :
                shimCloneNode( elem );

        if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
                (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
            // IE copies events bound via attachEvent when using cloneNode.
            // Calling detachEvent on the clone will also remove the events
            // from the original. In order to get around this, we use some
            // proprietary methods to clear the events. Thanks to MooTools
            // guys for this hotness.

            cloneFixAttributes( elem, clone );

            // Using Sizzle here is crazy slow, so we use getElementsByTagName instead
            srcElements = getAll( elem );
            destElements = getAll( clone );

            // Weird iteration because IE will replace the length property
            // with an element if you are cloning the body and one of the
            // elements on the page has a name or id of "length"
            for ( i = 0; srcElements[i]; ++i ) {
                // Ensure that the destination node is not null; Fixes #9587
                if ( destElements[i] ) {
                    cloneFixAttributes( srcElements[i], destElements[i] );
                }
            }
        }

        // Copy the events from the original to the clone
        if ( dataAndEvents ) {
            cloneCopyEvent( elem, clone );

            if ( deepDataAndEvents ) {
                srcElements = getAll( elem );
                destElements = getAll( clone );

                for ( i = 0; srcElements[i]; ++i ) {
                    cloneCopyEvent( srcElements[i], destElements[i] );
                }
            }
        }

        srcElements = destElements = null;

        // Return the cloned set
        return clone;
    },

    clean: function( elems, context, fragment, scripts ) {
        var checkScriptType;

        context = context || document;

        // !context.createElement fails in IE with an error but returns typeof 'object'
        if ( typeof context.createElement === "undefined" ) {
            context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
        }

        var ret = [], j;

        for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
            if ( typeof elem === "number" ) {
                elem += "";
            }

            if ( !elem ) {
                continue;
            }

            // Convert html string into DOM nodes
            if ( typeof elem === "string" ) {
                if ( !rhtml.test( elem ) ) {
                    elem = context.createTextNode( elem );
                } else {
                    // Fix "XHTML"-style tags in all browsers
                    elem = elem.replace(rxhtmlTag, "<$1></$2>");

                    // Trim whitespace, otherwise indexOf won't work as expected
                    var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
                        wrap = wrapMap[ tag ] || wrapMap._default,
                        depth = wrap[0],
                        div = context.createElement("div");

                    // Append wrapper element to unknown element safe doc fragment
                    if ( context === document ) {
                        // Use the fragment we've already created for this document
                        safeFragment.appendChild( div );
                    } else {
                        // Use a fragment created with the owner document
                        createSafeFragment( context ).appendChild( div );
                    }

                    // Go to html and back, then peel off extra wrappers
                    div.innerHTML = wrap[1] + elem + wrap[2];

                    // Move to the right depth
                    while ( depth-- ) {
                        div = div.lastChild;
                    }

                    // Remove IE's autoinserted <tbody> from table fragments
                    if ( !jQuery.support.tbody ) {

                        // String was a <table>, *may* have spurious <tbody>
                        var hasBody = rtbody.test(elem),
                            tbody = tag === "table" && !hasBody ?
                                div.firstChild && div.firstChild.childNodes :

                                // String was a bare <thead> or <tfoot>
                                wrap[1] === "<table>" && !hasBody ?
                                    div.childNodes :
                                    [];

                        for ( j = tbody.length - 1; j >= 0 ; --j ) {
                            if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
                                tbody[ j ].parentNode.removeChild( tbody[ j ] );
                            }
                        }
                    }

                    // IE completely kills leading whitespace when innerHTML is used
                    if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
                        div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
                    }

                    elem = div.childNodes;
                }
            }

            // Resets defaultChecked for any radios and checkboxes
            // about to be appended to the DOM in IE 6/7 (#8060)
            var len;
            if ( !jQuery.support.appendChecked ) {
                if ( elem[0] && typeof (len = elem.length) === "number" ) {
                    for ( j = 0; j < len; j++ ) {
                        findInputs( elem[j] );
                    }
                } else {
                    findInputs( elem );
                }
            }

            if ( elem.nodeType ) {
                ret.push( elem );
            } else {
                ret = jQuery.merge( ret, elem );
            }
        }

        if ( fragment ) {
            checkScriptType = function( elem ) {
                return !elem.type || rscriptType.test( elem.type );
            };
            for ( i = 0; ret[i]; i++ ) {
                if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
                    scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

                } else {
                    if ( ret[i].nodeType === 1 ) {
                        var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

                        ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
                    }
                    fragment.appendChild( ret[i] );
                }
            }
        }

        return ret;
    },

    cleanData: function( elems ) {
        var data, id,
            cache = jQuery.cache,
            special = jQuery.event.special,
            deleteExpando = jQuery.support.deleteExpando;

        for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
            if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
                continue;
            }

            id = elem[ jQuery.expando ];

            if ( id ) {
                data = cache[ id ];

                if ( data && data.events ) {
                    for ( var type in data.events ) {
                        if ( special[ type ] ) {
                            jQuery.event.remove( elem, type );

                        // This is a shortcut to avoid jQuery.event.remove's overhead
                        } else {
                            jQuery.removeEvent( elem, type, data.handle );
                        }
                    }

                    // Null the DOM reference to avoid IE6/7/8 leak (#7054)
                    if ( data.handle ) {
                        data.handle.elem = null;
                    }
                }

                if ( deleteExpando ) {
                    delete elem[ jQuery.expando ];

                } else if ( elem.removeAttribute ) {
                    elem.removeAttribute( jQuery.expando );
                }

                delete cache[ id ];
            }
        }
    }
});

function evalScript( i, elem ) {
    if ( elem.src ) {
        jQuery.ajax({
            url: elem.src,
            async: false,
            dataType: "script"
        });
    } else {
        jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
    }

    if ( elem.parentNode ) {
        elem.parentNode.removeChild( elem );
    }
}




var ralpha = /alpha\([^)]*\)/i,
    ropacity = /opacity=([^)]*)/,
    // fixed for IE9, see #8346
    rupper = /([A-Z]|^ms)/g,
    rnumpx = /^-?\d+(?:px)?$/i,
    rnum = /^-?\d/,
    rrelNum = /^([\-+])=([\-+.\de]+)/,

    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
    cssWidth = [ "Left", "Right" ],
    cssHeight = [ "Top", "Bottom" ],
    curCSS,

    getComputedStyle,
    currentStyle;

jQuery.fn.css = function( name, value ) {
    // Setting 'undefined' is a no-op
    if ( arguments.length === 2 && value === undefined ) {
        return this;
    }

    return jQuery.access( this, name, value, true, function( elem, name, value ) {
        return value !== undefined ?
            jQuery.style( elem, name, value ) :
            jQuery.css( elem, name );
    });
};

jQuery.extend({
    // Add in style property hooks for overriding the default
    // behavior of getting and setting a style property
    cssHooks: {
        opacity: {
            get: function( elem, computed ) {
                if ( computed ) {
                    // We should always get a number back from opacity
                    var ret = curCSS( elem, "opacity", "opacity" );
                    return ret === "" ? "1" : ret;

                } else {
                    return elem.style.opacity;
                }
            }
        }
    },

    // Exclude the following css properties to add px
    cssNumber: {
        "fillOpacity": true,
        "fontWeight": true,
        "lineHeight": true,
        "opacity": true,
        "orphans": true,
        "widows": true,
        "zIndex": true,
        "zoom": true
    },

    // Add in properties whose names you wish to fix before
    // setting or getting the value
    cssProps: {
        // normalize float css property
        "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
    },

    // Get and set the style property on a DOM Node
    style: function( elem, name, value, extra ) {
        // Don't set styles on text and comment nodes
        if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
            return;
        }

        // Make sure that we're working with the right name
        var ret, type, origName = jQuery.camelCase( name ),
            style = elem.style, hooks = jQuery.cssHooks[ origName ];

        name = jQuery.cssProps[ origName ] || origName;

        // Check if we're setting a value
        if ( value !== undefined ) {
            type = typeof value;

            // convert relative number strings (+= or -=) to relative numbers. #7345
            if ( type === "string" && (ret = rrelNum.exec( value )) ) {
                value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
                // Fixes bug #9237
                type = "number";
            }

            // Make sure that NaN and null values aren't set. See: #7116
            if ( value == null || type === "number" && isNaN( value ) ) {
                return;
            }

            // If a number was passed in, add 'px' to the (except for certain CSS properties)
            if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
                value += "px";
            }

            // If a hook was provided, use that value, otherwise just set the specified value
            if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
                // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                // Fixes bug #5509
                try {
                    style[ name ] = value;
                } catch(e) {}
            }

        } else {
            // If a hook was provided get the non-computed value from there
            if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
                return ret;
            }

            // Otherwise just get the value from the style object
            return style[ name ];
        }
    },

    css: function( elem, name, extra ) {
        var ret, hooks;

        // Make sure that we're working with the right name
        name = jQuery.camelCase( name );
        hooks = jQuery.cssHooks[ name ];
        name = jQuery.cssProps[ name ] || name;

        // cssFloat needs a special treatment
        if ( name === "cssFloat" ) {
            name = "float";
        }

        // If a hook was provided get the computed value from there
        if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
            return ret;

        // Otherwise, if a way to get the computed value exists, use that
        } else if ( curCSS ) {
            return curCSS( elem, name );
        }
    },

    // A method for quickly swapping in/out CSS properties to get correct calculations
    swap: function( elem, options, callback ) {
        var old = {};

        // Remember the old values, and insert the new ones
        for ( var name in options ) {
            old[ name ] = elem.style[ name ];
            elem.style[ name ] = options[ name ];
        }

        callback.call( elem );

        // Revert the old values
        for ( name in options ) {
            elem.style[ name ] = old[ name ];
        }
    }
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
    jQuery.cssHooks[ name ] = {
        get: function( elem, computed, extra ) {
            var val;

            if ( computed ) {
                if ( elem.offsetWidth !== 0 ) {
                    return getWH( elem, name, extra );
                } else {
                    jQuery.swap( elem, cssShow, function() {
                        val = getWH( elem, name, extra );
                    });
                }

                return val;
            }
        },

        set: function( elem, value ) {
            if ( rnumpx.test( value ) ) {
                // ignore negative width and height values #1599
                value = parseFloat( value );

                if ( value >= 0 ) {
                    return value + "px";
                }

            } else {
                return value;
            }
        }
    };
});

if ( !jQuery.support.opacity ) {
    jQuery.cssHooks.opacity = {
        get: function( elem, computed ) {
            // IE uses filters for opacity
            return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
                ( parseFloat( RegExp.$1 ) / 100 ) + "" :
                computed ? "1" : "";
        },

        set: function( elem, value ) {
            var style = elem.style,
                currentStyle = elem.currentStyle,
                opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
                filter = currentStyle && currentStyle.filter || style.filter || "";

            // IE has trouble with opacity if it does not have layout
            // Force it by setting the zoom level
            style.zoom = 1;

            // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
            if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

                // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
                // if "filter:" is present at all, clearType is disabled, we want to avoid this
                // style.removeAttribute is IE Only, but so apparently is this code path...
                style.removeAttribute( "filter" );

                // if there there is no filter style applied in a css rule, we are done
                if ( currentStyle && !currentStyle.filter ) {
                    return;
                }
            }

            // otherwise, set new filter values
            style.filter = ralpha.test( filter ) ?
                filter.replace( ralpha, opacity ) :
                filter + " " + opacity;
        }
    };
}

jQuery(function() {
    // This hook cannot be added until DOM ready because the support test
    // for it is not run until after DOM ready
    if ( !jQuery.support.reliableMarginRight ) {
        jQuery.cssHooks.marginRight = {
            get: function( elem, computed ) {
                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                // Work around by temporarily setting element display to inline-block
                var ret;
                jQuery.swap( elem, { "display": "inline-block" }, function() {
                    if ( computed ) {
                        ret = curCSS( elem, "margin-right", "marginRight" );
                    } else {
                        ret = elem.style.marginRight;
                    }
                });
                return ret;
            }
        };
    }
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
    getComputedStyle = function( elem, name ) {
        var ret, defaultView, computedStyle;

        name = name.replace( rupper, "-$1" ).toLowerCase();

        if ( (defaultView = elem.ownerDocument.defaultView) &&
                (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
            ret = computedStyle.getPropertyValue( name );
            if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
                ret = jQuery.style( elem, name );
            }
        }

        return ret;
    };
}

if ( document.documentElement.currentStyle ) {
    currentStyle = function( elem, name ) {
        var left, rsLeft, uncomputed,
            ret = elem.currentStyle && elem.currentStyle[ name ],
            style = elem.style;

        // Avoid setting ret to empty string here
        // so we don't default to auto
        if ( ret === null && style && (uncomputed = style[ name ]) ) {
            ret = uncomputed;
        }

        // From the awesome hack by Dean Edwards
        // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

        // If we're not dealing with a regular pixel number
        // but a number that has a weird ending, we need to convert it to pixels
        if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {

            // Remember the original values
            left = style.left;
            rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

            // Put in the new values to get a computed value out
            if ( rsLeft ) {
                elem.runtimeStyle.left = elem.currentStyle.left;
            }
            style.left = name === "fontSize" ? "1em" : ( ret || 0 );
            ret = style.pixelLeft + "px";

            // Revert the changed values
            style.left = left;
            if ( rsLeft ) {
                elem.runtimeStyle.left = rsLeft;
            }
        }

        return ret === "" ? "auto" : ret;
    };
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

    // Start with offset property
    var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
        which = name === "width" ? cssWidth : cssHeight,
        i = 0,
        len = which.length;

    if ( val > 0 ) {
        if ( extra !== "border" ) {
            for ( ; i < len; i++ ) {
                if ( !extra ) {
                    val -= parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
                }
                if ( extra === "margin" ) {
                    val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
                } else {
                    val -= parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
                }
            }
        }

        return val + "px";
    }

    // Fall back to computed then uncomputed css if necessary
    val = curCSS( elem, name, name );
    if ( val < 0 || val == null ) {
        val = elem.style[ name ] || 0;
    }
    // Normalize "", auto, and prepare for extra
    val = parseFloat( val ) || 0;

    // Add padding, border, margin
    if ( extra ) {
        for ( ; i < len; i++ ) {
            val += parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
            if ( extra !== "padding" ) {
                val += parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
            }
            if ( extra === "margin" ) {
                val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
            }
        }
    }

    return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
    jQuery.expr.filters.hidden = function( elem ) {
        var width = elem.offsetWidth,
            height = elem.offsetHeight;

        return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
    };

    jQuery.expr.filters.visible = function( elem ) {
        return !jQuery.expr.filters.hidden( elem );
    };
}




var r20 = /%20/g,
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rhash = /#.*$/,
    rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
    rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
    // #7653, #8125, #8152: local protocol detection
    rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
    rnoContent = /^(?:GET|HEAD)$/,
    rprotocol = /^\/\//,
    rquery = /\?/,
    rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    rselectTextarea = /^(?:select|textarea)/i,
    rspacesAjax = /\s+/,
    rts = /([?&])_=[^&]*/,
    rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

    // Keep a copy of the old load method
    _load = jQuery.fn.load,

    /* Prefilters
     * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
     * 2) These are called:
     *    - BEFORE asking for a transport
     *    - AFTER param serialization (s.data is a string if s.processData is true)
     * 3) key is the dataType
     * 4) the catchall symbol "*" can be used
     * 5) execution will start with transport dataType and THEN continue down to "*" if needed
     */
    prefilters = {},

    /* Transports bindings
     * 1) key is the dataType
     * 2) the catchall symbol "*" can be used
     * 3) selection will start with transport dataType and THEN go to "*" if needed
     */
    transports = {},

    // Document location
    ajaxLocation,

    // Document location segments
    ajaxLocParts,

    // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
    ajaxLocation = location.href;
} catch( e ) {
    // Use the href attribute of an A element
    // since IE will modify it given document.location
    ajaxLocation = document.createElement( "a" );
    ajaxLocation.href = "";
    ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

    // dataTypeExpression is optional and defaults to "*"
    return function( dataTypeExpression, func ) {

        if ( typeof dataTypeExpression !== "string" ) {
            func = dataTypeExpression;
            dataTypeExpression = "*";
        }

        if ( jQuery.isFunction( func ) ) {
            var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
                i = 0,
                length = dataTypes.length,
                dataType,
                list,
                placeBefore;

            // For each dataType in the dataTypeExpression
            for ( ; i < length; i++ ) {
                dataType = dataTypes[ i ];
                // We control if we're asked to add before
                // any existing element
                placeBefore = /^\+/.test( dataType );
                if ( placeBefore ) {
                    dataType = dataType.substr( 1 ) || "*";
                }
                list = structure[ dataType ] = structure[ dataType ] || [];
                // then we add to the structure accordingly
                list[ placeBefore ? "unshift" : "push" ]( func );
            }
        }
    };
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
        dataType /* internal */, inspected /* internal */ ) {

    dataType = dataType || options.dataTypes[ 0 ];
    inspected = inspected || {};

    inspected[ dataType ] = true;

    var list = structure[ dataType ],
        i = 0,
        length = list ? list.length : 0,
        executeOnly = ( structure === prefilters ),
        selection;

    for ( ; i < length && ( executeOnly || !selection ); i++ ) {
        selection = list[ i ]( options, originalOptions, jqXHR );
        // If we got redirected to another dataType
        // we try there if executing only and not done already
        if ( typeof selection === "string" ) {
            if ( !executeOnly || inspected[ selection ] ) {
                selection = undefined;
            } else {
                options.dataTypes.unshift( selection );
                selection = inspectPrefiltersOrTransports(
                        structure, options, originalOptions, jqXHR, selection, inspected );
            }
        }
    }
    // If we're only executing or nothing was selected
    // we try the catchall dataType if not done already
    if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
        selection = inspectPrefiltersOrTransports(
                structure, options, originalOptions, jqXHR, "*", inspected );
    }
    // unnecessary when only executing (prefilters)
    // but it'll be ignored by the caller in that case
    return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
    var key, deep,
        flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for ( key in src ) {
        if ( src[ key ] !== undefined ) {
            ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
        }
    }
    if ( deep ) {
        jQuery.extend( true, target, deep );
    }
}

jQuery.fn.extend({
    load: function( url, params, callback ) {
        if ( typeof url !== "string" && _load ) {
            return _load.apply( this, arguments );

        // Don't do a request if no elements are being requested
        } else if ( !this.length ) {
            return this;
        }

        var off = url.indexOf( " " );
        if ( off >= 0 ) {
            var selector = url.slice( off, url.length );
            url = url.slice( 0, off );
        }

        // Default to a GET request
        var type = "GET";

        // If the second parameter was provided
        if ( params ) {
            // If it's a function
            if ( jQuery.isFunction( params ) ) {
                // We assume that it's the callback
                callback = params;
                params = undefined;

            // Otherwise, build a param string
            } else if ( typeof params === "object" ) {
                params = jQuery.param( params, jQuery.ajaxSettings.traditional );
                type = "POST";
            }
        }

        var self = this;

        // Request the remote document
        jQuery.ajax({
            url: url,
            type: type,
            dataType: "html",
            data: params,
            // Complete callback (responseText is used internally)
            complete: function( jqXHR, status, responseText ) {
                // Store the response as specified by the jqXHR object
                responseText = jqXHR.responseText;
                // If successful, inject the HTML into all the matched elements
                if ( jqXHR.isResolved() ) {
                    // #4825: Get the actual response in case
                    // a dataFilter is present in ajaxSettings
                    jqXHR.done(function( r ) {
                        responseText = r;
                    });
                    // See if a selector was specified
                    self.html( selector ?
                        // Create a dummy div to hold the results
                        jQuery("<div>")
                            // inject the contents of the document in, removing the scripts
                            // to avoid any 'Permission Denied' errors in IE
                            .append(responseText.replace(rscript, ""))

                            // Locate the specified elements
                            .find(selector) :

                        // If not, just inject the full result
                        responseText );
                }

                if ( callback ) {
                    self.each( callback, [ responseText, status, jqXHR ] );
                }
            }
        });

        return this;
    },

    serialize: function() {
        return jQuery.param( this.serializeArray() );
    },

    serializeArray: function() {
        return this.map(function(){
            return this.elements ? jQuery.makeArray( this.elements ) : this;
        })
        .filter(function(){
            return this.name && !this.disabled &&
                ( this.checked || rselectTextarea.test( this.nodeName ) ||
                    rinput.test( this.type ) );
        })
        .map(function( i, elem ){
            var val = jQuery( this ).val();

            return val == null ?
                null :
                jQuery.isArray( val ) ?
                    jQuery.map( val, function( val, i ){
                        return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                    }) :
                    { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
        }).get();
    }
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
    jQuery.fn[ o ] = function( f ){
        return this.on( o, f );
    };
});

jQuery.each( [ "get", "post" ], function( i, method ) {
    jQuery[ method ] = function( url, data, callback, type ) {
        // shift arguments if data argument was omitted
        if ( jQuery.isFunction( data ) ) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return jQuery.ajax({
            type: method,
            url: url,
            data: data,
            success: callback,
            dataType: type
        });
    };
});

jQuery.extend({

    getScript: function( url, callback ) {
        return jQuery.get( url, undefined, callback, "script" );
    },

    getJSON: function( url, data, callback ) {
        return jQuery.get( url, data, callback, "json" );
    },

    // Creates a full fledged settings object into target
    // with both ajaxSettings and settings fields.
    // If target is omitted, writes into ajaxSettings.
    ajaxSetup: function( target, settings ) {
        if ( settings ) {
            // Building a settings object
            ajaxExtend( target, jQuery.ajaxSettings );
        } else {
            // Extending ajaxSettings
            settings = target;
            target = jQuery.ajaxSettings;
        }
        ajaxExtend( target, settings );
        return target;
    },

    ajaxSettings: {
        url: ajaxLocation,
        isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
        global: true,
        type: "GET",
        contentType: "application/x-www-form-urlencoded",
        processData: true,
        async: true,
        /*
        timeout: 0,
        data: null,
        dataType: null,
        username: null,
        password: null,
        cache: null,
        traditional: false,
        headers: {},
        */

        accepts: {
            xml: "application/xml, text/xml",
            html: "text/html",
            text: "text/plain",
            json: "application/json, text/javascript",
            "*": allTypes
        },

        contents: {
            xml: /xml/,
            html: /html/,
            json: /json/
        },

        responseFields: {
            xml: "responseXML",
            text: "responseText"
        },

        // List of data converters
        // 1) key format is "source_type destination_type" (a single space in-between)
        // 2) the catchall symbol "*" can be used for source_type
        converters: {

            // Convert anything to text
            "* text": window.String,

            // Text to html (true = no transformation)
            "text html": true,

            // Evaluate text as a json expression
            "text json": jQuery.parseJSON,

            // Parse text as xml
            "text xml": jQuery.parseXML
        },

        // For options that shouldn't be deep extended:
        // you can add your own custom options here if
        // and when you create one that shouldn't be
        // deep extended (see ajaxExtend)
        flatOptions: {
            context: true,
            url: true
        }
    },

    ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
    ajaxTransport: addToPrefiltersOrTransports( transports ),

    // Main method
    ajax: function( url, options ) {

        // If url is an object, simulate pre-1.5 signature
        if ( typeof url === "object" ) {
            options = url;
            url = undefined;
        }

        // Force options to be an object
        options = options || {};

        var // Create the final options object
            s = jQuery.ajaxSetup( {}, options ),
            // Callbacks context
            callbackContext = s.context || s,
            // Context for global events
            // It's the callbackContext if one was provided in the options
            // and if it's a DOM node or a jQuery collection
            globalEventContext = callbackContext !== s &&
                ( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
                        jQuery( callbackContext ) : jQuery.event,
            // Deferreds
            deferred = jQuery.Deferred(),
            completeDeferred = jQuery.Callbacks( "once memory" ),
            // Status-dependent callbacks
            statusCode = s.statusCode || {},
            // ifModified key
            ifModifiedKey,
            // Headers (they are sent all at once)
            requestHeaders = {},
            requestHeadersNames = {},
            // Response headers
            responseHeadersString,
            responseHeaders,
            // transport
            transport,
            // timeout handle
            timeoutTimer,
            // Cross-domain detection vars
            parts,
            // The jqXHR state
            state = 0,
            // To know if global events are to be dispatched
            fireGlobals,
            // Loop variable
            i,
            // Fake xhr
            jqXHR = {

                readyState: 0,

                // Caches the header
                setRequestHeader: function( name, value ) {
                    if ( !state ) {
                        var lname = name.toLowerCase();
                        name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                        requestHeaders[ name ] = value;
                    }
                    return this;
                },

                // Raw string
                getAllResponseHeaders: function() {
                    return state === 2 ? responseHeadersString : null;
                },

                // Builds headers hashtable if needed
                getResponseHeader: function( key ) {
                    var match;
                    if ( state === 2 ) {
                        if ( !responseHeaders ) {
                            responseHeaders = {};
                            while( ( match = rheaders.exec( responseHeadersString ) ) ) {
                                responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                            }
                        }
                        match = responseHeaders[ key.toLowerCase() ];
                    }
                    return match === undefined ? null : match;
                },

                // Overrides response content-type header
                overrideMimeType: function( type ) {
                    if ( !state ) {
                        s.mimeType = type;
                    }
                    return this;
                },

                // Cancel the request
                abort: function( statusText ) {
                    statusText = statusText || "abort";
                    if ( transport ) {
                        transport.abort( statusText );
                    }
                    done( 0, statusText );
                    return this;
                }
            };

        // Callback for when everything is done
        // It is defined here because jslint complains if it is declared
        // at the end of the function (which would be more logical and readable)
        function done( status, nativeStatusText, responses, headers ) {

            // Called once
            if ( state === 2 ) {
                return;
            }

            // State is "done" now
            state = 2;

            // Clear timeout if it exists
            if ( timeoutTimer ) {
                clearTimeout( timeoutTimer );
            }

            // Dereference transport for early garbage collection
            // (no matter how long the jqXHR object will be used)
            transport = undefined;

            // Cache response headers
            responseHeadersString = headers || "";

            // Set readyState
            jqXHR.readyState = status > 0 ? 4 : 0;

            var isSuccess,
                success,
                error,
                statusText = nativeStatusText,
                response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
                lastModified,
                etag;

            // If successful, handle type chaining
            if ( status >= 200 && status < 300 || status === 304 ) {

                // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                if ( s.ifModified ) {

                    if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
                        jQuery.lastModified[ ifModifiedKey ] = lastModified;
                    }
                    if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
                        jQuery.etag[ ifModifiedKey ] = etag;
                    }
                }

                // If not modified
                if ( status === 304 ) {

                    statusText = "notmodified";
                    isSuccess = true;

                // If we have data
                } else {

                    try {
                        success = ajaxConvert( s, response );
                        statusText = "success";
                        isSuccess = true;
                    } catch(e) {
                        // We have a parsererror
                        statusText = "parsererror";
                        error = e;
                    }
                }
            } else {
                // We extract error from statusText
                // then normalize statusText and status for non-aborts
                error = statusText;
                if ( !statusText || status ) {
                    statusText = "error";
                    if ( status < 0 ) {
                        status = 0;
                    }
                }
            }

            // Set data for the fake xhr object
            jqXHR.status = status;
            jqXHR.statusText = "" + ( nativeStatusText || statusText );

            // Success/Error
            if ( isSuccess ) {
                deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
            } else {
                deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
            }

            // Status-dependent callbacks
            jqXHR.statusCode( statusCode );
            statusCode = undefined;

            if ( fireGlobals ) {
                globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
                        [ jqXHR, s, isSuccess ? success : error ] );
            }

            // Complete
            completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

            if ( fireGlobals ) {
                globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
                // Handle the global AJAX counter
                if ( !( --jQuery.active ) ) {
                    jQuery.event.trigger( "ajaxStop" );
                }
            }
        }

        // Attach deferreds
        deferred.promise( jqXHR );
        jqXHR.success = jqXHR.done;
        jqXHR.error = jqXHR.fail;
        jqXHR.complete = completeDeferred.add;

        // Status-dependent callbacks
        jqXHR.statusCode = function( map ) {
            if ( map ) {
                var tmp;
                if ( state < 2 ) {
                    for ( tmp in map ) {
                        statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
                    }
                } else {
                    tmp = map[ jqXHR.status ];
                    jqXHR.then( tmp, tmp );
                }
            }
            return this;
        };

        // Remove hash character (#7531: and string promotion)
        // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
        // We also use the url parameter if available
        s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

        // Extract dataTypes list
        s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

        // Determine if a cross-domain request is in order
        if ( s.crossDomain == null ) {
            parts = rurl.exec( s.url.toLowerCase() );
            s.crossDomain = !!( parts &&
                ( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
                    ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
                        ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
            );
        }

        // Convert data if not already a string
        if ( s.data && s.processData && typeof s.data !== "string" ) {
            s.data = jQuery.param( s.data, s.traditional );
        }

        // Apply prefilters
        inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

        // If request was aborted inside a prefiler, stop there
        if ( state === 2 ) {
            return false;
        }

        // We can fire global events as of now if asked to
        fireGlobals = s.global;

        // Uppercase the type
        s.type = s.type.toUpperCase();

        // Determine if request has content
        s.hasContent = !rnoContent.test( s.type );

        // Watch for a new set of requests
        if ( fireGlobals && jQuery.active++ === 0 ) {
            jQuery.event.trigger( "ajaxStart" );
        }

        // More options handling for requests with no content
        if ( !s.hasContent ) {

            // If data is available, append data to url
            if ( s.data ) {
                s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
                // #9682: remove data so that it's not used in an eventual retry
                delete s.data;
            }

            // Get ifModifiedKey before adding the anti-cache parameter
            ifModifiedKey = s.url;

            // Add anti-cache in url if needed
            if ( s.cache === false ) {

                var ts = jQuery.now(),
                    // try replacing _= if it is there
                    ret = s.url.replace( rts, "$1_=" + ts );

                // if nothing was replaced, add timestamp to the end
                s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
            }
        }

        // Set the correct header, if data is being sent
        if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
            jqXHR.setRequestHeader( "Content-Type", s.contentType );
        }

        // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
        if ( s.ifModified ) {
            ifModifiedKey = ifModifiedKey || s.url;
            if ( jQuery.lastModified[ ifModifiedKey ] ) {
                jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
            }
            if ( jQuery.etag[ ifModifiedKey ] ) {
                jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
            }
        }

        // Set the Accepts header for the server, depending on the dataType
        jqXHR.setRequestHeader(
            "Accept",
            s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
                s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
                s.accepts[ "*" ]
        );

        // Check for headers option
        for ( i in s.headers ) {
            jqXHR.setRequestHeader( i, s.headers[ i ] );
        }

        // Allow custom headers/mimetypes and early abort
        if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
                // Abort if not done already
                jqXHR.abort();
                return false;

        }

        // Install callbacks on deferreds
        for ( i in { success: 1, error: 1, complete: 1 } ) {
            jqXHR[ i ]( s[ i ] );
        }

        // Get transport
        transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

        // If no transport, we auto-abort
        if ( !transport ) {
            done( -1, "No Transport" );
        } else {
            jqXHR.readyState = 1;
            // Send global event
            if ( fireGlobals ) {
                globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
            }
            // Timeout
            if ( s.async && s.timeout > 0 ) {
                timeoutTimer = setTimeout( function(){
                    jqXHR.abort( "timeout" );
                }, s.timeout );
            }

            try {
                state = 1;
                transport.send( requestHeaders, done );
            } catch (e) {
                // Propagate exception as error if not done
                if ( state < 2 ) {
                    done( -1, e );
                // Simply rethrow otherwise
                } else {
                    throw e;
                }
            }
        }

        return jqXHR;
    },

    // Serialize an array of form elements or a set of
    // key/values into a query string
    param: function( a, traditional ) {
        var s = [],
            add = function( key, value ) {
                // If value is a function, invoke it and return its value
                value = jQuery.isFunction( value ) ? value() : value;
                s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
            };

        // Set traditional to true for jQuery <= 1.3.2 behavior.
        if ( traditional === undefined ) {
            traditional = jQuery.ajaxSettings.traditional;
        }

        // If an array was passed in, assume that it is an array of form elements.
        if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
            // Serialize the form elements
            jQuery.each( a, function() {
                add( this.name, this.value );
            });

        } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for ( var prefix in a ) {
                buildParams( prefix, a[ prefix ], traditional, add );
            }
        }

        // Return the resulting serialization
        return s.join( "&" ).replace( r20, "+" );
    }
});

function buildParams( prefix, obj, traditional, add ) {
    if ( jQuery.isArray( obj ) ) {
        // Serialize array item.
        jQuery.each( obj, function( i, v ) {
            if ( traditional || rbracket.test( prefix ) ) {
                // Treat each array item as a scalar.
                add( prefix, v );

            } else {
                // If array item is non-scalar (array or object), encode its
                // numeric index to resolve deserialization ambiguity issues.
                // Note that rack (as of 1.0.0) can't currently deserialize
                // nested arrays properly, and attempting to do so may cause
                // a server error. Possible fixes are to modify rack's
                // deserialization algorithm or to provide an option or flag
                // to force array serialization to be shallow.
                buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
            }
        });

    } else if ( !traditional && obj != null && typeof obj === "object" ) {
        // Serialize object item.
        for ( var name in obj ) {
            buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
        }

    } else {
        // Serialize scalar item.
        add( prefix, obj );
    }
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

    // Counter for holding the number of active queries
    active: 0,

    // Last-Modified header cache for next request
    lastModified: {},
    etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

    var contents = s.contents,
        dataTypes = s.dataTypes,
        responseFields = s.responseFields,
        ct,
        type,
        finalDataType,
        firstDataType;

    // Fill responseXXX fields
    for ( type in responseFields ) {
        if ( type in responses ) {
            jqXHR[ responseFields[type] ] = responses[ type ];
        }
    }

    // Remove auto dataType and get content-type in the process
    while( dataTypes[ 0 ] === "*" ) {
        dataTypes.shift();
        if ( ct === undefined ) {
            ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
        }
    }

    // Check if we're dealing with a known content-type
    if ( ct ) {
        for ( type in contents ) {
            if ( contents[ type ] && contents[ type ].test( ct ) ) {
                dataTypes.unshift( type );
                break;
            }
        }
    }

    // Check to see if we have a response for the expected dataType
    if ( dataTypes[ 0 ] in responses ) {
        finalDataType = dataTypes[ 0 ];
    } else {
        // Try convertible dataTypes
        for ( type in responses ) {
            if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
                finalDataType = type;
                break;
            }
            if ( !firstDataType ) {
                firstDataType = type;
            }
        }
        // Or just use first one
        finalDataType = finalDataType || firstDataType;
    }

    // If we found a dataType
    // We add the dataType to the list if needed
    // and return the corresponding response
    if ( finalDataType ) {
        if ( finalDataType !== dataTypes[ 0 ] ) {
            dataTypes.unshift( finalDataType );
        }
        return responses[ finalDataType ];
    }
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

    // Apply the dataFilter if provided
    if ( s.dataFilter ) {
        response = s.dataFilter( response, s.dataType );
    }

    var dataTypes = s.dataTypes,
        converters = {},
        i,
        key,
        length = dataTypes.length,
        tmp,
        // Current and previous dataTypes
        current = dataTypes[ 0 ],
        prev,
        // Conversion expression
        conversion,
        // Conversion function
        conv,
        // Conversion functions (transitive conversion)
        conv1,
        conv2;

    // For each dataType in the chain
    for ( i = 1; i < length; i++ ) {

        // Create converters map
        // with lowercased keys
        if ( i === 1 ) {
            for ( key in s.converters ) {
                if ( typeof key === "string" ) {
                    converters[ key.toLowerCase() ] = s.converters[ key ];
                }
            }
        }

        // Get the dataTypes
        prev = current;
        current = dataTypes[ i ];

        // If current is auto dataType, update it to prev
        if ( current === "*" ) {
            current = prev;
        // If no auto and dataTypes are actually different
        } else if ( prev !== "*" && prev !== current ) {

            // Get the converter
            conversion = prev + " " + current;
            conv = converters[ conversion ] || converters[ "* " + current ];

            // If there is no direct converter, search transitively
            if ( !conv ) {
                conv2 = undefined;
                for ( conv1 in converters ) {
                    tmp = conv1.split( " " );
                    if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
                        conv2 = converters[ tmp[1] + " " + current ];
                        if ( conv2 ) {
                            conv1 = converters[ conv1 ];
                            if ( conv1 === true ) {
                                conv = conv2;
                            } else if ( conv2 === true ) {
                                conv = conv1;
                            }
                            break;
                        }
                    }
                }
            }
            // If we found no converter, dispatch an error
            if ( !( conv || conv2 ) ) {
                jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
            }
            // If found converter is not an equivalence
            if ( conv !== true ) {
                // Convert with 1 or 2 converters accordingly
                response = conv ? conv( response ) : conv2( conv1(response) );
            }
        }
    }
    return response;
}




var jsc = jQuery.now(),
    jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
        return jQuery.expando + "_" + ( jsc++ );
    }
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

    var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
        ( typeof s.data === "string" );

    if ( s.dataTypes[ 0 ] === "jsonp" ||
        s.jsonp !== false && ( jsre.test( s.url ) ||
                inspectData && jsre.test( s.data ) ) ) {

        var responseContainer,
            jsonpCallback = s.jsonpCallback =
                jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
            previous = window[ jsonpCallback ],
            url = s.url,
            data = s.data,
            replace = "$1" + jsonpCallback + "$2";

        if ( s.jsonp !== false ) {
            url = url.replace( jsre, replace );
            if ( s.url === url ) {
                if ( inspectData ) {
                    data = data.replace( jsre, replace );
                }
                if ( s.data === data ) {
                    // Add callback manually
                    url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
                }
            }
        }

        s.url = url;
        s.data = data;

        // Install callback
        window[ jsonpCallback ] = function( response ) {
            responseContainer = [ response ];
        };

        // Clean-up function
        jqXHR.always(function() {
            // Set callback back to previous value
            window[ jsonpCallback ] = previous;
            // Call if it was a function and we have a response
            if ( responseContainer && jQuery.isFunction( previous ) ) {
                window[ jsonpCallback ]( responseContainer[ 0 ] );
            }
        });

        // Use data converter to retrieve json after script execution
        s.converters["script json"] = function() {
            if ( !responseContainer ) {
                jQuery.error( jsonpCallback + " was not called" );
            }
            return responseContainer[ 0 ];
        };

        // force json dataType
        s.dataTypes[ 0 ] = "json";

        // Delegate to script
        return "script";
    }
});




// Install script dataType
jQuery.ajaxSetup({
    accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
        script: /javascript|ecmascript/
    },
    converters: {
        "text script": function( text ) {
            jQuery.globalEval( text );
            return text;
        }
    }
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
    if ( s.cache === undefined ) {
        s.cache = false;
    }
    if ( s.crossDomain ) {
        s.type = "GET";
        s.global = false;
    }
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

    // This transport only deals with cross domain requests
    if ( s.crossDomain ) {

        var script,
            head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

        return {

            send: function( _, callback ) {

                script = document.createElement( "script" );

                script.async = "async";

                if ( s.scriptCharset ) {
                    script.charset = s.scriptCharset;
                }

                script.src = s.url;

                // Attach handlers for all browsers
                script.onload = script.onreadystatechange = function( _, isAbort ) {

                    if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

                        // Handle memory leak in IE
                        script.onload = script.onreadystatechange = null;

                        // Remove the script
                        if ( head && script.parentNode ) {
                            head.removeChild( script );
                        }

                        // Dereference the script
                        script = undefined;

                        // Callback if not abort
                        if ( !isAbort ) {
                            callback( 200, "success" );
                        }
                    }
                };
                // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                // This arises when a base node is used (#2709 and #4378).
                head.insertBefore( script, head.firstChild );
            },

            abort: function() {
                if ( script ) {
                    script.onload( 0, 1 );
                }
            }
        };
    }
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
    xhrOnUnloadAbort = window.ActiveXObject ? function() {
        // Abort all pending requests
        for ( var key in xhrCallbacks ) {
            xhrCallbacks[ key ]( 0, 1 );
        }
    } : false,
    xhrId = 0,
    xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
    try {
        return new window.XMLHttpRequest();
    } catch( e ) {}
}

function createActiveXHR() {
    try {
        return new window.ActiveXObject( "Microsoft.XMLHTTP" );
    } catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
    /* Microsoft failed to properly
     * implement the XMLHttpRequest in IE7 (can't request local files),
     * so we use the ActiveXObject when it is available
     * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
     * we need a fallback.
     */
    function() {
        return !this.isLocal && createStandardXHR() || createActiveXHR();
    } :
    // For all other browsers, use the standard XMLHttpRequest object
    createStandardXHR;

// Determine support properties
(function( xhr ) {
    jQuery.extend( jQuery.support, {
        ajax: !!xhr,
        cors: !!xhr && ( "withCredentials" in xhr )
    });
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

    jQuery.ajaxTransport(function( s ) {
        // Cross domain only allowed if supported through XMLHttpRequest
        if ( !s.crossDomain || jQuery.support.cors ) {

            var callback;

            return {
                send: function( headers, complete ) {

                    // Get a new xhr
                    var xhr = s.xhr(),
                        handle,
                        i;

                    // Open the socket
                    // Passing null username, generates a login popup on Opera (#2865)
                    if ( s.username ) {
                        xhr.open( s.type, s.url, s.async, s.username, s.password );
                    } else {
                        xhr.open( s.type, s.url, s.async );
                    }

                    // Apply custom fields if provided
                    if ( s.xhrFields ) {
                        for ( i in s.xhrFields ) {
                            xhr[ i ] = s.xhrFields[ i ];
                        }
                    }

                    // Override mime type if needed
                    if ( s.mimeType && xhr.overrideMimeType ) {
                        xhr.overrideMimeType( s.mimeType );
                    }

                    // X-Requested-With header
                    // For cross-domain requests, seeing as conditions for a preflight are
                    // akin to a jigsaw puzzle, we simply never set it to be sure.
                    // (it can always be set on a per-request basis or even using ajaxSetup)
                    // For same-domain requests, won't change header if already provided.
                    if ( !s.crossDomain && !headers["X-Requested-With"] ) {
                        headers[ "X-Requested-With" ] = "XMLHttpRequest";
                    }

                    // Need an extra try/catch for cross domain requests in Firefox 3
                    try {
                        for ( i in headers ) {
                            xhr.setRequestHeader( i, headers[ i ] );
                        }
                    } catch( _ ) {}

                    // Do send the request
                    // This may raise an exception which is actually
                    // handled in jQuery.ajax (so no try/catch here)
                    xhr.send( ( s.hasContent && s.data ) || null );

                    // Listener
                    callback = function( _, isAbort ) {

                        var status,
                            statusText,
                            responseHeaders,
                            responses,
                            xml;

                        // Firefox throws exceptions when accessing properties
                        // of an xhr when a network error occured
                        // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                        try {

                            // Was never called and is aborted or complete
                            if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                                // Only called once
                                callback = undefined;

                                // Do not keep as active anymore
                                if ( handle ) {
                                    xhr.onreadystatechange = jQuery.noop;
                                    if ( xhrOnUnloadAbort ) {
                                        delete xhrCallbacks[ handle ];
                                    }
                                }

                                // If it's an abort
                                if ( isAbort ) {
                                    // Abort it manually if needed
                                    if ( xhr.readyState !== 4 ) {
                                        xhr.abort();
                                    }
                                } else {
                                    status = xhr.status;
                                    responseHeaders = xhr.getAllResponseHeaders();
                                    responses = {};
                                    xml = xhr.responseXML;

                                    // Construct response list
                                    if ( xml && xml.documentElement /* #4958 */ ) {
                                        responses.xml = xml;
                                    }
                                    responses.text = xhr.responseText;

                                    // Firefox throws an exception when accessing
                                    // statusText for faulty cross-domain requests
                                    try {
                                        statusText = xhr.statusText;
                                    } catch( e ) {
                                        // We normalize with Webkit giving an empty statusText
                                        statusText = "";
                                    }

                                    // Filter status for non standard behaviors

                                    // If the request is local and we have data: assume a success
                                    // (success with no data won't get notified, that's the best we
                                    // can do given current implementations)
                                    if ( !status && s.isLocal && !s.crossDomain ) {
                                        status = responses.text ? 200 : 404;
                                    // IE - #1450: sometimes returns 1223 when it should be 204
                                    } else if ( status === 1223 ) {
                                        status = 204;
                                    }
                                }
                            }
                        } catch( firefoxAccessException ) {
                            if ( !isAbort ) {
                                complete( -1, firefoxAccessException );
                            }
                        }

                        // Call complete if needed
                        if ( responses ) {
                            complete( status, statusText, responses, responseHeaders );
                        }
                    };

                    // if we're in sync mode or it's in cache
                    // and has been retrieved directly (IE6 & IE7)
                    // we need to manually fire the callback
                    if ( !s.async || xhr.readyState === 4 ) {
                        callback();
                    } else {
                        handle = ++xhrId;
                        if ( xhrOnUnloadAbort ) {
                            // Create the active xhrs callbacks list if needed
                            // and attach the unload handler
                            if ( !xhrCallbacks ) {
                                xhrCallbacks = {};
                                jQuery( window ).unload( xhrOnUnloadAbort );
                            }
                            // Add to list of active xhrs callbacks
                            xhrCallbacks[ handle ] = callback;
                        }
                        xhr.onreadystatechange = callback;
                    }
                },

                abort: function() {
                    if ( callback ) {
                        callback(0,1);
                    }
                }
            };
        }
    });
}




var elemdisplay = {},
    iframe, iframeDoc,
    rfxtypes = /^(?:toggle|show|hide)$/,
    rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
    timerId,
    fxAttrs = [
        // height animations
        [ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
        // width animations
        [ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
        // opacity animations
        [ "opacity" ]
    ],
    fxNow;

jQuery.fn.extend({
    show: function( speed, easing, callback ) {
        var elem, display;

        if ( speed || speed === 0 ) {
            return this.animate( genFx("show", 3), speed, easing, callback );

        } else {
            for ( var i = 0, j = this.length; i < j; i++ ) {
                elem = this[ i ];

                if ( elem.style ) {
                    display = elem.style.display;

                    // Reset the inline display of this element to learn if it is
                    // being hidden by cascaded rules or not
                    if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
                        display = elem.style.display = "";
                    }

                    // Set elements which have been overridden with display: none
                    // in a stylesheet to whatever the default browser style is
                    // for such an element
                    if ( display === "" && jQuery.css(elem, "display") === "none" ) {
                        jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
                    }
                }
            }

            // Set the display of most of the elements in a second loop
            // to avoid the constant reflow
            for ( i = 0; i < j; i++ ) {
                elem = this[ i ];

                if ( elem.style ) {
                    display = elem.style.display;

                    if ( display === "" || display === "none" ) {
                        elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
                    }
                }
            }

            return this;
        }
    },

    hide: function( speed, easing, callback ) {
        if ( speed || speed === 0 ) {
            return this.animate( genFx("hide", 3), speed, easing, callback);

        } else {
            var elem, display,
                i = 0,
                j = this.length;

            for ( ; i < j; i++ ) {
                elem = this[i];
                if ( elem.style ) {
                    display = jQuery.css( elem, "display" );

                    if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
                        jQuery._data( elem, "olddisplay", display );
                    }
                }
            }

            // Set the display of the elements in a second loop
            // to avoid the constant reflow
            for ( i = 0; i < j; i++ ) {
                if ( this[i].style ) {
                    this[i].style.display = "none";
                }
            }

            return this;
        }
    },

    // Save the old toggle function
    _toggle: jQuery.fn.toggle,

    toggle: function( fn, fn2, callback ) {
        var bool = typeof fn === "boolean";

        if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
            this._toggle.apply( this, arguments );

        } else if ( fn == null || bool ) {
            this.each(function() {
                var state = bool ? fn : jQuery(this).is(":hidden");
                jQuery(this)[ state ? "show" : "hide" ]();
            });

        } else {
            this.animate(genFx("toggle", 3), fn, fn2, callback);
        }

        return this;
    },

    fadeTo: function( speed, to, easing, callback ) {
        return this.filter(":hidden").css("opacity", 0).show().end()
                    .animate({opacity: to}, speed, easing, callback);
    },

    animate: function( prop, speed, easing, callback ) {
        var optall = jQuery.speed( speed, easing, callback );

        if ( jQuery.isEmptyObject( prop ) ) {
            return this.each( optall.complete, [ false ] );
        }

        // Do not change referenced properties as per-property easing will be lost
        prop = jQuery.extend( {}, prop );

        function doAnimation() {
            // XXX 'this' does not always have a nodeName when running the
            // test suite

            if ( optall.queue === false ) {
                jQuery._mark( this );
            }

            var opt = jQuery.extend( {}, optall ),
                isElement = this.nodeType === 1,
                hidden = isElement && jQuery(this).is(":hidden"),
                name, val, p, e,
                parts, start, end, unit,
                method;

            // will store per property easing and be used to determine when an animation is complete
            opt.animatedProperties = {};

            for ( p in prop ) {

                // property name normalization
                name = jQuery.camelCase( p );
                if ( p !== name ) {
                    prop[ name ] = prop[ p ];
                    delete prop[ p ];
                }

                val = prop[ name ];

                // easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
                if ( jQuery.isArray( val ) ) {
                    opt.animatedProperties[ name ] = val[ 1 ];
                    val = prop[ name ] = val[ 0 ];
                } else {
                    opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
                }

                if ( val === "hide" && hidden || val === "show" && !hidden ) {
                    return opt.complete.call( this );
                }

                if ( isElement && ( name === "height" || name === "width" ) ) {
                    // Make sure that nothing sneaks out
                    // Record all 3 overflow attributes because IE does not
                    // change the overflow attribute when overflowX and
                    // overflowY are set to the same value
                    opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

                    // Set display property to inline-block for height/width
                    // animations on inline elements that are having width/height animated
                    if ( jQuery.css( this, "display" ) === "inline" &&
                            jQuery.css( this, "float" ) === "none" ) {

                        // inline-level elements accept inline-block;
                        // block-level elements need to be inline with layout
                        if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
                            this.style.display = "inline-block";

                        } else {
                            this.style.zoom = 1;
                        }
                    }
                }
            }

            if ( opt.overflow != null ) {
                this.style.overflow = "hidden";
            }

            for ( p in prop ) {
                e = new jQuery.fx( this, opt, p );
                val = prop[ p ];

                if ( rfxtypes.test( val ) ) {

                    // Tracks whether to show or hide based on private
                    // data attached to the element
                    method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
                    if ( method ) {
                        jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
                        e[ method ]();
                    } else {
                        e[ val ]();
                    }

                } else {
                    parts = rfxnum.exec( val );
                    start = e.cur();

                    if ( parts ) {
                        end = parseFloat( parts[2] );
                        unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

                        // We need to compute starting value
                        if ( unit !== "px" ) {
                            jQuery.style( this, p, (end || 1) + unit);
                            start = ( (end || 1) / e.cur() ) * start;
                            jQuery.style( this, p, start + unit);
                        }

                        // If a +=/-= token was provided, we're doing a relative animation
                        if ( parts[1] ) {
                            end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
                        }

                        e.custom( start, end, unit );

                    } else {
                        e.custom( start, val, "" );
                    }
                }
            }

            // For JS strict compliance
            return true;
        }

        return optall.queue === false ?
            this.each( doAnimation ) :
            this.queue( optall.queue, doAnimation );
    },

    stop: function( type, clearQueue, gotoEnd ) {
        if ( typeof type !== "string" ) {
            gotoEnd = clearQueue;
            clearQueue = type;
            type = undefined;
        }
        if ( clearQueue && type !== false ) {
            this.queue( type || "fx", [] );
        }

        return this.each(function() {
            var index,
                hadTimers = false,
                timers = jQuery.timers,
                data = jQuery._data( this );

            // clear marker counters if we know they won't be
            if ( !gotoEnd ) {
                jQuery._unmark( true, this );
            }

            function stopQueue( elem, data, index ) {
                var hooks = data[ index ];
                jQuery.removeData( elem, index, true );
                hooks.stop( gotoEnd );
            }

            if ( type == null ) {
                for ( index in data ) {
                    if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
                        stopQueue( this, data, index );
                    }
                }
            } else if ( data[ index = type + ".run" ] && data[ index ].stop ){
                stopQueue( this, data, index );
            }

            for ( index = timers.length; index--; ) {
                if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
                    if ( gotoEnd ) {

                        // force the next step to be the last
                        timers[ index ]( true );
                    } else {
                        timers[ index ].saveState();
                    }
                    hadTimers = true;
                    timers.splice( index, 1 );
                }
            }

            // start the next in the queue if the last step wasn't forced
            // timers currently will call their complete callbacks, which will dequeue
            // but only if they were gotoEnd
            if ( !( gotoEnd && hadTimers ) ) {
                jQuery.dequeue( this, type );
            }
        });
    }

});

// Animations created synchronously will run synchronously
function createFxNow() {
    setTimeout( clearFxNow, 0 );
    return ( fxNow = jQuery.now() );
}

function clearFxNow() {
    fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
    var obj = {};

    jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
        obj[ this ] = type;
    });

    return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
    slideDown: genFx( "show", 1 ),
    slideUp: genFx( "hide", 1 ),
    slideToggle: genFx( "toggle", 1 ),
    fadeIn: { opacity: "show" },
    fadeOut: { opacity: "hide" },
    fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
    jQuery.fn[ name ] = function( speed, easing, callback ) {
        return this.animate( props, speed, easing, callback );
    };
});

jQuery.extend({
    speed: function( speed, easing, fn ) {
        var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
            complete: fn || !fn && easing ||
                jQuery.isFunction( speed ) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
        };

        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
            opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

        // normalize opt.queue - true/undefined/null -> "fx"
        if ( opt.queue == null || opt.queue === true ) {
            opt.queue = "fx";
        }

        // Queueing
        opt.old = opt.complete;

        opt.complete = function( noUnmark ) {
            if ( jQuery.isFunction( opt.old ) ) {
                opt.old.call( this );
            }

            if ( opt.queue ) {
                jQuery.dequeue( this, opt.queue );
            } else if ( noUnmark !== false ) {
                jQuery._unmark( this );
            }
        };

        return opt;
    },

    easing: {
        linear: function( p, n, firstNum, diff ) {
            return firstNum + diff * p;
        },
        swing: function( p, n, firstNum, diff ) {
            return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
        }
    },

    timers: [],

    fx: function( elem, options, prop ) {
        this.options = options;
        this.elem = elem;
        this.prop = prop;

        options.orig = options.orig || {};
    }

});

jQuery.fx.prototype = {
    // Simple function for setting a style value
    update: function() {
        if ( this.options.step ) {
            this.options.step.call( this.elem, this.now, this );
        }

        ( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
    },

    // Get the current size
    cur: function() {
        if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
            return this.elem[ this.prop ];
        }

        var parsed,
            r = jQuery.css( this.elem, this.prop );
        // Empty strings, null, undefined and "auto" are converted to 0,
        // complex values such as "rotate(1rad)" are returned as is,
        // simple values such as "10px" are parsed to Float.
        return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
    },

    // Start an animation from one number to another
    custom: function( from, to, unit ) {
        var self = this,
            fx = jQuery.fx;

        this.startTime = fxNow || createFxNow();
        this.end = to;
        this.now = this.start = from;
        this.pos = this.state = 0;
        this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

        function t( gotoEnd ) {
            return self.step( gotoEnd );
        }

        t.queue = this.options.queue;
        t.elem = this.elem;
        t.saveState = function() {
            if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
                jQuery._data( self.elem, "fxshow" + self.prop, self.start );
            }
        };

        if ( t() && jQuery.timers.push(t) && !timerId ) {
            timerId = setInterval( fx.tick, fx.interval );
        }
    },

    // Simple 'show' function
    show: function() {
        var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

        // Remember where we started, so that we can go back to it later
        this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
        this.options.show = true;

        // Begin the animation
        // Make sure that we start at a small width/height to avoid any flash of content
        if ( dataShow !== undefined ) {
            // This show is picking up where a previous hide or show left off
            this.custom( this.cur(), dataShow );
        } else {
            this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
        }

        // Start by showing the element
        jQuery( this.elem ).show();
    },

    // Simple 'hide' function
    hide: function() {
        // Remember where we started, so that we can go back to it later
        this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
        this.options.hide = true;

        // Begin the animation
        this.custom( this.cur(), 0 );
    },

    // Each step of an animation
    step: function( gotoEnd ) {
        var p, n, complete,
            t = fxNow || createFxNow(),
            done = true,
            elem = this.elem,
            options = this.options;

        if ( gotoEnd || t >= options.duration + this.startTime ) {
            this.now = this.end;
            this.pos = this.state = 1;
            this.update();

            options.animatedProperties[ this.prop ] = true;

            for ( p in options.animatedProperties ) {
                if ( options.animatedProperties[ p ] !== true ) {
                    done = false;
                }
            }

            if ( done ) {
                // Reset the overflow
                if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

                    jQuery.each( [ "", "X", "Y" ], function( index, value ) {
                        elem.style[ "overflow" + value ] = options.overflow[ index ];
                    });
                }

                // Hide the element if the "hide" operation was done
                if ( options.hide ) {
                    jQuery( elem ).hide();
                }

                // Reset the properties, if the item has been hidden or shown
                if ( options.hide || options.show ) {
                    for ( p in options.animatedProperties ) {
                        jQuery.style( elem, p, options.orig[ p ] );
                        jQuery.removeData( elem, "fxshow" + p, true );
                        // Toggle data is no longer needed
                        jQuery.removeData( elem, "toggle" + p, true );
                    }
                }

                // Execute the complete function
                // in the event that the complete function throws an exception
                // we must ensure it won't be called twice. #5684

                complete = options.complete;
                if ( complete ) {

                    options.complete = false;
                    complete.call( elem );
                }
            }

            return false;

        } else {
            // classical easing cannot be used with an Infinity duration
            if ( options.duration == Infinity ) {
                this.now = t;
            } else {
                n = t - this.startTime;
                this.state = n / options.duration;

                // Perform the easing function, defaults to swing
                this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
                this.now = this.start + ( (this.end - this.start) * this.pos );
            }
            // Perform the next step of the animation
            this.update();
        }

        return true;
    }
};

jQuery.extend( jQuery.fx, {
    tick: function() {
        var timer,
            timers = jQuery.timers,
            i = 0;

        for ( ; i < timers.length; i++ ) {
            timer = timers[ i ];
            // Checks the timer has not already been removed
            if ( !timer() && timers[ i ] === timer ) {
                timers.splice( i--, 1 );
            }
        }

        if ( !timers.length ) {
            jQuery.fx.stop();
        }
    },

    interval: 13,

    stop: function() {
        clearInterval( timerId );
        timerId = null;
    },

    speeds: {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    },

    step: {
        opacity: function( fx ) {
            jQuery.style( fx.elem, "opacity", fx.now );
        },

        _default: function( fx ) {
            if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
                fx.elem.style[ fx.prop ] = fx.now + fx.unit;
            } else {
                fx.elem[ fx.prop ] = fx.now;
            }
        }
    }
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
    jQuery.fx.step[ prop ] = function( fx ) {
        jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
    };
});

if ( jQuery.expr && jQuery.expr.filters ) {
    jQuery.expr.filters.animated = function( elem ) {
        return jQuery.grep(jQuery.timers, function( fn ) {
            return elem === fn.elem;
        }).length;
    };
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

    if ( !elemdisplay[ nodeName ] ) {

        var body = document.body,
            elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
            display = elem.css( "display" );
        elem.remove();

        // If the simple way fails,
        // get element's real default display by attaching it to a temp iframe
        if ( display === "none" || display === "" ) {
            // No iframe to use yet, so create it
            if ( !iframe ) {
                iframe = document.createElement( "iframe" );
                iframe.frameBorder = iframe.width = iframe.height = 0;
            }

            body.appendChild( iframe );

            // Create a cacheable copy of the iframe document on first call.
            // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
            // document to it; WebKit & Firefox won't allow reusing the iframe document.
            if ( !iframeDoc || !iframe.createElement ) {
                iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
                iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
                iframeDoc.close();
            }

            elem = iframeDoc.createElement( nodeName );

            iframeDoc.body.appendChild( elem );

            display = jQuery.css( elem, "display" );
            body.removeChild( iframe );
        }

        // Store the correct default display
        elemdisplay[ nodeName ] = display;
    }

    return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
    rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
    jQuery.fn.offset = function( options ) {
        var elem = this[0], box;

        if ( options ) {
            return this.each(function( i ) {
                jQuery.offset.setOffset( this, options, i );
            });
        }

        if ( !elem || !elem.ownerDocument ) {
            return null;
        }

        if ( elem === elem.ownerDocument.body ) {
            return jQuery.offset.bodyOffset( elem );
        }

        try {
            box = elem.getBoundingClientRect();
        } catch(e) {}

        var doc = elem.ownerDocument,
            docElem = doc.documentElement;

        // Make sure we're not dealing with a disconnected DOM node
        if ( !box || !jQuery.contains( docElem, elem ) ) {
            return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
        }

        var body = doc.body,
            win = getWindow(doc),
            clientTop  = docElem.clientTop  || body.clientTop  || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0,
            scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
            scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
            top  = box.top  + scrollTop  - clientTop,
            left = box.left + scrollLeft - clientLeft;

        return { top: top, left: left };
    };

} else {
    jQuery.fn.offset = function( options ) {
        var elem = this[0];

        if ( options ) {
            return this.each(function( i ) {
                jQuery.offset.setOffset( this, options, i );
            });
        }

        if ( !elem || !elem.ownerDocument ) {
            return null;
        }

        if ( elem === elem.ownerDocument.body ) {
            return jQuery.offset.bodyOffset( elem );
        }

        var computedStyle,
            offsetParent = elem.offsetParent,
            prevOffsetParent = elem,
            doc = elem.ownerDocument,
            docElem = doc.documentElement,
            body = doc.body,
            defaultView = doc.defaultView,
            prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
            top = elem.offsetTop,
            left = elem.offsetLeft;

        while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
            if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
                break;
            }

            computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
            top  -= elem.scrollTop;
            left -= elem.scrollLeft;

            if ( elem === offsetParent ) {
                top  += elem.offsetTop;
                left += elem.offsetLeft;

                if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
                    top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
                    left += parseFloat( computedStyle.borderLeftWidth ) || 0;
                }

                prevOffsetParent = offsetParent;
                offsetParent = elem.offsetParent;
            }

            if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
                top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
                left += parseFloat( computedStyle.borderLeftWidth ) || 0;
            }

            prevComputedStyle = computedStyle;
        }

        if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
            top  += body.offsetTop;
            left += body.offsetLeft;
        }

        if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
            top  += Math.max( docElem.scrollTop, body.scrollTop );
            left += Math.max( docElem.scrollLeft, body.scrollLeft );
        }

        return { top: top, left: left };
    };
}

jQuery.offset = {

    bodyOffset: function( body ) {
        var top = body.offsetTop,
            left = body.offsetLeft;

        if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
            top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
            left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
        }

        return { top: top, left: left };
    },

    setOffset: function( elem, options, i ) {
        var position = jQuery.css( elem, "position" );

        // set position first, in-case top/left are set even on static elem
        if ( position === "static" ) {
            elem.style.position = "relative";
        }

        var curElem = jQuery( elem ),
            curOffset = curElem.offset(),
            curCSSTop = jQuery.css( elem, "top" ),
            curCSSLeft = jQuery.css( elem, "left" ),
            calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
            props = {}, curPosition = {}, curTop, curLeft;

        // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
        if ( calculatePosition ) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;
        } else {
            curTop = parseFloat( curCSSTop ) || 0;
            curLeft = parseFloat( curCSSLeft ) || 0;
        }

        if ( jQuery.isFunction( options ) ) {
            options = options.call( elem, i, curOffset );
        }

        if ( options.top != null ) {
            props.top = ( options.top - curOffset.top ) + curTop;
        }
        if ( options.left != null ) {
            props.left = ( options.left - curOffset.left ) + curLeft;
        }

        if ( "using" in options ) {
            options.using.call( elem, props );
        } else {
            curElem.css( props );
        }
    }
};


jQuery.fn.extend({

    position: function() {
        if ( !this[0] ) {
            return null;
        }

        var elem = this[0],

        // Get *real* offsetParent
        offsetParent = this.offsetParent(),

        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

        // Subtract element margins
        // note: when an element has margin: auto the offsetLeft and marginLeft
        // are the same in Safari causing offset.left to incorrectly be 0
        offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
        offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

        // Add offsetParent borders
        parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
        parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

        // Subtract the two offsets
        return {
            top:  offset.top  - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    },

    offsetParent: function() {
        return this.map(function() {
            var offsetParent = this.offsetParent || document.body;
            while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent;
        });
    }
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
    var method = "scroll" + name;

    jQuery.fn[ method ] = function( val ) {
        var elem, win;

        if ( val === undefined ) {
            elem = this[ 0 ];

            if ( !elem ) {
                return null;
            }

            win = getWindow( elem );

            // Return the scroll offset
            return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
                jQuery.support.boxModel && win.document.documentElement[ method ] ||
                    win.document.body[ method ] :
                elem[ method ];
        }

        // Set the scroll offset
        return this.each(function() {
            win = getWindow( this );

            if ( win ) {
                win.scrollTo(
                    !i ? val : jQuery( win ).scrollLeft(),
                     i ? val : jQuery( win ).scrollTop()
                );

            } else {
                this[ method ] = val;
            }
        });
    };
});

function getWindow( elem ) {
    return jQuery.isWindow( elem ) ?
        elem :
        elem.nodeType === 9 ?
            elem.defaultView || elem.parentWindow :
            false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

    var type = name.toLowerCase();

    // innerHeight and innerWidth
    jQuery.fn[ "inner" + name ] = function() {
        var elem = this[0];
        return elem ?
            elem.style ?
            parseFloat( jQuery.css( elem, type, "padding" ) ) :
            this[ type ]() :
            null;
    };

    // outerHeight and outerWidth
    jQuery.fn[ "outer" + name ] = function( margin ) {
        var elem = this[0];
        return elem ?
            elem.style ?
            parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
            this[ type ]() :
            null;
    };

    jQuery.fn[ type ] = function( size ) {
        // Get window width or height
        var elem = this[0];
        if ( !elem ) {
            return size == null ? null : this;
        }

        if ( jQuery.isFunction( size ) ) {
            return this.each(function( i ) {
                var self = jQuery( this );
                self[ type ]( size.call( this, i, self[ type ]() ) );
            });
        }

        if ( jQuery.isWindow( elem ) ) {
            // Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
            // 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
            var docElemProp = elem.document.documentElement[ "client" + name ],
                body = elem.document.body;
            return elem.document.compatMode === "CSS1Compat" && docElemProp ||
                body && body[ "client" + name ] || docElemProp;

        // Get document width or height
        } else if ( elem.nodeType === 9 ) {
            // Either scroll[Width/Height] or offset[Width/Height], whichever is greater
            return Math.max(
                elem.documentElement["client" + name],
                elem.body["scroll" + name], elem.documentElement["scroll" + name],
                elem.body["offset" + name], elem.documentElement["offset" + name]
            );

        // Get or set width or height on the element
        } else if ( size === undefined ) {
            var orig = jQuery.css( elem, type ),
                ret = parseFloat( orig );

            return jQuery.isNumeric( ret ) ? ret : orig;

        // Set the width or height on the element (default to pixels if value is unitless)
        } else {
            return this.css( type, typeof size === "string" ? size : size + "px" );
        }
    };

});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
    define( "jquery", [], function () { return jQuery; } );
}



})( window );
;

/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.core.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){function c(b,c){var e=b.nodeName.toLowerCase();if("area"===e){var f=b.parentNode,g=f.name,h;return!b.href||!g||f.nodeName.toLowerCase()!=="map"?!1:(h=a("img[usemap=#"+g+"]")[0],!!h&&d(h))}return(/input|select|textarea|button|object/.test(e)?!b.disabled:"a"==e?b.href||c:c)&&d(b)}function d(b){return!a(b).parents().andSelf().filter(function(){return a.curCSS(this,"visibility")==="hidden"||a.expr.filters.hidden(this)}).length}a.ui=a.ui||{};if(a.ui.version)return;a.extend(a.ui,{version:"1.8.23",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}}),a.fn.extend({propAttr:a.fn.prop||a.fn.attr,_focus:a.fn.focus,focus:function(b,c){return typeof b=="number"?this.each(function(){var d=this;setTimeout(function(){a(d).focus(),c&&c.call(d)},b)}):this._focus.apply(this,arguments)},scrollParent:function(){var b;return a.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?b=this.parents().filter(function(){return/(relative|absolute|fixed)/.test(a.curCSS(this,"position",1))&&/(auto|scroll)/.test(a.curCSS(this,"overflow",1)+a.curCSS(this,"overflow-y",1)+a.curCSS(this,"overflow-x",1))}).eq(0):b=this.parents().filter(function(){return/(auto|scroll)/.test(a.curCSS(this,"overflow",1)+a.curCSS(this,"overflow-y",1)+a.curCSS(this,"overflow-x",1))}).eq(0),/fixed/.test(this.css("position"))||!b.length?a(document):b},zIndex:function(c){if(c!==b)return this.css("zIndex",c);if(this.length){var d=a(this[0]),e,f;while(d.length&&d[0]!==document){e=d.css("position");if(e==="absolute"||e==="relative"||e==="fixed"){f=parseInt(d.css("zIndex"),10);if(!isNaN(f)&&f!==0)return f}d=d.parent()}}return 0},disableSelection:function(){return this.bind((a.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),a("<a>").outerWidth(1).jquery||a.each(["Width","Height"],function(c,d){function h(b,c,d,f){return a.each(e,function(){c-=parseFloat(a.curCSS(b,"padding"+this,!0))||0,d&&(c-=parseFloat(a.curCSS(b,"border"+this+"Width",!0))||0),f&&(c-=parseFloat(a.curCSS(b,"margin"+this,!0))||0)}),c}var e=d==="Width"?["Left","Right"]:["Top","Bottom"],f=d.toLowerCase(),g={innerWidth:a.fn.innerWidth,innerHeight:a.fn.innerHeight,outerWidth:a.fn.outerWidth,outerHeight:a.fn.outerHeight};a.fn["inner"+d]=function(c){return c===b?g["inner"+d].call(this):this.each(function(){a(this).css(f,h(this,c)+"px")})},a.fn["outer"+d]=function(b,c){return typeof b!="number"?g["outer"+d].call(this,b):this.each(function(){a(this).css(f,h(this,b,!0,c)+"px")})}}),a.extend(a.expr[":"],{data:a.expr.createPseudo?a.expr.createPseudo(function(b){return function(c){return!!a.data(c,b)}}):function(b,c,d){return!!a.data(b,d[3])},focusable:function(b){return c(b,!isNaN(a.attr(b,"tabindex")))},tabbable:function(b){var d=a.attr(b,"tabindex"),e=isNaN(d);return(e||d>=0)&&c(b,!e)}}),a(function(){var b=document.body,c=b.appendChild(c=document.createElement("div"));c.offsetHeight,a.extend(c.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0}),a.support.minHeight=c.offsetHeight===100,a.support.selectstart="onselectstart"in c,b.removeChild(c).style.display="none"}),a.curCSS||(a.curCSS=a.css),a.extend(a.ui,{plugin:{add:function(b,c,d){var e=a.ui[b].prototype;for(var f in d)e.plugins[f]=e.plugins[f]||[],e.plugins[f].push([c,d[f]])},call:function(a,b,c){var d=a.plugins[b];if(!d||!a.element[0].parentNode)return;for(var e=0;e<d.length;e++)a.options[d[e][0]]&&d[e][1].apply(a.element,c)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(b,c){if(a(b).css("overflow")==="hidden")return!1;var d=c&&c==="left"?"scrollLeft":"scrollTop",e=!1;return b[d]>0?!0:(b[d]=1,e=b[d]>0,b[d]=0,e)},isOverAxis:function(a,b,c){return a>b&&a<b+c},isOver:function(b,c,d,e,f,g){return a.ui.isOverAxis(b,d,f)&&a.ui.isOverAxis(c,e,g)}})})(jQuery);;/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.widget.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){if(a.cleanData){var c=a.cleanData;a.cleanData=function(b){for(var d=0,e;(e=b[d])!=null;d++)try{a(e).triggerHandler("remove")}catch(f){}c(b)}}else{var d=a.fn.remove;a.fn.remove=function(b,c){return this.each(function(){return c||(!b||a.filter(b,[this]).length)&&a("*",this).add([this]).each(function(){try{a(this).triggerHandler("remove")}catch(b){}}),d.call(a(this),b,c)})}}a.widget=function(b,c,d){var e=b.split(".")[0],f;b=b.split(".")[1],f=e+"-"+b,d||(d=c,c=a.Widget),a.expr[":"][f]=function(c){return!!a.data(c,b)},a[e]=a[e]||{},a[e][b]=function(a,b){arguments.length&&this._createWidget(a,b)};var g=new c;g.options=a.extend(!0,{},g.options),a[e][b].prototype=a.extend(!0,g,{namespace:e,widgetName:b,widgetEventPrefix:a[e][b].prototype.widgetEventPrefix||b,widgetBaseClass:f},d),a.widget.bridge(b,a[e][b])},a.widget.bridge=function(c,d){a.fn[c]=function(e){var f=typeof e=="string",g=Array.prototype.slice.call(arguments,1),h=this;return e=!f&&g.length?a.extend.apply(null,[!0,e].concat(g)):e,f&&e.charAt(0)==="_"?h:(f?this.each(function(){var d=a.data(this,c),f=d&&a.isFunction(d[e])?d[e].apply(d,g):d;if(f!==d&&f!==b)return h=f,!1}):this.each(function(){var b=a.data(this,c);b?b.option(e||{})._init():a.data(this,c,new d(e,this))}),h)}},a.Widget=function(a,b){arguments.length&&this._createWidget(a,b)},a.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:!1},_createWidget:function(b,c){a.data(c,this.widgetName,this),this.element=a(c),this.options=a.extend(!0,{},this.options,this._getCreateOptions(),b);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()}),this._create(),this._trigger("create"),this._init()},_getCreateOptions:function(){return a.metadata&&a.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName),this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled "+"ui-state-disabled")},widget:function(){return this.element},option:function(c,d){var e=c;if(arguments.length===0)return a.extend({},this.options);if(typeof c=="string"){if(d===b)return this.options[c];e={},e[c]=d}return this._setOptions(e),this},_setOptions:function(b){var c=this;return a.each(b,function(a,b){c._setOption(a,b)}),this},_setOption:function(a,b){return this.options[a]=b,a==="disabled"&&this.widget()[b?"addClass":"removeClass"](this.widgetBaseClass+"-disabled"+" "+"ui-state-disabled").attr("aria-disabled",b),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_trigger:function(b,c,d){var e,f,g=this.options[b];d=d||{},c=a.Event(c),c.type=(b===this.widgetEventPrefix?b:this.widgetEventPrefix+b).toLowerCase(),c.target=this.element[0],f=c.originalEvent;if(f)for(e in f)e in c||(c[e]=f[e]);return this.element.trigger(c,d),!(a.isFunction(g)&&g.call(this.element[0],c,d)===!1||c.isDefaultPrevented())}}})(jQuery);;/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.mouse.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){var c=!1;a(document).mouseup(function(a){c=!1}),a.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var b=this;this.element.bind("mousedown."+this.widgetName,function(a){return b._mouseDown(a)}).bind("click."+this.widgetName,function(c){if(!0===a.data(c.target,b.widgetName+".preventClickEvent"))return a.removeData(c.target,b.widgetName+".preventClickEvent"),c.stopImmediatePropagation(),!1}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&a(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(b){if(c)return;this._mouseStarted&&this._mouseUp(b),this._mouseDownEvent=b;var d=this,e=b.which==1,f=typeof this.options.cancel=="string"&&b.target.nodeName?a(b.target).closest(this.options.cancel).length:!1;if(!e||f||!this._mouseCapture(b))return!0;this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){d.mouseDelayMet=!0},this.options.delay));if(this._mouseDistanceMet(b)&&this._mouseDelayMet(b)){this._mouseStarted=this._mouseStart(b)!==!1;if(!this._mouseStarted)return b.preventDefault(),!0}return!0===a.data(b.target,this.widgetName+".preventClickEvent")&&a.removeData(b.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(a){return d._mouseMove(a)},this._mouseUpDelegate=function(a){return d._mouseUp(a)},a(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),b.preventDefault(),c=!0,!0},_mouseMove:function(b){return!a.browser.msie||document.documentMode>=9||!!b.button?this._mouseStarted?(this._mouseDrag(b),b.preventDefault()):(this._mouseDistanceMet(b)&&this._mouseDelayMet(b)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,b)!==!1,this._mouseStarted?this._mouseDrag(b):this._mouseUp(b)),!this._mouseStarted):this._mouseUp(b)},_mouseUp:function(b){return a(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,b.target==this._mouseDownEvent.target&&a.data(b.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(b)),!1},_mouseDistanceMet:function(a){return Math.max(Math.abs(this._mouseDownEvent.pageX-a.pageX),Math.abs(this._mouseDownEvent.pageY-a.pageY))>=this.options.distance},_mouseDelayMet:function(a){return this.mouseDelayMet},_mouseStart:function(a){},_mouseDrag:function(a){},_mouseStop:function(a){},_mouseCapture:function(a){return!0}})})(jQuery);;/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.draggable.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.widget("ui.draggable",a.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1},_create:function(){this.options.helper=="original"&&!/^(?:r|a|f)/.test(this.element.css("position"))&&(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},destroy:function(){if(!this.element.data("draggable"))return;return this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy(),this},_mouseCapture:function(b){var c=this.options;return this.helper||c.disabled||a(b.target).is(".ui-resizable-handle")?!1:(this.handle=this._getHandle(b),this.handle?(c.iframeFix&&a(c.iframeFix===!0?"iframe":c.iframeFix).each(function(){a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(a(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(b){var c=this.options;return this.helper=this._createHelper(b),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),a.ui.ddmanager&&(a.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},a.extend(this.offset,{click:{left:b.pageX-this.offset.left,top:b.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(b),this.originalPageX=b.pageX,this.originalPageY=b.pageY,c.cursorAt&&this._adjustOffsetFromHelper(c.cursorAt),c.containment&&this._setContainment(),this._trigger("start",b)===!1?(this._clear(),!1):(this._cacheHelperProportions(),a.ui.ddmanager&&!c.dropBehaviour&&a.ui.ddmanager.prepareOffsets(this,b),this._mouseDrag(b,!0),a.ui.ddmanager&&a.ui.ddmanager.dragStart(this,b),!0)},_mouseDrag:function(b,c){this.position=this._generatePosition(b),this.positionAbs=this._convertPositionTo("absolute");if(!c){var d=this._uiHash();if(this._trigger("drag",b,d)===!1)return this._mouseUp({}),!1;this.position=d.position}if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";return a.ui.ddmanager&&a.ui.ddmanager.drag(this,b),!1},_mouseStop:function(b){var c=!1;a.ui.ddmanager&&!this.options.dropBehaviour&&(c=a.ui.ddmanager.drop(this,b)),this.dropped&&(c=this.dropped,this.dropped=!1);var d=this.element[0],e=!1;while(d&&(d=d.parentNode))d==document&&(e=!0);if(!e&&this.options.helper==="original")return!1;if(this.options.revert=="invalid"&&!c||this.options.revert=="valid"&&c||this.options.revert===!0||a.isFunction(this.options.revert)&&this.options.revert.call(this.element,c)){var f=this;a(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){f._trigger("stop",b)!==!1&&f._clear()})}else this._trigger("stop",b)!==!1&&this._clear();return!1},_mouseUp:function(b){return this.options.iframeFix===!0&&a("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),a.ui.ddmanager&&a.ui.ddmanager.dragStop(this,b),a.ui.mouse.prototype._mouseUp.call(this,b)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(b){var c=!this.options.handle||!a(this.options.handle,this.element).length?!0:!1;return a(this.options.handle,this.element).find("*").andSelf().each(function(){this==b.target&&(c=!0)}),c},_createHelper:function(b){var c=this.options,d=a.isFunction(c.helper)?a(c.helper.apply(this.element[0],[b])):c.helper=="clone"?this.element.clone().removeAttr("id"):this.element;return d.parents("body").length||d.appendTo(c.appendTo=="parent"?this.element[0].parentNode:c.appendTo),d[0]!=this.element[0]&&!/(fixed|absolute)/.test(d.css("position"))&&d.css("position","absolute"),d},_adjustOffsetFromHelper:function(b){typeof b=="string"&&(b=b.split(" ")),a.isArray(b)&&(b={left:+b[0],top:+b[1]||0}),"left"in b&&(this.offset.click.left=b.left+this.margins.left),"right"in b&&(this.offset.click.left=this.helperProportions.width-b.right+this.margins.left),"top"in b&&(this.offset.click.top=b.top+this.margins.top),"bottom"in b&&(this.offset.click.top=this.helperProportions.height-b.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var b=this.offsetParent.offset();this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0])&&(b.left+=this.scrollParent.scrollLeft(),b.top+=this.scrollParent.scrollTop());if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&a.browser.msie)b={top:0,left:0};return{top:b.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:b.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.element.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var b=this.options;b.containment=="parent"&&(b.containment=this.helper[0].parentNode);if(b.containment=="document"||b.containment=="window")this.containment=[b.containment=="document"?0:a(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,b.containment=="document"?0:a(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(b.containment=="document"?0:a(window).scrollLeft())+a(b.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(b.containment=="document"?0:a(window).scrollTop())+(a(b.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(b.containment)&&b.containment.constructor!=Array){var c=a(b.containment),d=c[0];if(!d)return;var e=c.offset(),f=a(d).css("overflow")!="hidden";this.containment=[(parseInt(a(d).css("borderLeftWidth"),10)||0)+(parseInt(a(d).css("paddingLeft"),10)||0),(parseInt(a(d).css("borderTopWidth"),10)||0)+(parseInt(a(d).css("paddingTop"),10)||0),(f?Math.max(d.scrollWidth,d.offsetWidth):d.offsetWidth)-(parseInt(a(d).css("borderLeftWidth"),10)||0)-(parseInt(a(d).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(f?Math.max(d.scrollHeight,d.offsetHeight):d.offsetHeight)-(parseInt(a(d).css("borderTopWidth"),10)||0)-(parseInt(a(d).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=c}else b.containment.constructor==Array&&(this.containment=b.containment)},_convertPositionTo:function(b,c){c||(c=this.position);var d=b=="absolute"?1:-1,e=this.options,f=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,g=/(html|body)/i.test(f[0].tagName);return{top:c.top+this.offset.relative.top*d+this.offset.parent.top*d-(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():g?0:f.scrollTop())*d),left:c.left+this.offset.relative.left*d+this.offset.parent.left*d-(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():g?0:f.scrollLeft())*d)}},_generatePosition:function(b){var c=this.options,d=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(d[0].tagName),f=b.pageX,g=b.pageY;if(this.originalPosition){var h;if(this.containment){if(this.relative_container){var i=this.relative_container.offset();h=[this.containment[0]+i.left,this.containment[1]+i.top,this.containment[2]+i.left,this.containment[3]+i.top]}else h=this.containment;b.pageX-this.offset.click.left<h[0]&&(f=h[0]+this.offset.click.left),b.pageY-this.offset.click.top<h[1]&&(g=h[1]+this.offset.click.top),b.pageX-this.offset.click.left>h[2]&&(f=h[2]+this.offset.click.left),b.pageY-this.offset.click.top>h[3]&&(g=h[3]+this.offset.click.top)}if(c.grid){var j=c.grid[1]?this.originalPageY+Math.round((g-this.originalPageY)/c.grid[1])*c.grid[1]:this.originalPageY;g=h?j-this.offset.click.top<h[1]||j-this.offset.click.top>h[3]?j-this.offset.click.top<h[1]?j+c.grid[1]:j-c.grid[1]:j:j;var k=c.grid[0]?this.originalPageX+Math.round((f-this.originalPageX)/c.grid[0])*c.grid[0]:this.originalPageX;f=h?k-this.offset.click.left<h[0]||k-this.offset.click.left>h[2]?k-this.offset.click.left<h[0]?k+c.grid[0]:k-c.grid[0]:k:k}}return{top:g-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:d.scrollTop()),left:f-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:d.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(b,c,d){return d=d||this._uiHash(),a.ui.plugin.call(this,b,[c,d]),b=="drag"&&(this.positionAbs=this._convertPositionTo("absolute")),a.Widget.prototype._trigger.call(this,b,c,d)},plugins:{},_uiHash:function(a){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),a.extend(a.ui.draggable,{version:"1.8.23"}),a.ui.plugin.add("draggable","connectToSortable",{start:function(b,c){var d=a(this).data("draggable"),e=d.options,f=a.extend({},c,{item:d.element});d.sortables=[],a(e.connectToSortable).each(function(){var c=a.data(this,"sortable");c&&!c.options.disabled&&(d.sortables.push({instance:c,shouldRevert:c.options.revert}),c.refreshPositions(),c._trigger("activate",b,f))})},stop:function(b,c){var d=a(this).data("draggable"),e=a.extend({},c,{item:d.element});a.each(d.sortables,function(){this.instance.isOver?(this.instance.isOver=0,d.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=!0),this.instance._mouseStop(b),this.instance.options.helper=this.instance.options._helper,d.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",b,e))})},drag:function(b,c){var d=a(this).data("draggable"),e=this,f=function(b){var c=this.offset.click.top,d=this.offset.click.left,e=this.positionAbs.top,f=this.positionAbs.left,g=b.height,h=b.width,i=b.top,j=b.left;return a.ui.isOver(e+c,f+d,i,j,g,h)};a.each(d.sortables,function(f){this.instance.positionAbs=d.positionAbs,this.instance.helperProportions=d.helperProportions,this.instance.offset.click=d.offset.click,this.instance._intersectsWith(this.instance.containerCache)?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=a(e).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return c.helper[0]},b.target=this.instance.currentItem[0],this.instance._mouseCapture(b,!0),this.instance._mouseStart(b,!0,!0),this.instance.offset.click.top=d.offset.click.top,this.instance.offset.click.left=d.offset.click.left,this.instance.offset.parent.left-=d.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=d.offset.parent.top-this.instance.offset.parent.top,d._trigger("toSortable",b),d.dropped=this.instance.element,d.currentItem=d.element,this.instance.fromOutside=d),this.instance.currentItem&&this.instance._mouseDrag(b)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",b,this.instance._uiHash(this.instance)),this.instance._mouseStop(b,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),d._trigger("fromSortable",b),d.dropped=!1)})}}),a.ui.plugin.add("draggable","cursor",{start:function(b,c){var d=a("body"),e=a(this).data("draggable").options;d.css("cursor")&&(e._cursor=d.css("cursor")),d.css("cursor",e.cursor)},stop:function(b,c){var d=a(this).data("draggable").options;d._cursor&&a("body").css("cursor",d._cursor)}}),a.ui.plugin.add("draggable","opacity",{start:function(b,c){var d=a(c.helper),e=a(this).data("draggable").options;d.css("opacity")&&(e._opacity=d.css("opacity")),d.css("opacity",e.opacity)},stop:function(b,c){var d=a(this).data("draggable").options;d._opacity&&a(c.helper).css("opacity",d._opacity)}}),a.ui.plugin.add("draggable","scroll",{start:function(b,c){var d=a(this).data("draggable");d.scrollParent[0]!=document&&d.scrollParent[0].tagName!="HTML"&&(d.overflowOffset=d.scrollParent.offset())},drag:function(b,c){var d=a(this).data("draggable"),e=d.options,f=!1;if(d.scrollParent[0]!=document&&d.scrollParent[0].tagName!="HTML"){if(!e.axis||e.axis!="x")d.overflowOffset.top+d.scrollParent[0].offsetHeight-b.pageY<e.scrollSensitivity?d.scrollParent[0].scrollTop=f=d.scrollParent[0].scrollTop+e.scrollSpeed:b.pageY-d.overflowOffset.top<e.scrollSensitivity&&(d.scrollParent[0].scrollTop=f=d.scrollParent[0].scrollTop-e.scrollSpeed);if(!e.axis||e.axis!="y")d.overflowOffset.left+d.scrollParent[0].offsetWidth-b.pageX<e.scrollSensitivity?d.scrollParent[0].scrollLeft=f=d.scrollParent[0].scrollLeft+e.scrollSpeed:b.pageX-d.overflowOffset.left<e.scrollSensitivity&&(d.scrollParent[0].scrollLeft=f=d.scrollParent[0].scrollLeft-e.scrollSpeed)}else{if(!e.axis||e.axis!="x")b.pageY-a(document).scrollTop()<e.scrollSensitivity?f=a(document).scrollTop(a(document).scrollTop()-e.scrollSpeed):a(window).height()-(b.pageY-a(document).scrollTop())<e.scrollSensitivity&&(f=a(document).scrollTop(a(document).scrollTop()+e.scrollSpeed));if(!e.axis||e.axis!="y")b.pageX-a(document).scrollLeft()<e.scrollSensitivity?f=a(document).scrollLeft(a(document).scrollLeft()-e.scrollSpeed):a(window).width()-(b.pageX-a(document).scrollLeft())<e.scrollSensitivity&&(f=a(document).scrollLeft(a(document).scrollLeft()+e.scrollSpeed))}f!==!1&&a.ui.ddmanager&&!e.dropBehaviour&&a.ui.ddmanager.prepareOffsets(d,b)}}),a.ui.plugin.add("draggable","snap",{start:function(b,c){var d=a(this).data("draggable"),e=d.options;d.snapElements=[],a(e.snap.constructor!=String?e.snap.items||":data(draggable)":e.snap).each(function(){var b=a(this),c=b.offset();this!=d.element[0]&&d.snapElements.push({item:this,width:b.outerWidth(),height:b.outerHeight(),top:c.top,left:c.left})})},drag:function(b,c){var d=a(this).data("draggable"),e=d.options,f=e.snapTolerance,g=c.offset.left,h=g+d.helperProportions.width,i=c.offset.top,j=i+d.helperProportions.height;for(var k=d.snapElements.length-1;k>=0;k--){var l=d.snapElements[k].left,m=l+d.snapElements[k].width,n=d.snapElements[k].top,o=n+d.snapElements[k].height;if(!(l-f<g&&g<m+f&&n-f<i&&i<o+f||l-f<g&&g<m+f&&n-f<j&&j<o+f||l-f<h&&h<m+f&&n-f<i&&i<o+f||l-f<h&&h<m+f&&n-f<j&&j<o+f)){d.snapElements[k].snapping&&d.options.snap.release&&d.options.snap.release.call(d.element,b,a.extend(d._uiHash(),{snapItem:d.snapElements[k].item})),d.snapElements[k].snapping=!1;continue}if(e.snapMode!="inner"){var p=Math.abs(n-j)<=f,q=Math.abs(o-i)<=f,r=Math.abs(l-h)<=f,s=Math.abs(m-g)<=f;p&&(c.position.top=d._convertPositionTo("relative",{top:n-d.helperProportions.height,left:0}).top-d.margins.top),q&&(c.position.top=d._convertPositionTo("relative",{top:o,left:0}).top-d.margins.top),r&&(c.position.left=d._convertPositionTo("relative",{top:0,left:l-d.helperProportions.width}).left-d.margins.left),s&&(c.position.left=d._convertPositionTo("relative",{top:0,left:m}).left-d.margins.left)}var t=p||q||r||s;if(e.snapMode!="outer"){var p=Math.abs(n-i)<=f,q=Math.abs(o-j)<=f,r=Math.abs(l-g)<=f,s=Math.abs(m-h)<=f;p&&(c.position.top=d._convertPositionTo("relative",{top:n,left:0}).top-d.margins.top),q&&(c.position.top=d._convertPositionTo("relative",{top:o-d.helperProportions.height,left:0}).top-d.margins.top),r&&(c.position.left=d._convertPositionTo("relative",{top:0,left:l}).left-d.margins.left),s&&(c.position.left=d._convertPositionTo("relative",{top:0,left:m-d.helperProportions.width}).left-d.margins.left)}!d.snapElements[k].snapping&&(p||q||r||s||t)&&d.options.snap.snap&&d.options.snap.snap.call(d.element,b,a.extend(d._uiHash(),{snapItem:d.snapElements[k].item})),d.snapElements[k].snapping=p||q||r||s||t}}}),a.ui.plugin.add("draggable","stack",{start:function(b,c){var d=a(this).data("draggable").options,e=a.makeArray(a(d.stack)).sort(function(b,c){return(parseInt(a(b).css("zIndex"),10)||0)-(parseInt(a(c).css("zIndex"),10)||0)});if(!e.length)return;var f=parseInt(e[0].style.zIndex)||0;a(e).each(function(a){this.style.zIndex=f+a}),this[0].style.zIndex=f+e.length}}),a.ui.plugin.add("draggable","zIndex",{start:function(b,c){var d=a(c.helper),e=a(this).data("draggable").options;d.css("zIndex")&&(e._zIndex=d.css("zIndex")),d.css("zIndex",e.zIndex)},stop:function(b,c){var d=a(this).data("draggable").options;d._zIndex&&a(c.helper).css("zIndex",d._zIndex)}})})(jQuery);;;

//     Underscore.js 1.3.1
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.3.1';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    if (obj.length === +obj.length) results.length = obj.length;
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var shuffled = [], rand;
    each(obj, function(value, index, list) {
      if (index == 0) {
        shuffled[0] = value;
      } else {
        rand = Math.floor(Math.random() * (index + 1));
        shuffled[index] = shuffled[rand];
        shuffled[rand] = value;
      }
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    var result = {};
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return slice.call(iterable);
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head`. The **guard** check allows it to work
  // with `_.map`.
  _.first = _.head = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var result = [];
    _.reduce(initial, function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) {
        memo[memo.length] = el;
        result[result.length] = array[i];
      }
      return memo;
    }, []);
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = _.flatten(slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.include(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        func.apply(context, args);
      }
      whenDone();
      throttling = true;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  _.debounce = function(func, wait) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function.
  function eq(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return toString.call(obj) == '[object Arguments]';
  };
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Is a given value a function?
  _.isFunction = function(obj) {
    return toString.call(obj) == '[object Function]';
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return toString.call(obj) == '[object String]';
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Has own property?
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /.^/;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function(code) {
    return code.replace(/\\\\/g, '\\').replace(/\\'/g, "'");
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.escape || noMatch, function(match, code) {
           return "',_.escape(" + unescape(code) + "),'";
         })
         .replace(c.interpolate || noMatch, function(match, code) {
           return "'," + unescape(code) + ",'";
         })
         .replace(c.evaluate || noMatch, function(match, code) {
           return "');" + unescape(code).replace(/[\r\n\t]/g, ' ') + ";__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', '_', tmpl);
    if (data) return func(data, _);
    return function(data) {
      return func.call(this, data, _);
    };
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      var wrapped = this._wrapped;
      method.apply(wrapped, arguments);
      var length = wrapped.length;
      if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
      return result(wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);
;

//     Backbone.js 0.9.1

//     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `global`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to slice/splice.
  var slice = Array.prototype.slice;
  var splice = Array.prototype.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.9.1';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, or Ender owns the `$` variable.
  var $ = root.jQuery || root.Zepto || root.ender;

  // Set the JavaScript library that will be used for DOM manipulation and
  // Ajax calls (a.k.a. the `$` variable). By default Backbone will use: jQuery,
  // Zepto, or Ender; but the `setDomLibrary()` method lets you inject an
  // alternate JavaScript library (or a mock library for testing your views
  // outside of a browser).
  Backbone.setDomLibrary = function(lib) {
    $ = lib;
  };

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback functions
  // to an event; trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  Backbone.Events = {

    // Bind an event, specified by a string name, `ev`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    on: function(events, callback, context) {
      var ev;
      events = events.split(/\s+/);
      var calls = this._callbacks || (this._callbacks = {});
      while (ev = events.shift()) {
        // Create an immutable callback list, allowing traversal during
        // modification.  The tail is an empty object that will always be used
        // as the next node.
        var list  = calls[ev] || (calls[ev] = {});
        var tail = list.tail || (list.tail = list.next = {});
        tail.callback = callback;
        tail.context = context;
        list.tail = tail.next = {};
      }
      return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `ev` is null, removes all bound callbacks for all events.
    off: function(events, callback, context) {
      var ev, calls, node;
      if (!events) {
        delete this._callbacks;
      } else if (calls = this._callbacks) {
        events = events.split(/\s+/);
        while (ev = events.shift()) {
          node = calls[ev];
          delete calls[ev];
          if (!callback || !node) continue;
          // Create a new list, omitting the indicated event/context pairs.
          while ((node = node.next) && node.next) {
            if (node.callback === callback &&
              (!context || node.context === context)) continue;
            this.on(ev, node.callback, node.context);
          }
        }
      }
      return this;
    },

    // Trigger an event, firing all bound callbacks. Callbacks are passed the
    // same arguments as `trigger` is, apart from the event name.
    // Listening for `"all"` passes the true event name as the first argument.
    trigger: function(events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) return this;
      all = calls['all'];
      (events = events.split(/\s+/)).push(null);
      // Save references to the current heads & tails.
      while (event = events.shift()) {
        if (all) events.push({next: all.next, tail: all.tail, event: event});
        if (!(node = calls[event])) continue;
        events.push({next: node.next, tail: node.tail});
      }
      // Traverse each list, stopping when the saved tail is reached.
      rest = slice.call(arguments, 1);
      while (node = events.pop()) {
        tail = node.tail;
        args = node.event ? [node.event].concat(rest) : rest;
        while ((node = node.next) !== tail) {
          node.callback.apply(node.context || this, args);
        }
      }
      return this;
    }

  };

  // Aliases for backwards compatibility.
  Backbone.Events.bind   = Backbone.Events.on;
  Backbone.Events.unbind = Backbone.Events.off;

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  Backbone.Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if (options && options.parse) attributes = this.parse(attributes);
    if (defaults = getValue(this, 'defaults')) {
      attributes = _.extend({}, defaults, attributes);
    }
    if (options && options.collection) this.collection = options.collection;
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    if (!this.set(attributes, {silent: true})) {
      throw new Error("Can't create an invalid model");
    }
    delete this._changed;
    this._previousAttributes = _.clone(this.attributes);
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Backbone.Model.prototype, Backbone.Events, {

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function() {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.attributes[attr];
      return this._escapedAttributes[attr] = _.escape(val == null ? '' : '' + val);
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.attributes[attr] != null;
    },

    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    set: function(key, value, options) {
      var attrs, attr, val;
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs instanceof Backbone.Model) attrs = attrs.attributes;
      if (options.unset) for (attr in attrs) attrs[attr] = void 0;

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      var now = this.attributes;
      var escaped = this._escapedAttributes;
      var prev = this._previousAttributes || {};
      var alreadySetting = this._setting;
      this._changed || (this._changed = {});
      this._setting = true;

      // Update attributes.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(now[attr], val)) delete escaped[attr];
        options.unset ? delete now[attr] : now[attr] = val;
        if (this._changing && !_.isEqual(this._changed[attr], val)) {
          this.trigger('change:' + attr, this, val, options);
          this._moreChanges = true;
        }
        delete this._changed[attr];
        if (!_.isEqual(prev[attr], val) || (_.has(now, attr) != _.has(prev, attr))) {
          this._changed[attr] = val;
        }
      }

      // Fire the `"change"` events, if the model has been changed.
      if (!alreadySetting) {
        if (!options.silent && this.hasChanged()) this.change(options);
        this._setting = false;
      }
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset: function(attr, options) {
      (options || (options = {})).unset = true;
      return this.set(attr, null, options);
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear: function(options) {
      (options || (options = {})).unset = true;
      return this.set(_.clone(this.attributes), options);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp);
      };
      options.error = Backbone.wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, value, options) {
      var attrs, current;
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }

      options = options ? _.clone(options) : {};
      if (options.wait) current = _.clone(this.attributes);
      var silentOptions = _.extend({}, options, {silent: true});
      if (attrs && !this.set(attrs, options.wait ? silentOptions : options)) {
        return false;
      }
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        var serverAttrs = model.parse(resp, xhr);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (!model.set(serverAttrs, options)) return false;
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };
      options.error = Backbone.wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
      if (options.wait) this.set(current, silentOptions);
      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var triggerDestroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      if (this.isNew()) return triggerDestroy();
      options.success = function(resp) {
        if (options.wait) triggerDestroy();
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };
      options.error = Backbone.wrapError(options.error, model, options);
      var xhr = (this.sync || Backbone.sync).call(this, 'delete', this, options);
      if (!options.wait) triggerDestroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = getValue(this.collection, 'url') || getValue(this, 'urlRoot') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, xhr) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Call this method to manually fire a `"change"` event for this model and
    // a `"change:attribute"` event for each changed attribute.
    // Calling this will cause all objects observing the model to update.
    change: function(options) {
      if (this._changing || !this.hasChanged()) return this;
      this._changing = true;
      this._moreChanges = true;
      for (var attr in this._changed) {
        this.trigger('change:' + attr, this, this._changed[attr], options);
      }
      while (this._moreChanges) {
        this._moreChanges = false;
        this.trigger('change', this, options);
      }
      this._previousAttributes = _.clone(this.attributes);
      delete this._changed;
      this._changing = false;
      return this;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (!arguments.length) return !_.isEmpty(this._changed);
      return this._changed && _.has(this._changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this._changed) : false;
      var val, changed = false, old = this._previousAttributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (!arguments.length || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Check if the model is currently in a valid state. It's only possible to
    // get into an *invalid* state if you're using silent changes.
    isValid: function() {
      return !this.validate(this.attributes);
    },

    // Run validation against a set of incoming attributes, returning `true`
    // if all is well. If a specific `error` callback has been passed,
    // call that instead of firing the general `"error"` event.
    _validate: function(attrs, options) {
      if (options.silent || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validate(attrs, options);
      if (!error) return true;
      if (options && options.error) {
        options.error(this, error, options);
      } else {
        this.trigger('error', this, error, options);
      }
      return false;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.comparator) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, {silent: true, parse: options.parse});
  };

  // Define the Collection's inheritable methods.
  _.extend(Backbone.Collection.prototype, Backbone.Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Backbone.Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function() {
      return this.map(function(model){ return model.toJSON(); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `add` event for every new model.
    add: function(models, options) {
      var i, index, length, model, cid, id, cids = {}, ids = {};
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];

      // Begin by turning bare objects into model references, and preventing
      // invalid models or duplicate models from being added.
      for (i = 0, length = models.length; i < length; i++) {
        if (!(model = models[i] = this._prepareModel(models[i], options))) {
          throw new Error("Can't add an invalid model to a collection");
        }
        if (cids[cid = model.cid] || this._byCid[cid] ||
          (((id = model.id) != null) && (ids[id] || this._byId[id]))) {
          throw new Error("Can't add the same model to a collection twice");
        }
        cids[cid] = ids[id] = model;
      }

      // Listen to added models' events, and index models for lookup by
      // `id` and by `cid`.
      for (i = 0; i < length; i++) {
        (model = models[i]).on('all', this._onModelEvent, this);
        this._byCid[model.cid] = model;
        if (model.id != null) this._byId[model.id] = model;
      }

      // Insert models into the collection, re-sorting if needed, and triggering
      // `add` events unless silenced.
      this.length += length;
      index = options.at != null ? options.at : this.models.length;
      splice.apply(this.models, [index, 0].concat(models));
      if (this.comparator) this.sort({silent: true});
      if (options.silent) return this;
      for (i = 0, length = this.models.length; i < length; i++) {
        if (!cids[(model = this.models[i]).cid]) continue;
        options.index = i;
        model.trigger('add', model, this, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `remove` event for every model removed.
    remove: function(models, options) {
      var i, l, index, model;
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];
      for (i = 0, l = models.length; i < l; i++) {
        model = this.getByCid(models[i]) || this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byCid[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Get a model from the set by id.
    get: function(id) {
      if (id == null) return null;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid: function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      var boundComparator = _.bind(this.comparator, this);
      if (this.comparator.length == 1) {
        this.models = this.sortBy(boundComparator);
      } else {
        this.models.sort(boundComparator);
      }
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `add` or `remove` events. Fires `reset` when finished.
    reset: function(models, options) {
      models  || (models = []);
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      this._reset();
      this.add(models, {silent: true, parse: options.parse});
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `add: true` is passed, appends the
    // models to the collection instead of resetting.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === undefined) options.parse = true;
      var collection = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
        if (success) success(collection, resp);
      };
      options.error = Backbone.wrapError(options.error, collection, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      var coll = this;
      options = options ? _.clone(options) : {};
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!options.wait) coll.add(model, options);
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        if (options.wait) coll.add(nextModel, options);
        if (success) {
          success(nextModel, resp);
        } else {
          nextModel.trigger('sync', model, resp, options);
        }
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, xhr) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is reset.
    _reset: function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Prepare a model or hash of attributes to be added to this collection.
    _prepareModel: function(model, options) {
      if (!(model instanceof Backbone.Model)) {
        var attrs = model;
        options.collection = this;
        model = new this.model(attrs, options);
        if (!model._validate(model.attributes, options)) model = false;
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference: function(model) {
      if (this == model.collection) {
        delete model.collection;
      }
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(ev, model, collection, options) {
      if ((ev == 'add' || ev == 'remove') && collection != this) return;
      if (ev == 'destroy') {
        this.remove(model, options);
      }
      if (model && ev === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
    'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
    'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
    'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
    'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Backbone.Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Router
  // -------------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Backbone.Router.prototype, Backbone.Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      Backbone.history || (Backbone.history = new Backbone.History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (!callback) callback = this[name];
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback && callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
        Backbone.history.trigger('route', this, name, args);
      }, this));
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      var routes = [];
      for (var route in this.routes) {
        routes.unshift([route, this.routes[route]]);
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(namedParam, '([^\/]+)')
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters: function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning leading hashes and slashes .
  var routeStripper = /^[#\/]/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  var historyStarted = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(Backbone.History.prototype, Backbone.Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) fragment += search;
        } else {
          fragment = window.location.hash;
        }
      }
      fragment = decodeURIComponent(fragment);
      if (!fragment.indexOf(this.options.root)) fragment = fragment.substr(this.options.root.length);
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      if (historyStarted) throw new Error("Backbone.history has already been started");
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && window.history && window.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));
      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        $(window).bind('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      historyStarted = true;
      var loc = window.location;
      var atRoot  = loc.pathname == this.options.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = loc.hash.replace(routeStripper, '');
        window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      $(window).unbind('popstate', this.checkUrl).unbind('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      historyStarted = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) current = this.getFragment(this.iframe.location.hash);
      if (current == this.fragment || current == decodeURIComponent(this.fragment)) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(window.location.hash);
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you which to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!historyStarted) return false;
      if (!options || options === true) options = {trigger: options};
      var frag = (fragment || '').replace(routeStripper, '');
      if (this.fragment == frag || this.fragment == decodeURIComponent(frag)) return;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
        this.fragment = frag;
        window.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, frag);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this.fragment = frag;
        this._updateHash(window.location, frag, options.replace);
        if (this.iframe && (frag != this.getFragment(this.iframe.location.hash))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a history entry on hash-tag change.
          // When replace is true, we don't want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, frag, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        window.location.assign(this.options.root + fragment);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        location.replace(location.toString().replace(/(javascript:|#).*$/, '') + '#' + fragment);
      } else {
        location.hash = fragment;
      }
    }
  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var eventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(Backbone.View.prototype, Backbone.Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove: function() {
      this.$el.remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
    //
    make: function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      this.$el = $(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = getValue(this, 'events')))) return;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) throw new Error('Event "' + events[key] + '" does not exist');
        var match = key.match(eventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.bind(eventName, method);
        } else {
          this.$el.delegate(selector, eventName, method);
        }
      }
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.unbind('.delegateEvents' + this.cid);
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure: function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      for (var i = 0, l = viewOptions.length; i < l; i++) {
        var attr = viewOptions[i];
        if (options[attr]) this[attr] = options[attr];
      }
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = getValue(this, 'attributes') || {};
        if (this.id) attrs.id = this.id;
        if (this.className) attrs['class'] = this.className;
        this.setElement(this.make(this.tagName, attrs), false);
      } else {
        this.setElement(this.el, false);
      }
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Backbone.Model.extend = Backbone.Collection.extend =
    Backbone.Router.extend = Backbone.View.extend = extend;

  // Backbone.sync
  // -------------

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = getValue(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!options.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request, allowing the user to override any Ajax options.
    return $.ajax(_.extend(params, options));
  };

  // Wrap an optional error callback with a fallback error event.
  Backbone.wrapError = function(onError, originalModel, options) {
    return function(model, resp) {
      resp = model === originalModel ? resp : model;
      if (onError) {
        onError(originalModel, resp, options);
      } else {
        originalModel.trigger('error', originalModel, resp, options);
      }
    };
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
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

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a value from a Backbone object as a property
  // or as a function.
  var getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

}).call(this);
;

/*
 * jsTree 1.0-rc3
 * http://jstree.com/
 *
 * Copyright (c) 2010 Ivan Bozhanov (vakata.com)
 *
 * Licensed same as jquery - under the terms of either the MIT License or the GPL Version 2 License
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * $Date: 2011-02-09 01:17:14 +0200 (ср, 09 февр 2011) $
 * $Revision: 236 $
 */

/*jslint browser: true, onevar: true, undef: true, bitwise: true, strict: true */
/*global window : false, clearInterval: false, clearTimeout: false, document: false, setInterval: false, setTimeout: false, jQuery: false, navigator: false, XSLTProcessor: false, DOMParser: false, XMLSerializer: false*/

"use strict";

// top wrapper to prevent multiple inclusion (is this OK?)
(function () { if(jQuery && jQuery.jstree) { return; }
	var is_ie6 = false, is_ie7 = false, is_ff2 = false;

/* 
 * jsTree core
 */
(function ($) {
	// Common functions not related to jsTree 
	// decided to move them to a `vakata` "namespace"
	$.vakata = {};
	// CSS related functions
	$.vakata.css = {
		get_css : function(rule_name, delete_flag, sheet) {
			rule_name = rule_name.toLowerCase();
			var css_rules = sheet.cssRules || sheet.rules,
				j = 0;
			do {
				if(css_rules.length && j > css_rules.length + 5) { return false; }
				if(css_rules[j].selectorText && css_rules[j].selectorText.toLowerCase() == rule_name) {
					if(delete_flag === true) {
						if(sheet.removeRule) { sheet.removeRule(j); }
						if(sheet.deleteRule) { sheet.deleteRule(j); }
						return true;
					}
					else { return css_rules[j]; }
				}
			}
			while (css_rules[++j]);
			return false;
		},
		add_css : function(rule_name, sheet) {
			if($.jstree.css.get_css(rule_name, false, sheet)) { return false; }
			if(sheet.insertRule) { sheet.insertRule(rule_name + ' { }', 0); } else { sheet.addRule(rule_name, null, 0); }
			return $.vakata.css.get_css(rule_name);
		},
		remove_css : function(rule_name, sheet) { 
			return $.vakata.css.get_css(rule_name, true, sheet); 
		},
		add_sheet : function(opts) {
			var tmp = false, is_new = true;
			if(opts.str) {
				if(opts.title) { tmp = $("style[id='" + opts.title + "-stylesheet']")[0]; }
				if(tmp) { is_new = false; }
				else {
					tmp = document.createElement("style");
					tmp.setAttribute('type',"text/css");
					if(opts.title) { tmp.setAttribute("id", opts.title + "-stylesheet"); }
				}
				if(tmp.styleSheet) {
					if(is_new) { 
						document.getElementsByTagName("head")[0].appendChild(tmp); 
						tmp.styleSheet.cssText = opts.str; 
					}
					else {
						tmp.styleSheet.cssText = tmp.styleSheet.cssText + " " + opts.str; 
					}
				}
				else {
					tmp.appendChild(document.createTextNode(opts.str));
					document.getElementsByTagName("head")[0].appendChild(tmp);
				}
				return tmp.sheet || tmp.styleSheet;
			}
			if(opts.url) {
				if(document.createStyleSheet) {
					try { tmp = document.createStyleSheet(opts.url); } catch (e) { }
				}
				else {
					tmp			= document.createElement('link');
					tmp.rel		= 'stylesheet';
					tmp.type	= 'text/css';
					tmp.media	= "all";
					tmp.href	= opts.url;
					document.getElementsByTagName("head")[0].appendChild(tmp);
					return tmp.styleSheet;
				}
			}
		}
	};

	// private variables 
	var instances = [],			// instance array (used by $.jstree.reference/create/focused)
		focused_instance = -1,	// the index in the instance array of the currently focused instance
		plugins = {},			// list of included plugins
		prepared_move = {};		// for the move_node function

	// jQuery plugin wrapper (thanks to jquery UI widget function)
	$.fn.jstree = function (settings) {
		var isMethodCall = (typeof settings == 'string'), // is this a method call like $().jstree("open_node")
			args = Array.prototype.slice.call(arguments, 1), 
			returnValue = this;

		// if a method call execute the method on all selected instances
		if(isMethodCall) {
			if(settings.substring(0, 1) == '_') { return returnValue; }
			this.each(function() {
				var instance = instances[$.data(this, "jstree_instance_id")],
					methodValue = (instance && $.isFunction(instance[settings])) ? instance[settings].apply(instance, args) : instance;
					if(typeof methodValue !== "undefined" && (settings.indexOf("is_") === 0 || (methodValue !== true && methodValue !== false))) { returnValue = methodValue; return false; }
			});
		}
		else {
			this.each(function() {
				// extend settings and allow for multiple hashes and $.data
				var instance_id = $.data(this, "jstree_instance_id"),
					a = [],
					b = settings ? $.extend({}, true, settings) : {},
					c = $(this), 
					s = false, 
					t = [];
				a = a.concat(args);
				if(c.data("jstree")) { a.push(c.data("jstree")); }
				b = a.length ? $.extend.apply(null, [true, b].concat(a)) : b;

				// if an instance already exists, destroy it first
				if(typeof instance_id !== "undefined" && instances[instance_id]) { instances[instance_id].destroy(); }
				// push a new empty object to the instances array
				instance_id = parseInt(instances.push({}),10) - 1;
				// store the jstree instance id to the container element
				$.data(this, "jstree_instance_id", instance_id);
				// clean up all plugins
				b.plugins = $.isArray(b.plugins) ? b.plugins : $.jstree.defaults.plugins.slice();
				b.plugins.unshift("core");
				// only unique plugins
				b.plugins = b.plugins.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",");

				// extend defaults with passed data
				s = $.extend(true, {}, $.jstree.defaults, b);
				s.plugins = b.plugins;
				$.each(plugins, function (i, val) { 
					if($.inArray(i, s.plugins) === -1) { s[i] = null; delete s[i]; } 
					else { t.push(i); }
				});
				s.plugins = t;

				// push the new object to the instances array (at the same time set the default classes to the container) and init
				instances[instance_id] = new $.jstree._instance(instance_id, $(this).addClass("jstree jstree-" + instance_id), s); 
				// init all activated plugins for this instance
				$.each(instances[instance_id]._get_settings().plugins, function (i, val) { instances[instance_id].data[val] = {}; });
				$.each(instances[instance_id]._get_settings().plugins, function (i, val) { if(plugins[val]) { plugins[val].__init.apply(instances[instance_id]); } });
				// initialize the instance
				setTimeout(function() { if(instances[instance_id]) { instances[instance_id].init(); } }, 0);
			});
		}
		// return the jquery selection (or if it was a method call that returned a value - the returned value)
		return returnValue;
	};
	// object to store exposed functions and objects
	$.jstree = {
		defaults : {
			plugins : []
		},
		_focused : function () { return instances[focused_instance] || null; },
		_reference : function (needle) { 
			// get by instance id
			if(instances[needle]) { return instances[needle]; }
			// get by DOM (if still no luck - return null
			var o = $(needle); 
			if(!o.length && typeof needle === "string") { o = $("#" + needle); }
			if(!o.length) { return null; }
			return instances[o.closest(".jstree").data("jstree_instance_id")] || null; 
		},
		_instance : function (index, container, settings) { 
			// for plugins to store data in
			this.data = { core : {} };
			this.get_settings	= function () { return $.extend(true, {}, settings); };
			this._get_settings	= function () { return settings; };
			this.get_index		= function () { return index; };
			this.get_container	= function () { return container; };
			this.get_container_ul = function () { return container.children("ul:eq(0)"); };
			this._set_settings	= function (s) { 
				settings = $.extend(true, {}, settings, s);
			};
		},
		_fn : { },
		plugin : function (pname, pdata) {
			pdata = $.extend({}, {
				__init		: $.noop, 
				__destroy	: $.noop,
				_fn			: {},
				defaults	: false
			}, pdata);
			plugins[pname] = pdata;

			$.jstree.defaults[pname] = pdata.defaults;
			$.each(pdata._fn, function (i, val) {
				val.plugin		= pname;
				val.old			= $.jstree._fn[i];
				$.jstree._fn[i] = function () {
					var rslt,
						func = val,
						args = Array.prototype.slice.call(arguments),
						evnt = new $.Event("before.jstree"),
						rlbk = false;

					if(this.data.core.locked === true && i !== "unlock" && i !== "is_locked") { return; }

					// Check if function belongs to the included plugins of this instance
					do {
						if(func && func.plugin && $.inArray(func.plugin, this._get_settings().plugins) !== -1) { break; }
						func = func.old;
					} while(func);
					if(!func) { return; }

					// context and function to trigger events, then finally call the function
					if(i.indexOf("_") === 0) {
						rslt = func.apply(this, args);
					}
					else {
						rslt = this.get_container().triggerHandler(evnt, { "func" : i, "inst" : this, "args" : args, "plugin" : func.plugin });
						if(rslt === false) { return; }
						if(typeof rslt !== "undefined") { args = rslt; }

						rslt = func.apply(
							$.extend({}, this, { 
								__callback : function (data) { 
									this.get_container().triggerHandler( i + '.jstree', { "inst" : this, "args" : args, "rslt" : data, "rlbk" : rlbk });
								},
								__rollback : function () { 
									rlbk = this.get_rollback();
									return rlbk;
								},
								__call_old : function (replace_arguments) {
									return func.old.apply(this, (replace_arguments ? Array.prototype.slice.call(arguments, 1) : args ) );
								}
							}), args);
					}

					// return the result
					return rslt;
				};
				$.jstree._fn[i].old = val.old;
				$.jstree._fn[i].plugin = pname;
			});
		},
		rollback : function (rb) {
			if(rb) {
				if(!$.isArray(rb)) { rb = [ rb ]; }
				$.each(rb, function (i, val) {
					instances[val.i].set_rollback(val.h, val.d);
				});
			}
		}
	};
	// set the prototype for all instances
	$.jstree._fn = $.jstree._instance.prototype = {};

	// load the css when DOM is ready
	$(function() {
		// code is copied from jQuery ($.browser is deprecated + there is a bug in IE)
		var u = navigator.userAgent.toLowerCase(),
			v = (u.match( /.+?(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
			css_string = '' + 
				'.jstree ul, .jstree li { display:block; margin:0 0 0 0; padding:0 0 0 0; list-style-type:none; } ' + 
				'.jstree li { display:block; min-height:18px; line-height:18px; white-space:nowrap; margin-left:18px; min-width:18px; } ' + 
				'.jstree-rtl li { margin-left:0; margin-right:18px; } ' + 
				'.jstree > ul > li { margin-left:0px; } ' + 
				'.jstree-rtl > ul > li { margin-right:0px; } ' + 
				'.jstree ins { display:inline-block; text-decoration:none; width:18px; height:18px; margin:0 0 0 0; padding:0; } ' + 
				'.jstree a { display:inline-block; line-height:16px; height:16px; color:black; white-space:nowrap; text-decoration:none; padding:1px 2px; margin:0; } ' + 
				'.jstree a:focus { outline: none; } ' + 
				'.jstree a > ins { height:16px; width:16px; } ' + 
				'.jstree a > .jstree-icon { margin-right:3px; } ' + 
				'.jstree-rtl a > .jstree-icon { margin-left:3px; margin-right:0; } ' + 
				'li.jstree-open > ul { display:block; } ' + 
				'li.jstree-closed > ul { display:none; } ';
		// Correct IE 6 (does not support the > CSS selector)
		if(/msie/.test(u) && parseInt(v, 10) == 6) { 
			is_ie6 = true;

			// fix image flicker and lack of caching
			try {
				document.execCommand("BackgroundImageCache", false, true);
			} catch (err) { }

			css_string += '' + 
				'.jstree li { height:18px; margin-left:0; margin-right:0; } ' + 
				'.jstree li li { margin-left:18px; } ' + 
				'.jstree-rtl li li { margin-left:0px; margin-right:18px; } ' + 
				'li.jstree-open ul { display:block; } ' + 
				'li.jstree-closed ul { display:none !important; } ' + 
				'.jstree li a { display:inline; border-width:0 !important; padding:0px 2px !important; } ' + 
				'.jstree li a ins { height:16px; width:16px; margin-right:3px; } ' + 
				'.jstree-rtl li a ins { margin-right:0px; margin-left:3px; } ';
		}
		// Correct IE 7 (shifts anchor nodes onhover)
		if(/msie/.test(u) && parseInt(v, 10) == 7) { 
			is_ie7 = true;
			css_string += '.jstree li a { border-width:0 !important; padding:0px 2px !important; } ';
		}
		// correct ff2 lack of display:inline-block
		if(!/compatible/.test(u) && /mozilla/.test(u) && parseFloat(v, 10) < 1.9) {
			is_ff2 = true;
			css_string += '' + 
				'.jstree ins { display:-moz-inline-box; } ' + 
				'.jstree li { line-height:12px; } ' + // WHY??
				'.jstree a { display:-moz-inline-box; } ' + 
				'.jstree .jstree-no-icons .jstree-checkbox { display:-moz-inline-stack !important; } ';
				/* this shouldn't be here as it is theme specific */
		}
		// the default stylesheet
		$.vakata.css.add_sheet({ str : css_string, title : "jstree" });
	});

	// core functions (open, close, create, update, delete)
	$.jstree.plugin("core", {
		__init : function () {
			this.data.core.locked = false;
			this.data.core.to_open = this.get_settings().core.initially_open;
			this.data.core.to_load = this.get_settings().core.initially_load;
		},
		defaults : { 
			html_titles	: false,
			animation	: 500,
			initially_open : [],
			initially_load : [],
			open_parents : true,
			notify_plugins : true,
			rtl			: false,
			load_open	: false,
			strings		: {
				loading		: "Loading ...",
				new_node	: "New node",
				multiple_selection : "Multiple selection"
			}
		},
		_fn : { 
			init	: function () { 
				this.set_focus(); 
				if(this._get_settings().core.rtl) {
					this.get_container().addClass("jstree-rtl").css("direction", "rtl");
				}
				this.get_container().html("<ul><li class='jstree-last jstree-leaf'><ins>&#160;</ins><a class='jstree-loading' href='#'><ins class='jstree-icon'>&#160;</ins>" + this._get_string("loading") + "</a></li></ul>");
				this.data.core.li_height = this.get_container_ul().find("li.jstree-closed, li.jstree-leaf").eq(0).height() || 18;

				this.get_container()
					.delegate("li > ins", "click.jstree", $.proxy(function (event) {
							var trgt = $(event.target);
							// if(trgt.is("ins") && event.pageY - trgt.offset().top < this.data.core.li_height) { this.toggle_node(trgt); }
							this.toggle_node(trgt);
						}, this))
					.bind("mousedown.jstree", $.proxy(function () { 
							this.set_focus(); // This used to be setTimeout(set_focus,0) - why?
						}, this))
					.bind("dblclick.jstree", function (event) { 
						var sel;
						if(document.selection && document.selection.empty) { document.selection.empty(); }
						else {
							if(window.getSelection) {
								sel = window.getSelection();
								try { 
									sel.removeAllRanges();
									sel.collapse();
								} catch (err) { }
							}
						}
					});
				if(this._get_settings().core.notify_plugins) {
					this.get_container()
						.bind("load_node.jstree", $.proxy(function (e, data) { 
								var o = this._get_node(data.rslt.obj),
									t = this;
								if(o === -1) { o = this.get_container_ul(); }
								if(!o.length) { return; }
								o.find("li").each(function () {
									var th = $(this);
									if(th.data("jstree")) {
										$.each(th.data("jstree"), function (plugin, values) {
											if(t.data[plugin] && $.isFunction(t["_" + plugin + "_notify"])) {
												t["_" + plugin + "_notify"].call(t, th, values);
											}
										});
									}
								});
							}, this));
				}
				if(this._get_settings().core.load_open) {
					this.get_container()
						.bind("load_node.jstree", $.proxy(function (e, data) { 
								var o = this._get_node(data.rslt.obj),
									t = this;
								if(o === -1) { o = this.get_container_ul(); }
								if(!o.length) { return; }
								o.find("li.jstree-open:not(:has(ul))").each(function () {
									t.load_node(this, $.noop, $.noop);
								});
							}, this));
				}
				this.__callback();
				this.load_node(-1, function () { this.loaded(); this.reload_nodes(); });
			},
			destroy	: function () { 
				var i,
					n = this.get_index(),
					s = this._get_settings(),
					_this = this;

				$.each(s.plugins, function (i, val) {
					try { plugins[val].__destroy.apply(_this); } catch(err) { }
				});
				this.__callback();
				// set focus to another instance if this one is focused
				if(this.is_focused()) { 
					for(i in instances) { 
						if(instances.hasOwnProperty(i) && i != n) { 
							instances[i].set_focus(); 
							break; 
						} 
					}
				}
				// if no other instance found
				if(n === focused_instance) { focused_instance = -1; }
				// remove all traces of jstree in the DOM (only the ones set using jstree*) and cleans all events
				this.get_container()
					.unbind(".jstree")
					.undelegate(".jstree")
					.removeData("jstree_instance_id")
					.find("[class^='jstree']")
						.andSelf()
						.attr("class", function () { return this.className.replace(/jstree[^ ]*|$/ig,''); });
				$(document)
					.unbind(".jstree-" + n)
					.undelegate(".jstree-" + n);
				// remove the actual data
				instances[n] = null;
				delete instances[n];
			},

			_core_notify : function (n, data) {
				if(data.opened) {
					this.open_node(n, false, true);
				}
			},

			lock : function () {
				this.data.core.locked = true;
				this.get_container().children("ul").addClass("jstree-locked").css("opacity","0.7");
				this.__callback({});
			},
			unlock : function () {
				this.data.core.locked = false;
				this.get_container().children("ul").removeClass("jstree-locked").css("opacity","1");
				this.__callback({});
			},
			is_locked : function () { return this.data.core.locked; },
			save_opened : function () {
				var _this = this;
				this.data.core.to_open = [];
				this.get_container_ul().find("li.jstree-open").each(function () { 
					if(this.id) { _this.data.core.to_open.push("#" + this.id.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:")); }
				});
				this.__callback(_this.data.core.to_open);
			},
			save_loaded : function () { },
			reload_nodes : function (is_callback) {
				var _this = this,
					done = true,
					current = [],
					remaining = [];
				if(!is_callback) { 
					this.data.core.reopen = false; 
					this.data.core.refreshing = true; 
					this.data.core.to_open = $.map($.makeArray(this.data.core.to_open), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
					this.data.core.to_load = $.map($.makeArray(this.data.core.to_load), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
					if(this.data.core.to_open.length) {
						this.data.core.to_load = this.data.core.to_load.concat(this.data.core.to_open);
					}
				}
				if(this.data.core.to_load.length) {
					$.each(this.data.core.to_load, function (i, val) {
						if(val == "#") { return true; }
						if($(val).length) { current.push(val); }
						else { remaining.push(val); }
					});
					if(current.length) {
						this.data.core.to_load = remaining;
						$.each(current, function (i, val) { 
							if(!_this._is_loaded(val)) {
								_this.load_node(val, function () { _this.reload_nodes(true); }, function () { _this.reload_nodes(true); });
								done = false;
							}
						});
					}
				}
				if(this.data.core.to_open.length) {
					$.each(this.data.core.to_open, function (i, val) {
						_this.open_node(val, false, true); 
					});
				}
				if(done) { 
					// TODO: find a more elegant approach to syncronizing returning requests
					if(this.data.core.reopen) { clearTimeout(this.data.core.reopen); }
					this.data.core.reopen = setTimeout(function () { _this.__callback({}, _this); }, 50);
					this.data.core.refreshing = false;
					this.reopen();
				}
			},
			reopen : function () {
				var _this = this;
				if(this.data.core.to_open.length) {
					$.each(this.data.core.to_open, function (i, val) {
						_this.open_node(val, false, true); 
					});
				}
				this.__callback({});
			},
			refresh : function (obj) {
				var _this = this;
				this.save_opened();
				if(!obj) { obj = -1; }
				obj = this._get_node(obj);
				if(!obj) { obj = -1; }
				if(obj !== -1) { obj.children("UL").remove(); }
				else { this.get_container_ul().empty(); }
				this.load_node(obj, function () { _this.__callback({ "obj" : obj}); _this.reload_nodes(); });
			},
			// Dummy function to fire after the first load (so that there is a jstree.loaded event)
			loaded	: function () { 
				this.__callback(); 
			},
			// deal with focus
			set_focus	: function () { 
				if(this.is_focused()) { return; }
				var f = $.jstree._focused();
				if(f) { f.unset_focus(); }

				this.get_container().addClass("jstree-focused"); 
				focused_instance = this.get_index(); 
				this.__callback();
			},
			is_focused	: function () { 
				return focused_instance == this.get_index(); 
			},
			unset_focus	: function () {
				if(this.is_focused()) {
					this.get_container().removeClass("jstree-focused"); 
					focused_instance = -1; 
				}
				this.__callback();
			},

			// traverse
			_get_node		: function (obj) { 
				var $obj = $(obj, this.get_container()); 
				if($obj.is(".jstree") || obj == -1) { return -1; } 
				$obj = $obj.closest("li", this.get_container()); 
				return $obj.length ? $obj : false; 
			},
			_get_next		: function (obj, strict) {
				obj = this._get_node(obj);
				if(obj === -1) { return this.get_container().find("> ul > li:first-child"); }
				if(!obj.length) { return false; }
				if(strict) { return (obj.nextAll("li").size() > 0) ? obj.nextAll("li:eq(0)") : false; }

				if(obj.hasClass("jstree-open")) { return obj.find("li:eq(0)"); }
				else if(obj.nextAll("li").size() > 0) { return obj.nextAll("li:eq(0)"); }
				else { return obj.parentsUntil(".jstree","li").next("li").eq(0); }
			},
			_get_prev		: function (obj, strict) {
				obj = this._get_node(obj);
				if(obj === -1) { return this.get_container().find("> ul > li:last-child"); }
				if(!obj.length) { return false; }
				if(strict) { return (obj.prevAll("li").length > 0) ? obj.prevAll("li:eq(0)") : false; }

				if(obj.prev("li").length) {
					obj = obj.prev("li").eq(0);
					while(obj.hasClass("jstree-open")) { obj = obj.children("ul:eq(0)").children("li:last"); }
					return obj;
				}
				else { var o = obj.parentsUntil(".jstree","li:eq(0)"); return o.length ? o : false; }
			},
			_get_parent		: function (obj) {
				obj = this._get_node(obj);
				if(obj == -1 || !obj.length) { return false; }
				var o = obj.parentsUntil(".jstree", "li:eq(0)");
				return o.length ? o : -1;
			},
			_get_children	: function (obj) {
				obj = this._get_node(obj);
				if(obj === -1) { return this.get_container().children("ul:eq(0)").children("li"); }
				if(!obj.length) { return false; }
				return obj.children("ul:eq(0)").children("li");
			},
			get_path		: function (obj, id_mode) {
				var p = [],
					_this = this;
				obj = this._get_node(obj);
				if(obj === -1 || !obj || !obj.length) { return false; }
				obj.parentsUntil(".jstree", "li").each(function () {
					p.push( id_mode ? this.id : _this.get_text(this) );
				});
				p.reverse();
				p.push( id_mode ? obj.attr("id") : this.get_text(obj) );
				return p;
			},

			// string functions
			_get_string : function (key) {
				return this._get_settings().core.strings[key] || key;
			},

			is_open		: function (obj) { obj = this._get_node(obj); return obj && obj !== -1 && obj.hasClass("jstree-open"); },
			is_closed	: function (obj) { obj = this._get_node(obj); return obj && obj !== -1 && obj.hasClass("jstree-closed"); },
			is_leaf		: function (obj) { obj = this._get_node(obj); return obj && obj !== -1 && obj.hasClass("jstree-leaf"); },
			correct_state	: function (obj) {
				obj = this._get_node(obj);
				if(!obj || obj === -1) { return false; }
				obj.removeClass("jstree-closed jstree-open").addClass("jstree-leaf").children("ul").remove();
				this.__callback({ "obj" : obj });
			},
			// open/close
			open_node	: function (obj, callback, skip_animation) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				if(!obj.hasClass("jstree-closed")) { if(callback) { callback.call(); } return false; }
				var s = skip_animation || is_ie6 ? 0 : this._get_settings().core.animation,
					t = this;
				if(!this._is_loaded(obj)) {
					obj.children("a").addClass("jstree-loading");
					this.load_node(obj, function () { t.open_node(obj, callback, skip_animation); }, callback);
				}
				else {
					if(this._get_settings().core.open_parents) {
						obj.parentsUntil(".jstree",".jstree-closed").each(function () {
							t.open_node(this, false, true);
						});
					}
					if(s) { obj.children("ul").css("display","none"); }
					obj.removeClass("jstree-closed").addClass("jstree-open").children("a").removeClass("jstree-loading");
					if(s) { obj.children("ul").stop(true, true).slideDown(s, function () { this.style.display = ""; t.after_open(obj); }); }
					else { t.after_open(obj); }
					this.__callback({ "obj" : obj });
					if(callback) { callback.call(); }
				}
			},
			after_open	: function (obj) { this.__callback({ "obj" : obj }); },
			close_node	: function (obj, skip_animation) {
				obj = this._get_node(obj);
				var s = skip_animation || is_ie6 ? 0 : this._get_settings().core.animation,
					t = this;
				if(!obj.length || !obj.hasClass("jstree-open")) { return false; }
				if(s) { obj.children("ul").attr("style","display:block !important"); }
				obj.removeClass("jstree-open").addClass("jstree-closed");
				if(s) { obj.children("ul").stop(true, true).slideUp(s, function () { this.style.display = ""; t.after_close(obj); }); }
				else { t.after_close(obj); }
				this.__callback({ "obj" : obj });
			},
			after_close	: function (obj) { this.__callback({ "obj" : obj }); },
			toggle_node	: function (obj) {
				obj = this._get_node(obj);
				if(obj.hasClass("jstree-closed")) { return this.open_node(obj); }
				if(obj.hasClass("jstree-open")) { return this.close_node(obj); }
			},
			open_all	: function (obj, do_animation, original_obj) {
				obj = obj ? this._get_node(obj) : -1;
				if(!obj || obj === -1) { obj = this.get_container_ul(); }
				if(original_obj) { 
					obj = obj.find("li.jstree-closed");
				}
				else {
					original_obj = obj;
					if(obj.is(".jstree-closed")) { obj = obj.find("li.jstree-closed").andSelf(); }
					else { obj = obj.find("li.jstree-closed"); }
				}
				var _this = this;
				obj.each(function () { 
					var __this = this; 
					if(!_this._is_loaded(this)) { _this.open_node(this, function() { _this.open_all(__this, do_animation, original_obj); }, !do_animation); }
					else { _this.open_node(this, false, !do_animation); }
				});
				// so that callback is fired AFTER all nodes are open
				if(original_obj.find('li.jstree-closed').length === 0) { this.__callback({ "obj" : original_obj }); }
			},
			close_all	: function (obj, do_animation) {
				var _this = this;
				obj = obj ? this._get_node(obj) : this.get_container();
				if(!obj || obj === -1) { obj = this.get_container_ul(); }
				obj.find("li.jstree-open").andSelf().each(function () { _this.close_node(this, !do_animation); });
				this.__callback({ "obj" : obj });
			},
			clean_node	: function (obj) {
				obj = obj && obj != -1 ? $(obj) : this.get_container_ul();
				obj = obj.is("li") ? obj.find("li").andSelf() : obj.find("li");
				obj.removeClass("jstree-last")
					.filter("li:last-child").addClass("jstree-last").end()
					.filter(":has(li)")
						.not(".jstree-open").removeClass("jstree-leaf").addClass("jstree-closed");
				obj.not(".jstree-open, .jstree-closed").addClass("jstree-leaf").children("ul").remove();
				this.__callback({ "obj" : obj });
			},
			// rollback
			get_rollback : function () { 
				this.__callback();
				return { i : this.get_index(), h : this.get_container().children("ul").clone(true), d : this.data }; 
			},
			set_rollback : function (html, data) {
				this.get_container().empty().append(html);
				this.data = data;
				this.__callback();
			},
			// Dummy functions to be overwritten by any datastore plugin included
			load_node	: function (obj, s_call, e_call) { this.__callback({ "obj" : obj }); },
			_is_loaded	: function (obj) { return true; },

			// Basic operations: create
			create_node	: function (obj, position, js, callback, is_loaded) {
				obj = this._get_node(obj);
				position = typeof position === "undefined" ? "last" : position;
				var d = $("<li />"),
					s = this._get_settings().core,
					tmp;

				if(obj !== -1 && !obj.length) { return false; }
				if(!is_loaded && !this._is_loaded(obj)) { this.load_node(obj, function () { this.create_node(obj, position, js, callback, true); }); return false; }

				this.__rollback();

				if(typeof js === "string") { js = { "data" : js }; }
				if(!js) { js = {}; }
				if(js.attr) { d.attr(js.attr); }
				if(js.metadata) { d.data(js.metadata); }
				if(js.state) { d.addClass("jstree-" + js.state); }
				if(!js.data) { js.data = this._get_string("new_node"); }
				if(!$.isArray(js.data)) { tmp = js.data; js.data = []; js.data.push(tmp); }
				$.each(js.data, function (i, m) {
					tmp = $("<a />");
					if($.isFunction(m)) { m = m.call(this, js); }
					if(typeof m == "string") { tmp.attr('href','#')[ s.html_titles ? "html" : "text" ](m); }
					else {
						if(!m.attr) { m.attr = {}; }
						if(!m.attr.href) { m.attr.href = '#'; }
						tmp.attr(m.attr)[ s.html_titles ? "html" : "text" ](m.title);
						if(m.language) { tmp.addClass(m.language); }
					}
					tmp.prepend("<ins class='jstree-icon'>&#160;</ins>");
					if(!m.icon && js.icon) { m.icon = js.icon; }
					if(m.icon) { 
						if(m.icon.indexOf("/") === -1) { tmp.children("ins").addClass(m.icon); }
						else { tmp.children("ins").css("background","url('" + m.icon + "') center center no-repeat"); }
					}
					d.append(tmp);
				});
				d.prepend("<ins class='jstree-icon'>&#160;</ins>");
				if(obj === -1) {
					obj = this.get_container();
					if(position === "before") { position = "first"; }
					if(position === "after") { position = "last"; }
				}
				switch(position) {
					case "before": obj.before(d); tmp = this._get_parent(obj); break;
					case "after" : obj.after(d);  tmp = this._get_parent(obj); break;
					case "inside":
					case "first" :
						if(!obj.children("ul").length) { obj.append("<ul />"); }
						obj.children("ul").prepend(d);
						tmp = obj;
						break;
					case "last":
						if(!obj.children("ul").length) { obj.append("<ul />"); }
						obj.children("ul").append(d);
						tmp = obj;
						break;
					default:
						if(!obj.children("ul").length) { obj.append("<ul />"); }
						if(!position) { position = 0; }
						tmp = obj.children("ul").children("li").eq(position);
						if(tmp.length) { tmp.before(d); }
						else { obj.children("ul").append(d); }
						tmp = obj;
						break;
				}
				if(tmp === -1 || tmp.get(0) === this.get_container().get(0)) { tmp = -1; }
				this.clean_node(tmp);
				this.__callback({ "obj" : d, "parent" : tmp });
				if(callback) { callback.call(this, d); }
				return d;
			},
			// Basic operations: rename (deal with text)
			get_text	: function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				var s = this._get_settings().core.html_titles;
				obj = obj.children("a:eq(0)");
				if(s) {
					obj = obj.clone();
					obj.children("INS").remove();
					return obj.html();
				}
				else {
					obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
					return obj.nodeValue;
				}
			},
			set_text	: function (obj, val) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				obj = obj.children("a:eq(0)");
				if(this._get_settings().core.html_titles) {
					var tmp = obj.children("INS").clone();
					obj.html(val).prepend(tmp);
					this.__callback({ "obj" : obj, "name" : val });
					return true;
				}
				else {
					obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
					this.__callback({ "obj" : obj, "name" : val });
					return (obj.nodeValue = val);
				}
			},
			rename_node : function (obj, val) {
				obj = this._get_node(obj);
				this.__rollback();
				if(obj && obj.length && this.set_text.apply(this, Array.prototype.slice.call(arguments))) { this.__callback({ "obj" : obj, "name" : val }); }
			},
			// Basic operations: deleting nodes
			delete_node : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				this.__rollback();
				var p = this._get_parent(obj), prev = $([]), t = this;
				obj.each(function () {
					prev = prev.add(t._get_prev(this));
				});
				obj = obj.detach();
				if(p !== -1 && p.find("> ul > li").length === 0) {
					p.removeClass("jstree-open jstree-closed").addClass("jstree-leaf");
				}
				this.clean_node(p);
				this.__callback({ "obj" : obj, "prev" : prev, "parent" : p });
				return obj;
			},
			prepare_move : function (o, r, pos, cb, is_cb) {
				var p = {};

				p.ot = $.jstree._reference(o) || this;
				p.o = p.ot._get_node(o);
				p.r = r === - 1 ? -1 : this._get_node(r);
				p.p = (typeof pos === "undefined" || pos === false) ? "last" : pos; // TODO: move to a setting
				if(!is_cb && prepared_move.o && prepared_move.o[0] === p.o[0] && prepared_move.r[0] === p.r[0] && prepared_move.p === p.p) {
					this.__callback(prepared_move);
					if(cb) { cb.call(this, prepared_move); }
					return;
				}
				p.ot = $.jstree._reference(p.o) || this;
				p.rt = $.jstree._reference(p.r) || this; // r === -1 ? p.ot : $.jstree._reference(p.r) || this
				if(p.r === -1 || !p.r) {
					p.cr = -1;
					switch(p.p) {
						case "first":
						case "before":
						case "inside":
							p.cp = 0; 
							break;
						case "after":
						case "last":
							p.cp = p.rt.get_container().find(" > ul > li").length; 
							break;
						default:
							p.cp = p.p;
							break;
					}
				}
				else {
					if(!/^(before|after)$/.test(p.p) && !this._is_loaded(p.r)) {
						return this.load_node(p.r, function () { this.prepare_move(o, r, pos, cb, true); });
					}
					switch(p.p) {
						case "before":
							p.cp = p.r.index();
							p.cr = p.rt._get_parent(p.r);
							break;
						case "after":
							p.cp = p.r.index() + 1;
							p.cr = p.rt._get_parent(p.r);
							break;
						case "inside":
						case "first":
							p.cp = 0;
							p.cr = p.r;
							break;
						case "last":
							p.cp = p.r.find(" > ul > li").length; 
							p.cr = p.r;
							break;
						default: 
							p.cp = p.p;
							p.cr = p.r;
							break;
					}
				}
				p.np = p.cr == -1 ? p.rt.get_container() : p.cr;
				p.op = p.ot._get_parent(p.o);
				p.cop = p.o.index();
				if(p.op === -1) { p.op = p.ot ? p.ot.get_container() : this.get_container(); }
				if(!/^(before|after)$/.test(p.p) && p.op && p.np && p.op[0] === p.np[0] && p.o.index() < p.cp) { p.cp++; }
				//if(p.p === "before" && p.op && p.np && p.op[0] === p.np[0] && p.o.index() < p.cp) { p.cp--; }
				p.or = p.np.find(" > ul > li:nth-child(" + (p.cp + 1) + ")");
				prepared_move = p;
				this.__callback(prepared_move);
				if(cb) { cb.call(this, prepared_move); }
			},
			check_move : function () {
				var obj = prepared_move, ret = true, r = obj.r === -1 ? this.get_container() : obj.r;
				if(!obj || !obj.o || obj.or[0] === obj.o[0]) { return false; }
				if(obj.op && obj.np && obj.op[0] === obj.np[0] && obj.cp - 1 === obj.o.index()) { return false; }
				obj.o.each(function () { 
					if(r.parentsUntil(".jstree", "li").andSelf().index(this) !== -1) { ret = false; return false; }
				});
				return ret;
			},
			move_node : function (obj, ref, position, is_copy, is_prepared, skip_check) {
				if(!is_prepared) { 
					return this.prepare_move(obj, ref, position, function (p) {
						this.move_node(p, false, false, is_copy, true, skip_check);
					});
				}
				if(is_copy) { 
					prepared_move.cy = true;
				}
				if(!skip_check && !this.check_move()) { return false; }

				this.__rollback();
				var o = false;
				if(is_copy) {
					o = obj.o.clone(true);
					o.find("*[id]").andSelf().each(function () {
						if(this.id) { this.id = "copy_" + this.id; }
					});
				}
				else { o = obj.o; }

				if(obj.or.length) { obj.or.before(o); }
				else { 
					if(!obj.np.children("ul").length) { $("<ul />").appendTo(obj.np); }
					obj.np.children("ul:eq(0)").append(o); 
				}

				try { 
					obj.ot.clean_node(obj.op);
					obj.rt.clean_node(obj.np);
					if(!obj.op.find("> ul > li").length) {
						obj.op.removeClass("jstree-open jstree-closed").addClass("jstree-leaf").children("ul").remove();
					}
				} catch (e) { }

				if(is_copy) { 
					prepared_move.cy = true;
					prepared_move.oc = o; 
				}
				this.__callback(prepared_move);
				return prepared_move;
			},
			_get_move : function () { return prepared_move; }
		}
	});
})(jQuery);
//*/

/* 
 * jsTree ui plugin
 * This plugins handles selecting/deselecting/hovering/dehovering nodes
 */
(function ($) {
	var scrollbar_width, e1, e2;
	$(function() {
		if (/msie/.test(navigator.userAgent.toLowerCase())) {
			e1 = $('<textarea cols="10" rows="2"></textarea>').css({ position: 'absolute', top: -1000, left: 0 }).appendTo('body');
			e2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>').css({ position: 'absolute', top: -1000, left: 0 }).appendTo('body');
			scrollbar_width = e1.width() - e2.width();
			e1.add(e2).remove();
		} 
		else {
			e1 = $('<div />').css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: 0 })
					.prependTo('body').append('<div />').find('div').css({ width: '100%', height: 200 });
			scrollbar_width = 100 - e1.width();
			e1.parent().remove();
		}
	});
	$.jstree.plugin("ui", {
		__init : function () { 
			this.data.ui.selected = $(); 
			this.data.ui.last_selected = false; 
			this.data.ui.hovered = null;
			this.data.ui.to_select = this.get_settings().ui.initially_select;

			this.get_container()
				.delegate("a", "click.jstree", $.proxy(function (event) {
						event.preventDefault();
						event.currentTarget.blur();
						if(!$(event.currentTarget).hasClass("jstree-loading")) {
							this.select_node(event.currentTarget, true, event);
						}
					}, this))
				.delegate("a", "mouseenter.jstree", $.proxy(function (event) {
						if(!$(event.currentTarget).hasClass("jstree-loading")) {
							this.hover_node(event.target);
						}
					}, this))
				.delegate("a", "mouseleave.jstree", $.proxy(function (event) {
						if(!$(event.currentTarget).hasClass("jstree-loading")) {
							this.dehover_node(event.target);
						}
					}, this))
				.bind("reopen.jstree", $.proxy(function () { 
						this.reselect();
					}, this))
				.bind("get_rollback.jstree", $.proxy(function () { 
						this.dehover_node();
						this.save_selected();
					}, this))
				.bind("set_rollback.jstree", $.proxy(function () { 
						this.reselect();
					}, this))
				.bind("close_node.jstree", $.proxy(function (event, data) { 
						var s = this._get_settings().ui,
							obj = this._get_node(data.rslt.obj),
							clk = (obj && obj.length) ? obj.children("ul").find("a.jstree-clicked") : $(),
							_this = this;
						if(s.selected_parent_close === false || !clk.length) { return; }
						clk.each(function () { 
							_this.deselect_node(this);
							if(s.selected_parent_close === "select_parent") { _this.select_node(obj); }
						});
					}, this))
				.bind("delete_node.jstree", $.proxy(function (event, data) { 
						var s = this._get_settings().ui.select_prev_on_delete,
							obj = this._get_node(data.rslt.obj),
							clk = (obj && obj.length) ? obj.find("a.jstree-clicked") : [],
							_this = this;
						clk.each(function () { _this.deselect_node(this); });
						if(s && clk.length) { 
							data.rslt.prev.each(function () { 
								if(this.parentNode) { _this.select_node(this); return false; /* if return false is removed all prev nodes will be selected */}
							});
						}
					}, this))
				.bind("move_node.jstree", $.proxy(function (event, data) { 
						if(data.rslt.cy) { 
							data.rslt.oc.find("a.jstree-clicked").removeClass("jstree-clicked");
						}
					}, this));
		},
		defaults : {
			select_limit : -1, // 0, 1, 2 ... or -1 for unlimited
			select_multiple_modifier : "ctrl", // on, or ctrl, shift, alt
			select_range_modifier : "shift",
			selected_parent_close : "select_parent", // false, "deselect", "select_parent"
			selected_parent_open : true,
			select_prev_on_delete : true,
			disable_selecting_children : false,
			initially_select : []
		},
		_fn : { 
			_get_node : function (obj, allow_multiple) {
				if(typeof obj === "undefined" || obj === null) { return allow_multiple ? this.data.ui.selected : this.data.ui.last_selected; }
				var $obj = $(obj, this.get_container()); 
				if($obj.is(".jstree") || obj == -1) { return -1; } 
				$obj = $obj.closest("li", this.get_container()); 
				return $obj.length ? $obj : false; 
			},
			_ui_notify : function (n, data) {
				if(data.selected) {
					this.select_node(n, false);
				}
			},
			save_selected : function () {
				var _this = this;
				this.data.ui.to_select = [];
				this.data.ui.selected.each(function () { if(this.id) { _this.data.ui.to_select.push("#" + this.id.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:")); } });
				this.__callback(this.data.ui.to_select);
			},
			reselect : function () {
				var _this = this,
					s = this.data.ui.to_select;
				s = $.map($.makeArray(s), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
				// this.deselect_all(); WHY deselect, breaks plugin state notifier?
				$.each(s, function (i, val) { if(val && val !== "#") { _this.select_node(val); } });
				this.data.ui.selected = this.data.ui.selected.filter(function () { return this.parentNode; });
				this.__callback();
			},
			refresh : function (obj) {
				this.save_selected();
				return this.__call_old();
			},
			hover_node : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				//if(this.data.ui.hovered && obj.get(0) === this.data.ui.hovered.get(0)) { return; }
				if(!obj.hasClass("jstree-hovered")) { this.dehover_node(); }
				this.data.ui.hovered = obj.children("a").addClass("jstree-hovered").parent();
				this._fix_scroll(obj);
				this.__callback({ "obj" : obj });
			},
			dehover_node : function () {
				var obj = this.data.ui.hovered, p;
				if(!obj || !obj.length) { return false; }
				p = obj.children("a").removeClass("jstree-hovered").parent();
				if(this.data.ui.hovered[0] === p[0]) { this.data.ui.hovered = null; }
				this.__callback({ "obj" : obj });
			},
			select_node : function (obj, check, e) {
				obj = this._get_node(obj);
				if(obj == -1 || !obj || !obj.length) { return false; }
				var s = this._get_settings().ui,
					is_multiple = (s.select_multiple_modifier == "on" || (s.select_multiple_modifier !== false && e && e[s.select_multiple_modifier + "Key"])),
					is_range = (s.select_range_modifier !== false && e && e[s.select_range_modifier + "Key"] && this.data.ui.last_selected && this.data.ui.last_selected[0] !== obj[0] && this.data.ui.last_selected.parent()[0] === obj.parent()[0]),
					is_selected = this.is_selected(obj),
					proceed = true,
					t = this;
				if(check) {
					if(s.disable_selecting_children && is_multiple && 
						(
							(obj.parentsUntil(".jstree","li").children("a.jstree-clicked").length) ||
							(obj.children("ul").find("a.jstree-clicked:eq(0)").length)
						)
					) {
						return false;
					}
					proceed = false;
					switch(!0) {
						case (is_range):
							this.data.ui.last_selected.addClass("jstree-last-selected");
							obj = obj[ obj.index() < this.data.ui.last_selected.index() ? "nextUntil" : "prevUntil" ](".jstree-last-selected").andSelf();
							if(s.select_limit == -1 || obj.length < s.select_limit) {
								this.data.ui.last_selected.removeClass("jstree-last-selected");
								this.data.ui.selected.each(function () {
									if(this !== t.data.ui.last_selected[0]) { t.deselect_node(this); }
								});
								is_selected = false;
								proceed = true;
							}
							else {
								proceed = false;
							}
							break;
						case (is_selected && !is_multiple): 
							this.deselect_all();
							is_selected = false;
							proceed = true;
							break;
						case (!is_selected && !is_multiple): 
							if(s.select_limit == -1 || s.select_limit > 0) {
								this.deselect_all();
								proceed = true;
							}
							break;
						case (is_selected && is_multiple): 
							this.deselect_node(obj);
							break;
						case (!is_selected && is_multiple): 
							if(s.select_limit == -1 || this.data.ui.selected.length + 1 <= s.select_limit) { 
								proceed = true;
							}
							break;
					}
				}
				if(proceed && !is_selected) {
					if(!is_range) { this.data.ui.last_selected = obj; }
					obj.children("a").addClass("jstree-clicked");
					if(s.selected_parent_open) {
						obj.parents(".jstree-closed").each(function () { t.open_node(this, false, true); });
					}
					this.data.ui.selected = this.data.ui.selected.add(obj);
					this._fix_scroll(obj.eq(0));
					this.__callback({ "obj" : obj, "e" : e });
				}
			},
			_fix_scroll : function (obj) {
				var c = this.get_container()[0], t;
				if(c.scrollHeight > c.offsetHeight) {
					obj = this._get_node(obj);
					if(!obj || obj === -1 || !obj.length || !obj.is(":visible")) { return; }
					t = obj.offset().top - this.get_container().offset().top;
					if(t < 0) { 
						c.scrollTop = c.scrollTop + t - 1; 
					}
					if(t + this.data.core.li_height + (c.scrollWidth > c.offsetWidth ? scrollbar_width : 0) > c.offsetHeight) { 
						c.scrollTop = c.scrollTop + (t - c.offsetHeight + this.data.core.li_height + 1 + (c.scrollWidth > c.offsetWidth ? scrollbar_width : 0)); 
					}
				}
			},
			deselect_node : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				if(this.is_selected(obj)) {
					obj.children("a").removeClass("jstree-clicked");
					this.data.ui.selected = this.data.ui.selected.not(obj);
					if(this.data.ui.last_selected.get(0) === obj.get(0)) { this.data.ui.last_selected = this.data.ui.selected.eq(0); }
					this.__callback({ "obj" : obj });
				}
			},
			toggle_select : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				if(this.is_selected(obj)) { this.deselect_node(obj); }
				else { this.select_node(obj); }
			},
			is_selected : function (obj) { return this.data.ui.selected.index(this._get_node(obj)) >= 0; },
			get_selected : function (context) { 
				return context ? $(context).find("a.jstree-clicked").parent() : this.data.ui.selected; 
			},
			deselect_all : function (context) {
				var ret = context ? $(context).find("a.jstree-clicked").parent() : this.get_container().find("a.jstree-clicked").parent();
				ret.children("a.jstree-clicked").removeClass("jstree-clicked");
				this.data.ui.selected = $([]);
				this.data.ui.last_selected = false;
				this.__callback({ "obj" : ret });
			}
		}
	});
	// include the selection plugin by default
	$.jstree.defaults.plugins.push("ui");
})(jQuery);
//*/

/* 
 * jsTree CRRM plugin
 * Handles creating/renaming/removing/moving nodes by user interaction.
 */
(function ($) {
	$.jstree.plugin("crrm", { 
		__init : function () {
			this.get_container()
				.bind("move_node.jstree", $.proxy(function (e, data) {
					if(this._get_settings().crrm.move.open_onmove) {
						var t = this;
						data.rslt.np.parentsUntil(".jstree").andSelf().filter(".jstree-closed").each(function () {
							t.open_node(this, false, true);
						});
					}
				}, this));
		},
		defaults : {
			input_width_limit : 200,
			move : {
				always_copy			: false, // false, true or "multitree"
				open_onmove			: true,
				default_position	: "last",
				check_move			: function (m) { return true; }
			}
		},
		_fn : {
			_show_input : function (obj, callback) {
				obj = this._get_node(obj);
				var rtl = this._get_settings().core.rtl,
					w = this._get_settings().crrm.input_width_limit,
					w1 = obj.children("ins").width(),
					w2 = obj.find("> a:visible > ins").width() * obj.find("> a:visible > ins").length,
					t = this.get_text(obj),
					h1 = $("<div />", { css : { "position" : "absolute", "top" : "-200px", "left" : (rtl ? "0px" : "-1000px"), "visibility" : "hidden" } }).appendTo("body"),
					h2 = obj.css("position","relative").append(
					$("<input />", { 
						"value" : t,
						"class" : "jstree-rename-input",
						// "size" : t.length,
						"css" : {
							"padding" : "0",
							"border" : "1px solid silver",
							"position" : "absolute",
							"left"  : (rtl ? "auto" : (w1 + w2 + 4) + "px"),
							"right" : (rtl ? (w1 + w2 + 4) + "px" : "auto"),
							"top" : "0px",
							"height" : (this.data.core.li_height - 2) + "px",
							"lineHeight" : (this.data.core.li_height - 2) + "px",
							"width" : "150px" // will be set a bit further down
						},
						"blur" : $.proxy(function () {
							var i = obj.children(".jstree-rename-input"),
								v = i.val();
							if(v === "") { v = t; }
							h1.remove();
							i.remove(); // rollback purposes
							this.set_text(obj,t); // rollback purposes
							this.rename_node(obj, v);
							callback.call(this, obj, v, t);
							obj.css("position","");
						}, this),
						"keyup" : function (event) {
							var key = event.keyCode || event.which;
							if(key == 27) { this.value = t; this.blur(); return; }
							else if(key == 13) { this.blur(); return; }
							else {
								h2.width(Math.min(h1.text("pW" + this.value).width(),w));
							}
						},
						"keypress" : function(event) {
							var key = event.keyCode || event.which;
							if(key == 13) { return false; }
						}
					})
				).children(".jstree-rename-input"); 
				this.set_text(obj, "");
				h1.css({
						fontFamily		: h2.css('fontFamily')		|| '',
						fontSize		: h2.css('fontSize')		|| '',
						fontWeight		: h2.css('fontWeight')		|| '',
						fontStyle		: h2.css('fontStyle')		|| '',
						fontStretch		: h2.css('fontStretch')		|| '',
						fontVariant		: h2.css('fontVariant')		|| '',
						letterSpacing	: h2.css('letterSpacing')	|| '',
						wordSpacing		: h2.css('wordSpacing')		|| ''
				});
				h2.width(Math.min(h1.text("pW" + h2[0].value).width(),w))[0].select();
			},
			rename : function (obj) {
				obj = this._get_node(obj);
				this.__rollback();
				var f = this.__callback;
				this._show_input(obj, function (obj, new_name, old_name) { 
					f.call(this, { "obj" : obj, "new_name" : new_name, "old_name" : old_name });
				});
			},
			create : function (obj, position, js, callback, skip_rename) {
				var t, _this = this;
				obj = this._get_node(obj);
				if(!obj) { obj = -1; }
				this.__rollback();
				t = this.create_node(obj, position, js, function (t) {
					var p = this._get_parent(t),
						pos = $(t).index();
					if(callback) { callback.call(this, t); }
					if(p.length && p.hasClass("jstree-closed")) { this.open_node(p, false, true); }
					if(!skip_rename) { 
						this._show_input(t, function (obj, new_name, old_name) { 
							_this.__callback({ "obj" : obj, "name" : new_name, "parent" : p, "position" : pos });
						});
					}
					else { _this.__callback({ "obj" : t, "name" : this.get_text(t), "parent" : p, "position" : pos }); }
				});
				return t;
			},
			remove : function (obj) {
				obj = this._get_node(obj, true);
				var p = this._get_parent(obj), prev = this._get_prev(obj);
				this.__rollback();
				obj = this.delete_node(obj);
				if(obj !== false) { this.__callback({ "obj" : obj, "prev" : prev, "parent" : p }); }
			},
			check_move : function () {
				if(!this.__call_old()) { return false; }
				var s = this._get_settings().crrm.move;
				if(!s.check_move.call(this, this._get_move())) { return false; }
				return true;
			},
			move_node : function (obj, ref, position, is_copy, is_prepared, skip_check) {
				var s = this._get_settings().crrm.move;
				if(!is_prepared) { 
					if(typeof position === "undefined") { position = s.default_position; }
					if(position === "inside" && !s.default_position.match(/^(before|after)$/)) { position = s.default_position; }
					return this.__call_old(true, obj, ref, position, is_copy, false, skip_check);
				}
				// if the move is already prepared
				if(s.always_copy === true || (s.always_copy === "multitree" && obj.rt.get_index() !== obj.ot.get_index() )) {
					is_copy = true;
				}
				this.__call_old(true, obj, ref, position, is_copy, true, skip_check);
			},

			cut : function (obj) {
				obj = this._get_node(obj, true);
				if(!obj || !obj.length) { return false; }
				this.data.crrm.cp_nodes = false;
				this.data.crrm.ct_nodes = obj;
				this.__callback({ "obj" : obj });
			},
			copy : function (obj) {
				obj = this._get_node(obj, true);
				if(!obj || !obj.length) { return false; }
				this.data.crrm.ct_nodes = false;
				this.data.crrm.cp_nodes = obj;
				this.__callback({ "obj" : obj });
			},
			paste : function (obj) { 
				obj = this._get_node(obj);
				if(!obj || !obj.length) { return false; }
				var nodes = this.data.crrm.ct_nodes ? this.data.crrm.ct_nodes : this.data.crrm.cp_nodes;
				if(!this.data.crrm.ct_nodes && !this.data.crrm.cp_nodes) { return false; }
				if(this.data.crrm.ct_nodes) { this.move_node(this.data.crrm.ct_nodes, obj); this.data.crrm.ct_nodes = false; }
				if(this.data.crrm.cp_nodes) { this.move_node(this.data.crrm.cp_nodes, obj, false, true); }
				this.__callback({ "obj" : obj, "nodes" : nodes });
			}
		}
	});
	// include the crr plugin by default
	// $.jstree.defaults.plugins.push("crrm");
})(jQuery);
//*/

/* 
 * jsTree themes plugin
 * Handles loading and setting themes, as well as detecting path to themes, etc.
 */
(function ($) {
	var themes_loaded = [];
	// this variable stores the path to the themes folder - if left as false - it will be autodetected
	$.jstree._themes = false;
	$.jstree.plugin("themes", {
		__init : function () { 
			this.get_container()
				.bind("init.jstree", $.proxy(function () {
						var s = this._get_settings().themes;
						this.data.themes.dots = s.dots; 
						this.data.themes.icons = s.icons; 
						this.set_theme(s.theme, s.url);
					}, this))
				.bind("loaded.jstree", $.proxy(function () {
						// bound here too, as simple HTML tree's won't honor dots & icons otherwise
						if(!this.data.themes.dots) { this.hide_dots(); }
						else { this.show_dots(); }
						if(!this.data.themes.icons) { this.hide_icons(); }
						else { this.show_icons(); }
					}, this));
		},
		defaults : { 
			theme : "default", 
			url : false,
			dots : true,
			icons : true
		},
		_fn : {
			set_theme : function (theme_name, theme_url) {
				if(!theme_name) { return false; }
				if(!theme_url) { theme_url = $.jstree._themes + theme_name + '/style.css'; }
				if($.inArray(theme_url, themes_loaded) == -1) {
					$.vakata.css.add_sheet({ "url" : theme_url });
					themes_loaded.push(theme_url);
				}
				if(this.data.themes.theme != theme_name) {
					this.get_container().removeClass('jstree-' + this.data.themes.theme);
					this.data.themes.theme = theme_name;
				}
				this.get_container().addClass('jstree-' + theme_name);
				if(!this.data.themes.dots) { this.hide_dots(); }
				else { this.show_dots(); }
				if(!this.data.themes.icons) { this.hide_icons(); }
				else { this.show_icons(); }
				this.__callback();
			},
			get_theme	: function () { return this.data.themes.theme; },

			show_dots	: function () { this.data.themes.dots = true; this.get_container().children("ul").removeClass("jstree-no-dots"); },
			hide_dots	: function () { this.data.themes.dots = false; this.get_container().children("ul").addClass("jstree-no-dots"); },
			toggle_dots	: function () { if(this.data.themes.dots) { this.hide_dots(); } else { this.show_dots(); } },

			show_icons	: function () { this.data.themes.icons = true; this.get_container().children("ul").removeClass("jstree-no-icons"); },
			hide_icons	: function () { this.data.themes.icons = false; this.get_container().children("ul").addClass("jstree-no-icons"); },
			toggle_icons: function () { if(this.data.themes.icons) { this.hide_icons(); } else { this.show_icons(); } }
		}
	});
	// autodetect themes path
	$(function () {
		if($.jstree._themes === false) {
			$("script").each(function () { 
				if(this.src.toString().match(/jquery\.jstree[^\/]*?\.js(\?.*)?$/)) { 
					$.jstree._themes = this.src.toString().replace(/jquery\.jstree[^\/]*?\.js(\?.*)?$/, "") + 'themes/'; 
					return false; 
				}
			});
		}
		if($.jstree._themes === false) { $.jstree._themes = "themes/"; }
	});
	// include the themes plugin by default
	$.jstree.defaults.plugins.push("themes");
})(jQuery);
//*/

/*
 * jsTree hotkeys plugin
 * Enables keyboard navigation for all tree instances
 * Depends on the jstree ui & jquery hotkeys plugins
 */
(function ($) {
	var bound = [];
	function exec(i, event) {
		var f = $.jstree._focused(), tmp;
		if(f && f.data && f.data.hotkeys && f.data.hotkeys.enabled) { 
			tmp = f._get_settings().hotkeys[i];
			if(tmp) { return tmp.call(f, event); }
		}
	}
	$.jstree.plugin("hotkeys", {
		__init : function () {
			if(typeof $.hotkeys === "undefined") { throw "jsTree hotkeys: jQuery hotkeys plugin not included."; }
			if(!this.data.ui) { throw "jsTree hotkeys: jsTree UI plugin not included."; }
			$.each(this._get_settings().hotkeys, function (i, v) {
				if(v !== false && $.inArray(i, bound) == -1) {
					$(document).bind("keydown", i, function (event) { return exec(i, event); });
					bound.push(i);
				}
			});
			this.get_container()
				.bind("lock.jstree", $.proxy(function () {
						if(this.data.hotkeys.enabled) { this.data.hotkeys.enabled = false; this.data.hotkeys.revert = true; }
					}, this))
				.bind("unlock.jstree", $.proxy(function () {
						if(this.data.hotkeys.revert) { this.data.hotkeys.enabled = true; }
					}, this));
			this.enable_hotkeys();
		},
		defaults : {
			"up" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_prev(o));
				return false; 
			},
			"ctrl+up" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_prev(o));
				return false; 
			},
			"shift+up" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_prev(o));
				return false; 
			},
			"down" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_next(o));
				return false;
			},
			"ctrl+down" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_next(o));
				return false;
			},
			"shift+down" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_next(o));
				return false;
			},
			"left" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o) {
					if(o.hasClass("jstree-open")) { this.close_node(o); }
					else { this.hover_node(this._get_prev(o)); }
				}
				return false;
			},
			"ctrl+left" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o) {
					if(o.hasClass("jstree-open")) { this.close_node(o); }
					else { this.hover_node(this._get_prev(o)); }
				}
				return false;
			},
			"shift+left" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o) {
					if(o.hasClass("jstree-open")) { this.close_node(o); }
					else { this.hover_node(this._get_prev(o)); }
				}
				return false;
			},
			"right" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o && o.length) {
					if(o.hasClass("jstree-closed")) { this.open_node(o); }
					else { this.hover_node(this._get_next(o)); }
				}
				return false;
			},
			"ctrl+right" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o && o.length) {
					if(o.hasClass("jstree-closed")) { this.open_node(o); }
					else { this.hover_node(this._get_next(o)); }
				}
				return false;
			},
			"shift+right" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o && o.length) {
					if(o.hasClass("jstree-closed")) { this.open_node(o); }
					else { this.hover_node(this._get_next(o)); }
				}
				return false;
			},
			"space" : function () { 
				if(this.data.ui.hovered) { this.data.ui.hovered.children("a:eq(0)").click(); } 
				return false; 
			},
			"ctrl+space" : function (event) { 
				event.type = "click";
				if(this.data.ui.hovered) { this.data.ui.hovered.children("a:eq(0)").trigger(event); } 
				return false; 
			},
			"shift+space" : function (event) { 
				event.type = "click";
				if(this.data.ui.hovered) { this.data.ui.hovered.children("a:eq(0)").trigger(event); } 
				return false; 
			},
			"f2" : function () { this.rename(this.data.ui.hovered || this.data.ui.last_selected); },
			"del" : function () { this.remove(this.data.ui.hovered || this._get_node(null)); }
		},
		_fn : {
			enable_hotkeys : function () {
				this.data.hotkeys.enabled = true;
			},
			disable_hotkeys : function () {
				this.data.hotkeys.enabled = false;
			}
		}
	});
})(jQuery);
//*/

/* 
 * jsTree JSON plugin
 * The JSON data store. Datastores are build by overriding the `load_node` and `_is_loaded` functions.
 */
(function ($) {
	$.jstree.plugin("json_data", {
		__init : function() {
			var s = this._get_settings().json_data;
			if(s.progressive_unload) {
				this.get_container().bind("after_close.jstree", function (e, data) {
					data.rslt.obj.children("ul").remove();
				});
			}
		},
		defaults : { 
			// `data` can be a function:
			//  * accepts two arguments - node being loaded and a callback to pass the result to
			//  * will be executed in the current tree's scope & ajax won't be supported
			data : false, 
			ajax : false,
			correct_state : true,
			progressive_render : false,
			progressive_unload : false
		},
		_fn : {
			load_node : function (obj, s_call, e_call) { var _this = this; this.load_node_json(obj, function () { _this.__callback({ "obj" : _this._get_node(obj) }); s_call.call(this); }, e_call); },
			_is_loaded : function (obj) { 
				var s = this._get_settings().json_data;
				obj = this._get_node(obj); 
				return obj == -1 || !obj || (!s.ajax && !s.progressive_render && !$.isFunction(s.data)) || obj.is(".jstree-open, .jstree-leaf") || obj.children("ul").children("li").length > 0;
			},
			refresh : function (obj) {
				obj = this._get_node(obj);
				var s = this._get_settings().json_data;
				if(obj && obj !== -1 && s.progressive_unload && ($.isFunction(s.data) || !!s.ajax)) {
					obj.removeData("jstree_children");
				}
				return this.__call_old();
			},
			load_node_json : function (obj, s_call, e_call) {
				var s = this.get_settings().json_data, d,
					error_func = function () {},
					success_func = function () {};
				obj = this._get_node(obj);

				if(obj && obj !== -1 && (s.progressive_render || s.progressive_unload) && !obj.is(".jstree-open, .jstree-leaf") && obj.children("ul").children("li").length === 0 && obj.data("jstree_children")) {
					d = this._parse_json(obj.data("jstree_children"), obj);
					if(d) {
						obj.append(d);
						if(!s.progressive_unload) { obj.removeData("jstree_children"); }
					}
					this.clean_node(obj);
					if(s_call) { s_call.call(this); }
					return;
				}

				if(obj && obj !== -1) {
					if(obj.data("jstree_is_loading")) { return; }
					else { obj.data("jstree_is_loading",true); }
				}
				switch(!0) {
					case (!s.data && !s.ajax): throw "Neither data nor ajax settings supplied.";
					// function option added here for easier model integration (also supporting async - see callback)
					case ($.isFunction(s.data)):
						s.data.call(this, obj, $.proxy(function (d) {
							d = this._parse_json(d, obj);
							if(!d) { 
								if(obj === -1 || !obj) {
									if(s.correct_state) { this.get_container().children("ul").empty(); }
								}
								else {
									obj.children("a.jstree-loading").removeClass("jstree-loading");
									obj.removeData("jstree_is_loading");
									if(s.correct_state) { this.correct_state(obj); }
								}
								if(e_call) { e_call.call(this); }
							}
							else {
								if(obj === -1 || !obj) { this.get_container().children("ul").empty().append(d.children()); }
								else { obj.append(d).children("a.jstree-loading").removeClass("jstree-loading"); obj.removeData("jstree_is_loading"); }
								this.clean_node(obj);
								if(s_call) { s_call.call(this); }
							}
						}, this));
						break;
					case (!!s.data && !s.ajax) || (!!s.data && !!s.ajax && (!obj || obj === -1)):
						if(!obj || obj == -1) {
							d = this._parse_json(s.data, obj);
							if(d) {
								this.get_container().children("ul").empty().append(d.children());
								this.clean_node();
							}
							else { 
								if(s.correct_state) { this.get_container().children("ul").empty(); }
							}
						}
						if(s_call) { s_call.call(this); }
						break;
					case (!s.data && !!s.ajax) || (!!s.data && !!s.ajax && obj && obj !== -1):
						error_func = function (x, t, e) {
							var ef = this.get_settings().json_data.ajax.error; 
							if(ef) { ef.call(this, x, t, e); }
							if(obj != -1 && obj.length) {
								obj.children("a.jstree-loading").removeClass("jstree-loading");
								obj.removeData("jstree_is_loading");
								if(t === "success" && s.correct_state) { this.correct_state(obj); }
							}
							else {
								if(t === "success" && s.correct_state) { this.get_container().children("ul").empty(); }
							}
							if(e_call) { e_call.call(this); }
						};
						success_func = function (d, t, x) {
							var sf = this.get_settings().json_data.ajax.success; 
							if(sf) { d = sf.call(this,d,t,x) || d; }
							if(d === "" || (d && d.toString && d.toString().replace(/^[\s\n]+$/,"") === "") || (!$.isArray(d) && !$.isPlainObject(d))) {
								return error_func.call(this, x, t, "");
							}
							d = this._parse_json(d, obj);
							if(d) {
								if(obj === -1 || !obj) { this.get_container().children("ul").empty().append(d.children()); }
								else { obj.append(d).children("a.jstree-loading").removeClass("jstree-loading"); obj.removeData("jstree_is_loading"); }
								this.clean_node(obj);
								if(s_call) { s_call.call(this); }
							}
							else {
								if(obj === -1 || !obj) {
									if(s.correct_state) { 
										this.get_container().children("ul").empty(); 
										if(s_call) { s_call.call(this); }
									}
								}
								else {
									obj.children("a.jstree-loading").removeClass("jstree-loading");
									obj.removeData("jstree_is_loading");
									if(s.correct_state) { 
										this.correct_state(obj);
										if(s_call) { s_call.call(this); } 
									}
								}
							}
						};
						s.ajax.context = this;
						s.ajax.error = error_func;
						s.ajax.success = success_func;
						if(!s.ajax.dataType) { s.ajax.dataType = "json"; }
						if($.isFunction(s.ajax.url)) { s.ajax.url = s.ajax.url.call(this, obj); }
						if($.isFunction(s.ajax.data)) { s.ajax.data = s.ajax.data.call(this, obj); }
						$.ajax(s.ajax);
						break;
				}
			},
			_parse_json : function (js, obj, is_callback) {
				var d = false, 
					p = this._get_settings(),
					s = p.json_data,
					t = p.core.html_titles,
					tmp, i, j, ul1, ul2;

				if(!js) { return d; }
				if(s.progressive_unload && obj && obj !== -1) { 
					obj.data("jstree_children", d);
				}
				if($.isArray(js)) {
					d = $();
					if(!js.length) { return false; }
					for(i = 0, j = js.length; i < j; i++) {
						tmp = this._parse_json(js[i], obj, true);
						if(tmp.length) { d = d.add(tmp); }
					}
				}
				else {
					if(typeof js == "string") { js = { data : js }; }
					if(!js.data && js.data !== "") { return d; }
					d = $("<li />");
					if(js.attr) { d.attr(js.attr); }
					if(js.metadata) { d.data(js.metadata); }
					if(js.state) { d.addClass("jstree-" + js.state); }
					if(!$.isArray(js.data)) { tmp = js.data; js.data = []; js.data.push(tmp); }
					$.each(js.data, function (i, m) {
						tmp = $("<a />");
						if($.isFunction(m)) { m = m.call(this, js); }
						if(typeof m == "string") { tmp.attr('href','#')[ t ? "html" : "text" ](m); }
						else {
							if(!m.attr) { m.attr = {}; }
							if(!m.attr.href) { m.attr.href = '#'; }
							tmp.attr(m.attr)[ t ? "html" : "text" ](m.title);
							if(m.language) { tmp.addClass(m.language); }
						}
						tmp.prepend("<ins class='jstree-icon'>&#160;</ins>");
						if(!m.icon && js.icon) { m.icon = js.icon; }
						if(m.icon) { 
							if(m.icon.indexOf("/") === -1) { tmp.children("ins").addClass(m.icon); }
							else { tmp.children("ins").css("background","url('" + m.icon + "') center center no-repeat"); }
						}
						d.append(tmp);
					});
					d.prepend("<ins class='jstree-icon'>&#160;</ins>");
					if(js.children) { 
						if(s.progressive_render && js.state !== "open") {
							d.addClass("jstree-closed").data("jstree_children", js.children);
						}
						else {
							if(s.progressive_unload) { d.data("jstree_children", js.children); }
							if($.isArray(js.children) && js.children.length) {
								tmp = this._parse_json(js.children, obj, true);
								if(tmp.length) {
									ul2 = $("<ul />");
									ul2.append(tmp);
									d.append(ul2);
								}
							}
						}
					}
				}
				if(!is_callback) {
					ul1 = $("<ul />");
					ul1.append(d);
					d = ul1;
				}
				return d;
			},
			get_json : function (obj, li_attr, a_attr, is_callback) {
				var result = [], 
					s = this._get_settings(), 
					_this = this,
					tmp1, tmp2, li, a, t, lang;
				obj = this._get_node(obj);
				if(!obj || obj === -1) { obj = this.get_container().find("> ul > li"); }
				li_attr = $.isArray(li_attr) ? li_attr : [ "id", "class" ];
				if(!is_callback && this.data.types) { li_attr.push(s.types.type_attr); }
				a_attr = $.isArray(a_attr) ? a_attr : [ ];

				obj.each(function () {
					li = $(this);
					tmp1 = { data : [] };
					if(li_attr.length) { tmp1.attr = { }; }
					$.each(li_attr, function (i, v) { 
						tmp2 = li.attr(v); 
						if(tmp2 && tmp2.length && tmp2.replace(/jstree[^ ]*/ig,'').length) {
							tmp1.attr[v] = (" " + tmp2).replace(/ jstree[^ ]*/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,""); 
						}
					});
					if(li.hasClass("jstree-open")) { tmp1.state = "open"; }
					if(li.hasClass("jstree-closed")) { tmp1.state = "closed"; }
					if(li.data()) { tmp1.metadata = li.data(); }
					a = li.children("a");
					a.each(function () {
						t = $(this);
						if(
							a_attr.length || 
							$.inArray("languages", s.plugins) !== -1 || 
							t.children("ins").get(0).style.backgroundImage.length || 
							(t.children("ins").get(0).className && t.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').length)
						) { 
							lang = false;
							if($.inArray("languages", s.plugins) !== -1 && $.isArray(s.languages) && s.languages.length) {
								$.each(s.languages, function (l, lv) {
									if(t.hasClass(lv)) {
										lang = lv;
										return false;
									}
								});
							}
							tmp2 = { attr : { }, title : _this.get_text(t, lang) }; 
							$.each(a_attr, function (k, z) {
								tmp2.attr[z] = (" " + (t.attr(z) || "")).replace(/ jstree[^ ]*/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"");
							});
							if($.inArray("languages", s.plugins) !== -1 && $.isArray(s.languages) && s.languages.length) {
								$.each(s.languages, function (k, z) {
									if(t.hasClass(z)) { tmp2.language = z; return true; }
								});
							}
							if(t.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').replace(/^\s+$/ig,"").length) {
								tmp2.icon = t.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"");
							}
							if(t.children("ins").get(0).style.backgroundImage.length) {
								tmp2.icon = t.children("ins").get(0).style.backgroundImage.replace("url(","").replace(")","");
							}
						}
						else {
							tmp2 = _this.get_text(t);
						}
						if(a.length > 1) { tmp1.data.push(tmp2); }
						else { tmp1.data = tmp2; }
					});
					li = li.find("> ul > li");
					if(li.length) { tmp1.children = _this.get_json(li, li_attr, a_attr, true); }
					result.push(tmp1);
				});
				return result;
			}
		}
	});
})(jQuery);
//*/

/* 
 * jsTree languages plugin
 * Adds support for multiple language versions in one tree
 * This basically allows for many titles coexisting in one node, but only one of them being visible at any given time
 * This is useful for maintaining the same structure in many languages (hence the name of the plugin)
 */
(function ($) {
	$.jstree.plugin("languages", {
		__init : function () { this._load_css();  },
		defaults : [],
		_fn : {
			set_lang : function (i) { 
				var langs = this._get_settings().languages,
					st = false,
					selector = ".jstree-" + this.get_index() + ' a';
				if(!$.isArray(langs) || langs.length === 0) { return false; }
				if($.inArray(i,langs) == -1) {
					if(!!langs[i]) { i = langs[i]; }
					else { return false; }
				}
				if(i == this.data.languages.current_language) { return true; }
				st = $.vakata.css.get_css(selector + "." + this.data.languages.current_language, false, this.data.languages.language_css);
				if(st !== false) { st.style.display = "none"; }
				st = $.vakata.css.get_css(selector + "." + i, false, this.data.languages.language_css);
				if(st !== false) { st.style.display = ""; }
				this.data.languages.current_language = i;
				this.__callback(i);
				return true;
			},
			get_lang : function () {
				return this.data.languages.current_language;
			},
			_get_string : function (key, lang) {
				var langs = this._get_settings().languages,
					s = this._get_settings().core.strings;
				if($.isArray(langs) && langs.length) {
					lang = (lang && $.inArray(lang,langs) != -1) ? lang : this.data.languages.current_language;
				}
				if(s[lang] && s[lang][key]) { return s[lang][key]; }
				if(s[key]) { return s[key]; }
				return key;
			},
			get_text : function (obj, lang) {
				obj = this._get_node(obj) || this.data.ui.last_selected;
				if(!obj.size()) { return false; }
				var langs = this._get_settings().languages,
					s = this._get_settings().core.html_titles;
				if($.isArray(langs) && langs.length) {
					lang = (lang && $.inArray(lang,langs) != -1) ? lang : this.data.languages.current_language;
					obj = obj.children("a." + lang);
				}
				else { obj = obj.children("a:eq(0)"); }
				if(s) {
					obj = obj.clone();
					obj.children("INS").remove();
					return obj.html();
				}
				else {
					obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
					return obj.nodeValue;
				}
			},
			set_text : function (obj, val, lang) {
				obj = this._get_node(obj) || this.data.ui.last_selected;
				if(!obj.size()) { return false; }
				var langs = this._get_settings().languages,
					s = this._get_settings().core.html_titles,
					tmp;
				if($.isArray(langs) && langs.length) {
					lang = (lang && $.inArray(lang,langs) != -1) ? lang : this.data.languages.current_language;
					obj = obj.children("a." + lang);
				}
				else { obj = obj.children("a:eq(0)"); }
				if(s) {
					tmp = obj.children("INS").clone();
					obj.html(val).prepend(tmp);
					this.__callback({ "obj" : obj, "name" : val, "lang" : lang });
					return true;
				}
				else {
					obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
					this.__callback({ "obj" : obj, "name" : val, "lang" : lang });
					return (obj.nodeValue = val);
				}
			},
			_load_css : function () {
				var langs = this._get_settings().languages,
					str = "/* languages css */",
					selector = ".jstree-" + this.get_index() + ' a',
					ln;
				if($.isArray(langs) && langs.length) {
					this.data.languages.current_language = langs[0];
					for(ln = 0; ln < langs.length; ln++) {
						str += selector + "." + langs[ln] + " {";
						if(langs[ln] != this.data.languages.current_language) { str += " display:none; "; }
						str += " } ";
					}
					this.data.languages.language_css = $.vakata.css.add_sheet({ 'str' : str, 'title' : "jstree-languages" });
				}
			},
			create_node : function (obj, position, js, callback) {
				var t = this.__call_old(true, obj, position, js, function (t) {
					var langs = this._get_settings().languages,
						a = t.children("a"),
						ln;
					if($.isArray(langs) && langs.length) {
						for(ln = 0; ln < langs.length; ln++) {
							if(!a.is("." + langs[ln])) {
								t.append(a.eq(0).clone().removeClass(langs.join(" ")).addClass(langs[ln]));
							}
						}
						a.not("." + langs.join(", .")).remove();
					}
					if(callback) { callback.call(this, t); }
				});
				return t;
			}
		}
	});
})(jQuery);
//*/

/*
 * jsTree cookies plugin
 * Stores the currently opened/selected nodes in a cookie and then restores them
 * Depends on the jquery.cookie plugin
 */
(function ($) {
	$.jstree.plugin("cookies", {
		__init : function () {
			if(typeof $.cookie === "undefined") { throw "jsTree cookie: jQuery cookie plugin not included."; }

			var s = this._get_settings().cookies,
				tmp;
			if(!!s.save_loaded) {
				tmp = $.cookie(s.save_loaded);
				if(tmp && tmp.length) { this.data.core.to_load = tmp.split(","); }
			}
			if(!!s.save_opened) {
				tmp = $.cookie(s.save_opened);
				if(tmp && tmp.length) { this.data.core.to_open = tmp.split(","); }
			}
			if(!!s.save_selected) {
				tmp = $.cookie(s.save_selected);
				if(tmp && tmp.length && this.data.ui) { this.data.ui.to_select = tmp.split(","); }
			}
			this.get_container()
				.one( ( this.data.ui ? "reselect" : "reopen" ) + ".jstree", $.proxy(function () {
					this.get_container()
						.bind("open_node.jstree close_node.jstree select_node.jstree deselect_node.jstree", $.proxy(function (e) { 
								if(this._get_settings().cookies.auto_save) { this.save_cookie((e.handleObj.namespace + e.handleObj.type).replace("jstree","")); }
							}, this));
				}, this));
		},
		defaults : {
			save_loaded		: "jstree_load",
			save_opened		: "jstree_open",
			save_selected	: "jstree_select",
			auto_save		: true,
			cookie_options	: {}
		},
		_fn : {
			save_cookie : function (c) {
				if(this.data.core.refreshing) { return; }
				var s = this._get_settings().cookies;
				if(!c) { // if called manually and not by event
					if(s.save_loaded) {
						this.save_loaded();
						$.cookie(s.save_loaded, this.data.core.to_load.join(","), s.cookie_options);
					}
					if(s.save_opened) {
						this.save_opened();
						$.cookie(s.save_opened, this.data.core.to_open.join(","), s.cookie_options);
					}
					if(s.save_selected && this.data.ui) {
						this.save_selected();
						$.cookie(s.save_selected, this.data.ui.to_select.join(","), s.cookie_options);
					}
					return;
				}
				switch(c) {
					case "open_node":
					case "close_node":
						if(!!s.save_opened) { 
							this.save_opened(); 
							$.cookie(s.save_opened, this.data.core.to_open.join(","), s.cookie_options); 
						}
						if(!!s.save_loaded) { 
							this.save_loaded(); 
							$.cookie(s.save_loaded, this.data.core.to_load.join(","), s.cookie_options); 
						}
						break;
					case "select_node":
					case "deselect_node":
						if(!!s.save_selected && this.data.ui) { 
							this.save_selected(); 
							$.cookie(s.save_selected, this.data.ui.to_select.join(","), s.cookie_options); 
						}
						break;
				}
			}
		}
	});
	// include cookies by default
	// $.jstree.defaults.plugins.push("cookies");
})(jQuery);
//*/

/*
 * jsTree sort plugin
 * Sorts items alphabetically (or using any other function)
 */
(function ($) {
	$.jstree.plugin("sort", {
		__init : function () {
			this.get_container()
				.bind("load_node.jstree", $.proxy(function (e, data) {
						var obj = this._get_node(data.rslt.obj);
						obj = obj === -1 ? this.get_container().children("ul") : obj.children("ul");
						this.sort(obj);
					}, this))
				.bind("rename_node.jstree create_node.jstree create.jstree", $.proxy(function (e, data) {
						this.sort(data.rslt.obj.parent());
					}, this))
				.bind("move_node.jstree", $.proxy(function (e, data) {
						var m = data.rslt.np == -1 ? this.get_container() : data.rslt.np;
						this.sort(m.children("ul"));
					}, this));
		},
		defaults : function (a, b) { return this.get_text(a) > this.get_text(b) ? 1 : -1; },
		_fn : {
			sort : function (obj) {
				var s = this._get_settings().sort,
					t = this;
				obj.append($.makeArray(obj.children("li")).sort($.proxy(s, t)));
				obj.find("> li > ul").each(function() { t.sort($(this)); });
				this.clean_node(obj);
			}
		}
	});
})(jQuery);
//*/

/*
 * jsTree DND plugin
 * Drag and drop plugin for moving/copying nodes
 */
(function ($) {
	var o = false,
		r = false,
		m = false,
		ml = false,
		sli = false,
		sti = false,
		dir1 = false,
		dir2 = false,
		last_pos = false;
	$.vakata.dnd = {
		is_down : false,
		is_drag : false,
		helper : false,
		scroll_spd : 10,
		init_x : 0,
		init_y : 0,
		threshold : 5,
		helper_left : 5,
		helper_top : 10,
		user_data : {},

		drag_start : function (e, data, html) { 
			if($.vakata.dnd.is_drag) { $.vakata.drag_stop({}); }
			try {
				e.currentTarget.unselectable = "on";
				e.currentTarget.onselectstart = function() { return false; };
				if(e.currentTarget.style) { e.currentTarget.style.MozUserSelect = "none"; }
			} catch(err) { }
			$.vakata.dnd.init_x = e.pageX;
			$.vakata.dnd.init_y = e.pageY;
			$.vakata.dnd.user_data = data;
			$.vakata.dnd.is_down = true;
			$.vakata.dnd.helper = $("<div id='vakata-dragged' />").html(html); //.fadeTo(10,0.25);
			$(document).bind("mousemove", $.vakata.dnd.drag);
			$(document).bind("mouseup", $.vakata.dnd.drag_stop);
			return false;
		},
		drag : function (e) { 
			if(!$.vakata.dnd.is_down) { return; }
			if(!$.vakata.dnd.is_drag) {
				if(Math.abs(e.pageX - $.vakata.dnd.init_x) > 5 || Math.abs(e.pageY - $.vakata.dnd.init_y) > 5) { 
					$.vakata.dnd.helper.appendTo("body");
					$.vakata.dnd.is_drag = true;
					$(document).triggerHandler("drag_start.vakata", { "event" : e, "data" : $.vakata.dnd.user_data });
				}
				else { return; }
			}

			// maybe use a scrolling parent element instead of document?
			if(e.type === "mousemove") { // thought of adding scroll in order to move the helper, but mouse poisition is n/a
				var d = $(document), t = d.scrollTop(), l = d.scrollLeft();
				if(e.pageY - t < 20) { 
					if(sti && dir1 === "down") { clearInterval(sti); sti = false; }
					if(!sti) { dir1 = "up"; sti = setInterval(function () { $(document).scrollTop($(document).scrollTop() - $.vakata.dnd.scroll_spd); }, 150); }
				}
				else { 
					if(sti && dir1 === "up") { clearInterval(sti); sti = false; }
				}
				if($(window).height() - (e.pageY - t) < 20) {
					if(sti && dir1 === "up") { clearInterval(sti); sti = false; }
					if(!sti) { dir1 = "down"; sti = setInterval(function () { $(document).scrollTop($(document).scrollTop() + $.vakata.dnd.scroll_spd); }, 150); }
				}
				else { 
					if(sti && dir1 === "down") { clearInterval(sti); sti = false; }
				}

				if(e.pageX - l < 20) {
					if(sli && dir2 === "right") { clearInterval(sli); sli = false; }
					if(!sli) { dir2 = "left"; sli = setInterval(function () { $(document).scrollLeft($(document).scrollLeft() - $.vakata.dnd.scroll_spd); }, 150); }
				}
				else { 
					if(sli && dir2 === "left") { clearInterval(sli); sli = false; }
				}
				if($(window).width() - (e.pageX - l) < 20) {
					if(sli && dir2 === "left") { clearInterval(sli); sli = false; }
					if(!sli) { dir2 = "right"; sli = setInterval(function () { $(document).scrollLeft($(document).scrollLeft() + $.vakata.dnd.scroll_spd); }, 150); }
				}
				else { 
					if(sli && dir2 === "right") { clearInterval(sli); sli = false; }
				}
			}

			$.vakata.dnd.helper.css({ left : (e.pageX + $.vakata.dnd.helper_left) + "px", top : (e.pageY + $.vakata.dnd.helper_top) + "px" });
			$(document).triggerHandler("drag.vakata", { "event" : e, "data" : $.vakata.dnd.user_data });
		},
		drag_stop : function (e) {
			if(sli) { clearInterval(sli); }
			if(sti) { clearInterval(sti); }
			$(document).unbind("mousemove", $.vakata.dnd.drag);
			$(document).unbind("mouseup", $.vakata.dnd.drag_stop);
			$(document).triggerHandler("drag_stop.vakata", { "event" : e, "data" : $.vakata.dnd.user_data });
			$.vakata.dnd.helper.remove();
			$.vakata.dnd.init_x = 0;
			$.vakata.dnd.init_y = 0;
			$.vakata.dnd.user_data = {};
			$.vakata.dnd.is_down = false;
			$.vakata.dnd.is_drag = false;
		}
	};
	$(function() {
		var css_string = '#vakata-dragged { display:block; margin:0 0 0 0; padding:4px 4px 4px 24px; position:absolute; top:-2000px; line-height:16px; z-index:10000; } ';
		$.vakata.css.add_sheet({ str : css_string, title : "vakata" });
	});

	$.jstree.plugin("dnd", {
		__init : function () {
			this.data.dnd = {
				active : false,
				after : false,
				inside : false,
				before : false,
				off : false,
				prepared : false,
				w : 0,
				to1 : false,
				to2 : false,
				cof : false,
				cw : false,
				ch : false,
				i1 : false,
				i2 : false,
				mto : false
			};
			this.get_container()
				.bind("mouseenter.jstree", $.proxy(function (e) {
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							if(this.data.themes) {
								m.attr("class", "jstree-" + this.data.themes.theme); 
								if(ml) { ml.attr("class", "jstree-" + this.data.themes.theme); }
								$.vakata.dnd.helper.attr("class", "jstree-dnd-helper jstree-" + this.data.themes.theme);
							}
							//if($(e.currentTarget).find("> ul > li").length === 0) {
							if(e.currentTarget === e.target && $.vakata.dnd.user_data.obj && $($.vakata.dnd.user_data.obj).length && $($.vakata.dnd.user_data.obj).parents(".jstree:eq(0)")[0] !== e.target) { // node should not be from the same tree
								var tr = $.jstree._reference(e.target), dc;
								if(tr.data.dnd.foreign) {
									dc = tr._get_settings().dnd.drag_check.call(this, { "o" : o, "r" : tr.get_container(), is_root : true });
									if(dc === true || dc.inside === true || dc.before === true || dc.after === true) {
										$.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
									}
								}
								else {
									tr.prepare_move(o, tr.get_container(), "last");
									if(tr.check_move()) {
										$.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
									}
								}
							}
						}
					}, this))
				.bind("mouseup.jstree", $.proxy(function (e) {
						//if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && $(e.currentTarget).find("> ul > li").length === 0) {
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && e.currentTarget === e.target && $.vakata.dnd.user_data.obj && $($.vakata.dnd.user_data.obj).length && $($.vakata.dnd.user_data.obj).parents(".jstree:eq(0)")[0] !== e.target) { // node should not be from the same tree
							var tr = $.jstree._reference(e.currentTarget), dc;
							if(tr.data.dnd.foreign) {
								dc = tr._get_settings().dnd.drag_check.call(this, { "o" : o, "r" : tr.get_container(), is_root : true });
								if(dc === true || dc.inside === true || dc.before === true || dc.after === true) {
									tr._get_settings().dnd.drag_finish.call(this, { "o" : o, "r" : tr.get_container(), is_root : true });
								}
							}
							else {
								tr.move_node(o, tr.get_container(), "last", e[tr._get_settings().dnd.copy_modifier + "Key"]);
							}
						}
					}, this))
				.bind("mouseleave.jstree", $.proxy(function (e) {
						if(e.relatedTarget && e.relatedTarget.id && e.relatedTarget.id === "jstree-marker-line") {
							return false; 
						}
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
							if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
							if(this.data.dnd.to1) { clearTimeout(this.data.dnd.to1); }
							if(this.data.dnd.to2) { clearTimeout(this.data.dnd.to2); }
							if($.vakata.dnd.helper.children("ins").hasClass("jstree-ok")) {
								$.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
							}
						}
					}, this))
				.bind("mousemove.jstree", $.proxy(function (e) {
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							var cnt = this.get_container()[0];

							// Horizontal scroll
							if(e.pageX + 24 > this.data.dnd.cof.left + this.data.dnd.cw) {
								if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
								this.data.dnd.i1 = setInterval($.proxy(function () { this.scrollLeft += $.vakata.dnd.scroll_spd; }, cnt), 100);
							}
							else if(e.pageX - 24 < this.data.dnd.cof.left) {
								if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
								this.data.dnd.i1 = setInterval($.proxy(function () { this.scrollLeft -= $.vakata.dnd.scroll_spd; }, cnt), 100);
							}
							else {
								if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
							}

							// Vertical scroll
							if(e.pageY + 24 > this.data.dnd.cof.top + this.data.dnd.ch) {
								if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
								this.data.dnd.i2 = setInterval($.proxy(function () { this.scrollTop += $.vakata.dnd.scroll_spd; }, cnt), 100);
							}
							else if(e.pageY - 24 < this.data.dnd.cof.top) {
								if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
								this.data.dnd.i2 = setInterval($.proxy(function () { this.scrollTop -= $.vakata.dnd.scroll_spd; }, cnt), 100);
							}
							else {
								if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
							}

						}
					}, this))
				.bind("scroll.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && m && ml) {
							m.hide();
							ml.hide();
						}
					}, this))
				.delegate("a", "mousedown.jstree", $.proxy(function (e) { 
						if(e.which === 1) {
							this.start_drag(e.currentTarget, e);
							return false;
						}
					}, this))
				.delegate("a", "mouseenter.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							this.dnd_enter(e.currentTarget);
						}
					}, this))
				.delegate("a", "mousemove.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							if(!r || !r.length || r.children("a")[0] !== e.currentTarget) {
								this.dnd_enter(e.currentTarget);
							}
							if(typeof this.data.dnd.off.top === "undefined") { this.data.dnd.off = $(e.target).offset(); }
							this.data.dnd.w = (e.pageY - (this.data.dnd.off.top || 0)) % this.data.core.li_height;
							if(this.data.dnd.w < 0) { this.data.dnd.w += this.data.core.li_height; }
							this.dnd_show();
						}
					}, this))
				.delegate("a", "mouseleave.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							if(e.relatedTarget && e.relatedTarget.id && e.relatedTarget.id === "jstree-marker-line") {
								return false; 
							}
								if(m) { m.hide(); }
								if(ml) { ml.hide(); }
							/*
							var ec = $(e.currentTarget).closest("li"), 
								er = $(e.relatedTarget).closest("li");
							if(er[0] !== ec.prev()[0] && er[0] !== ec.next()[0]) {
								if(m) { m.hide(); }
								if(ml) { ml.hide(); }
							}
							*/
							this.data.dnd.mto = setTimeout( 
								(function (t) { return function () { t.dnd_leave(e); }; })(this),
							0);
						}
					}, this))
				.delegate("a", "mouseup.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							this.dnd_finish(e);
						}
					}, this));

			$(document)
				.bind("drag_stop.vakata", $.proxy(function () {
						if(this.data.dnd.to1) { clearTimeout(this.data.dnd.to1); }
						if(this.data.dnd.to2) { clearTimeout(this.data.dnd.to2); }
						if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
						if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
						this.data.dnd.after		= false;
						this.data.dnd.before	= false;
						this.data.dnd.inside	= false;
						this.data.dnd.off		= false;
						this.data.dnd.prepared	= false;
						this.data.dnd.w			= false;
						this.data.dnd.to1		= false;
						this.data.dnd.to2		= false;
						this.data.dnd.i1		= false;
						this.data.dnd.i2		= false;
						this.data.dnd.active	= false;
						this.data.dnd.foreign	= false;
						if(m) { m.css({ "top" : "-2000px" }); }
						if(ml) { ml.css({ "top" : "-2000px" }); }
					}, this))
				.bind("drag_start.vakata", $.proxy(function (e, data) {
						if(data.data.jstree) { 
							var et = $(data.event.target);
							if(et.closest(".jstree").hasClass("jstree-" + this.get_index())) {
								this.dnd_enter(et);
							}
						}
					}, this));
				/*
				.bind("keydown.jstree-" + this.get_index() + " keyup.jstree-" + this.get_index(), $.proxy(function(e) {
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && !this.data.dnd.foreign) {
							var h = $.vakata.dnd.helper.children("ins");
							if(e[this._get_settings().dnd.copy_modifier + "Key"] && h.hasClass("jstree-ok")) {
								h.parent().html(h.parent().html().replace(/ \(Copy\)$/, "") + " (Copy)");
							} 
							else {
								h.parent().html(h.parent().html().replace(/ \(Copy\)$/, ""));
							}
						}
					}, this)); */



			var s = this._get_settings().dnd;
			if(s.drag_target) {
				$(document)
					.delegate(s.drag_target, "mousedown.jstree-" + this.get_index(), $.proxy(function (e) {
						o = e.target;
						$.vakata.dnd.drag_start(e, { jstree : true, obj : e.target }, "<ins class='jstree-icon'></ins>" + $(e.target).text() );
						if(this.data.themes) { 
							if(m) { m.attr("class", "jstree-" + this.data.themes.theme); }
							if(ml) { ml.attr("class", "jstree-" + this.data.themes.theme); }
							$.vakata.dnd.helper.attr("class", "jstree-dnd-helper jstree-" + this.data.themes.theme); 
						}
						$.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
						var cnt = this.get_container();
						this.data.dnd.cof = cnt.offset();
						this.data.dnd.cw = parseInt(cnt.width(),10);
						this.data.dnd.ch = parseInt(cnt.height(),10);
						this.data.dnd.foreign = true;
						e.preventDefault();
					}, this));
			}
			if(s.drop_target) {
				$(document)
					.delegate(s.drop_target, "mouseenter.jstree-" + this.get_index(), $.proxy(function (e) {
							if(this.data.dnd.active && this._get_settings().dnd.drop_check.call(this, { "o" : o, "r" : $(e.target), "e" : e })) {
								$.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
							}
						}, this))
					.delegate(s.drop_target, "mouseleave.jstree-" + this.get_index(), $.proxy(function (e) {
							if(this.data.dnd.active) {
								$.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
							}
						}, this))
					.delegate(s.drop_target, "mouseup.jstree-" + this.get_index(), $.proxy(function (e) {
							if(this.data.dnd.active && $.vakata.dnd.helper.children("ins").hasClass("jstree-ok")) {
								this._get_settings().dnd.drop_finish.call(this, { "o" : o, "r" : $(e.target), "e" : e });
							}
						}, this));
			}
		},
		defaults : {
			copy_modifier	: "ctrl",
			check_timeout	: 100,
			open_timeout	: 500,
			drop_target		: ".jstree-drop",
			drop_check		: function (data) { return true; },
			drop_finish		: $.noop,
			drag_target		: ".jstree-draggable",
			drag_finish		: $.noop,
			drag_check		: function (data) { return { after : false, before : false, inside : true }; }
		},
		_fn : {
			dnd_prepare : function () {
				if(!r || !r.length) { return; }
				this.data.dnd.off = r.offset();
				if(this._get_settings().core.rtl) {
					this.data.dnd.off.right = this.data.dnd.off.left + r.width();
				}
				if(this.data.dnd.foreign) {
					var a = this._get_settings().dnd.drag_check.call(this, { "o" : o, "r" : r });
					this.data.dnd.after = a.after;
					this.data.dnd.before = a.before;
					this.data.dnd.inside = a.inside;
					this.data.dnd.prepared = true;
					return this.dnd_show();
				}
				this.prepare_move(o, r, "before");
				this.data.dnd.before = this.check_move();
				this.prepare_move(o, r, "after");
				this.data.dnd.after = this.check_move();
				if(this._is_loaded(r)) {
					this.prepare_move(o, r, "inside");
					this.data.dnd.inside = this.check_move();
				}
				else {
					this.data.dnd.inside = false;
				}
				this.data.dnd.prepared = true;
				return this.dnd_show();
			},
			dnd_show : function () {
				if(!this.data.dnd.prepared) { return; }
				var o = ["before","inside","after"],
					r = false,
					rtl = this._get_settings().core.rtl,
					pos;
				if(this.data.dnd.w < this.data.core.li_height/3) { o = ["before","inside","after"]; }
				else if(this.data.dnd.w <= this.data.core.li_height*2/3) {
					o = this.data.dnd.w < this.data.core.li_height/2 ? ["inside","before","after"] : ["inside","after","before"];
				}
				else { o = ["after","inside","before"]; }
				$.each(o, $.proxy(function (i, val) { 
					if(this.data.dnd[val]) {
						$.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
						r = val;
						return false;
					}
				}, this));
				if(r === false) { $.vakata.dnd.helper.children("ins").attr("class","jstree-invalid"); }
				
				pos = rtl ? (this.data.dnd.off.right - 18) : (this.data.dnd.off.left + 10);
				switch(r) {
					case "before":
						m.css({ "left" : pos + "px", "top" : (this.data.dnd.off.top - 6) + "px" }).show();
						if(ml) { ml.css({ "left" : (pos + 8) + "px", "top" : (this.data.dnd.off.top - 1) + "px" }).show(); }
						break;
					case "after":
						m.css({ "left" : pos + "px", "top" : (this.data.dnd.off.top + this.data.core.li_height - 6) + "px" }).show();
						if(ml) { ml.css({ "left" : (pos + 8) + "px", "top" : (this.data.dnd.off.top + this.data.core.li_height - 1) + "px" }).show(); }
						break;
					case "inside":
						m.css({ "left" : pos + ( rtl ? -4 : 4) + "px", "top" : (this.data.dnd.off.top + this.data.core.li_height/2 - 5) + "px" }).show();
						if(ml) { ml.hide(); }
						break;
					default:
						m.hide();
						if(ml) { ml.hide(); }
						break;
				}
				last_pos = r;
				return r;
			},
			dnd_open : function () {
				this.data.dnd.to2 = false;
				this.open_node(r, $.proxy(this.dnd_prepare,this), true);
			},
			dnd_finish : function (e) {
				if(this.data.dnd.foreign) {
					if(this.data.dnd.after || this.data.dnd.before || this.data.dnd.inside) {
						this._get_settings().dnd.drag_finish.call(this, { "o" : o, "r" : r, "p" : last_pos });
					}
				}
				else {
					this.dnd_prepare();
					this.move_node(o, r, last_pos, e[this._get_settings().dnd.copy_modifier + "Key"]);
				}
				o = false;
				r = false;
				m.hide();
				if(ml) { ml.hide(); }
			},
			dnd_enter : function (obj) {
				if(this.data.dnd.mto) { 
					clearTimeout(this.data.dnd.mto);
					this.data.dnd.mto = false;
				}
				var s = this._get_settings().dnd;
				this.data.dnd.prepared = false;
				r = this._get_node(obj);
				if(s.check_timeout) { 
					// do the calculations after a minimal timeout (users tend to drag quickly to the desired location)
					if(this.data.dnd.to1) { clearTimeout(this.data.dnd.to1); }
					this.data.dnd.to1 = setTimeout($.proxy(this.dnd_prepare, this), s.check_timeout); 
				}
				else { 
					this.dnd_prepare(); 
				}
				if(s.open_timeout) { 
					if(this.data.dnd.to2) { clearTimeout(this.data.dnd.to2); }
					if(r && r.length && r.hasClass("jstree-closed")) { 
						// if the node is closed - open it, then recalculate
						this.data.dnd.to2 = setTimeout($.proxy(this.dnd_open, this), s.open_timeout);
					}
				}
				else {
					if(r && r.length && r.hasClass("jstree-closed")) { 
						this.dnd_open();
					}
				}
			},
			dnd_leave : function (e) {
				this.data.dnd.after		= false;
				this.data.dnd.before	= false;
				this.data.dnd.inside	= false;
				$.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
				m.hide();
				if(ml) { ml.hide(); }
				if(r && r[0] === e.target.parentNode) {
					if(this.data.dnd.to1) {
						clearTimeout(this.data.dnd.to1);
						this.data.dnd.to1 = false;
					}
					if(this.data.dnd.to2) {
						clearTimeout(this.data.dnd.to2);
						this.data.dnd.to2 = false;
					}
				}
			},
			start_drag : function (obj, e) {
				o = this._get_node(obj);
				if(this.data.ui && this.is_selected(o)) { o = this._get_node(null, true); }
				var dt = o.length > 1 ? this._get_string("multiple_selection") : this.get_text(o),
					cnt = this.get_container();
				if(!this._get_settings().core.html_titles) { dt = dt.replace(/</ig,"&lt;").replace(/>/ig,"&gt;"); }
				$.vakata.dnd.drag_start(e, { jstree : true, obj : o }, "<ins class='jstree-icon'></ins>" + dt );
				if(this.data.themes) { 
					if(m) { m.attr("class", "jstree-" + this.data.themes.theme); }
					if(ml) { ml.attr("class", "jstree-" + this.data.themes.theme); }
					$.vakata.dnd.helper.attr("class", "jstree-dnd-helper jstree-" + this.data.themes.theme); 
				}
				this.data.dnd.cof = cnt.offset();
				this.data.dnd.cw = parseInt(cnt.width(),10);
				this.data.dnd.ch = parseInt(cnt.height(),10);
				this.data.dnd.active = true;
			}
		}
	});
	$(function() {
		var css_string = '' + 
			'#vakata-dragged ins { display:block; text-decoration:none; width:16px; height:16px; margin:0 0 0 0; padding:0; position:absolute; top:4px; left:4px; ' + 
			' -moz-border-radius:4px; border-radius:4px; -webkit-border-radius:4px; ' +
			'} ' + 
			'#vakata-dragged .jstree-ok { background:green; } ' + 
			'#vakata-dragged .jstree-invalid { background:red; } ' + 
			'#jstree-marker { padding:0; margin:0; font-size:12px; overflow:hidden; height:12px; width:8px; position:absolute; top:-30px; z-index:10001; background-repeat:no-repeat; display:none; background-color:transparent; text-shadow:1px 1px 1px white; color:black; line-height:10px; } ' + 
			'#jstree-marker-line { padding:0; margin:0; line-height:0%; font-size:1px; overflow:hidden; height:1px; width:100px; position:absolute; top:-30px; z-index:10000; background-repeat:no-repeat; display:none; background-color:#456c43; ' + 
			' cursor:pointer; border:1px solid #eeeeee; border-left:0; -moz-box-shadow: 0px 0px 2px #666; -webkit-box-shadow: 0px 0px 2px #666; box-shadow: 0px 0px 2px #666; ' + 
			' -moz-border-radius:1px; border-radius:1px; -webkit-border-radius:1px; ' +
			'}' + 
			'';
		$.vakata.css.add_sheet({ str : css_string, title : "jstree" });
		m = $("<div />").attr({ id : "jstree-marker" }).hide().html("&raquo;")
			.bind("mouseleave mouseenter", function (e) { 
				m.hide();
				ml.hide();
				e.preventDefault(); 
				e.stopImmediatePropagation(); 
				return false; 
			})
			.appendTo("body");
		ml = $("<div />").attr({ id : "jstree-marker-line" }).hide()
			.bind("mouseup", function (e) { 
				if(r && r.length) { 
					r.children("a").trigger(e); 
					e.preventDefault(); 
					e.stopImmediatePropagation(); 
					return false; 
				} 
			})
			.bind("mouseleave", function (e) { 
				var rt = $(e.relatedTarget);
				if(rt.is(".jstree") || rt.closest(".jstree").length === 0) {
					if(r && r.length) { 
						r.children("a").trigger(e); 
						m.hide();
						ml.hide();
						e.preventDefault(); 
						e.stopImmediatePropagation(); 
						return false; 
					}
				}
			})
			.appendTo("body");
		$(document).bind("drag_start.vakata", function (e, data) {
			if(data.data.jstree) { m.show(); if(ml) { ml.show(); } }
		});
		$(document).bind("drag_stop.vakata", function (e, data) {
			if(data.data.jstree) { m.hide(); if(ml) { ml.hide(); } }
		});
	});
})(jQuery);
//*/

/*
 * jsTree checkbox plugin
 * Inserts checkboxes in front of every node
 * Depends on the ui plugin
 * DOES NOT WORK NICELY WITH MULTITREE DRAG'N'DROP
 */
(function ($) {
	$.jstree.plugin("checkbox", {
		__init : function () {
			this.data.checkbox.noui = this._get_settings().checkbox.override_ui;
			if(this.data.ui && this.data.checkbox.noui) {
				this.select_node = this.deselect_node = this.deselect_all = $.noop;
				this.get_selected = this.get_checked;
			}

			this.get_container()
				.bind("open_node.jstree create_node.jstree clean_node.jstree refresh.jstree", $.proxy(function (e, data) { 
						this._prepare_checkboxes(data.rslt.obj);
					}, this))
				.bind("loaded.jstree", $.proxy(function (e) {
						this._prepare_checkboxes();
					}, this))
				.delegate( (this.data.ui && this.data.checkbox.noui ? "a" : "ins.jstree-checkbox") , "click.jstree", $.proxy(function (e) {
						e.preventDefault();
						if(this._get_node(e.target).hasClass("jstree-checked")) { this.uncheck_node(e.target); }
						else { this.check_node(e.target); }
						if(this.data.ui && this.data.checkbox.noui) {
							this.save_selected();
							if(this.data.cookies) { this.save_cookie("select_node"); }
						}
						else {
							e.stopImmediatePropagation();
							return false;
						}
					}, this));
		},
		defaults : {
			override_ui : false,
			two_state : false,
			real_checkboxes : false,
			checked_parent_open : true,
			real_checkboxes_names : function (n) { return [ ("check_" + (n[0].id || Math.ceil(Math.random() * 10000))) , 1]; }
		},
		__destroy : function () {
			this.get_container()
				.find("input.jstree-real-checkbox").removeClass("jstree-real-checkbox").end()
				.find("ins.jstree-checkbox").remove();
		},
		_fn : {
			_checkbox_notify : function (n, data) {
				if(data.checked) {
					this.check_node(n, false);
				}
			},
			_prepare_checkboxes : function (obj) {
				obj = !obj || obj == -1 ? this.get_container().find("> ul > li") : this._get_node(obj);
				if(obj === false) { return; } // added for removing root nodes
				var c, _this = this, t, ts = this._get_settings().checkbox.two_state, rc = this._get_settings().checkbox.real_checkboxes, rcn = this._get_settings().checkbox.real_checkboxes_names;
				obj.each(function () {
					t = $(this);
					c = t.is("li") && (t.hasClass("jstree-checked") || (rc && t.children(":checked").length)) ? "jstree-checked" : "jstree-unchecked";
					t.find("li").andSelf().each(function () {
						var $t = $(this), nm;
						$t.children("a" + (_this.data.languages ? "" : ":eq(0)") ).not(":has(.jstree-checkbox)").prepend("<ins class='jstree-checkbox'>&#160;</ins>").parent().not(".jstree-checked, .jstree-unchecked").addClass( ts ? "jstree-unchecked" : c );
						if(rc) {
							if(!$t.children(":checkbox").length) {
								nm = rcn.call(_this, $t);
								$t.prepend("<input type='checkbox' class='jstree-real-checkbox' id='" + nm[0] + "' name='" + nm[0] + "' value='" + nm[1] + "' />");
							}
							else {
								$t.children(":checkbox").addClass("jstree-real-checkbox");
							}
						}
						if(!ts) {
							if(c === "jstree-checked" || $t.hasClass("jstree-checked") || $t.children(':checked').length) {
								$t.find("li").andSelf().addClass("jstree-checked").children(":checkbox").prop("checked", true);
							}
						}
						else {
							if($t.hasClass("jstree-checked") || $t.children(':checked').length) {
								$t.addClass("jstree-checked").children(":checkbox").prop("checked", true);
							}
						}
					});
				});
				if(!ts) {
					obj.find(".jstree-checked").parent().parent().each(function () { _this._repair_state(this); }); 
				}
			},
			change_state : function (obj, state) {
				obj = this._get_node(obj);
				var coll = false, rc = this._get_settings().checkbox.real_checkboxes;
				if(!obj || obj === -1) { return false; }
				state = (state === false || state === true) ? state : obj.hasClass("jstree-checked");
				if(this._get_settings().checkbox.two_state) {
					if(state) { 
						obj.removeClass("jstree-checked").addClass("jstree-unchecked"); 
						if(rc) { obj.children(":checkbox").prop("checked", false); }
					}
					else { 
						obj.removeClass("jstree-unchecked").addClass("jstree-checked"); 
						if(rc) { obj.children(":checkbox").prop("checked", true); }
					}
				}
				else {
					if(state) { 
						coll = obj.find("li").andSelf();
						if(!coll.filter(".jstree-checked, .jstree-undetermined").length) { return false; }
						coll.removeClass("jstree-checked jstree-undetermined").addClass("jstree-unchecked"); 
						if(rc) { coll.children(":checkbox").prop("checked", false); }
					}
					else { 
						coll = obj.find("li").andSelf();
						if(!coll.filter(".jstree-unchecked, .jstree-undetermined").length) { return false; }
						coll.removeClass("jstree-unchecked jstree-undetermined").addClass("jstree-checked"); 
						if(rc) { coll.children(":checkbox").prop("checked", true); }
						if(this.data.ui) { this.data.ui.last_selected = obj; }
						this.data.checkbox.last_selected = obj;
					}
					obj.parentsUntil(".jstree", "li").each(function () {
						var $this = $(this);
						if(state) {
							if($this.children("ul").children("li.jstree-checked, li.jstree-undetermined").length) {
								$this.parentsUntil(".jstree", "li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined");
								if(rc) { $this.parentsUntil(".jstree", "li").andSelf().children(":checkbox").prop("checked", false); }
								return false;
							}
							else {
								$this.removeClass("jstree-checked jstree-undetermined").addClass("jstree-unchecked");
								if(rc) { $this.children(":checkbox").prop("checked", false); }
							}
						}
						else {
							if($this.children("ul").children("li.jstree-unchecked, li.jstree-undetermined").length) {
								$this.parentsUntil(".jstree", "li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined");
								if(rc) { $this.parentsUntil(".jstree", "li").andSelf().children(":checkbox").prop("checked", false); }
								return false;
							}
							else {
								$this.removeClass("jstree-unchecked jstree-undetermined").addClass("jstree-checked");
								if(rc) { $this.children(":checkbox").prop("checked", true); }
							}
						}
					});
				}
				if(this.data.ui && this.data.checkbox.noui) { this.data.ui.selected = this.get_checked(); }
				this.__callback(obj);
				return true;
			},
			check_node : function (obj) {
				if(this.change_state(obj, false)) { 
					obj = this._get_node(obj);
					if(this._get_settings().checkbox.checked_parent_open) {
						var t = this;
						obj.parents(".jstree-closed").each(function () { t.open_node(this, false, true); });
					}
					this.__callback({ "obj" : obj }); 
				}
			},
			uncheck_node : function (obj) {
				if(this.change_state(obj, true)) { this.__callback({ "obj" : this._get_node(obj) }); }
			},
			check_all : function () {
				var _this = this, 
					coll = this._get_settings().checkbox.two_state ? this.get_container_ul().find("li") : this.get_container_ul().children("li");
				coll.each(function () {
					_this.change_state(this, false);
				});
				this.__callback();
			},
			uncheck_all : function () {
				var _this = this,
					coll = this._get_settings().checkbox.two_state ? this.get_container_ul().find("li") : this.get_container_ul().children("li");
				coll.each(function () {
					_this.change_state(this, true);
				});
				this.__callback();
			},

			is_checked : function(obj) {
				obj = this._get_node(obj);
				return obj.length ? obj.is(".jstree-checked") : false;
			},
			get_checked : function (obj, get_all) {
				obj = !obj || obj === -1 ? this.get_container() : this._get_node(obj);
				return get_all || this._get_settings().checkbox.two_state ? obj.find(".jstree-checked") : obj.find("> ul > .jstree-checked, .jstree-undetermined > ul > .jstree-checked");
			},
			get_unchecked : function (obj, get_all) { 
				obj = !obj || obj === -1 ? this.get_container() : this._get_node(obj);
				return get_all || this._get_settings().checkbox.two_state ? obj.find(".jstree-unchecked") : obj.find("> ul > .jstree-unchecked, .jstree-undetermined > ul > .jstree-unchecked");
			},

			show_checkboxes : function () { this.get_container().children("ul").removeClass("jstree-no-checkboxes"); },
			hide_checkboxes : function () { this.get_container().children("ul").addClass("jstree-no-checkboxes"); },

			_repair_state : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return; }
				if(this._get_settings().checkbox.two_state) {
					obj.find('li').andSelf().not('.jstree-checked').removeClass('jstree-undetermined').addClass('jstree-unchecked').children(':checkbox').prop('checked', true);
					return;
				}
				var rc = this._get_settings().checkbox.real_checkboxes,
					a = obj.find("> ul > .jstree-checked").length,
					b = obj.find("> ul > .jstree-undetermined").length,
					c = obj.find("> ul > li").length;
				if(c === 0) { if(obj.hasClass("jstree-undetermined")) { this.change_state(obj, false); } }
				else if(a === 0 && b === 0) { this.change_state(obj, true); }
				else if(a === c) { this.change_state(obj, false); }
				else { 
					obj.parentsUntil(".jstree","li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined");
					if(rc) { obj.parentsUntil(".jstree", "li").andSelf().children(":checkbox").prop("checked", false); }
				}
			},
			reselect : function () {
				if(this.data.ui && this.data.checkbox.noui) { 
					var _this = this,
						s = this.data.ui.to_select;
					s = $.map($.makeArray(s), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
					this.deselect_all();
					$.each(s, function (i, val) { _this.check_node(val); });
					this.__callback();
				}
				else { 
					this.__call_old(); 
				}
			},
			save_loaded : function () {
				var _this = this;
				this.data.core.to_load = [];
				this.get_container_ul().find("li.jstree-closed.jstree-undetermined").each(function () {
					if(this.id) { _this.data.core.to_load.push("#" + this.id); }
				});
			}
		}
	});
	$(function() {
		var css_string = '.jstree .jstree-real-checkbox { display:none; } ';
		$.vakata.css.add_sheet({ str : css_string, title : "jstree" });
	});
})(jQuery);
//*/

/* 
 * jsTree XML plugin
 * The XML data store. Datastores are build by overriding the `load_node` and `_is_loaded` functions.
 */
(function ($) {
	$.vakata.xslt = function (xml, xsl, callback) {
		var rs = "", xm, xs, processor, support;
		// TODO: IE9 no XSLTProcessor, no document.recalc
		if(document.recalc) {
			xm = document.createElement('xml');
			xs = document.createElement('xml');
			xm.innerHTML = xml;
			xs.innerHTML = xsl;
			$("body").append(xm).append(xs);
			setTimeout( (function (xm, xs, callback) {
				return function () {
					callback.call(null, xm.transformNode(xs.XMLDocument));
					setTimeout( (function (xm, xs) { return function () { $(xm).remove(); $(xs).remove(); }; })(xm, xs), 200);
				};
			})(xm, xs, callback), 100);
			return true;
		}
		if(typeof window.DOMParser !== "undefined" && typeof window.XMLHttpRequest !== "undefined" && typeof window.XSLTProcessor === "undefined") {
			xml = new DOMParser().parseFromString(xml, "text/xml");
			xsl = new DOMParser().parseFromString(xsl, "text/xml");
			// alert(xml.transformNode());
			// callback.call(null, new XMLSerializer().serializeToString(rs));
			
		}
		if(typeof window.DOMParser !== "undefined" && typeof window.XMLHttpRequest !== "undefined" && typeof window.XSLTProcessor !== "undefined") {
			processor = new XSLTProcessor();
			support = $.isFunction(processor.transformDocument) ? (typeof window.XMLSerializer !== "undefined") : true;
			if(!support) { return false; }
			xml = new DOMParser().parseFromString(xml, "text/xml");
			xsl = new DOMParser().parseFromString(xsl, "text/xml");
			if($.isFunction(processor.transformDocument)) {
				rs = document.implementation.createDocument("", "", null);
				processor.transformDocument(xml, xsl, rs, null);
				callback.call(null, new XMLSerializer().serializeToString(rs));
				return true;
			}
			else {
				processor.importStylesheet(xsl);
				rs = processor.transformToFragment(xml, document);
				callback.call(null, $("<div />").append(rs).html());
				return true;
			}
		}
		return false;
	};
	var xsl = {
		'nest' : '<' + '?xml version="1.0" encoding="utf-8" ?>' + 
			'<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >' + 
			'<xsl:output method="html" encoding="utf-8" omit-xml-declaration="yes" standalone="no" indent="no" media-type="text/html" />' + 
			'<xsl:template match="/">' + 
			'	<xsl:call-template name="nodes">' + 
			'		<xsl:with-param name="node" select="/root" />' + 
			'	</xsl:call-template>' + 
			'</xsl:template>' + 
			'<xsl:template name="nodes">' + 
			'	<xsl:param name="node" />' + 
			'	<ul>' + 
			'	<xsl:for-each select="$node/item">' + 
			'		<xsl:variable name="children" select="count(./item) &gt; 0" />' + 
			'		<li>' + 
			'			<xsl:attribute name="class">' + 
			'				<xsl:if test="position() = last()">jstree-last </xsl:if>' + 
			'				<xsl:choose>' + 
			'					<xsl:when test="@state = \'open\'">jstree-open </xsl:when>' + 
			'					<xsl:when test="$children or @hasChildren or @state = \'closed\'">jstree-closed </xsl:when>' + 
			'					<xsl:otherwise>jstree-leaf </xsl:otherwise>' + 
			'				</xsl:choose>' + 
			'				<xsl:value-of select="@class" />' + 
			'			</xsl:attribute>' + 
			'			<xsl:for-each select="@*">' + 
			'				<xsl:if test="name() != \'class\' and name() != \'state\' and name() != \'hasChildren\'">' + 
			'					<xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute>' + 
			'				</xsl:if>' + 
			'			</xsl:for-each>' + 
			'	<ins class="jstree-icon"><xsl:text>&#xa0;</xsl:text></ins>' + 
			'			<xsl:for-each select="content/name">' + 
			'				<a>' + 
			'				<xsl:attribute name="href">' + 
			'					<xsl:choose>' + 
			'					<xsl:when test="@href"><xsl:value-of select="@href" /></xsl:when>' + 
			'					<xsl:otherwise>#</xsl:otherwise>' + 
			'					</xsl:choose>' + 
			'				</xsl:attribute>' + 
			'				<xsl:attribute name="class"><xsl:value-of select="@lang" /> <xsl:value-of select="@class" /></xsl:attribute>' + 
			'				<xsl:attribute name="style"><xsl:value-of select="@style" /></xsl:attribute>' + 
			'				<xsl:for-each select="@*">' + 
			'					<xsl:if test="name() != \'style\' and name() != \'class\' and name() != \'href\'">' + 
			'						<xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute>' + 
			'					</xsl:if>' + 
			'				</xsl:for-each>' + 
			'					<ins>' + 
			'						<xsl:attribute name="class">jstree-icon ' + 
			'							<xsl:if test="string-length(attribute::icon) > 0 and not(contains(@icon,\'/\'))"><xsl:value-of select="@icon" /></xsl:if>' + 
			'						</xsl:attribute>' + 
			'						<xsl:if test="string-length(attribute::icon) > 0 and contains(@icon,\'/\')"><xsl:attribute name="style">background:url(<xsl:value-of select="@icon" />) center center no-repeat;</xsl:attribute></xsl:if>' + 
			'						<xsl:text>&#xa0;</xsl:text>' + 
			'					</ins>' + 
			'					<xsl:copy-of select="./child::node()" />' + 
			'				</a>' + 
			'			</xsl:for-each>' + 
			'			<xsl:if test="$children or @hasChildren"><xsl:call-template name="nodes"><xsl:with-param name="node" select="current()" /></xsl:call-template></xsl:if>' + 
			'		</li>' + 
			'	</xsl:for-each>' + 
			'	</ul>' + 
			'</xsl:template>' + 
			'</xsl:stylesheet>',

		'flat' : '<' + '?xml version="1.0" encoding="utf-8" ?>' + 
			'<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >' + 
			'<xsl:output method="html" encoding="utf-8" omit-xml-declaration="yes" standalone="no" indent="no" media-type="text/xml" />' + 
			'<xsl:template match="/">' + 
			'	<ul>' + 
			'	<xsl:for-each select="//item[not(@parent_id) or @parent_id=0 or not(@parent_id = //item/@id)]">' + /* the last `or` may be removed */
			'		<xsl:call-template name="nodes">' + 
			'			<xsl:with-param name="node" select="." />' + 
			'			<xsl:with-param name="is_last" select="number(position() = last())" />' + 
			'		</xsl:call-template>' + 
			'	</xsl:for-each>' + 
			'	</ul>' + 
			'</xsl:template>' + 
			'<xsl:template name="nodes">' + 
			'	<xsl:param name="node" />' + 
			'	<xsl:param name="is_last" />' + 
			'	<xsl:variable name="children" select="count(//item[@parent_id=$node/attribute::id]) &gt; 0" />' + 
			'	<li>' + 
			'	<xsl:attribute name="class">' + 
			'		<xsl:if test="$is_last = true()">jstree-last </xsl:if>' + 
			'		<xsl:choose>' + 
			'			<xsl:when test="@state = \'open\'">jstree-open </xsl:when>' + 
			'			<xsl:when test="$children or @hasChildren or @state = \'closed\'">jstree-closed </xsl:when>' + 
			'			<xsl:otherwise>jstree-leaf </xsl:otherwise>' + 
			'		</xsl:choose>' + 
			'		<xsl:value-of select="@class" />' + 
			'	</xsl:attribute>' + 
			'	<xsl:for-each select="@*">' + 
			'		<xsl:if test="name() != \'parent_id\' and name() != \'hasChildren\' and name() != \'class\' and name() != \'state\'">' + 
			'		<xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute>' + 
			'		</xsl:if>' + 
			'	</xsl:for-each>' + 
			'	<ins class="jstree-icon"><xsl:text>&#xa0;</xsl:text></ins>' + 
			'	<xsl:for-each select="content/name">' + 
			'		<a>' + 
			'		<xsl:attribute name="href">' + 
			'			<xsl:choose>' + 
			'			<xsl:when test="@href"><xsl:value-of select="@href" /></xsl:when>' + 
			'			<xsl:otherwise>#</xsl:otherwise>' + 
			'			</xsl:choose>' + 
			'		</xsl:attribute>' + 
			'		<xsl:attribute name="class"><xsl:value-of select="@lang" /> <xsl:value-of select="@class" /></xsl:attribute>' + 
			'		<xsl:attribute name="style"><xsl:value-of select="@style" /></xsl:attribute>' + 
			'		<xsl:for-each select="@*">' + 
			'			<xsl:if test="name() != \'style\' and name() != \'class\' and name() != \'href\'">' + 
			'				<xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute>' + 
			'			</xsl:if>' + 
			'		</xsl:for-each>' + 
			'			<ins>' + 
			'				<xsl:attribute name="class">jstree-icon ' + 
			'					<xsl:if test="string-length(attribute::icon) > 0 and not(contains(@icon,\'/\'))"><xsl:value-of select="@icon" /></xsl:if>' + 
			'				</xsl:attribute>' + 
			'				<xsl:if test="string-length(attribute::icon) > 0 and contains(@icon,\'/\')"><xsl:attribute name="style">background:url(<xsl:value-of select="@icon" />) center center no-repeat;</xsl:attribute></xsl:if>' + 
			'				<xsl:text>&#xa0;</xsl:text>' + 
			'			</ins>' + 
			'			<xsl:copy-of select="./child::node()" />' + 
			'		</a>' + 
			'	</xsl:for-each>' + 
			'	<xsl:if test="$children">' + 
			'		<ul>' + 
			'		<xsl:for-each select="//item[@parent_id=$node/attribute::id]">' + 
			'			<xsl:call-template name="nodes">' + 
			'				<xsl:with-param name="node" select="." />' + 
			'				<xsl:with-param name="is_last" select="number(position() = last())" />' + 
			'			</xsl:call-template>' + 
			'		</xsl:for-each>' + 
			'		</ul>' + 
			'	</xsl:if>' + 
			'	</li>' + 
			'</xsl:template>' + 
			'</xsl:stylesheet>'
	},
	escape_xml = function(string) {
		return string
			.toString()
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	};
	$.jstree.plugin("xml_data", {
		defaults : { 
			data : false,
			ajax : false,
			xsl : "flat",
			clean_node : false,
			correct_state : true,
			get_skip_empty : false,
			get_include_preamble : true
		},
		_fn : {
			load_node : function (obj, s_call, e_call) { var _this = this; this.load_node_xml(obj, function () { _this.__callback({ "obj" : _this._get_node(obj) }); s_call.call(this); }, e_call); },
			_is_loaded : function (obj) { 
				var s = this._get_settings().xml_data;
				obj = this._get_node(obj);
				return obj == -1 || !obj || (!s.ajax && !$.isFunction(s.data)) || obj.is(".jstree-open, .jstree-leaf") || obj.children("ul").children("li").size() > 0;
			},
			load_node_xml : function (obj, s_call, e_call) {
				var s = this.get_settings().xml_data,
					error_func = function () {},
					success_func = function () {};

				obj = this._get_node(obj);
				if(obj && obj !== -1) {
					if(obj.data("jstree_is_loading")) { return; }
					else { obj.data("jstree_is_loading",true); }
				}
				switch(!0) {
					case (!s.data && !s.ajax): throw "Neither data nor ajax settings supplied.";
					case ($.isFunction(s.data)):
						s.data.call(this, obj, $.proxy(function (d) {
							this.parse_xml(d, $.proxy(function (d) {
								if(d) {
									d = d.replace(/ ?xmlns="[^"]*"/ig, "");
									if(d.length > 10) {
										d = $(d);
										if(obj === -1 || !obj) { this.get_container().children("ul").empty().append(d.children()); }
										else { obj.children("a.jstree-loading").removeClass("jstree-loading"); obj.append(d); obj.removeData("jstree_is_loading"); }
										if(s.clean_node) { this.clean_node(obj); }
										if(s_call) { s_call.call(this); }
									}
									else {
										if(obj && obj !== -1) { 
											obj.children("a.jstree-loading").removeClass("jstree-loading");
											obj.removeData("jstree_is_loading");
											if(s.correct_state) { 
												this.correct_state(obj);
												if(s_call) { s_call.call(this); } 
											}
										}
										else {
											if(s.correct_state) { 
												this.get_container().children("ul").empty();
												if(s_call) { s_call.call(this); } 
											}
										}
									}
								}
							}, this));
						}, this));
						break;
					case (!!s.data && !s.ajax) || (!!s.data && !!s.ajax && (!obj || obj === -1)):
						if(!obj || obj == -1) {
							this.parse_xml(s.data, $.proxy(function (d) {
								if(d) {
									d = d.replace(/ ?xmlns="[^"]*"/ig, "");
									if(d.length > 10) {
										d = $(d);
										this.get_container().children("ul").empty().append(d.children());
										if(s.clean_node) { this.clean_node(obj); }
										if(s_call) { s_call.call(this); }
									}
								}
								else { 
									if(s.correct_state) { 
										this.get_container().children("ul").empty(); 
										if(s_call) { s_call.call(this); }
									}
								}
							}, this));
						}
						break;
					case (!s.data && !!s.ajax) || (!!s.data && !!s.ajax && obj && obj !== -1):
						error_func = function (x, t, e) {
							var ef = this.get_settings().xml_data.ajax.error; 
							if(ef) { ef.call(this, x, t, e); }
							if(obj !== -1 && obj.length) {
								obj.children("a.jstree-loading").removeClass("jstree-loading");
								obj.removeData("jstree_is_loading");
								if(t === "success" && s.correct_state) { this.correct_state(obj); }
							}
							else {
								if(t === "success" && s.correct_state) { this.get_container().children("ul").empty(); }
							}
							if(e_call) { e_call.call(this); }
						};
						success_func = function (d, t, x) {
							d = x.responseText;
							var sf = this.get_settings().xml_data.ajax.success; 
							if(sf) { d = sf.call(this,d,t,x) || d; }
							if(d === "" || (d && d.toString && d.toString().replace(/^[\s\n]+$/,"") === "")) {
								return error_func.call(this, x, t, "");
							}
							this.parse_xml(d, $.proxy(function (d) {
								if(d) {
									d = d.replace(/ ?xmlns="[^"]*"/ig, "");
									if(d.length > 10) {
										d = $(d);
										if(obj === -1 || !obj) { this.get_container().children("ul").empty().append(d.children()); }
										else { obj.children("a.jstree-loading").removeClass("jstree-loading"); obj.append(d); obj.removeData("jstree_is_loading"); }
										if(s.clean_node) { this.clean_node(obj); }
										if(s_call) { s_call.call(this); }
									}
									else {
										if(obj && obj !== -1) { 
											obj.children("a.jstree-loading").removeClass("jstree-loading");
											obj.removeData("jstree_is_loading");
											if(s.correct_state) { 
												this.correct_state(obj);
												if(s_call) { s_call.call(this); } 
											}
										}
										else {
											if(s.correct_state) { 
												this.get_container().children("ul").empty();
												if(s_call) { s_call.call(this); } 
											}
										}
									}
								}
							}, this));
						};
						s.ajax.context = this;
						s.ajax.error = error_func;
						s.ajax.success = success_func;
						if(!s.ajax.dataType) { s.ajax.dataType = "xml"; }
						if($.isFunction(s.ajax.url)) { s.ajax.url = s.ajax.url.call(this, obj); }
						if($.isFunction(s.ajax.data)) { s.ajax.data = s.ajax.data.call(this, obj); }
						$.ajax(s.ajax);
						break;
				}
			},
			parse_xml : function (xml, callback) {
				var s = this._get_settings().xml_data;
				$.vakata.xslt(xml, xsl[s.xsl], callback);
			},
			get_xml : function (tp, obj, li_attr, a_attr, is_callback) {
				var result = "", 
					s = this._get_settings(), 
					_this = this,
					tmp1, tmp2, li, a, lang;
				if(!tp) { tp = "flat"; }
				if(!is_callback) { is_callback = 0; }
				obj = this._get_node(obj);
				if(!obj || obj === -1) { obj = this.get_container().find("> ul > li"); }
				li_attr = $.isArray(li_attr) ? li_attr : [ "id", "class" ];
				if(!is_callback && this.data.types && $.inArray(s.types.type_attr, li_attr) === -1) { li_attr.push(s.types.type_attr); }

				a_attr = $.isArray(a_attr) ? a_attr : [ ];

				if(!is_callback) { 
					if(s.xml_data.get_include_preamble) { 
						result += '<' + '?xml version="1.0" encoding="UTF-8"?' + '>'; 
					}
					result += "<root>"; 
				}
				obj.each(function () {
					result += "<item";
					li = $(this);
					$.each(li_attr, function (i, v) { 
						var t = li.attr(v);
						if(!s.xml_data.get_skip_empty || typeof t !== "undefined") {
							result += " " + v + "=\"" + escape_xml((" " + (t || "")).replace(/ jstree[^ ]*/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"")) + "\""; 
						}
					});
					if(li.hasClass("jstree-open")) { result += " state=\"open\""; }
					if(li.hasClass("jstree-closed")) { result += " state=\"closed\""; }
					if(tp === "flat") { result += " parent_id=\"" + escape_xml(is_callback) + "\""; }
					result += ">";
					result += "<content>";
					a = li.children("a");
					a.each(function () {
						tmp1 = $(this);
						lang = false;
						result += "<name";
						if($.inArray("languages", s.plugins) !== -1) {
							$.each(s.languages, function (k, z) {
								if(tmp1.hasClass(z)) { result += " lang=\"" + escape_xml(z) + "\""; lang = z; return false; }
							});
						}
						if(a_attr.length) { 
							$.each(a_attr, function (k, z) {
								var t = tmp1.attr(z);
								if(!s.xml_data.get_skip_empty || typeof t !== "undefined") {
									result += " " + z + "=\"" + escape_xml((" " + t || "").replace(/ jstree[^ ]*/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"")) + "\"";
								}
							});
						}
						if(tmp1.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').replace(/^\s+$/ig,"").length) {
							result += ' icon="' + escape_xml(tmp1.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"")) + '"';
						}
						if(tmp1.children("ins").get(0).style.backgroundImage.length) {
							result += ' icon="' + escape_xml(tmp1.children("ins").get(0).style.backgroundImage.replace("url(","").replace(")","").replace(/'/ig,"").replace(/"/ig,"")) + '"';
						}
						result += ">";
						result += "<![CDATA[" + _this.get_text(tmp1, lang) + "]]>";
						result += "</name>";
					});
					result += "</content>";
					tmp2 = li[0].id || true;
					li = li.find("> ul > li");
					if(li.length) { tmp2 = _this.get_xml(tp, li, li_attr, a_attr, tmp2); }
					else { tmp2 = ""; }
					if(tp == "nest") { result += tmp2; }
					result += "</item>";
					if(tp == "flat") { result += tmp2; }
				});
				if(!is_callback) { result += "</root>"; }
				return result;
			}
		}
	});
})(jQuery);
//*/

/*
 * jsTree search plugin
 * Enables both sync and async search on the tree
 * DOES NOT WORK WITH JSON PROGRESSIVE RENDER
 */
(function ($) {
	$.expr[':'].jstree_contains = function(a,i,m){
		return (a.textContent || a.innerText || "").toLowerCase().indexOf(m[3].toLowerCase())>=0;
	};
	$.expr[':'].jstree_title_contains = function(a,i,m) {
		return (a.getAttribute("title") || "").toLowerCase().indexOf(m[3].toLowerCase())>=0;
	};
	$.jstree.plugin("search", {
		__init : function () {
			this.data.search.str = "";
			this.data.search.result = $();
			if(this._get_settings().search.show_only_matches) {
				this.get_container()
					.bind("search.jstree", function (e, data) {
						$(this).children("ul").find("li").hide().removeClass("jstree-last");
						data.rslt.nodes.parentsUntil(".jstree").andSelf().show()
							.filter("ul").each(function () { $(this).children("li:visible").eq(-1).addClass("jstree-last"); });
					})
					.bind("clear_search.jstree", function () {
						$(this).children("ul").find("li").css("display","").end().end().jstree("clean_node", -1);
					});
			}
		},
		defaults : {
			ajax : false,
			search_method : "jstree_contains", // for case insensitive - jstree_contains
			show_only_matches : false
		},
		_fn : {
			search : function (str, skip_async) {
				if($.trim(str) === "") { this.clear_search(); return; }
				var s = this.get_settings().search, 
					t = this,
					error_func = function () { },
					success_func = function () { };
				this.data.search.str = str;

				if(!skip_async && s.ajax !== false && this.get_container_ul().find("li.jstree-closed:not(:has(ul)):eq(0)").length > 0) {
					this.search.supress_callback = true;
					error_func = function () { };
					success_func = function (d, t, x) {
						var sf = this.get_settings().search.ajax.success; 
						if(sf) { d = sf.call(this,d,t,x) || d; }
						this.data.search.to_open = d;
						this._search_open();
					};
					s.ajax.context = this;
					s.ajax.error = error_func;
					s.ajax.success = success_func;
					if($.isFunction(s.ajax.url)) { s.ajax.url = s.ajax.url.call(this, str); }
					if($.isFunction(s.ajax.data)) { s.ajax.data = s.ajax.data.call(this, str); }
					if(!s.ajax.data) { s.ajax.data = { "search_string" : str }; }
					if(!s.ajax.dataType || /^json/.exec(s.ajax.dataType)) { s.ajax.dataType = "json"; }
					$.ajax(s.ajax);
					return;
				}
				if(this.data.search.result.length) { this.clear_search(); }
				this.data.search.result = this.get_container().find("a" + (this.data.languages ? "." + this.get_lang() : "" ) + ":" + (s.search_method) + "(" + this.data.search.str + ")");
				this.data.search.result.addClass("jstree-search").parent().parents(".jstree-closed").each(function () {
					t.open_node(this, false, true);
				});
				this.__callback({ nodes : this.data.search.result, str : str });
			},
			clear_search : function (str) {
				this.data.search.result.removeClass("jstree-search");
				this.__callback(this.data.search.result);
				this.data.search.result = $();
			},
			_search_open : function (is_callback) {
				var _this = this,
					done = true,
					current = [],
					remaining = [];
				if(this.data.search.to_open.length) {
					$.each(this.data.search.to_open, function (i, val) {
						if(val == "#") { return true; }
						if($(val).length && $(val).is(".jstree-closed")) { current.push(val); }
						else { remaining.push(val); }
					});
					if(current.length) {
						this.data.search.to_open = remaining;
						$.each(current, function (i, val) { 
							_this.open_node(val, function () { _this._search_open(true); }); 
						});
						done = false;
					}
				}
				if(done) { this.search(this.data.search.str, true); }
			}
		}
	});
})(jQuery);
//*/


/* 
 * jsTree contextmenu plugin
 */
(function ($) {
	$.vakata.context = {
		hide_on_mouseleave : false,

		cnt		: $("<div id='vakata-contextmenu' />"),
		vis		: false,
		tgt		: false,
		par		: false,
		func	: false,
		data	: false,
		rtl		: false,
		show	: function (s, t, x, y, d, p, rtl) {
			$.vakata.context.rtl = !!rtl;
			var html = $.vakata.context.parse(s), h, w;
			if(!html) { return; }
			$.vakata.context.vis = true;
			$.vakata.context.tgt = t;
			$.vakata.context.par = p || t || null;
			$.vakata.context.data = d || null;
			$.vakata.context.cnt
				.html(html)
				.css({ "visibility" : "hidden", "display" : "block", "left" : 0, "top" : 0 });

			if($.vakata.context.hide_on_mouseleave) {
				$.vakata.context.cnt
					.one("mouseleave", function(e) { $.vakata.context.hide(); });
			}

			h = $.vakata.context.cnt.height();
			w = $.vakata.context.cnt.width();
			if(x + w > $(document).width()) { 
				x = $(document).width() - (w + 5); 
				$.vakata.context.cnt.find("li > ul").addClass("right"); 
			}
			if(y + h > $(document).height()) { 
				y = y - (h + t[0].offsetHeight); 
				$.vakata.context.cnt.find("li > ul").addClass("bottom"); 
			}

			$.vakata.context.cnt
				.css({ "left" : x, "top" : y })
				.find("li:has(ul)")
					.bind("mouseenter", function (e) { 
						var w = $(document).width(),
							h = $(document).height(),
							ul = $(this).children("ul").show(); 
						if(w !== $(document).width()) { ul.toggleClass("right"); }
						if(h !== $(document).height()) { ul.toggleClass("bottom"); }
					})
					.bind("mouseleave", function (e) { 
						$(this).children("ul").hide(); 
					})
					.end()
				.css({ "visibility" : "visible" })
				.show();
			$(document).triggerHandler("context_show.vakata");
		},
		hide	: function () {
			$.vakata.context.vis = false;
			$.vakata.context.cnt.attr("class","").css({ "visibility" : "hidden" });
			$(document).triggerHandler("context_hide.vakata");
		},
		parse	: function (s, is_callback) {
			if(!s) { return false; }
			var str = "",
				tmp = false,
				was_sep = true;
			if(!is_callback) { $.vakata.context.func = {}; }
			str += "<ul>";
			$.each(s, function (i, val) {
				if(!val) { return true; }
				$.vakata.context.func[i] = val.action;
				if(!was_sep && val.separator_before) {
					str += "<li class='vakata-separator vakata-separator-before'></li>";
				}
				was_sep = false;
				str += "<li class='" + (val._class || "") + (val._disabled ? " jstree-contextmenu-disabled " : "") + "'><ins ";
				if(val.icon && val.icon.indexOf("/") === -1) { str += " class='" + val.icon + "' "; }
				if(val.icon && val.icon.indexOf("/") !== -1) { str += " style='background:url(" + val.icon + ") center center no-repeat;' "; }
				str += ">&#160;</ins><a href='#' rel='" + i + "'>";
				if(val.submenu) {
					str += "<span style='float:" + ($.vakata.context.rtl ? "left" : "right") + ";'>&raquo;</span>";
				}
				str += val.label + "</a>";
				if(val.submenu) {
					tmp = $.vakata.context.parse(val.submenu, true);
					if(tmp) { str += tmp; }
				}
				str += "</li>";
				if(val.separator_after) {
					str += "<li class='vakata-separator vakata-separator-after'></li>";
					was_sep = true;
				}
			});
			str = str.replace(/<li class\='vakata-separator vakata-separator-after'\><\/li\>$/,"");
			str += "</ul>";
			$(document).triggerHandler("context_parse.vakata");
			return str.length > 10 ? str : false;
		},
		exec	: function (i) {
			if($.isFunction($.vakata.context.func[i])) {
				// if is string - eval and call it!
				$.vakata.context.func[i].call($.vakata.context.data, $.vakata.context.par);
				return true;
			}
			else { return false; }
		}
	};
	$(function () {
		var css_string = '' + 
			'#vakata-contextmenu { display:block; visibility:hidden; left:0; top:-200px; position:absolute; margin:0; padding:0; min-width:180px; background:#ebebeb; border:1px solid silver; z-index:10000; *width:180px; } ' + 
			'#vakata-contextmenu ul { min-width:180px; *width:180px; } ' + 
			'#vakata-contextmenu ul, #vakata-contextmenu li { margin:0; padding:0; list-style-type:none; display:block; } ' + 
			'#vakata-contextmenu li { line-height:20px; min-height:20px; position:relative; padding:0px; } ' + 
			'#vakata-contextmenu li a { padding:1px 6px; line-height:17px; display:block; text-decoration:none; margin:1px 1px 0 1px; } ' + 
			'#vakata-contextmenu li ins { float:left; width:16px; height:16px; text-decoration:none; margin-right:2px; } ' + 
			'#vakata-contextmenu li a:hover, #vakata-contextmenu li.vakata-hover > a { background:gray; color:white; } ' + 
			'#vakata-contextmenu li ul { display:none; position:absolute; top:-2px; left:100%; background:#ebebeb; border:1px solid gray; } ' + 
			'#vakata-contextmenu .right { right:100%; left:auto; } ' + 
			'#vakata-contextmenu .bottom { bottom:-1px; top:auto; } ' + 
			'#vakata-contextmenu li.vakata-separator { min-height:0; height:1px; line-height:1px; font-size:1px; overflow:hidden; margin:0 2px; background:silver; /* border-top:1px solid #fefefe; */ padding:0; } ';
		$.vakata.css.add_sheet({ str : css_string, title : "vakata" });
		$.vakata.context.cnt
			.delegate("a","click", function (e) { e.preventDefault(); })
			.delegate("a","mouseup", function (e) {
				if(!$(this).parent().hasClass("jstree-contextmenu-disabled") && $.vakata.context.exec($(this).attr("rel"))) {
					$.vakata.context.hide();
				}
				else { $(this).blur(); }
			})
			.delegate("a","mouseover", function () {
				$.vakata.context.cnt.find(".vakata-hover").removeClass("vakata-hover");
			})
			.appendTo("body");
		$(document).bind("mousedown", function (e) { if($.vakata.context.vis && !$.contains($.vakata.context.cnt[0], e.target)) { $.vakata.context.hide(); } });
		if(typeof $.hotkeys !== "undefined") {
			$(document)
				.bind("keydown", "up", function (e) { 
					if($.vakata.context.vis) { 
						var o = $.vakata.context.cnt.find("ul:visible").last().children(".vakata-hover").removeClass("vakata-hover").prevAll("li:not(.vakata-separator)").first();
						if(!o.length) { o = $.vakata.context.cnt.find("ul:visible").last().children("li:not(.vakata-separator)").last(); }
						o.addClass("vakata-hover");
						e.stopImmediatePropagation(); 
						e.preventDefault();
					} 
				})
				.bind("keydown", "down", function (e) { 
					if($.vakata.context.vis) { 
						var o = $.vakata.context.cnt.find("ul:visible").last().children(".vakata-hover").removeClass("vakata-hover").nextAll("li:not(.vakata-separator)").first();
						if(!o.length) { o = $.vakata.context.cnt.find("ul:visible").last().children("li:not(.vakata-separator)").first(); }
						o.addClass("vakata-hover");
						e.stopImmediatePropagation(); 
						e.preventDefault();
					} 
				})
				.bind("keydown", "right", function (e) { 
					if($.vakata.context.vis) { 
						$.vakata.context.cnt.find(".vakata-hover").children("ul").show().children("li:not(.vakata-separator)").removeClass("vakata-hover").first().addClass("vakata-hover");
						e.stopImmediatePropagation(); 
						e.preventDefault();
					} 
				})
				.bind("keydown", "left", function (e) { 
					if($.vakata.context.vis) { 
						$.vakata.context.cnt.find(".vakata-hover").children("ul").hide().children(".vakata-separator").removeClass("vakata-hover");
						e.stopImmediatePropagation(); 
						e.preventDefault();
					} 
				})
				.bind("keydown", "esc", function (e) { 
					$.vakata.context.hide(); 
					e.preventDefault();
				})
				.bind("keydown", "space", function (e) { 
					$.vakata.context.cnt.find(".vakata-hover").last().children("a").click();
					e.preventDefault();
				});
		}
	});

	$.jstree.plugin("contextmenu", {
		__init : function () {
			this.get_container()
				.delegate("a", "contextmenu.jstree", $.proxy(function (e) {
						e.preventDefault();
						if(!$(e.currentTarget).hasClass("jstree-loading")) {
							this.show_contextmenu(e.currentTarget, e.pageX, e.pageY);
						}
					}, this))
				.delegate("a", "click.jstree", $.proxy(function (e) {
						if(this.data.contextmenu) {
							$.vakata.context.hide();
						}
					}, this))
				.bind("destroy.jstree", $.proxy(function () {
						// TODO: move this to descruct method
						if(this.data.contextmenu) {
							$.vakata.context.hide();
						}
					}, this));
			$(document).bind("context_hide.vakata", $.proxy(function () { this.data.contextmenu = false; }, this));
		},
		defaults : { 
			select_node : false, // requires UI plugin
			show_at_node : true,
			items : { // Could be a function that should return an object like this one
				"create" : {
					"separator_before"	: false,
					"separator_after"	: true,
					"label"				: "Create",
					"action"			: function (obj) { this.create(obj); }
				},
				"rename" : {
					"separator_before"	: false,
					"separator_after"	: false,
					"label"				: "Rename",
					"action"			: function (obj) { this.rename(obj); }
				},
				"remove" : {
					"separator_before"	: false,
					"icon"				: false,
					"separator_after"	: false,
					"label"				: "Delete",
					"action"			: function (obj) { if(this.is_selected(obj)) { this.remove(); } else { this.remove(obj); } }
				},
				"ccp" : {
					"separator_before"	: true,
					"icon"				: false,
					"separator_after"	: false,
					"label"				: "Edit",
					"action"			: false,
					"submenu" : { 
						"cut" : {
							"separator_before"	: false,
							"separator_after"	: false,
							"label"				: "Cut",
							"action"			: function (obj) { this.cut(obj); }
						},
						"copy" : {
							"separator_before"	: false,
							"icon"				: false,
							"separator_after"	: false,
							"label"				: "Copy",
							"action"			: function (obj) { this.copy(obj); }
						},
						"paste" : {
							"separator_before"	: false,
							"icon"				: false,
							"separator_after"	: false,
							"label"				: "Paste",
							"action"			: function (obj) { this.paste(obj); }
						}
					}
				}
			}
		},
		_fn : {
			show_contextmenu : function (obj, x, y) {
				obj = this._get_node(obj);
				var s = this.get_settings().contextmenu,
					a = obj.children("a:visible:eq(0)"),
					o = false,
					i = false;
				if(s.select_node && this.data.ui && !this.is_selected(obj)) {
					this.deselect_all();
					this.select_node(obj, true);
				}
				if(s.show_at_node || typeof x === "undefined" || typeof y === "undefined") {
					o = a.offset();
					x = o.left;
					y = o.top + this.data.core.li_height;
				}
				i = obj.data("jstree") && obj.data("jstree").contextmenu ? obj.data("jstree").contextmenu : s.items;
				if($.isFunction(i)) { i = i.call(this, obj); }
				this.data.contextmenu = true;
				$.vakata.context.show(i, a, x, y, this, obj, this._get_settings().core.rtl);
				if(this.data.themes) { $.vakata.context.cnt.attr("class", "jstree-" + this.data.themes.theme + "-context"); }
			}
		}
	});
})(jQuery);
//*/

/* 
 * jsTree types plugin
 * Adds support types of nodes
 * You can set an attribute on each li node, that represents its type.
 * According to the type setting the node may get custom icon/validation rules
 */
(function ($) {
	$.jstree.plugin("types", {
		__init : function () {
			var s = this._get_settings().types;
			this.data.types.attach_to = [];
			this.get_container()
				.bind("init.jstree", $.proxy(function () { 
						var types = s.types, 
							attr  = s.type_attr, 
							icons_css = "", 
							_this = this;

						$.each(types, function (i, tp) {
							$.each(tp, function (k, v) { 
								if(!/^(max_depth|max_children|icon|valid_children)$/.test(k)) { _this.data.types.attach_to.push(k); }
							});
							if(!tp.icon) { return true; }
							if( tp.icon.image || tp.icon.position) {
								if(i == "default")	{ icons_css += '.jstree-' + _this.get_index() + ' a > .jstree-icon { '; }
								else				{ icons_css += '.jstree-' + _this.get_index() + ' li[' + attr + '="' + i + '"] > a > .jstree-icon { '; }
								if(tp.icon.image)	{ icons_css += ' background-image:url(' + tp.icon.image + '); '; }
								if(tp.icon.position){ icons_css += ' background-position:' + tp.icon.position + '; '; }
								else				{ icons_css += ' background-position:0 0; '; }
								icons_css += '} ';
							}
						});
						if(icons_css !== "") { $.vakata.css.add_sheet({ 'str' : icons_css, title : "jstree-types" }); }
					}, this))
				.bind("before.jstree", $.proxy(function (e, data) { 
						var s, t, 
							o = this._get_settings().types.use_data ? this._get_node(data.args[0]) : false, 
							d = o && o !== -1 && o.length ? o.data("jstree") : false;
						if(d && d.types && d.types[data.func] === false) { e.stopImmediatePropagation(); return false; }
						if($.inArray(data.func, this.data.types.attach_to) !== -1) {
							if(!data.args[0] || (!data.args[0].tagName && !data.args[0].jquery)) { return; }
							s = this._get_settings().types.types;
							t = this._get_type(data.args[0]);
							if(
								( 
									(s[t] && typeof s[t][data.func] !== "undefined") || 
									(s["default"] && typeof s["default"][data.func] !== "undefined") 
								) && this._check(data.func, data.args[0]) === false
							) {
								e.stopImmediatePropagation();
								return false;
							}
						}
					}, this));
			if(is_ie6) {
				this.get_container()
					.bind("load_node.jstree set_type.jstree", $.proxy(function (e, data) {
							var r = data && data.rslt && data.rslt.obj && data.rslt.obj !== -1 ? this._get_node(data.rslt.obj).parent() : this.get_container_ul(),
								c = false,
								s = this._get_settings().types;
							$.each(s.types, function (i, tp) {
								if(tp.icon && (tp.icon.image || tp.icon.position)) {
									c = i === "default" ? r.find("li > a > .jstree-icon") : r.find("li[" + s.type_attr + "='" + i + "'] > a > .jstree-icon");
									if(tp.icon.image) { c.css("backgroundImage","url(" + tp.icon.image + ")"); }
									c.css("backgroundPosition", tp.icon.position || "0 0");
								}
							});
						}, this));
			}
		},
		defaults : {
			// defines maximum number of root nodes (-1 means unlimited, -2 means disable max_children checking)
			max_children		: -1,
			// defines the maximum depth of the tree (-1 means unlimited, -2 means disable max_depth checking)
			max_depth			: -1,
			// defines valid node types for the root nodes
			valid_children		: "all",

			// whether to use $.data
			use_data : false, 
			// where is the type stores (the rel attribute of the LI element)
			type_attr : "rel",
			// a list of types
			types : {
				// the default type
				"default" : {
					"max_children"	: -1,
					"max_depth"		: -1,
					"valid_children": "all"

					// Bound functions - you can bind any other function here (using boolean or function)
					//"select_node"	: true
				}
			}
		},
		_fn : {
			_types_notify : function (n, data) {
				if(data.type && this._get_settings().types.use_data) {
					this.set_type(data.type, n);
				}
			},
			_get_type : function (obj) {
				obj = this._get_node(obj);
				return (!obj || !obj.length) ? false : obj.attr(this._get_settings().types.type_attr) || "default";
			},
			set_type : function (str, obj) {
				obj = this._get_node(obj);
				var ret = (!obj.length || !str) ? false : obj.attr(this._get_settings().types.type_attr, str);
				if(ret) { this.__callback({ obj : obj, type : str}); }
				return ret;
			},
			_check : function (rule, obj, opts) {
				obj = this._get_node(obj);
				var v = false, t = this._get_type(obj), d = 0, _this = this, s = this._get_settings().types, data = false;
				if(obj === -1) { 
					if(!!s[rule]) { v = s[rule]; }
					else { return; }
				}
				else {
					if(t === false) { return; }
					data = s.use_data ? obj.data("jstree") : false;
					if(data && data.types && typeof data.types[rule] !== "undefined") { v = data.types[rule]; }
					else if(!!s.types[t] && typeof s.types[t][rule] !== "undefined") { v = s.types[t][rule]; }
					else if(!!s.types["default"] && typeof s.types["default"][rule] !== "undefined") { v = s.types["default"][rule]; }
				}
				if($.isFunction(v)) { v = v.call(this, obj); }
				if(rule === "max_depth" && obj !== -1 && opts !== false && s.max_depth !== -2 && v !== 0) {
					// also include the node itself - otherwise if root node it is not checked
					obj.children("a:eq(0)").parentsUntil(".jstree","li").each(function (i) {
						// check if current depth already exceeds global tree depth
						if(s.max_depth !== -1 && s.max_depth - (i + 1) <= 0) { v = 0; return false; }
						d = (i === 0) ? v : _this._check(rule, this, false);
						// check if current node max depth is already matched or exceeded
						if(d !== -1 && d - (i + 1) <= 0) { v = 0; return false; }
						// otherwise - set the max depth to the current value minus current depth
						if(d >= 0 && (d - (i + 1) < v || v < 0) ) { v = d - (i + 1); }
						// if the global tree depth exists and it minus the nodes calculated so far is less than `v` or `v` is unlimited
						if(s.max_depth >= 0 && (s.max_depth - (i + 1) < v || v < 0) ) { v = s.max_depth - (i + 1); }
					});
				}
				return v;
			},
			check_move : function () {
				if(!this.__call_old()) { return false; }
				var m  = this._get_move(),
					s  = m.rt._get_settings().types,
					mc = m.rt._check("max_children", m.cr),
					md = m.rt._check("max_depth", m.cr),
					vc = m.rt._check("valid_children", m.cr),
					ch = 0, d = 1, t;

				if(vc === "none") { return false; } 
				if($.isArray(vc) && m.ot && m.ot._get_type) {
					m.o.each(function () {
						if($.inArray(m.ot._get_type(this), vc) === -1) { d = false; return false; }
					});
					if(d === false) { return false; }
				}
				if(s.max_children !== -2 && mc !== -1) {
					ch = m.cr === -1 ? this.get_container().find("> ul > li").not(m.o).length : m.cr.find("> ul > li").not(m.o).length;
					if(ch + m.o.length > mc) { return false; }
				}
				if(s.max_depth !== -2 && md !== -1) {
					d = 0;
					if(md === 0) { return false; }
					if(typeof m.o.d === "undefined") {
						// TODO: deal with progressive rendering and async when checking max_depth (how to know the depth of the moved node)
						t = m.o;
						while(t.length > 0) {
							t = t.find("> ul > li");
							d ++;
						}
						m.o.d = d;
					}
					if(md - m.o.d < 0) { return false; }
				}
				return true;
			},
			create_node : function (obj, position, js, callback, is_loaded, skip_check) {
				if(!skip_check && (is_loaded || this._is_loaded(obj))) {
					var p  = (typeof position == "string" && position.match(/^before|after$/i) && obj !== -1) ? this._get_parent(obj) : this._get_node(obj),
						s  = this._get_settings().types,
						mc = this._check("max_children", p),
						md = this._check("max_depth", p),
						vc = this._check("valid_children", p),
						ch;
					if(typeof js === "string") { js = { data : js }; }
					if(!js) { js = {}; }
					if(vc === "none") { return false; } 
					if($.isArray(vc)) {
						if(!js.attr || !js.attr[s.type_attr]) { 
							if(!js.attr) { js.attr = {}; }
							js.attr[s.type_attr] = vc[0]; 
						}
						else {
							if($.inArray(js.attr[s.type_attr], vc) === -1) { return false; }
						}
					}
					if(s.max_children !== -2 && mc !== -1) {
						ch = p === -1 ? this.get_container().find("> ul > li").length : p.find("> ul > li").length;
						if(ch + 1 > mc) { return false; }
					}
					if(s.max_depth !== -2 && md !== -1 && (md - 1) < 0) { return false; }
				}
				return this.__call_old(true, obj, position, js, callback, is_loaded, skip_check);
			}
		}
	});
})(jQuery);
//*/

/* 
 * jsTree HTML plugin
 * The HTML data store. Datastores are build by replacing the `load_node` and `_is_loaded` functions.
 */
(function ($) {
	$.jstree.plugin("html_data", {
		__init : function () { 
			// this used to use html() and clean the whitespace, but this way any attached data was lost
			this.data.html_data.original_container_html = this.get_container().find(" > ul > li").clone(true);
			// remove white space from LI node - otherwise nodes appear a bit to the right
			this.data.html_data.original_container_html.find("li").andSelf().contents().filter(function() { return this.nodeType == 3; }).remove();
		},
		defaults : { 
			data : false,
			ajax : false,
			correct_state : true
		},
		_fn : {
			load_node : function (obj, s_call, e_call) { var _this = this; this.load_node_html(obj, function () { _this.__callback({ "obj" : _this._get_node(obj) }); s_call.call(this); }, e_call); },
			_is_loaded : function (obj) { 
				obj = this._get_node(obj); 
				return obj == -1 || !obj || (!this._get_settings().html_data.ajax && !$.isFunction(this._get_settings().html_data.data)) || obj.is(".jstree-open, .jstree-leaf") || obj.children("ul").children("li").size() > 0;
			},
			load_node_html : function (obj, s_call, e_call) {
				var d,
					s = this.get_settings().html_data,
					error_func = function () {},
					success_func = function () {};
				obj = this._get_node(obj);
				if(obj && obj !== -1) {
					if(obj.data("jstree_is_loading")) { return; }
					else { obj.data("jstree_is_loading",true); }
				}
				switch(!0) {
					case ($.isFunction(s.data)):
						s.data.call(this, obj, $.proxy(function (d) {
							if(d && d !== "" && d.toString && d.toString().replace(/^[\s\n]+$/,"") !== "") {
								d = $(d);
								if(!d.is("ul")) { d = $("<ul />").append(d); }
								if(obj == -1 || !obj) { this.get_container().children("ul").empty().append(d.children()).find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"); }
								else { obj.children("a.jstree-loading").removeClass("jstree-loading"); obj.append(d).children("ul").find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"); obj.removeData("jstree_is_loading"); }
								this.clean_node(obj);
								if(s_call) { s_call.call(this); }
							}
							else {
								if(obj && obj !== -1) {
									obj.children("a.jstree-loading").removeClass("jstree-loading");
									obj.removeData("jstree_is_loading");
									if(s.correct_state) { 
										this.correct_state(obj);
										if(s_call) { s_call.call(this); } 
									}
								}
								else {
									if(s.correct_state) { 
										this.get_container().children("ul").empty();
										if(s_call) { s_call.call(this); } 
									}
								}
							}
						}, this));
						break;
					case (!s.data && !s.ajax):
						if(!obj || obj == -1) {
							this.get_container()
								.children("ul").empty()
								.append(this.data.html_data.original_container_html)
								.find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end()
								.filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon");
							this.clean_node();
						}
						if(s_call) { s_call.call(this); }
						break;
					case (!!s.data && !s.ajax) || (!!s.data && !!s.ajax && (!obj || obj === -1)):
						if(!obj || obj == -1) {
							d = $(s.data);
							if(!d.is("ul")) { d = $("<ul />").append(d); }
							this.get_container()
								.children("ul").empty().append(d.children())
								.find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end()
								.filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon");
							this.clean_node();
						}
						if(s_call) { s_call.call(this); }
						break;
					case (!s.data && !!s.ajax) || (!!s.data && !!s.ajax && obj && obj !== -1):
						obj = this._get_node(obj);
						error_func = function (x, t, e) {
							var ef = this.get_settings().html_data.ajax.error; 
							if(ef) { ef.call(this, x, t, e); }
							if(obj != -1 && obj.length) {
								obj.children("a.jstree-loading").removeClass("jstree-loading");
								obj.removeData("jstree_is_loading");
								if(t === "success" && s.correct_state) { this.correct_state(obj); }
							}
							else {
								if(t === "success" && s.correct_state) { this.get_container().children("ul").empty(); }
							}
							if(e_call) { e_call.call(this); }
						};
						success_func = function (d, t, x) {
							var sf = this.get_settings().html_data.ajax.success; 
							if(sf) { d = sf.call(this,d,t,x) || d; }
							if(d === "" || (d && d.toString && d.toString().replace(/^[\s\n]+$/,"") === "")) {
								return error_func.call(this, x, t, "");
							}
							if(d) {
								d = $(d);
								if(!d.is("ul")) { d = $("<ul />").append(d); }
								if(obj == -1 || !obj) { this.get_container().children("ul").empty().append(d.children()).find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"); }
								else { obj.children("a.jstree-loading").removeClass("jstree-loading"); obj.append(d).children("ul").find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"); obj.removeData("jstree_is_loading"); }
								this.clean_node(obj);
								if(s_call) { s_call.call(this); }
							}
							else {
								if(obj && obj !== -1) {
									obj.children("a.jstree-loading").removeClass("jstree-loading");
									obj.removeData("jstree_is_loading");
									if(s.correct_state) { 
										this.correct_state(obj);
										if(s_call) { s_call.call(this); } 
									}
								}
								else {
									if(s.correct_state) { 
										this.get_container().children("ul").empty();
										if(s_call) { s_call.call(this); } 
									}
								}
							}
						};
						s.ajax.context = this;
						s.ajax.error = error_func;
						s.ajax.success = success_func;
						if(!s.ajax.dataType) { s.ajax.dataType = "html"; }
						if($.isFunction(s.ajax.url)) { s.ajax.url = s.ajax.url.call(this, obj); }
						if($.isFunction(s.ajax.data)) { s.ajax.data = s.ajax.data.call(this, obj); }
						$.ajax(s.ajax);
						break;
				}
			}
		}
	});
	// include the HTML data plugin by default
	$.jstree.defaults.plugins.push("html_data");
})(jQuery);
//*/

/* 
 * jsTree themeroller plugin
 * Adds support for jQuery UI themes. Include this at the end of your plugins list, also make sure "themes" is not included.
 */
(function ($) {
	$.jstree.plugin("themeroller", {
		__init : function () {
			var s = this._get_settings().themeroller;
			this.get_container()
				.addClass("ui-widget-content")
				.addClass("jstree-themeroller")
				.delegate("a","mouseenter.jstree", function (e) {
					if(!$(e.currentTarget).hasClass("jstree-loading")) {
						$(this).addClass(s.item_h);
					}
				})
				.delegate("a","mouseleave.jstree", function () {
					$(this).removeClass(s.item_h);
				})
				.bind("init.jstree", $.proxy(function (e, data) { 
						data.inst.get_container().find("> ul > li > .jstree-loading > ins").addClass("ui-icon-refresh");
						this._themeroller(data.inst.get_container().find("> ul > li"));
					}, this))
				.bind("open_node.jstree create_node.jstree", $.proxy(function (e, data) { 
						this._themeroller(data.rslt.obj);
					}, this))
				.bind("loaded.jstree refresh.jstree", $.proxy(function (e) {
						this._themeroller();
					}, this))
				.bind("close_node.jstree", $.proxy(function (e, data) {
						this._themeroller(data.rslt.obj);
					}, this))
				.bind("delete_node.jstree", $.proxy(function (e, data) {
						this._themeroller(data.rslt.parent);
					}, this))
				.bind("correct_state.jstree", $.proxy(function (e, data) {
						data.rslt.obj
							.children("ins.jstree-icon").removeClass(s.opened + " " + s.closed + " ui-icon").end()
							.find("> a > ins.ui-icon")
								.filter(function() { 
									return this.className.toString()
										.replace(s.item_clsd,"").replace(s.item_open,"").replace(s.item_leaf,"")
										.indexOf("ui-icon-") === -1; 
								}).removeClass(s.item_open + " " + s.item_clsd).addClass(s.item_leaf || "jstree-no-icon");
					}, this))
				.bind("select_node.jstree", $.proxy(function (e, data) {
						data.rslt.obj.children("a").addClass(s.item_a);
					}, this))
				.bind("deselect_node.jstree deselect_all.jstree", $.proxy(function (e, data) {
						this.get_container()
							.find("a." + s.item_a).removeClass(s.item_a).end()
							.find("a.jstree-clicked").addClass(s.item_a);
					}, this))
				.bind("dehover_node.jstree", $.proxy(function (e, data) {
						data.rslt.obj.children("a").removeClass(s.item_h);
					}, this))
				.bind("hover_node.jstree", $.proxy(function (e, data) {
						this.get_container()
							.find("a." + s.item_h).not(data.rslt.obj).removeClass(s.item_h);
						data.rslt.obj.children("a").addClass(s.item_h);
					}, this))
				.bind("move_node.jstree", $.proxy(function (e, data) {
						this._themeroller(data.rslt.o);
						this._themeroller(data.rslt.op);
					}, this));
		},
		__destroy : function () {
			var s = this._get_settings().themeroller,
				c = [ "ui-icon" ];
			$.each(s, function (i, v) {
				v = v.split(" ");
				if(v.length) { c = c.concat(v); }
			});
			this.get_container()
				.removeClass("ui-widget-content")
				.find("." + c.join(", .")).removeClass(c.join(" "));
		},
		_fn : {
			_themeroller : function (obj) {
				var s = this._get_settings().themeroller;
				obj = !obj || obj == -1 ? this.get_container_ul() : this._get_node(obj).parent();
				obj
					.find("li.jstree-closed")
						.children("ins.jstree-icon").removeClass(s.opened).addClass("ui-icon " + s.closed).end()
						.children("a").addClass(s.item)
							.children("ins.jstree-icon").addClass("ui-icon")
								.filter(function() { 
									return this.className.toString()
										.replace(s.item_clsd,"").replace(s.item_open,"").replace(s.item_leaf,"")
										.indexOf("ui-icon-") === -1; 
								}).removeClass(s.item_leaf + " " + s.item_open).addClass(s.item_clsd || "jstree-no-icon")
								.end()
							.end()
						.end()
					.end()
					.find("li.jstree-open")
						.children("ins.jstree-icon").removeClass(s.closed).addClass("ui-icon " + s.opened).end()
						.children("a").addClass(s.item)
							.children("ins.jstree-icon").addClass("ui-icon")
								.filter(function() { 
									return this.className.toString()
										.replace(s.item_clsd,"").replace(s.item_open,"").replace(s.item_leaf,"")
										.indexOf("ui-icon-") === -1; 
								}).removeClass(s.item_leaf + " " + s.item_clsd).addClass(s.item_open || "jstree-no-icon")
								.end()
							.end()
						.end()
					.end()
					.find("li.jstree-leaf")
						.children("ins.jstree-icon").removeClass(s.closed + " ui-icon " + s.opened).end()
						.children("a").addClass(s.item)
							.children("ins.jstree-icon").addClass("ui-icon")
								.filter(function() { 
									return this.className.toString()
										.replace(s.item_clsd,"").replace(s.item_open,"").replace(s.item_leaf,"")
										.indexOf("ui-icon-") === -1; 
								}).removeClass(s.item_clsd + " " + s.item_open).addClass(s.item_leaf || "jstree-no-icon");
			}
		},
		defaults : {
			"opened"	: "ui-icon-triangle-1-se",
			"closed"	: "ui-icon-triangle-1-e",
			"item"		: "ui-state-default",
			"item_h"	: "ui-state-hover",
			"item_a"	: "ui-state-active",
			"item_open"	: "ui-icon-folder-open",
			"item_clsd"	: "ui-icon-folder-collapsed",
			"item_leaf"	: "ui-icon-document"
		}
	});
	$(function() {
		var css_string = '' + 
			'.jstree-themeroller .ui-icon { overflow:visible; } ' + 
			'.jstree-themeroller a { padding:0 2px; } ' + 
			'.jstree-themeroller .jstree-no-icon { display:none; }';
		$.vakata.css.add_sheet({ str : css_string, title : "jstree" });
	});
})(jQuery);
//*/

/* 
 * jsTree unique plugin
 * Forces different names amongst siblings (still a bit experimental)
 * NOTE: does not check language versions (it will not be possible to have nodes with the same title, even in different languages)
 */
(function ($) {
	$.jstree.plugin("unique", {
		__init : function () {
			this.get_container()
				.bind("before.jstree", $.proxy(function (e, data) { 
						var nms = [], res = true, p, t;
						if(data.func == "move_node") {
							// obj, ref, position, is_copy, is_prepared, skip_check
							if(data.args[4] === true) {
								if(data.args[0].o && data.args[0].o.length) {
									data.args[0].o.children("a").each(function () { nms.push($(this).text().replace(/^\s+/g,"")); });
									res = this._check_unique(nms, data.args[0].np.find("> ul > li").not(data.args[0].o), "move_node");
								}
							}
						}
						if(data.func == "create_node") {
							// obj, position, js, callback, is_loaded
							if(data.args[4] || this._is_loaded(data.args[0])) {
								p = this._get_node(data.args[0]);
								if(data.args[1] && (data.args[1] === "before" || data.args[1] === "after")) {
									p = this._get_parent(data.args[0]);
									if(!p || p === -1) { p = this.get_container(); }
								}
								if(typeof data.args[2] === "string") { nms.push(data.args[2]); }
								else if(!data.args[2] || !data.args[2].data) { nms.push(this._get_string("new_node")); }
								else { nms.push(data.args[2].data); }
								res = this._check_unique(nms, p.find("> ul > li"), "create_node");
							}
						}
						if(data.func == "rename_node") {
							// obj, val
							nms.push(data.args[1]);
							t = this._get_node(data.args[0]);
							p = this._get_parent(t);
							if(!p || p === -1) { p = this.get_container(); }
							res = this._check_unique(nms, p.find("> ul > li").not(t), "rename_node");
						}
						if(!res) {
							e.stopPropagation();
							return false;
						}
					}, this));
		},
		defaults : { 
			error_callback : $.noop
		},
		_fn : { 
			_check_unique : function (nms, p, func) {
				var cnms = [];
				p.children("a").each(function () { cnms.push($(this).text().replace(/^\s+/g,"")); });
				if(!cnms.length || !nms.length) { return true; }
				cnms = cnms.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",");
				if((cnms.length + nms.length) != cnms.concat(nms).sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",").length) {
					this._get_settings().unique.error_callback.call(null, nms, p, func);
					return false;
				}
				return true;
			},
			check_move : function () {
				if(!this.__call_old()) { return false; }
				var p = this._get_move(), nms = [];
				if(p.o && p.o.length) {
					p.o.children("a").each(function () { nms.push($(this).text().replace(/^\s+/g,"")); });
					return this._check_unique(nms, p.np.find("> ul > li").not(p.o), "check_move");
				}
				return true;
			}
		}
	});
})(jQuery);
//*/

/*
 * jsTree wholerow plugin
 * Makes select and hover work on the entire width of the node
 * MAY BE HEAVY IN LARGE DOM
 */
(function ($) {
	$.jstree.plugin("wholerow", {
		__init : function () {
			if(!this.data.ui) { throw "jsTree wholerow: jsTree UI plugin not included."; }
			this.data.wholerow.html = false;
			this.data.wholerow.to = false;
			this.get_container()
				.bind("init.jstree", $.proxy(function (e, data) { 
						this._get_settings().core.animation = 0;
					}, this))
				.bind("open_node.jstree create_node.jstree clean_node.jstree loaded.jstree", $.proxy(function (e, data) { 
						this._prepare_wholerow_span( data && data.rslt && data.rslt.obj ? data.rslt.obj : -1 );
					}, this))
				.bind("search.jstree clear_search.jstree reopen.jstree after_open.jstree after_close.jstree create_node.jstree delete_node.jstree clean_node.jstree", $.proxy(function (e, data) { 
						if(this.data.to) { clearTimeout(this.data.to); }
						this.data.to = setTimeout( (function (t, o) { return function() { t._prepare_wholerow_ul(o); }; })(this,  data && data.rslt && data.rslt.obj ? data.rslt.obj : -1), 0);
					}, this))
				.bind("deselect_all.jstree", $.proxy(function (e, data) { 
						this.get_container().find(" > .jstree-wholerow .jstree-clicked").removeClass("jstree-clicked " + (this.data.themeroller ? this._get_settings().themeroller.item_a : "" ));
					}, this))
				.bind("select_node.jstree deselect_node.jstree ", $.proxy(function (e, data) { 
						data.rslt.obj.each(function () { 
							var ref = data.inst.get_container().find(" > .jstree-wholerow li:visible:eq(" + ( parseInt((($(this).offset().top - data.inst.get_container().offset().top + data.inst.get_container()[0].scrollTop) / data.inst.data.core.li_height),10)) + ")");
							// ref.children("a")[e.type === "select_node" ? "addClass" : "removeClass"]("jstree-clicked");
							ref.children("a").attr("class",data.rslt.obj.children("a").attr("class"));
						});
					}, this))
				.bind("hover_node.jstree dehover_node.jstree", $.proxy(function (e, data) { 
						this.get_container().find(" > .jstree-wholerow .jstree-hovered").removeClass("jstree-hovered " + (this.data.themeroller ? this._get_settings().themeroller.item_h : "" ));
						if(e.type === "hover_node") {
							var ref = this.get_container().find(" > .jstree-wholerow li:visible:eq(" + ( parseInt(((data.rslt.obj.offset().top - this.get_container().offset().top + this.get_container()[0].scrollTop) / this.data.core.li_height),10)) + ")");
							// ref.children("a").addClass("jstree-hovered");
							ref.children("a").attr("class",data.rslt.obj.children(".jstree-hovered").attr("class"));
						}
					}, this))
				.delegate(".jstree-wholerow-span, ins.jstree-icon, li", "click.jstree", function (e) {
						var n = $(e.currentTarget);
						if(e.target.tagName === "A" || (e.target.tagName === "INS" && n.closest("li").is(".jstree-open, .jstree-closed"))) { return; }
						n.closest("li").children("a:visible:eq(0)").click();
						e.stopImmediatePropagation();
					})
				.delegate("li", "mouseover.jstree", $.proxy(function (e) {
						e.stopImmediatePropagation();
						if($(e.currentTarget).children(".jstree-hovered, .jstree-clicked").length) { return false; }
						this.hover_node(e.currentTarget);
						return false;
					}, this))
				.delegate("li", "mouseleave.jstree", $.proxy(function (e) {
						if($(e.currentTarget).children("a").hasClass("jstree-hovered").length) { return; }
						this.dehover_node(e.currentTarget);
					}, this));
			if(is_ie7 || is_ie6) {
				$.vakata.css.add_sheet({ str : ".jstree-" + this.get_index() + " { position:relative; } ", title : "jstree" });
			}
		},
		defaults : {
		},
		__destroy : function () {
			this.get_container().children(".jstree-wholerow").remove();
			this.get_container().find(".jstree-wholerow-span").remove();
		},
		_fn : {
			_prepare_wholerow_span : function (obj) {
				obj = !obj || obj == -1 ? this.get_container().find("> ul > li") : this._get_node(obj);
				if(obj === false) { return; } // added for removing root nodes
				obj.each(function () {
					$(this).find("li").andSelf().each(function () {
						var $t = $(this);
						if($t.children(".jstree-wholerow-span").length) { return true; }
						$t.prepend("<span class='jstree-wholerow-span' style='width:" + ($t.parentsUntil(".jstree","li").length * 18) + "px;'>&#160;</span>");
					});
				});
			},
			_prepare_wholerow_ul : function () {
				var o = this.get_container().children("ul").eq(0), h = o.html();
				o.addClass("jstree-wholerow-real");
				if(this.data.wholerow.last_html !== h) {
					this.data.wholerow.last_html = h;
					this.get_container().children(".jstree-wholerow").remove();
					this.get_container().append(
						o.clone().removeClass("jstree-wholerow-real")
							.wrapAll("<div class='jstree-wholerow' />").parent()
							.width(o.parent()[0].scrollWidth)
							.css("top", (o.height() + ( is_ie7 ? 5 : 0)) * -1 )
							.find("li[id]").each(function () { this.removeAttribute("id"); }).end()
					);
				}
			}
		}
	});
	$(function() {
		var css_string = '' + 
			'.jstree .jstree-wholerow-real { position:relative; z-index:1; } ' + 
			'.jstree .jstree-wholerow-real li { cursor:pointer; } ' + 
			'.jstree .jstree-wholerow-real a { border-left-color:transparent !important; border-right-color:transparent !important; } ' + 
			'.jstree .jstree-wholerow { position:relative; z-index:0; height:0; } ' + 
			'.jstree .jstree-wholerow ul, .jstree .jstree-wholerow li { width:100%; } ' + 
			'.jstree .jstree-wholerow, .jstree .jstree-wholerow ul, .jstree .jstree-wholerow li, .jstree .jstree-wholerow a { margin:0 !important; padding:0 !important; } ' + 
			'.jstree .jstree-wholerow, .jstree .jstree-wholerow ul, .jstree .jstree-wholerow li { background:transparent !important; }' + 
			'.jstree .jstree-wholerow ins, .jstree .jstree-wholerow span, .jstree .jstree-wholerow input { display:none !important; }' + 
			'.jstree .jstree-wholerow a, .jstree .jstree-wholerow a:hover { text-indent:-9999px; !important; width:100%; padding:0 !important; border-right-width:0px !important; border-left-width:0px !important; } ' + 
			'.jstree .jstree-wholerow-span { position:absolute; left:0; margin:0px; padding:0; height:18px; border-width:0; padding:0; z-index:0; }';
		if(is_ff2) {
			css_string += '' + 
				'.jstree .jstree-wholerow a { display:block; height:18px; margin:0; padding:0; border:0; } ' + 
				'.jstree .jstree-wholerow-real a { border-color:transparent !important; } ';
		}
		if(is_ie7 || is_ie6) {
			css_string += '' + 
				'.jstree .jstree-wholerow, .jstree .jstree-wholerow li, .jstree .jstree-wholerow ul, .jstree .jstree-wholerow a { margin:0; padding:0; line-height:18px; } ' + 
				'.jstree .jstree-wholerow a { display:block; height:18px; line-height:18px; overflow:hidden; } ';
		}
		$.vakata.css.add_sheet({ str : css_string, title : "jstree" });
	});
})(jQuery);
//*/

/*
* jsTree model plugin
* This plugin gets jstree to use a class model to retrieve data, creating great dynamism
*/
(function ($) {
	var nodeInterface = ["getChildren","getChildrenCount","getAttr","getName","getProps"],
		validateInterface = function(obj, inter) {
			var valid = true;
			obj = obj || {};
			inter = [].concat(inter);
			$.each(inter, function (i, v) {
				if(!$.isFunction(obj[v])) { valid = false; return false; }
			});
			return valid;
		};
	$.jstree.plugin("model", {
		__init : function () {
			if(!this.data.json_data) { throw "jsTree model: jsTree json_data plugin not included."; }
			this._get_settings().json_data.data = function (n, b) {
				var obj = (n == -1) ? this._get_settings().model.object : n.data("jstree_model");
				if(!validateInterface(obj, nodeInterface)) { return b.call(null, false); }
				if(this._get_settings().model.async) {
					obj.getChildren($.proxy(function (data) {
						this.model_done(data, b);
					}, this));
				}
				else {
					this.model_done(obj.getChildren(), b);
				}
			};
		},
		defaults : {
			object : false,
			id_prefix : false,
			async : false
		},
		_fn : {
			model_done : function (data, callback) {
				var ret = [], 
					s = this._get_settings(),
					_this = this;

				if(!$.isArray(data)) { data = [data]; }
				$.each(data, function (i, nd) {
					var r = nd.getProps() || {};
					r.attr = nd.getAttr() || {};
					if(nd.getChildrenCount()) { r.state = "closed"; }
					r.data = nd.getName();
					if(!$.isArray(r.data)) { r.data = [r.data]; }
					if(_this.data.types && $.isFunction(nd.getType)) {
						r.attr[s.types.type_attr] = nd.getType();
					}
					if(r.attr.id && s.model.id_prefix) { r.attr.id = s.model.id_prefix + r.attr.id; }
					if(!r.metadata) { r.metadata = { }; }
					r.metadata.jstree_model = nd;
					ret.push(r);
				});
				callback.call(null, ret);
			}
		}
	});
})(jQuery);
//*/

})();
;

/*
 jquery.layout 1.3.0 - Release Candidate 30.62
 $Date: 2012-08-04 08:00:00 (Thu, 23 Aug 2012) $
 $Rev: 303006 $

 Copyright (c) 2012 
   Fabrizio Balliano (http://www.fabrizioballiano.net)
   Kevin Dalman (http://allpro.net)

 Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.

 Changelog: http://layout.jquery-dev.net/changelog.cfm#1.3.0.rc30.62
 NOTE: This is a short-term release to patch a couple of bugs.
 These bugs are listed as officially fixed in RC30.7, which will be released shortly.

 Docs: http://layout.jquery-dev.net/documentation.html
 Tips: http://layout.jquery-dev.net/tips.html
 Help: http://groups.google.com/group/jquery-ui-layout
*/
(function(b){var Ca=Math.min,D=Math.max,qa=Math.floor,S=function(a){return"string"===b.type(a)},ja=function(a,c){if(b.isArray(c))for(var d=0,f=c.length;d<f;d++){var h=c[d];try{S(h)&&(h=eval(h)),b.isFunction(h)&&h(a)}catch(j){}}};b.layout={version:"1.3.rc30.62",revision:0.033006,browser:{mozilla:!!b.browser.mozilla,webkit:!!b.browser.webkit||!!b.browser.safari,msie:!!b.browser.msie,isIE6:b.browser.msie&&6==b.browser.version,boxModel:!1!==b.support.boxModel||!b.browser.msie,version:b.browser.version},
effects:{slide:{all:{duration:"fast"},north:{direction:"up"},south:{direction:"down"},east:{direction:"right"},west:{direction:"left"}},drop:{all:{duration:"slow"},north:{direction:"up"},south:{direction:"down"},east:{direction:"right"},west:{direction:"left"}},scale:{all:{duration:"fast"}},blind:{},clip:{},explode:{},fade:{},fold:{},puff:{},size:{all:{easing:"swing"}}},config:{optionRootKeys:"effects panes north south west east center".split(" "),allPanes:["north","south","west","east","center"],
borderPanes:["north","south","west","east"],oppositeEdge:{north:"south",south:"north",east:"west",west:"east"},offscreenCSS:{left:"-99999px",right:"auto"},offscreenReset:"offscreenReset",hidden:{visibility:"hidden"},visible:{visibility:"visible"},resizers:{cssReq:{position:"absolute",padding:0,margin:0,fontSize:"1px",textAlign:"left",overflow:"hidden"},cssDemo:{background:"#DDD",border:"none"}},togglers:{cssReq:{position:"absolute",display:"block",padding:0,margin:0,overflow:"hidden",textAlign:"center",
fontSize:"1px",cursor:"pointer",zIndex:1},cssDemo:{background:"#AAA"}},content:{cssReq:{position:"relative"},cssDemo:{overflow:"auto",padding:"10px"},cssDemoPane:{overflow:"hidden",padding:0}},panes:{cssReq:{position:"absolute",margin:0},cssDemo:{padding:"10px",background:"#FFF",border:"1px solid #BBB",overflow:"auto"}},north:{side:"Top",sizeType:"Height",dir:"horz",cssReq:{top:0,bottom:"auto",left:0,right:0,width:"auto"}},south:{side:"Bottom",sizeType:"Height",dir:"horz",cssReq:{top:"auto",bottom:0,
left:0,right:0,width:"auto"}},east:{side:"Right",sizeType:"Width",dir:"vert",cssReq:{left:"auto",right:0,top:"auto",bottom:"auto",height:"auto"}},west:{side:"Left",sizeType:"Width",dir:"vert",cssReq:{left:0,right:"auto",top:"auto",bottom:"auto",height:"auto"}},center:{dir:"center",cssReq:{left:"auto",right:"auto",top:"auto",bottom:"auto",height:"auto",width:"auto"}}},callbacks:{},getParentPaneElem:function(a){a=b(a);if(a=a.data("layout")||a.data("parentLayout")){a=a.container;if(a.data("layoutPane"))return a;
a=a.closest("."+b.layout.defaults.panes.paneClass);if(a.data("layoutPane"))return a}return null},getParentPaneInstance:function(a){return(a=b.layout.getParentPaneElem(a))?a.data("layoutPane"):null},getParentLayoutInstance:function(a){return(a=b.layout.getParentPaneElem(a))?a.data("parentLayout"):null},getEventObject:function(b){return"object"===typeof b&&b.stopPropagation?b:null},parsePaneName:function(a){var c=b.layout.getEventObject(a);return c?(c.stopPropagation(),b(this).data("layoutEdge")):a},
plugins:{draggable:!!b.fn.draggable,effects:{core:!!b.effects,slide:b.effects&&b.effects.slide}},onCreate:[],onLoad:[],onReady:[],onDestroy:[],onUnload:[],afterOpen:[],afterClose:[],scrollbarWidth:function(){return window.scrollbarWidth||b.layout.getScrollbarSize("width")},scrollbarHeight:function(){return window.scrollbarHeight||b.layout.getScrollbarSize("height")},getScrollbarSize:function(a){var c=b('<div style="position: absolute; top: -10000px; left: -10000px; width: 100px; height: 100px; overflow: scroll;"></div>').appendTo("body"),
d={width:c.width()-c[0].clientWidth,height:c.height()-c[0].clientHeight};c.remove();window.scrollbarWidth=d.width;window.scrollbarHeight=d.height;return a.match(/^(width|height)$/)?d[a]:d},showInvisibly:function(b,c){if(b&&b.length&&(c||"none"===b.css("display"))){var d=b[0].style,d={display:d.display||"",visibility:d.visibility||""};b.css({display:"block",visibility:"hidden"});return d}return{}},getElementDimensions:function(a){var c={},d=c.css={},f={},h,j,m=b.layout.cssNum,r=a.offset();c.offsetLeft=
r.left;c.offsetTop=r.top;b.each(["Left","Right","Top","Bottom"],function(m,r){h=d["border"+r]=b.layout.borderWidth(a,r);j=d["padding"+r]=b.layout.cssNum(a,"padding"+r);f[r]=h+j;c["inset"+r]=j});c.offsetWidth=a.innerWidth();c.offsetHeight=a.innerHeight();c.outerWidth=a.outerWidth();c.outerHeight=a.outerHeight();c.innerWidth=D(0,c.outerWidth-f.Left-f.Right);c.innerHeight=D(0,c.outerHeight-f.Top-f.Bottom);d.width=a.width();d.height=a.height();d.top=m(a,"top",!0);d.bottom=m(a,"bottom",!0);d.left=m(a,
"left",!0);d.right=m(a,"right",!0);return c},getElementCSS:function(b,c){var d={},f=b[0].style,h=c.split(","),j=["Top","Bottom","Left","Right"],m=["Color","Style","Width"],r,y,T,I,x,p;for(I=0;I<h.length;I++)if(r=h[I],r.match(/(border|padding|margin)$/))for(x=0;4>x;x++)if(y=j[x],"border"===r)for(p=0;3>p;p++)T=m[p],d[r+y+T]=f[r+y+T];else d[r+y]=f[r+y];else d[r]=f[r];return d},cssWidth:function(a,c){if(0>=c)return 0;if(!b.layout.browser.boxModel)return c;var d=b.layout.borderWidth,f=b.layout.cssNum,
d=c-d(a,"Left")-d(a,"Right")-f(a,"paddingLeft")-f(a,"paddingRight");return D(0,d)},cssHeight:function(a,c){if(0>=c)return 0;if(!b.layout.browser.boxModel)return c;var d=b.layout.borderWidth,f=b.layout.cssNum,d=c-d(a,"Top")-d(a,"Bottom")-f(a,"paddingTop")-f(a,"paddingBottom");return D(0,d)},cssNum:function(a,c,d){a.jquery||(a=b(a));var f=b.layout.showInvisibly(a),c=b.css(a[0],c,!0),d=d&&"auto"==c?c:parseInt(c,10)||0;a.css(f);return d},borderWidth:function(a,c){a.jquery&&(a=a[0]);var d="border"+c.substr(0,
1).toUpperCase()+c.substr(1);return"none"===b.css(a,d+"Style",!0)?0:parseInt(b.css(a,d+"Width",!0),10)||0},isMouseOverElem:function(a,c){var d=b(c||this),f=d.offset(),h=f.top,f=f.left,j=f+d.outerWidth(),d=h+d.outerHeight(),m=a.pageX,r=a.pageY;return b.layout.browser.msie&&0>m&&0>r||m>=f&&m<=j&&r>=h&&r<=d},msg:function(a,c,d,f){b.isPlainObject(a)&&window.debugData?("string"===typeof c?(f=d,d=c):"object"===typeof d&&(f=d,d=null),d=d||"log( <object> )",f=b.extend({sort:!1,returnHTML:!1,display:!1},f),
!0===c||f.display?debugData(a,d,f):window.console&&console.log(debugData(a,d,f))):c?alert(a):window.console?console.log(a):(c=b("#layoutLogger"),c.length||(c=b('<div id="layoutLogger" style="position: '+(b.support.fixedPosition?"fixed":"absolute")+'; top: 5px; z-index: 999999; max-width: 25%; overflow: hidden; border: 1px solid #000; border-radius: 5px; background: #FBFBFB; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"><div style="font-size: 13px; font-weight: bold; padding: 5px 10px; background: #F6F6F6; border-radius: 5px 5px 0 0; cursor: move;"><span style="float: right; padding-left: 7px; cursor: pointer;" title="Remove Console" onclick="$(this).closest(\'#layoutLogger\').remove()">X</span>Layout console.log</div><ul style="font-size: 13px; font-weight: none; list-style: none; margin: 0; padding: 0 0 2px;"></ul></div>').appendTo("body"),
c.css("left",b(window).width()-c.outerWidth()-5),b.ui.draggable&&c.draggable({handle:":first-child"})),c.children("ul").append('<li style="padding: 4px 10px; margin: 0; border-top: 1px solid #CCC;">'+a.replace(/\</g,"&lt;").replace(/\>/g,"&gt;")+"</li>"))}};b.layout.defaults={name:"",containerSelector:"",containerClass:"ui-layout-container",scrollToBookmarkOnLoad:!0,resizeWithWindow:!0,resizeWithWindowDelay:200,resizeWithWindowMaxDelay:0,onresizeall_start:null,onresizeall_end:null,onload_start:null,
onload_end:null,onunload_start:null,onunload_end:null,initPanes:!0,showErrorMessages:!0,showDebugMessages:!1,zIndex:null,zIndexes:{pane_normal:0,content_mask:1,resizer_normal:2,pane_sliding:100,pane_animate:1E3,resizer_drag:1E4},errors:{pane:"pane",selector:"selector",addButtonError:"Error Adding Button \n\nInvalid ",containerMissing:"UI Layout Initialization Error\n\nThe specified layout-container does not exist.",centerPaneMissing:"UI Layout Initialization Error\n\nThe center-pane element does not exist.\n\nThe center-pane is a required element.",
noContainerHeight:"UI Layout Initialization Warning\n\nThe layout-container \"CONTAINER\" has no height.\n\nTherefore the layout is 0-height and hence 'invisible'!",callbackError:"UI Layout Callback Error\n\nThe EVENT callback is not a valid function."},panes:{applyDemoStyles:!1,closable:!0,resizable:!0,slidable:!0,initClosed:!1,initHidden:!1,contentSelector:".ui-layout-content",contentIgnoreSelector:".ui-layout-ignore",findNestedContent:!1,paneClass:"ui-layout-pane",resizerClass:"ui-layout-resizer",
togglerClass:"ui-layout-toggler",buttonClass:"ui-layout-button",minSize:0,maxSize:0,spacing_open:6,spacing_closed:6,togglerLength_open:50,togglerLength_closed:50,togglerAlign_open:"center",togglerAlign_closed:"center",togglerContent_open:"",togglerContent_closed:"",resizerDblClickToggle:!0,autoResize:!0,autoReopen:!0,resizerDragOpacity:1,maskContents:!1,maskObjects:!1,maskZindex:null,resizingGrid:!1,livePaneResizing:!1,liveContentResizing:!1,liveResizingTolerance:1,sliderCursor:"pointer",slideTrigger_open:"click",
slideTrigger_close:"mouseleave",slideDelay_open:300,slideDelay_close:300,hideTogglerOnSlide:!1,preventQuickSlideClose:b.layout.browser.webkit,preventPrematureSlideClose:!1,tips:{Open:"Open",Close:"Close",Resize:"Resize",Slide:"Slide Open",Pin:"Pin",Unpin:"Un-Pin",noRoomToOpen:"Not enough room to show this panel.",minSizeWarning:"Panel has reached its minimum size",maxSizeWarning:"Panel has reached its maximum size"},showOverflowOnHover:!1,enableCursorHotkey:!0,customHotkeyModifier:"SHIFT",fxName:"slide",
fxSpeed:null,fxSettings:{},fxOpacityFix:!0,animatePaneSizing:!1,childOptions:null,initChildLayout:!0,destroyChildLayout:!0,resizeChildLayout:!0,triggerEventsOnLoad:!1,triggerEventsDuringLiveResize:!0,onshow_start:null,onshow_end:null,onhide_start:null,onhide_end:null,onopen_start:null,onopen_end:null,onclose_start:null,onclose_end:null,onresize_start:null,onresize_end:null,onsizecontent_start:null,onsizecontent_end:null,onswap_start:null,onswap_end:null,ondrag_start:null,ondrag_end:null},north:{paneSelector:".ui-layout-north",
size:"auto",resizerCursor:"n-resize",customHotkey:""},south:{paneSelector:".ui-layout-south",size:"auto",resizerCursor:"s-resize",customHotkey:""},east:{paneSelector:".ui-layout-east",size:200,resizerCursor:"e-resize",customHotkey:""},west:{paneSelector:".ui-layout-west",size:200,resizerCursor:"w-resize",customHotkey:""},center:{paneSelector:".ui-layout-center",minWidth:0,minHeight:0}};b.layout.optionsMap={layout:"stateManagement effects zIndexes errors name zIndex scrollToBookmarkOnLoad showErrorMessages resizeWithWindow resizeWithWindowDelay resizeWithWindowMaxDelay onresizeall onresizeall_start onresizeall_end onload onunload".split(" "),
center:"paneClass contentSelector contentIgnoreSelector findNestedContent applyDemoStyles triggerEventsOnLoad showOverflowOnHover maskContents maskObjects liveContentResizing childOptions initChildLayout resizeChildLayout destroyChildLayout onresize onresize_start onresize_end onsizecontent onsizecontent_start onsizecontent_end".split(" "),noDefault:["paneSelector","resizerCursor","customHotkey"]};b.layout.transformData=function(b){var c={panes:{},center:{}},d,f,h,j,m,r,y;if("object"!==typeof b)return c;
for(f in b){d=c;m=b[f];h=f.split("__");y=h.length-1;for(r=0;r<=y;r++)j=h[r],r===y?d[j]=m:d[j]||(d[j]={}),d=d[j]}return c};b.layout.backwardCompatibility={map:{applyDefaultStyles:"applyDemoStyles",resizeNestedLayout:"resizeChildLayout",resizeWhileDragging:"livePaneResizing",resizeContentWhileDragging:"liveContentResizing",triggerEventsWhileDragging:"triggerEventsDuringLiveResize",maskIframesOnResize:"maskContents",useStateCookie:"stateManagement.enabled","cookie.autoLoad":"stateManagement.autoLoad",
"cookie.autoSave":"stateManagement.autoSave","cookie.keys":"stateManagement.stateKeys","cookie.name":"stateManagement.cookie.name","cookie.domain":"stateManagement.cookie.domain","cookie.path":"stateManagement.cookie.path","cookie.expires":"stateManagement.cookie.expires","cookie.secure":"stateManagement.cookie.secure",noRoomToOpenTip:"tips.noRoomToOpen",togglerTip_open:"tips.Close",togglerTip_closed:"tips.Open",resizerTip:"tips.Resize",sliderTip:"tips.Slide"},renameOptions:function(a){function c(b,
c){for(var d=b.split("."),f=d.length-1,j={branch:a,key:d[f]},h=0,o;h<f;h++)o=d[h],j.branch=void 0==j.branch[o]?c?j.branch[o]={}:{}:j.branch[o];return j}var d=b.layout.backwardCompatibility.map,f,h,j,m;for(m in d)f=c(m),j=f.branch[f.key],void 0!==j&&(h=c(d[m],!0),h.branch[h.key]=j,delete f.branch[f.key])},renameAllOptions:function(a){var c=b.layout.backwardCompatibility.renameOptions;c(a);a.defaults&&("object"!==typeof a.panes&&(a.panes={}),b.extend(!0,a.panes,a.defaults),delete a.defaults);a.panes&&
c(a.panes);b.each(b.layout.config.allPanes,function(b,f){a[f]&&c(a[f])});return a}};b.fn.layout=function(a){function c(g){if(!g)return!0;var w=g.keyCode;if(33>w)return!0;var v={38:"north",40:"south",37:"west",39:"east"},a=g.shiftKey,e=g.ctrlKey,i,K,c,k;e&&(37<=w&&40>=w)&&p[v[w]].enableCursorHotkey?k=v[w]:(e||a)&&b.each(j.borderPanes,function(g,b){i=p[b];K=i.customHotkey;c=i.customHotkeyModifier;if(a&&"SHIFT"==c||e&&"CTRL"==c||e&&a)if(K&&w===(isNaN(K)||9>=K?K.toUpperCase().charCodeAt(0):K))return k=
b,!1});if(!k||!t[k]||!p[k].closable||o[k].isHidden)return!0;ka(k);g.stopPropagation();return g.returnValue=!1}function d(g){if(E()){this&&this.tagName&&(g=this);var w;S(g)?w=t[g]:b(g).data("layoutRole")?w=b(g):b(g).parents().each(function(){if(b(this).data("layoutRole"))return w=b(this),!1});if(w&&w.length){var v=w.data("layoutEdge"),g=o[v];g.cssSaved&&f(v);if(g.isSliding||g.isResizing||g.isClosed)g.cssSaved=!1;else{var a={zIndex:p.zIndexes.resizer_normal+1},e={},i=w.css("overflow"),c=w.css("overflowX"),
d=w.css("overflowY");"visible"!=i&&(e.overflow=i,a.overflow="visible");c&&!c.match(/(visible|auto)/)&&(e.overflowX=c,a.overflowX="visible");d&&!d.match(/(visible|auto)/)&&(e.overflowY=c,a.overflowY="visible");g.cssSaved=e;w.css(a);b.each(j.allPanes,function(g,b){b!=v&&f(b)})}}}}function f(g){if(E()){this&&this.tagName&&(g=this);var w;S(g)?w=t[g]:b(g).data("layoutRole")?w=b(g):b(g).parents().each(function(){if(b(this).data("layoutRole"))return w=b(this),!1});if(w&&w.length){var g=w.data("layoutEdge"),
g=o[g],v=g.cssSaved||{};!g.isSliding&&!g.isResizing&&w.css("zIndex",p.zIndexes.pane_normal);w.css(v);g.cssSaved=!1}}}var h=b.layout.browser,j=b.layout.config,m=b.layout.cssWidth,r=b.layout.cssHeight,y=b.layout.getElementDimensions,T=b.layout.getElementCSS,I=b.layout.getEventObject,x=b.layout.parsePaneName,p=b.extend(!0,{},b.layout.defaults);p.effects=b.extend(!0,{},b.layout.effects);var o={id:"layout"+b.now(),initialized:!1,container:{},north:{},south:{},east:{},west:{},center:{}},M={north:null,south:null,
east:null,west:null,center:null},F={data:{},set:function(g,b,v){F.clear(g);F.data[g]=setTimeout(b,v)},clear:function(g){var b=F.data;b[g]&&(clearTimeout(b[g]),delete b[g])}},U=function(g,w,v){var a=p;(a.showErrorMessages&&!v||v&&a.showDebugMessages)&&b.layout.msg(a.name+" / "+g,!1!==w);return!1},A=function(g,w,a){var z=w&&S(w),e=z?o[w]:o,i=z?p[w]:p,c=p.name,d=g+(g.match(/_/)?"":"_end"),k=d.match(/_end$/)?d.substr(0,d.length-4):"",l=i[d]||i[k],j="NC",f=[];!z&&"boolean"!==b.type(a)&&(a=w);if(l)try{S(l)&&
(l.match(/,/)?(f=l.split(","),l=eval(f[0])):l=eval(l)),b.isFunction(l)&&(j=f.length?l(f[1]):z?l(w,t[w],e,i,c):l(s,e,i,c))}catch(h){U(p.errors.callbackError.replace(/EVENT/,b.trim(w+" "+d)),!1)}!a&&!1!==j&&(z?(a=t[w],i=p[w],e=o[w],a.triggerHandler("layoutpane"+d,[w,a,e,i,c]),k&&a.triggerHandler("layoutpane"+k,[w,a,e,i,c])):(u.triggerHandler("layout"+d,[s,e,i,c]),k&&u.triggerHandler("layout"+k,[s,e,i,c])));("onresize_end"===g||"onsizecontent_end"===g)&&Da(w);return j},Ua=function(g){if(!h.mozilla){var b=
t[g];"IFRAME"===o[g].tagName?b.css(j.hidden).css(j.visible):b.find("IFRAME").css(j.hidden).css(j.visible)}},ra=function(g){var b=t[g],g=j[g].dir,b={minWidth:1001-m(b,1E3),minHeight:1001-r(b,1E3)};"horz"===g&&(b.minSize=b.minHeight);"vert"===g&&(b.minSize=b.minWidth);return b},V=function(g,a,v){v||(v=j[g].dir);S(a)&&a.match(/%/)&&(a="100%"===a?-1:parseInt(a,10)/100);if(0===a)return 0;if(1<=a)return parseInt(a,10);var z=p,e=0;"horz"==v?e=q.innerHeight-(t.north?z.north.spacing_open:0)-(t.south?z.south.spacing_open:
0):"vert"==v&&(e=q.innerWidth-(t.west?z.west.spacing_open:0)-(t.east?z.east.spacing_open:0));if(-1===a)return e;if(0<a)return qa(e*a);if("center"==g)return 0;var v="horz"===v?"height":"width",z=t[g],g="height"===v?L[g]:!1,e=b.layout.showInvisibly(z),i=z.css(v),c=g?g.css(v):0;z.css(v,"auto");g&&g.css(v,"auto");a="height"===v?z.outerHeight():z.outerWidth();z.css(v,i).css(e);g&&g.css(v,c);return a},aa=function(g,b){var a=t[g],z=p[g],e=o[g],i=b?z.spacing_open:0,z=b?z.spacing_closed:0;return!a||e.isHidden?
0:e.isClosed||e.isSliding&&b?z:"horz"===j[g].dir?a.outerHeight()+i:a.outerWidth()+i},P=function(g,b){if(E()){var a=p[g],z=o[g],e=j[g],i=e.dir;e.side.toLowerCase();e.sizeType.toLowerCase();var e=void 0!=b?b:z.isSliding,c=a.spacing_open,d=j.oppositeEdge[g],k=o[d],l=t[d],f=!l||!1===k.isVisible||k.isSliding?0:"horz"==i?l.outerHeight():l.outerWidth(),d=(!l||k.isHidden?0:p[d][!1!==k.isClosed?"spacing_closed":"spacing_open"])||0,k="horz"==i?q.innerHeight:q.innerWidth,l=ra("center"),l="horz"==i?D(p.center.minHeight,
l.minHeight):D(p.center.minWidth,l.minWidth),e=k-c-(e?0:V("center",l,i)+f+d),i=z.minSize=D(V(g,a.minSize),ra(g).minSize),e=z.maxSize=Ca(a.maxSize?V(g,a.maxSize):1E5,e),z=z.resizerPosition={},c=q.insetTop,f=q.insetLeft,d=q.innerWidth,k=q.innerHeight,a=a.spacing_open;switch(g){case "north":z.min=c+i;z.max=c+e;break;case "west":z.min=f+i;z.max=f+e;break;case "south":z.min=c+k-e-a;z.max=c+k-i-a;break;case "east":z.min=f+d-e-a,z.max=f+d-i-a}}},Ea=function(g,a){var v=b(g),z=v.data("layoutRole"),e=v.data("layoutEdge"),
i=p[e][z+"Class"],e="-"+e,c=v.hasClass(i+"-closed")?"-closed":"-open",d="-closed"===c?"-open":"-closed",c=i+"-hover "+(i+e+"-hover ")+(i+c+"-hover ")+(i+e+c+"-hover ");a&&(c+=i+d+"-hover "+(i+e+d+"-hover "));"resizer"==z&&v.hasClass(i+"-sliding")&&(c+=i+"-sliding-hover "+(i+e+"-sliding-hover "));return b.trim(c)},Fa=function(g,a){var v=b(a||this);g&&"toggler"===v.data("layoutRole")&&g.stopPropagation();v.addClass(Ea(v))},Q=function(g,a){var v=b(a||this);v.removeClass(Ea(v,!0))},Va=function(){b.fn.disableSelection&&
b("body").disableSelection()},Wa=function(g,a){var v=a||this,c=b(v).data("layoutEdge"),e=c+"ResizerLeave";F.clear(c+"_openSlider");F.clear(e);a?!o[c].isResizing&&b.fn.enableSelection&&b("body").enableSelection():F.set(e,function(){Wa(g,v)},200)},E=function(){return o.initialized||o.creatingLayout?!0:sa()},sa=function(g){var a=p;if(!u.is(":visible"))return!g&&(h.webkit&&"BODY"===u[0].tagName)&&setTimeout(function(){sa(!0)},50),!1;if(!Xa("center").length)return U(a.errors.centerPaneMissing);o.creatingLayout=
!0;b.extend(q,y(u));x(void 0);b.each(j.allPanes,function(g,b){Ya(b,!0)});Ga();b.each(j.borderPanes,function(g,b){t[b]&&o[b].isVisible&&(P(b),W(b))});X("center");b.each(j.allPanes,function(g,b){var a=p[b];t[b]&&(o[b].isVisible&&(da(b),a.triggerEventsOnLoad?A("onresize_end",b):Da(b)),a.initChildLayout&&a.childOptions&&Ha(b))});a.scrollToBookmarkOnLoad&&(g=self.location,g.hash&&g.replace(g.hash));s.hasParentLayout?a.resizeWithWindow=!1:a.resizeWithWindow&&b(window).bind("resize."+H,ob);delete o.creatingLayout;
o.initialized=!0;ja(s,b.layout.onReady);A("onload_end");return!0},Ha=function(g,b){var a=x.call(this,g),c=t[a];if(c){var e=L[a],i=b||p[a].childOptions,c=i.containerSelector?c.find(i.containerSelector):e||c,d=(e=c.length)?M[a]=c.data("layout")||null:null;!d&&(e&&i)&&(d=M[a]=c.eq(0).layout(i)||null);d&&(d.hasParentLayout=!0)}s[a].child=M[a]},ob=function(){var g=Number(p.resizeWithWindowDelay);10>g&&(g=100);F.clear("winResize");F.set("winResize",function(){F.clear("winResize");F.clear("winResizeRepeater");
var g=y(u);(g.innerWidth!==q.innerWidth||g.innerHeight!==q.innerHeight)&&ea()},g);F.data.winResizeRepeater||Za()},Za=function(){var g=Number(p.resizeWithWindowMaxDelay);0<g&&F.set("winResizeRepeater",function(){Za();ea()},g)},$a=function(){A("onunload_start");ja(s,b.layout.onUnload);A("onunload_end")},ab=function(g){g=g?g.split(","):j.borderPanes;b.each(g,function(g,a){var d=p[a];if(d.enableCursorHotkey||d.customHotkey)return b(document).bind("keydown."+H,c),!1})},Xa=function(g){g=p[g].paneSelector;
if("#"===g.substr(0,1))return u.find(g).eq(0);var b=u.children(g).eq(0);return b.length?b:u.children("form:first").children(g).eq(0)},Ya=function(g,b){if(b||E()){var a=p[g],c=o[g],e=j[g],i=e.dir,K="center"===g,C={},k=t[g],l,h;k?Ia(g,!1,!0,!1):L[g]=!1;k=t[g]=Xa(g);if(k.length){k.data("layoutCSS")||k.data("layoutCSS",T(k,"position,top,left,bottom,right,width,height,overflow,zIndex,display,backgroundColor,padding,margin,border"));s[g]={name:g,pane:t[g],content:L[g],options:p[g],state:o[g],child:M[g]};
k.data({parentLayout:s,layoutPane:s[g],layoutEdge:g,layoutRole:"pane"}).css(e.cssReq).css("zIndex",p.zIndexes.pane_normal).css(a.applyDemoStyles?e.cssDemo:{}).addClass(a.paneClass+" "+a.paneClass+"-"+g).bind("mouseenter."+H,Fa).bind("mouseleave."+H,Q);e={hide:"",show:"",toggle:"",close:"",open:"",slideOpen:"",slideClose:"",slideToggle:"",size:"sizePane",sizePane:"sizePane",sizeContent:"",sizeHandles:"",enableClosable:"",disableClosable:"",enableSlideable:"",disableSlideable:"",enableResizable:"",
disableResizable:"",swapPanes:"swapPanes",swap:"swapPanes",move:"swapPanes",removePane:"removePane",remove:"removePane",createChildLayout:"",resizeChildLayout:"",resizeAll:"resizeAll",resizeLayout:"resizeAll"};for(h in e)k.bind("layoutpane"+h.toLowerCase()+"."+H,s[e[h]||h]);Ja(g,!1);K||(l=c.size=V(g,a.size),K=V(g,a.minSize)||1,h=V(g,a.maxSize)||1E5,0<l&&(l=D(Ca(l,h),K)),c.isClosed=!1,c.isSliding=!1,c.isResizing=!1,c.isHidden=!1,c.pins||(c.pins=[]));c.tagName=k[0].tagName;c.edge=g;c.noRoom=!1;c.isVisible=
!0;switch(g){case "north":C.top=q.insetTop;C.left=q.insetLeft;C.right=q.insetRight;break;case "south":C.bottom=q.insetBottom;C.left=q.insetLeft;C.right=q.insetRight;break;case "west":C.left=q.insetLeft;break;case "east":C.right=q.insetRight}"horz"===i?C.height=r(k,l):"vert"===i&&(C.width=m(k,l));k.css(C);"horz"!=i&&X(g,!0);a.initClosed&&a.closable&&!a.initHidden?Y(g,!0,!0):a.initHidden||a.initClosed?Ka(g):c.noRoom||k.css("display","block");k.css("visibility","visible");a.showOverflowOnHover&&k.hover(d,
f);o.initialized&&(Ga(g),ab(g),ea(),c.isVisible&&(a.triggerEventsOnLoad?A("onresize_end",g):Da(g)),a.initChildLayout&&a.childOptions&&Ha(g))}else t[g]=!1}},Ga=function(g){g=g?g.split(","):j.borderPanes;b.each(g,function(g,a){var c=t[a];B[a]=!1;J[a]=!1;if(c){var e=p[a],c=o[a],i=j[a],d="#"===e.paneSelector.substr(0,1)?e.paneSelector.substr(1):"",f=e.resizerClass,k=e.togglerClass;i.side.toLowerCase();var i="-"+a,l=s[a],h=l.resizer=B[a]=b("<div></div>"),l=l.toggler=e.closable?J[a]=b("<div></div>"):!1;
!c.isVisible&&e.slidable&&h.attr("title",e.tips.Slide).css("cursor",e.sliderCursor);h.attr("id",d?d+"-resizer":"").data({parentLayout:s,layoutPane:s[a],layoutEdge:a,layoutRole:"resizer"}).css(j.resizers.cssReq).css("zIndex",p.zIndexes.resizer_normal).css(e.applyDemoStyles?j.resizers.cssDemo:{}).addClass(f+" "+f+i).hover(Fa,Q).hover(Va,Wa).appendTo(u);l&&(l.attr("id",d?d+"-toggler":"").data({parentLayout:s,layoutPane:s[a],layoutEdge:a,layoutRole:"toggler"}).css(j.togglers.cssReq).css(e.applyDemoStyles?
j.togglers.cssDemo:{}).addClass(k+" "+k+i).hover(Fa,Q).bind("mouseenter",Va).appendTo(h),e.togglerContent_open&&b("<span>"+e.togglerContent_open+"</span>").data({layoutEdge:a,layoutRole:"togglerContent"}).data("layoutRole","togglerContent").data("layoutEdge",a).addClass("content content-open").css("display","none").appendTo(l),e.togglerContent_closed&&b("<span>"+e.togglerContent_closed+"</span>").data({layoutEdge:a,layoutRole:"togglerContent"}).addClass("content content-closed").css("display","none").appendTo(l),
bb(a));var e=a,m=b.layout.plugins.draggable,e=e?e.split(","):j.borderPanes;b.each(e,function(g,a){var e=p[a];if(!m||!t[a]||!e.resizable){e.resizable=false;return true}var c=o[a],w=p.zIndexes,i=j[a],d=i.dir=="horz"?"top":"left",v=a+",center,"+j.oppositeEdge[a]+(i.dir=="horz"?",west,east":""),k=B[a],z=e.resizerClass,f=0,l,K,h=z+"-drag",C=z+"-"+a+"-drag",mb=z+"-dragging",q=z+"-"+a+"-dragging",y=z+"-dragging-limit",x=z+"-"+a+"-dragging-limit",s=false;c.isClosed||k.attr("title",e.tips.Resize).css("cursor",
e.resizerCursor);k.draggable({containment:u[0],axis:i.dir=="horz"?"y":"x",delay:0,distance:1,grid:e.resizingGrid,helper:"clone",opacity:e.resizerDragOpacity,addClasses:false,zIndex:w.resizer_drag,start:function(g,w){e=p[a];c=o[a];K=e.livePaneResizing;if(false===A("ondrag_start",a))return false;c.isResizing=true;F.clear(a+"_closeSlider");P(a);l=c.resizerPosition;f=w.position[d];k.addClass(h+" "+C);s=false;b("body").disableSelection();ma(v)},drag:function(g,b){if(!s){b.helper.addClass(mb+" "+q).css({right:"auto",
bottom:"auto"}).children().css("visibility","hidden");s=true;c.isSliding&&t[a].css("zIndex",w.pane_sliding)}var i=0;if(b.position[d]<l.min){b.position[d]=l.min;i=-1}else if(b.position[d]>l.max){b.position[d]=l.max;i=1}if(i){b.helper.addClass(y+" "+x);window.defaultStatus=i>0&&a.match(/(north|west)/)||i<0&&a.match(/(south|east)/)?e.tips.maxSizeWarning:e.tips.minSizeWarning}else{b.helper.removeClass(y+" "+x);window.defaultStatus=""}if(K&&Math.abs(b.position[d]-f)>=e.liveResizingTolerance){f=b.position[d];
r(g,b,a)}},stop:function(g,e){b("body").enableSelection();window.defaultStatus="";k.removeClass(h+" "+C);c.isResizing=false;r(g,e,a,true,v)}})});var r=function(a,g,b,e,c){var w=g.position,i=j[b],a=p[b],g=o[b],d;switch(b){case "north":d=w.top;break;case "west":d=w.left;break;case "south":d=q.offsetHeight-w.top-a.spacing_open;break;case "east":d=q.offsetWidth-w.left-a.spacing_open}d=d-q["inset"+i.side];if(e){false!==A("ondrag_end",b)&&ta(b,d,false,true);ua();g.isSliding&&c&&ma(c,true)}else if(!(Math.abs(d-
g.size)<a.liveResizingTolerance)){ta(b,d,false,true);ba.each(cb)}};c.isVisible?La(a):(Ma(a),ca(a,!0))}});fa()},Ja=function(a,b){if(E()){var c=p[a],d=c.contentSelector,e=s[a],i=t[a],f;d&&(f=e.content=L[a]=c.findNestedContent?i.find(d).eq(0):i.children(d).eq(0));f&&f.length?(f.data("layoutRole","content"),f.data("layoutCSS")||f.data("layoutCSS",T(f,"height")),f.css(j.content.cssReq),c.applyDemoStyles&&(f.css(j.content.cssDemo),i.css(j.content.cssDemoPane)),o[a].content={},!1!==b&&da(a)):e.content=L[a]=
!1}},cb=function(){var a=b(this),c=a.data("layoutMask"),c=o[c];"IFRAME"==c.tagName&&c.isVisible&&a.css({top:c.offsetTop,left:c.offsetLeft,width:c.outerWidth,height:c.outerHeight})},ma=function(a,c){var d=a?a.split(","):b.layout.config.allPanes,f=p.zIndexes,e,i;b.each(d,function(a,g){i=o[g];e=p[g];if(i.isVisible&&(!c&&e.maskContents||e.maskObjects)){for(var d=b([]),v,j=0,h=ba.length;j<h;j++)v=ba.eq(j),v.data("layoutMask")===g&&(d=d.add(v));if(!d.length){d=t[g];v=o[g];var j=p[g],h=p.zIndexes,m=b([]),
r,q,y,s,x;if(j.maskContents||j.maskObjects)for(x=0;x<(j.maskObjects?2:1);x++)r=j.maskObjects&&0==x,q=document.createElement(r?"iframe":"div"),y=b(q).data("layoutMask",g),q.className="ui-layout-mask ui-layout-mask-"+g,s=q.style,s.display="block",s.position="absolute",r&&(q.frameborder=0,q.src="about:blank",s.opacity=0,s.filter="Alpha(Opacity='0')",s.border=0),"IFRAME"==v.tagName?(s.zIndex=h.pane_normal+1,u.append(q)):(y.addClass("ui-layout-mask-inside-pane"),s.zIndex=j.maskZindex||h.content_mask,s.top=
0,s.left=0,s.width="100%",s.height="100%",d.append(q)),m=m.add(q),ba=ba.add(q);d=m}d.each(function(){cb.call(this);this.style.zIndex=i.isSliding?f.pane_sliding+1:f.pane_normal+1;this.style.display="block"})}})},ua=function(){var a;b.each(b.layout.config.borderPanes,function(b,c){if(o[c].isResizing)return a=!0,!1});a||ba.hide()},Ia=function(a,c,d,f){if(E()){var a=x.call(this,a),e=t[a],i=L[a],j=B[a],h=J[a];e&&b.isEmptyObject(e.data())&&(e=!1);i&&b.isEmptyObject(i.data())&&(i=!1);j&&b.isEmptyObject(j.data())&&
(j=!1);h&&b.isEmptyObject(h.data())&&(h=!1);e&&e.stop(!0,!0);var k=p[a],l=M[a]||(e?e.data("layout"):0)||(i?i.data("layout"):0)||null;if((void 0!==f?f:k.destroyChildLayout)&&l&&!l.destroyed)l.destroy(!0),l.destroyed&&(l=null);e&&c&&!l?e.remove():e&&e[0]&&(c=k.paneClass,f=c+"-"+a,c=[c,c+"-open",c+"-closed",c+"-sliding",f,f+"-open",f+"-closed",f+"-sliding"],b.merge(c,Ea(e,!0)),e.removeClass(c.join(" ")).removeData("parentLayout").removeData("layoutPane").removeData("layoutRole").removeData("layoutEdge").removeData("autoHidden").unbind("."+
H),i&&i.data("layout")?(i.width(i.width()),l.resizeAll()):i&&i.css(i.data("layoutCSS")).removeData("layoutCSS").removeData("layoutRole"),e.data("layout")||e.css(e.data("layoutCSS")).removeData("layoutCSS"));h&&h.remove();j&&j.remove();s[a]=t[a]=L[a]=B[a]=J[a]=M[a]=!1;d||ea()}},va=function(a){var b=t[a],c=b[0].style;p[a].useOffscreenClose?(b.data(j.offscreenReset)||b.data(j.offscreenReset,{left:c.left,right:c.right}),b.css(j.offscreenCSS)):b.hide().removeData(j.offscreenReset)},db=function(a){var b=
t[a],a=p[a],c=j.offscreenCSS,d=b.data(j.offscreenReset),e=b[0].style;b.show().removeData(j.offscreenReset);if(a.useOffscreenClose&&d&&(e.left==c.left&&(e.left=d.left),e.right==c.right))e.right=d.right},Ka=function(a,b){if(E()){var c=x.call(this,a),d=p[c],e=o[c],i=B[c];t[c]&&!e.isHidden&&!(o.initialized&&!1===A("onhide_start",c))&&(e.isSliding=!1,i&&i.hide(),!o.initialized||e.isClosed?(e.isClosed=!0,e.isHidden=!0,e.isVisible=!1,o.initialized||va(c),X("horz"===j[c].dir?"":"center"),(o.initialized||
d.triggerEventsOnLoad)&&A("onhide_end",c)):(e.isHiding=!0,Y(c,!1,b)))}},wa=function(a,b,c,d){if(E()){var a=x.call(this,a),e=o[a];t[a]&&e.isHidden&&!1!==A("onshow_start",a)&&(e.isSliding=!1,e.isShowing=!0,!1===b?Y(a,!0):ga(a,!1,c,d))}},ka=function(a,b){if(E()){var c=I(a),d=x.call(this,a),e=o[d];c&&c.stopImmediatePropagation();e.isHidden?wa(d):e.isClosed?ga(d,!!b):Y(d)}},Y=function(a,b,c,d){function e(){k.isMoving=!1;ca(i,!0);var a=j.oppositeEdge[i];o[a].noRoom&&(P(a),W(a));ua();if(!d&&(o.initialized||
h.triggerEventsOnLoad))r||A("onclose_end",i),r&&A("onshow_end",i),q&&A("onhide_end",i)}var i=x.call(this,a);if(!o.initialized&&t[i])a=o[i],va(i),a.isClosed=!0,a.isVisible=!1;else if(E()){var f=t[i],h=p[i],k=o[i],l=j[i],m,r,q;u.queue(function(a){if(!f||!h.closable&&!k.isShowing&&!k.isHiding||!b&&k.isClosed&&!k.isShowing)return a();var g=!k.isShowing&&!1===A("onclose_start",i);r=k.isShowing;q=k.isHiding;delete k.isShowing;delete k.isHiding;if(g)return a();m=!c&&!k.isClosed&&"none"!=h.fxName_close;k.isMoving=
!0;k.isClosed=!0;k.isVisible=!1;q?k.isHidden=!0:r&&(k.isHidden=!1);k.isSliding?na(i,!1):X("horz"===j[i].dir?"":"center",!1);Ma(i);m?(ma("center"+("horz"==l.dir?",west,east":""),!0),xa(i,!0),f.hide(h.fxName_close,h.fxSettings_close,h.fxSpeed_close,function(){xa(i,false);k.isClosed&&e();a()})):(va(i),e(),a())})}},Ma=function(a){var c=B[a],d=J[a],f=p[a],e=j[a].side.toLowerCase(),i=f.resizerClass,h=f.togglerClass,C="-"+a;c.css(e,q["inset"+j[a].side]).removeClass(i+"-open "+i+C+"-open").removeClass(i+
"-sliding "+i+C+"-sliding").addClass(i+"-closed "+i+C+"-closed").unbind("dblclick."+H);f.resizable&&b.layout.plugins.draggable&&c.draggable("disable").removeClass("ui-state-disabled").css("cursor","default").attr("title","");d&&(d.removeClass(h+"-open "+h+C+"-open").addClass(h+"-closed "+h+C+"-closed").attr("title",f.tips.Open),d.children(".content-open").hide(),d.children(".content-closed").css("display","block"));Na(a,!1);o.initialized&&fa()},ga=function(a,b,c,d){function e(){k.isMoving=!1;Ua(i);
k.isSliding||(ua(),X("vert"==j[i].dir?"center":"",!1));La(i)}if(E()){var i=x.call(this,a),f=t[i],h=p[i],k=o[i],l=j[i],m,r;u.queue(function(a){if(!f||!h.resizable&&!h.closable&&!k.isShowing||k.isVisible&&!k.isSliding)return a();if(k.isHidden&&!k.isShowing)a(),wa(i,!0);else{h.autoResize&&k.size!=h.size?Z(i,h.size,!0,!0,!0):P(i,b);var g=A("onopen_start",i);if("abort"===g)return a();"NC"!==g&&P(i,b);if(k.minSize>k.maxSize)return Na(i,!1),!d&&h.tips.noRoomToOpen&&alert(h.tips.noRoomToOpen),a();b?na(i,
!0):k.isSliding?na(i,!1):h.slidable&&ca(i,!1);k.noRoom=!1;W(i);r=k.isShowing;delete k.isShowing;m=!c&&k.isClosed&&"none"!=h.fxName_open;k.isMoving=!0;k.isVisible=!0;k.isClosed=!1;r&&(k.isHidden=!1);m?(g="center"+("horz"==l.dir?",west,east":""),k.isSliding&&(g+=","+j.oppositeEdge[i]),ma(g,!0),xa(i,!0),f.show(h.fxName_open,h.fxSettings_open,h.fxSpeed_open,function(){xa(i,false);k.isVisible&&e();a()})):(db(i),e(),a())}})}},La=function(a,c){var d=t[a],f=B[a],e=J[a],i=p[a],h=o[a],C=j[a].side.toLowerCase(),
k=i.resizerClass,l=i.togglerClass,m="-"+a;f.css(C,q["inset"+j[a].side]+aa(a)).removeClass(k+"-closed "+k+m+"-closed").addClass(k+"-open "+k+m+"-open");h.isSliding?f.addClass(k+"-sliding "+k+m+"-sliding"):f.removeClass(k+"-sliding "+k+m+"-sliding");i.resizerDblClickToggle&&f.bind("dblclick",ka);Q(0,f);i.resizable&&b.layout.plugins.draggable?f.draggable("enable").css("cursor",i.resizerCursor).attr("title",i.tips.Resize):h.isSliding||f.css("cursor","default");e&&(e.removeClass(l+"-closed "+l+m+"-closed").addClass(l+
"-open "+l+m+"-open").attr("title",i.tips.Close),Q(0,e),e.children(".content-closed").hide(),e.children(".content-open").css("display","block"));Na(a,!h.isSliding);b.extend(h,y(d));o.initialized&&(fa(),da(a,!0));if(!c&&(o.initialized||i.triggerEventsOnLoad)&&d.is(":visible"))A("onopen_end",a),h.isShowing&&A("onshow_end",a),o.initialized&&A("onresize_end",a)},eb=function(a){function b(){e.isClosed?e.isMoving||ga(d,!0):na(d,!0)}if(E()){var c=I(a),d=x.call(this,a),e=o[d],a=p[d].slideDelay_open;c&&c.stopImmediatePropagation();
e.isClosed&&c&&"mouseenter"===c.type&&0<a?F.set(d+"_openSlider",b,a):b()}},Oa=function(a){function c(){e.isClosed?na(f,!1):e.isMoving||Y(f)}if(E()){var d=I(a),f=x.call(this,a),a=p[f],e=o[f],i=e.isMoving?1E3:300;!e.isClosed&&!e.isResizing&&("click"===a.slideTrigger_close?c():a.preventQuickSlideClose&&e.isMoving||a.preventPrematureSlideClose&&d&&b.layout.isMouseOverElem(d,t[f])||(d?F.set(f+"_closeSlider",c,D(a.slideDelay_close,i)):c()))}},xa=function(a,b){var c=t[a],d=o[a],e=p[a],i=p.zIndexes;b?(c.css({zIndex:i.pane_animate}),
"south"==a?c.css({top:q.insetTop+q.innerHeight-c.outerHeight()}):"east"==a&&c.css({left:q.insetLeft+q.innerWidth-c.outerWidth()})):(c.css({zIndex:d.isSliding?i.pane_sliding:i.pane_normal}),"south"==a?c.css({top:"auto"}):"east"==a&&!c.css("left").match(/\-99999/)&&c.css({left:"auto"}),h.msie&&(e.fxOpacityFix&&"slide"!=e.fxName_open&&c.css("filter")&&1==c.css("opacity"))&&c[0].style.removeAttribute("filter"))},ca=function(a,b){var c=p[a],d=B[a],e=c.slideTrigger_open.toLowerCase();if(d&&(!b||c.slidable))e.match(/mouseover/)?
e=c.slideTrigger_open="mouseenter":e.match(/(click|dblclick|mouseenter)/)||(e=c.slideTrigger_open="click"),d[b?"bind":"unbind"](e+"."+H,eb).css("cursor",b?c.sliderCursor:"default").attr("title",b?c.tips.Slide:"")},na=function(a,b){function c(b){F.clear(a+"_closeSlider");b.stopPropagation()}var d=p[a],e=o[a],i=p.zIndexes,f=d.slideTrigger_close.toLowerCase(),h=b?"bind":"unbind",k=t[a],j=B[a];e.isSliding=b;F.clear(a+"_closeSlider");b&&ca(a,!1);k.css("zIndex",b?i.pane_sliding:i.pane_normal);j.css("zIndex",
b?i.pane_sliding+2:i.resizer_normal);f.match(/(click|mouseleave)/)||(f=d.slideTrigger_close="mouseleave");j[h](f,Oa);"mouseleave"===f&&(k[h]("mouseleave."+H,Oa),j[h]("mouseenter."+H,c),k[h]("mouseenter."+H,c));b?"click"===f&&!d.resizable&&(j.css("cursor",b?d.sliderCursor:"default"),j.attr("title",b?d.tips.Close:"")):F.clear(a+"_closeSlider")},W=function(a,c,d,f){var c=p[a],e=o[a],i=j[a],h=t[a],m=B[a],k="vert"===i.dir,l=!1;if("center"===a||k&&e.noVerticalRoom)(l=0<=e.maxHeight)&&e.noRoom?(db(a),m&&
m.show(),e.isVisible=!0,e.noRoom=!1,k&&(e.noVerticalRoom=!1),Ua(a)):!l&&!e.noRoom&&(va(a),m&&m.hide(),e.isVisible=!1,e.noRoom=!0);if("center"!==a)if(e.minSize<=e.maxSize){if(e.size>e.maxSize?Z(a,e.maxSize,d,f,!0):e.size<e.minSize?Z(a,e.minSize,d,f,!0):m&&(e.isVisible&&h.is(":visible"))&&(d=i.side.toLowerCase(),f=e.size+q["inset"+i.side],b.layout.cssNum(m,d)!=f&&m.css(d,f)),e.noRoom)e.wasOpen&&c.closable?c.autoReopen?ga(a,!1,!0,!0):e.noRoom=!1:wa(a,e.wasOpen,!0,!0)}else e.noRoom||(e.noRoom=!0,e.wasOpen=
!e.isClosed&&!e.isSliding,e.isClosed||(c.closable?Y(a,!0,!0):Ka(a,!0)))},ta=function(a,b,c,d){if(E()){var a=x.call(this,a),e=p[a],i=o[a],i=e.livePaneResizing&&!i.isResizing;e.autoResize=!1;Z(a,b,c,i,d)}},Z=function(a,c,d,f,e){function i(){for(var a="width"===la?l.outerWidth():l.outerHeight(),a=[{pane:h,count:1,target:c,actual:a,correct:c===a,attempt:c,cssSize:G}],e=a[0],g={},i="Inaccurate size after resizing the "+h+"-pane.";!e.correct;){g={pane:h,count:e.count+1,target:c};g.attempt=e.actual>c?D(0,
e.attempt-(e.actual-c)):D(0,e.attempt+(c-e.actual));g.cssSize=("horz"==j[h].dir?r:m)(t[h],g.attempt);l.css(la,g.cssSize);g.actual="width"==la?l.outerWidth():l.outerHeight();g.correct=c===g.actual;1===a.length&&(U(i,!1,!0),U(e,!1,!0));U(g,!1,!0);if(3<a.length)break;a.push(g);e=a[a.length-1]}k.size=c;b.extend(k,y(l));k.isVisible&&l.is(":visible")&&(s&&s.css(nb,c+q[R]),da(h));!d&&(!I&&o.initialized&&k.isVisible)&&A("onresize_end",h);d||(k.isSliding||X("horz"==j[h].dir?"":"center",I,f),fa());e=j.oppositeEdge[h];
c<F&&o[e].noRoom&&(P(e),W(e,!1,d));1<a.length&&U(i+"\nSee the Error Console for details.",!0,!0)}if(E()){var h=x.call(this,a),C=p[h],k=o[h],l=t[h],s=B[h],nb=j[h].side.toLowerCase(),la=j[h].sizeType.toLowerCase(),R="inset"+j[h].side,I=k.isResizing&&!C.triggerEventsDuringLiveResize,H=!0!==e&&C.animatePaneSizing,F,G;u.queue(function(a){P(h);F=k.size;c=V(h,c);c=D(c,V(h,C.minSize));c=Ca(c,k.maxSize);if(c<k.minSize)a(),W(h,!1,d);else{if(!f&&c===F)return a();!d&&(o.initialized&&k.isVisible)&&A("onresize_start",
h);G=("horz"==j[h].dir?r:m)(t[h],c);if(H&&l.is(":visible")){var e=b.layout.effects.size[h]||b.layout.effects.size.all,e=C.fxSettings_size.easing||e.easing,g=p.zIndexes,q={};q[la]=G+"px";k.isMoving=!0;l.css({zIndex:g.pane_animate}).show().animate(q,C.fxSpeed_size,e,function(){l.css({zIndex:k.isSliding?g.pane_sliding:g.pane_normal});k.isMoving=!1;i();a()})}else l.css(la,G),l.is(":visible")?i():(k.size=c,b.extend(k,y(l))),a()}})}},X=function(a,c,d){a=(a?a:"east,west,center").split(",");b.each(a,function(a,
e){if(t[e]){var g=p[e],f=o[e],j=t[e],k=!0,l={},k={top:aa("north",!0),bottom:aa("south",!0),left:aa("west",!0),right:aa("east",!0),width:0,height:0};k.width=q.innerWidth-k.left-k.right;k.height=q.innerHeight-k.bottom-k.top;k.top+=q.insetTop;k.bottom+=q.insetBottom;k.left+=q.insetLeft;k.right+=q.insetRight;b.extend(f,y(j));if("center"===e){if(!d&&f.isVisible&&k.width===f.outerWidth&&k.height===f.outerHeight)return!0;b.extend(f,ra(e),{maxWidth:k.width,maxHeight:k.height});l=k;l.width=m(j,l.width);l.height=
r(j,l.height);k=0<=l.width&&0<=l.height;if(!o.initialized&&g.minWidth>f.outerWidth){var g=g.minWidth-f.outerWidth,s=p.east.minSize||0,u=p.west.minSize||0,x=o.east.size,R=o.west.size,B=x,I=R;0<g&&(o.east.isVisible&&x>s)&&(B=D(x-s,x-g),g-=x-B);0<g&&(o.west.isVisible&&R>u)&&(I=D(R-u,R-g),g-=R-I);if(0===g){x&&x!=s&&Z("east",B,!0,d,!0);R&&R!=u&&Z("west",I,!0,d,!0);X("center",c,d);return}}}else{f.isVisible&&!f.noVerticalRoom&&b.extend(f,y(j),ra(e));if(!d&&!f.noVerticalRoom&&k.height===f.outerHeight)return!0;
l.top=k.top;l.bottom=k.bottom;l.height=r(j,k.height);f.maxHeight=l.height;k=0<=f.maxHeight;k||(f.noVerticalRoom=!0)}k?(!c&&o.initialized&&A("onresize_start",e),j.css(l),"center"!==e&&fa(e),f.noRoom&&(!f.isClosed&&!f.isHidden)&&W(e),f.isVisible&&(b.extend(f,y(j)),o.initialized&&da(e))):!f.noRoom&&f.isVisible&&W(e);if(!f.isVisible)return!0;"center"===e&&(f=h.isIE6||!h.boxModel,t.north&&(f||"IFRAME"==o.north.tagName)&&t.north.css("width",m(t.north,q.innerWidth)),t.south&&(f||"IFRAME"==o.south.tagName)&&
t.south.css("width",m(t.south,q.innerWidth)));!c&&o.initialized&&A("onresize_end",e)}})},ea=function(a){x(a);if(o.initialized){if(u.is(":visible")&&(b.extend(o.container,y(u)),q.outerHeight)){if(!1===A("onresizeall_start"))return!1;var c,d,f;b.each(["south","north","east","west"],function(a,b){t[b]&&(f=o[b],d=p[b],d.autoResize&&f.size!=d.size?Z(b,d.size,!0,!0,!0):(P(b),W(b,!1,!0,!0)))});X("",!0,!0);fa();d=p;b.each(j.allPanes,function(a,b){(c=t[b])&&o[b].isVisible&&A("onresize_end",b)});A("onresizeall_end")}}else sa()},
Da=function(a){a=x.call(this,a);if(p[a].resizeChildLayout){var b=t[a],c=L[a],d=s[a],e=M[a];d.child&&!e&&(e=d.child.container,e=M[a]=(e?e.data("layout"):0)||null);e&&e.destroyed&&(e=M[a]=null);e||(e=M[a]=b.data("layout")||(c?c.data("layout"):0)||null);d.child=M[a];e&&e.resizeAll()}},da=function(a,c){if(E()){var d=x.call(this,a),d=d?d.split(","):j.allPanes;b.each(d,function(a,d){function g(a){return D(v.css.paddingBottom,parseInt(a.css("marginBottom"),10)||0)}function f(){var a=p[d].contentIgnoreSelector,
a=k.nextAll().not(a||":lt(0)"),b=a.filter(":visible"),c=b.filter(":last");q={top:k[0].offsetTop,height:k.outerHeight(),numFooters:a.length,hiddenFooters:a.length-b.length,spaceBelow:0};q.spaceAbove=q.top;q.bottom=q.top+q.height;q.spaceBelow=c.length?c[0].offsetTop+c.outerHeight()-q.bottom+g(c):g(k)}var m=t[d],k=L[d],l=p[d],v=o[d],q=v.content;if(!m||!k||!m.is(":visible"))return!0;if(!k.length&&(Ja(d,!1),!k))return;if(!1!==A("onsizecontent_start",d)){if(!v.isMoving&&!v.isResizing||l.liveContentResizing||
c||void 0==q.top)f(),0<q.hiddenFooters&&"hidden"===m.css("overflow")&&(m.css("overflow","visible"),f(),m.css("overflow","hidden"));m=v.innerHeight-(q.spaceAbove-v.css.paddingTop)-(q.spaceBelow-v.css.paddingBottom);if(!k.is(":visible")||q.height!=m){var s=k,l=s;S(s)?l=t[s]:s.jquery||(l=b(s));s=r(l,m);l.css({height:s,visibility:"visible"});0<s&&0<l.innerWidth()?l.data("autoHidden")&&(l.show().data("autoHidden",!1),h.mozilla||l.css(j.hidden).css(j.visible)):!l.data("autoHidden")&&l.hide().data("autoHidden",
!0);q.height=m}o.initialized&&A("onsizecontent_end",d)}})}},fa=function(a){a=(a=x.call(this,a))?a.split(","):j.borderPanes;b.each(a,function(a,c){var d=p[c],e=o[c],g=t[c],f=B[c],h=J[c],k;if(g&&f){var l=j[c].dir,s=e.isClosed?"_closed":"_open",u=d["spacing"+s],x=d["togglerAlign"+s],s=d["togglerLength"+s],y;if(0===u)f.hide();else{!e.noRoom&&!e.isHidden&&f.show();"horz"===l?(y=q.innerWidth,e.resizerLength=y,g=b.layout.cssNum(g,"left"),f.css({width:m(f,y),height:r(f,u),left:-9999<g?g:q.insetLeft})):(y=
g.outerHeight(),e.resizerLength=y,f.css({height:r(f,y),width:m(f,u),top:q.insetTop+aa("north",!0)}));Q(d,f);if(h){if(0===s||e.isSliding&&d.hideTogglerOnSlide){h.hide();return}h.show();if(!(0<s)||"100%"===s||s>y)s=y,x=0;else if(S(x))switch(x){case "top":case "left":x=0;break;case "bottom":case "right":x=y-s;break;default:x=qa((y-s)/2)}else g=parseInt(x,10),x=0<=x?g:y-s+g;if("horz"===l){var A=m(h,s);h.css({width:A,height:r(h,u),left:x,top:0});h.children(".content").each(function(){k=b(this);k.css("marginLeft",
qa((A-k.outerWidth())/2))})}else{var I=r(h,s);h.css({height:I,width:m(h,u),top:x,left:0});h.children(".content").each(function(){k=b(this);k.css("marginTop",qa((I-k.outerHeight())/2))})}Q(0,h)}if(!o.initialized&&(d.initHidden||e.noRoom))f.hide(),h&&h.hide()}}})},bb=function(a){if(E()){var b=x.call(this,a),a=J[b],c=p[b];a&&(c.closable=!0,a.bind("click."+H,function(a){a.stopPropagation();ka(b)}).css("visibility","visible").css("cursor","pointer").attr("title",o[b].isClosed?c.tips.Open:c.tips.Close).show())}},
Na=function(a,c){b.layout.plugins.buttons&&b.each(o[a].pins,function(d,f){b.layout.buttons.setPinState(s,b(f),a,c)})},u=b(this).eq(0);if(!u.length)return U(p.errors.containerMissing);if(u.data("layoutContainer")&&u.data("layout"))return u.data("layout");var t={},L={},B={},J={},ba=b([]),q=o.container,H=o.id,s={options:p,state:o,container:u,panes:t,contents:L,resizers:B,togglers:J,hide:Ka,show:wa,toggle:ka,open:ga,close:Y,slideOpen:eb,slideClose:Oa,slideToggle:function(a){a=x.call(this,a);ka(a,!0)},
setSizeLimits:P,_sizePane:Z,sizePane:ta,sizeContent:da,swapPanes:function(a,c){function d(a){var c=t[a],e=L[a];return!c?!1:{pane:a,P:c?c[0]:!1,C:e?e[0]:!1,state:b.extend(!0,{},o[a]),options:b.extend(!0,{},p[a])}}function f(a,c){if(a){var d=a.P,e=a.C,g=a.pane,h=j[c],i=h.side.toLowerCase(),m="inset"+h.side,v=b.extend(!0,{},o[c]),w=p[c],u={resizerCursor:w.resizerCursor};b.each(["fxName","fxSpeed","fxSettings"],function(a,b){u[b+"_open"]=w[b+"_open"];u[b+"_close"]=w[b+"_close"];u[b+"_size"]=w[b+"_size"]});
t[c]=b(d).data({layoutPane:s[c],layoutEdge:c}).css(j.hidden).css(h.cssReq);L[c]=e?b(e):!1;p[c]=b.extend(!0,{},a.options,u);o[c]=b.extend(!0,{},a.state);d.className=d.className.replace(RegExp(w.paneClass+"-"+g,"g"),w.paneClass+"-"+c);Ga(c);h.dir!=j[g].dir?(d=r[c]||0,P(c),d=D(d,o[c].minSize),ta(c,d,!0,!0)):B[c].css(i,q[m]+(o[c].isVisible?aa(c):0));a.state.isVisible&&!v.isVisible?La(c,!0):(Ma(c),ca(c,!0));a=null}}if(E()){var e=x.call(this,a);o[e].edge=c;o[c].edge=e;if(!1===A("onswap_start",e)||!1===
A("onswap_start",c))o[e].edge=e,o[c].edge=c;else{var h=d(e),m=d(c),r={};r[e]=h?h.state.size:0;r[c]=m?m.state.size:0;t[e]=!1;t[c]=!1;o[e]={};o[c]={};J[e]&&J[e].remove();J[c]&&J[c].remove();B[e]&&B[e].remove();B[c]&&B[c].remove();B[e]=B[c]=J[e]=J[c]=!1;f(h,c);f(m,e);h=m=r=null;t[e]&&t[e].css(j.visible);t[c]&&t[c].css(j.visible);ea();A("onswap_end",e);A("onswap_end",c)}}},showMasks:ma,hideMasks:ua,initContent:Ja,addPane:Ya,removePane:Ia,createChildLayout:Ha,enableClosable:bb,disableClosable:function(a,
b){if(E()){var c=x.call(this,a),d=J[c];d&&(p[c].closable=!1,o[c].isClosed&&ga(c,!1,!0),d.unbind("."+H).css("visibility",b?"hidden":"visible").css("cursor","default").attr("title",""))}},enableSlidable:function(a){if(E()){var a=x.call(this,a),b=B[a];b&&b.data("draggable")&&(p[a].slidable=!0,o[a].isClosed&&ca(a,!0))}},disableSlidable:function(a){if(E()){var a=x.call(this,a),b=B[a];b&&(p[a].slidable=!1,o[a].isSliding?Y(a,!1,!0):(ca(a,!1),b.css("cursor","default").attr("title",""),Q(null,b[0])))}},enableResizable:function(a){if(E()){var a=
x.call(this,a),b=B[a],c=p[a];b&&b.data("draggable")&&(c.resizable=!0,b.draggable("enable"),o[a].isClosed||b.css("cursor",c.resizerCursor).attr("title",c.tips.Resize))}},disableResizable:function(a){if(E()){var a=x.call(this,a),b=B[a];b&&b.data("draggable")&&(p[a].resizable=!1,b.draggable("disable").css("cursor","default").attr("title",""),Q(null,b[0]))}},allowOverflow:d,resetOverflow:f,destroy:function(a,c){b(window).unbind("."+H);b(document).unbind("."+H);"object"===typeof a?x(a):c=a;u.clearQueue().removeData("layout").removeData("layoutContainer").removeClass(p.containerClass).unbind("."+
H);ba.remove();b.each(j.allPanes,function(a,b){Ia(b,!1,!0,c)});u.data("layoutCSS")&&!u.data("layoutRole")&&u.css(u.data("layoutCSS")).removeData("layoutCSS");"BODY"===q.tagName&&(u=b("html")).data("layoutCSS")&&u.css(u.data("layoutCSS")).removeData("layoutCSS");ja(s,b.layout.onDestroy);$a();for(n in s)n.match(/^(container|options)$/)||delete s[n];s.destroyed=!0;return s},initPanes:E,resizeAll:ea,runCallbacks:A,hasParentLayout:!1,children:M,north:!1,south:!1,west:!1,east:!1,center:!1},Pa;var N,Qa,
G,ya,$,ha,O,a=b.layout.transformData(a),a=b.layout.backwardCompatibility.renameAllOptions(a);if(!b.isEmptyObject(a.panes)){N=b.layout.optionsMap.noDefault;$=0;for(ha=N.length;$<ha;$++)G=N[$],delete a.panes[G];N=b.layout.optionsMap.layout;$=0;for(ha=N.length;$<ha;$++)G=N[$],delete a.panes[G]}N=b.layout.optionsMap.layout;var pb=b.layout.config.optionRootKeys;for(G in a)ya=a[G],0>b.inArray(G,pb)&&0>b.inArray(G,N)&&(a.panes[G]||(a.panes[G]=b.isPlainObject(ya)?b.extend(!0,{},ya):ya),delete a[G]);b.extend(!0,
p,a);b.each(j.allPanes,function(c,d){j[d]=b.extend(!0,{},j.panes,j[d]);Qa=p.panes;O=p[d];if("center"===d){N=b.layout.optionsMap.center;c=0;for(ha=N.length;c<ha;c++)if(G=N[c],!a.center[G]&&(a.panes[G]||!O[G]))O[G]=Qa[G]}else{O=p[d]=b.extend(!0,{},Qa,O);var f=p[d],h=p.panes;f.fxSettings||(f.fxSettings={});h.fxSettings||(h.fxSettings={});b.each(["_open","_close","_size"],function(a,c){var g="fxName"+c,j="fxSpeed"+c,k="fxSettings"+c,l=f[g]=f[g]||h[g]||f.fxName||h.fxName||"none";if(l==="none"||!b.effects||
!b.effects[l]||!p.effects[l])l=f[g]="none";l=p.effects[l]||{};g=l.all||null;l=l[d]||null;f[j]=f[j]||h[j]||f.fxSpeed||h.fxSpeed||null;f[k]=b.extend(true,{},g,l,h.fxSettings,f.fxSettings,h[k],f[k])});delete f.fxName;delete f.fxSpeed;delete f.fxSettings;O.resizerClass||(O.resizerClass="ui-layout-resizer");O.togglerClass||(O.togglerClass="ui-layout-toggler")}O.paneClass||(O.paneClass="ui-layout-pane")});var za=a.zIndex,oa=p.zIndexes;0<za&&(oa.pane_normal=za,oa.content_mask=D(za+1,oa.content_mask),oa.resizer_normal=
D(za+2,oa.resizer_normal));delete p.panes;var qb=p;o.creatingLayout=!0;ja(s,b.layout.onCreate);if(!1===A("onload_start"))Pa="cancel";else{var Ra=u[0],fb=q.tagName=Ra.tagName,gb=q.id=Ra.id,hb=q.className=Ra.className,pa=p,Aa=pa.name,ib="BODY"===fb,ia={},Sa=u.data("parentLayout"),Ta=u.data("layoutEdge"),jb=Sa&&Ta;q.selector=u.selector.split(".slice")[0];q.ref=(pa.name?pa.name+" layout / ":"")+fb+(gb?"#"+gb:hb?".["+hb+"]":"");u.data({layout:s,layoutContainer:H}).addClass(pa.containerClass);var kb={destroy:"",
initPanes:"",resizeAll:"resizeAll",resize:"resizeAll"};for(Aa in kb)u.bind("layout"+Aa.toLowerCase()+"."+H,s[kb[Aa]||Aa]);jb&&(s.hasParentLayout=!0,Sa[Ta].child=Sa.children[Ta]=u.data("layout"));if(!u.data("layoutCSS")){if(ib){var ia=b.extend(T(u,"overflow,position,margin,padding,border"),{height:u.css("height"),overflow:u.css("overflow"),overflowX:u.css("overflowX"),overflowY:u.css("overflowY")}),Ba=b("html");Ba.data("layoutCSS",{height:"auto",overflow:Ba.css("overflow"),overflowX:Ba.css("overflowX"),
overflowY:Ba.css("overflowY")})}else ia=T(u,"overflow,position,margin,padding,border,top,bottom,left,right,width,height,overflow,overflowX,overflowY");u.data("layoutCSS",ia)}try{if(ib)b("html").css({height:"100%",overflow:"hidden",overflowX:"hidden",overflowY:"hidden"}),b("body").css({position:"relative",height:"100%",overflow:"hidden",overflowX:"hidden",overflowY:"hidden",margin:0,padding:0,border:"none"}),b.extend(q,y(u));else{var ia={overflow:"hidden",overflowX:"hidden",overflowY:"hidden"},lb=
u.css("position");u.css("height");if(!jb&&(!lb||!lb.match(/fixed|absolute|relative/)))ia.position="relative";u.css(ia);u.is(":visible")&&(b.extend(q,y(u)),1>q.innerHeight&&U(pa.errors.noContainerHeight.replace(/CONTAINER/,q.ref)))}}catch(rb){}ab();b(window).bind("unload."+H,$a);ja(s,b.layout.onLoad);qb.initPanes&&sa();delete o.creatingLayout;Pa=o.initialized}return"cancel"===Pa?null:s};b(function(){var a=b.layout.browser;a.msie&&(a.boxModel=b.support.boxModel)});b.ui||(b.ui={});b.ui.cookie={acceptsCookies:!!navigator.cookieEnabled,
read:function(a){for(var c=document.cookie,c=c?c.split(";"):[],d,f=0,h=c.length;f<h;f++){d=b.trim(c[f]).split("=");if(d[0]==a)return decodeURIComponent(d[1])}return null},write:function(a,b,d){var f="",h="",j=false,d=d||{},m=d.expires;if(m&&m.toUTCString)h=m;else if(m===null||typeof m==="number"){h=new Date;if(m>0)h.setDate(h.getDate()+m);else{h.setFullYear(1970);j=true}}h&&(f=f+(";expires="+h.toUTCString()));d.path&&(f=f+(";path="+d.path));d.domain&&(f=f+(";domain="+d.domain));d.secure&&(f=f+";secure");
document.cookie=a+"="+(j?"":encodeURIComponent(b))+f},clear:function(a){b.ui.cookie.write(a,"",{expires:-1})}};b.cookie||(b.cookie=function(a,c,d){var f=b.ui.cookie;if(c===null)f.clear(a);else{if(c===void 0)return f.read(a);f.write(a,c,d)}});b.layout.plugins.stateManagement=!0;b.layout.config.optionRootKeys.push("stateManagement");b.layout.defaults.stateManagement={enabled:!1,autoSave:!0,autoLoad:!0,stateKeys:"north.size,south.size,east.size,west.size,north.isClosed,south.isClosed,east.isClosed,west.isClosed,north.isHidden,south.isHidden,east.isHidden,west.isHidden",
cookie:{name:"",domain:"",path:"",expires:"",secure:!1}};b.layout.optionsMap.layout.push("stateManagement");b.layout.state={saveCookie:function(a,c,d){var f=a.options,h=f.stateManagement,d=b.extend(true,{},h.cookie,d||null),a=a.state.stateData=a.readState(c||h.stateKeys);b.ui.cookie.write(d.name||f.name||"Layout",b.layout.state.encodeJSON(a),d);return b.extend(true,{},a)},deleteCookie:function(a){a=a.options;b.ui.cookie.clear(a.stateManagement.cookie.name||a.name||"Layout")},readCookie:function(a){a=
a.options;return(a=b.ui.cookie.read(a.stateManagement.cookie.name||a.name||"Layout"))?b.layout.state.decodeJSON(a):{}},loadCookie:function(a){var c=b.layout.state.readCookie(a);if(c){a.state.stateData=b.extend(true,{},c);a.loadState(c)}return c},loadState:function(a,c,d){c=b.layout.transformData(c);if(!b.isEmptyObject(c)){b.extend(true,a.options,c);if(a.state.initialized){var f,h,j,m,r,y=d===false;b.each(b.layout.config.borderPanes,function(b,d){state=a.state[d];h=c[d];if(typeof h=="object"){j=h.size;
r=h.initClosed;m=h.initHidden;(f=state.isVisible)||a.sizePane(d,j,false,false);m===true?a.hide(d,y):r===false?a.open(d,false,y):r===true?a.close(d,false,y):m===false&&a.show(d,false,y);f&&a.sizePane(d,j,false,y)}})}}},readState:function(a,c){var d={},f={isClosed:"initClosed",isHidden:"initHidden"},h=a.state,j=b.layout.config.allPanes,m,r,y;if(!c)c=a.options.stateManagement.stateKeys;b.isArray(c)&&(c=c.join(","));for(var c=c.replace(/__/g,".").split(","),D=0,I=c.length;D<I;D++){m=c[D].split(".");r=
m[0];m=m[1];if(!(b.inArray(r,j)<0)){y=h[r][m];if(y!=void 0){m=="isClosed"&&h[r].isSliding&&(y=true);(d[r]||(d[r]={}))[f[m]?f[m]:m]=y}}}return d},encodeJSON:function(a){function b(a){var f=[],h=0,j,m,r;for(j in a){m=a[j];r=typeof m;r=="string"?m='"'+m+'"':r=="object"&&(m=b(m));f[h++]='"'+j+'":'+m}return"{"+f.join(",")+"}"}return b(a)},decodeJSON:function(a){try{return b.parseJSON?b.parseJSON(a):window.eval("("+a+")")||{}}catch(c){return{}}},_create:function(a){var c=b.layout.state;b.extend(a,{readCookie:function(){return c.readCookie(a)},
deleteCookie:function(){c.deleteCookie(a)},saveCookie:function(b,d){return c.saveCookie(a,b,d)},loadCookie:function(){return c.loadCookie(a)},loadState:function(b,d){c.loadState(a,b,d)},readState:function(b){return c.readState(a,b)},encodeJSON:c.encodeJSON,decodeJSON:c.decodeJSON});a.state.stateData={};var d=a.options.stateManagement;if(d.enabled)d.autoLoad?a.loadCookie():a.state.stateData=a.readCookie()},_unload:function(a){var b=a.options.stateManagement;if(b.enabled)b.autoSave?a.saveCookie():a.state.stateData=
a.readState()}};b.layout.onCreate.push(b.layout.state._create);b.layout.onUnload.push(b.layout.state._unload);b.layout.plugins.buttons=!0;b.layout.defaults.autoBindCustomButtons=!1;b.layout.optionsMap.layout.push("autoBindCustomButtons");b.layout.buttons={init:function(a){var c=a.options.name||"",d;b.each(["toggle","open","close","pin","toggle-slide","open-slide"],function(f,h){b.each(b.layout.config.borderPanes,function(f,m){b(".ui-layout-button-"+h+"-"+m).each(function(){d=b(this).data("layoutName")||
b(this).attr("layoutName");(d==void 0||d===c)&&a.bindButton(this,h,m)})})})},get:function(a,c,d,f){var h=b(c),a=a.options,j=a.errors.addButtonError;if(h.length)if(b.inArray(d,b.layout.config.borderPanes)<0){b.layout.msg(j+" "+a.errors.pane+": "+d,true);h=b("")}else{c=a[d].buttonClass+"-"+f;h.addClass(c+" "+c+"-"+d).data("layoutName",a.name)}else b.layout.msg(j+" "+a.errors.selector+": "+c,true);return h},bind:function(a,c,d,f){var h=b.layout.buttons;switch(d.toLowerCase()){case "toggle":h.addToggle(a,
c,f);break;case "open":h.addOpen(a,c,f);break;case "close":h.addClose(a,c,f);break;case "pin":h.addPin(a,c,f);break;case "toggle-slide":h.addToggle(a,c,f,true);break;case "open-slide":h.addOpen(a,c,f,true)}return a},addToggle:function(a,c,d,f){b.layout.buttons.get(a,c,d,"toggle").click(function(b){a.toggle(d,!!f);b.stopPropagation()});return a},addOpen:function(a,c,d,f){b.layout.buttons.get(a,c,d,"open").attr("title",a.options[d].tips.Open).click(function(b){a.open(d,!!f);b.stopPropagation()});return a},
addClose:function(a,c,d){b.layout.buttons.get(a,c,d,"close").attr("title",a.options[d].tips.Close).click(function(b){a.close(d);b.stopPropagation()});return a},addPin:function(a,c,d){var f=b.layout.buttons,h=f.get(a,c,d,"pin");if(h.length){var j=a.state[d];h.click(function(c){f.setPinState(a,b(this),d,j.isSliding||j.isClosed);j.isSliding||j.isClosed?a.open(d):a.close(d);c.stopPropagation()});f.setPinState(a,h,d,!j.isClosed&&!j.isSliding);j.pins.push(c)}return a},setPinState:function(a,b,d,f){var h=
b.attr("pin");if(!(h&&f===(h=="down"))){var a=a.options[d],h=a.buttonClass+"-pin",j=h+"-"+d,d=h+"-up "+j+"-up",h=h+"-down "+j+"-down";b.attr("pin",f?"down":"up").attr("title",f?a.tips.Unpin:a.tips.Pin).removeClass(f?d:h).addClass(f?h:d)}},syncPinBtns:function(a,c,d){b.each(a.state[c].pins,function(f,h){b.layout.buttons.setPinState(a,b(h),c,d)})},_load:function(a){var c=b.layout.buttons;b.extend(a,{bindButton:function(b,d,j){return c.bind(a,b,d,j)},addToggleBtn:function(b,d,j){return c.addToggle(a,
b,d,j)},addOpenBtn:function(b,d,j){return c.addOpen(a,b,d,j)},addCloseBtn:function(b,d){return c.addClose(a,b,d)},addPinBtn:function(b,d){return c.addPin(a,b,d)}});for(var d=0;d<4;d++)a.state[b.layout.config.borderPanes[d]].pins=[];a.options.autoBindCustomButtons&&c.init(a)},_unload:function(){}};b.layout.onLoad.push(b.layout.buttons._load);b.layout.plugins.browserZoom=!0;b.layout.defaults.browserZoomCheckInterval=1E3;b.layout.optionsMap.layout.push("browserZoomCheckInterval");b.layout.browserZoom=
{_init:function(a){b.layout.browserZoom.ratio()!==false&&b.layout.browserZoom._setTimer(a)},_setTimer:function(a){if(!a.destroyed){var c=a.options,d=a.state,f=a.hasParentLayout?5E3:Math.max(c.browserZoomCheckInterval,100);setTimeout(function(){if(!a.destroyed&&c.resizeWithWindow){var f=b.layout.browserZoom.ratio();if(f!==d.browserZoom){d.browserZoom=f;a.resizeAll()}b.layout.browserZoom._setTimer(a)}},f)}},ratio:function(){function a(a,b){return(parseInt(a,10)/parseInt(b,10)*100).toFixed()}var c=window,
d=screen,f=document,h=f.documentElement||f.body,j=b.layout.browser,m=j.version,r,y,D;return j.msie&&m>8||!j.msie?false:d.deviceXDPI?a(d.deviceXDPI,d.systemXDPI):j.webkit&&(r=f.body.getBoundingClientRect)?a(r.left-r.right,f.body.offsetWidth):j.webkit&&(y=c.outerWidth)?a(y,c.innerWidth):(y=d.width)&&(D=h.clientWidth)?a(y,D):false}};b.layout.onReady.push(b.layout.browserZoom._init)})(jQuery);;

/**
 * @license Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Copyright 2012, Tim Down
 * Licensed under the MIT license.
 * Version: 1.2.3
 * Build date: 26 February 2012
 */
window['rangy'] = (function() {


    var OBJECT = "object", FUNCTION = "function", UNDEFINED = "undefined";

    var domRangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed",
        "commonAncestorContainer", "START_TO_START", "START_TO_END", "END_TO_START", "END_TO_END"];

    var domRangeMethods = ["setStart", "setStartBefore", "setStartAfter", "setEnd", "setEndBefore",
        "setEndAfter", "collapse", "selectNode", "selectNodeContents", "compareBoundaryPoints", "deleteContents",
        "extractContents", "cloneContents", "insertNode", "surroundContents", "cloneRange", "toString", "detach"];

    var textRangeProperties = ["boundingHeight", "boundingLeft", "boundingTop", "boundingWidth", "htmlText", "text"];

    // Subset of TextRange's full set of methods that we're interested in
    var textRangeMethods = ["collapse", "compareEndPoints", "duplicate", "getBookmark", "moveToBookmark",
        "moveToElementText", "parentElement", "pasteHTML", "select", "setEndPoint", "getBoundingClientRect"];

    /*----------------------------------------------------------------------------------------------------------------*/

    // Trio of functions taken from Peter Michaux's article:
    // http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting
    function isHostMethod(o, p) {
        var t = typeof o[p];
        return t == FUNCTION || (!!(t == OBJECT && o[p])) || t == "unknown";
    }

    function isHostObject(o, p) {
        return !!(typeof o[p] == OBJECT && o[p]);
    }

    function isHostProperty(o, p) {
        return typeof o[p] != UNDEFINED;
    }

    // Creates a convenience function to save verbose repeated calls to tests functions
    function createMultiplePropertyTest(testFunc) {
        return function(o, props) {
            var i = props.length;
            while (i--) {
                if (!testFunc(o, props[i])) {
                    return false;
                }
            }
            return true;
        };
    }

    // Next trio of functions are a convenience to save verbose repeated calls to previous two functions
    var areHostMethods = createMultiplePropertyTest(isHostMethod);
    var areHostObjects = createMultiplePropertyTest(isHostObject);
    var areHostProperties = createMultiplePropertyTest(isHostProperty);

    function isTextRange(range) {
        return range && areHostMethods(range, textRangeMethods) && areHostProperties(range, textRangeProperties);
    }

    var api = {
        version: "1.2.3",
        initialized: false,
        supported: true,

        util: {
            isHostMethod: isHostMethod,
            isHostObject: isHostObject,
            isHostProperty: isHostProperty,
            areHostMethods: areHostMethods,
            areHostObjects: areHostObjects,
            areHostProperties: areHostProperties,
            isTextRange: isTextRange
        },

        features: {},

        modules: {},
        config: {
            alertOnWarn: false,
            preferTextRange: false
        }
    };

    function fail(reason) {
        window.alert("Rangy not supported in your browser. Reason: " + reason);
        api.initialized = true;
        api.supported = false;
    }

    api.fail = fail;

    function warn(msg) {
        var warningMessage = "Rangy warning: " + msg;
        if (api.config.alertOnWarn) {
            window.alert(warningMessage);
        } else if (typeof window.console != UNDEFINED && typeof window.console.log != UNDEFINED) {
            window.console.log(warningMessage);
        }
    }

    api.warn = warn;

    if ({}.hasOwnProperty) {
        api.util.extend = function(o, props) {
            for (var i in props) {
                if (props.hasOwnProperty(i)) {
                    o[i] = props[i];
                }
            }
        };
    } else {
        fail("hasOwnProperty not supported");
    }

    var initListeners = [];
    var moduleInitializers = [];

    // Initialization
    function init() {
        if (api.initialized) {
            return;
        }
        var testRange;
        var implementsDomRange = false, implementsTextRange = false;

        // First, perform basic feature tests

        if (isHostMethod(document, "createRange")) {
            testRange = document.createRange();
            if (areHostMethods(testRange, domRangeMethods) && areHostProperties(testRange, domRangeProperties)) {
                implementsDomRange = true;
            }
            testRange.detach();
        }

        var body = isHostObject(document, "body") ? document.body : document.getElementsByTagName("body")[0];

        if (body && isHostMethod(body, "createTextRange")) {
            testRange = body.createTextRange();
            if (isTextRange(testRange)) {
                implementsTextRange = true;
            }
        }

        if (!implementsDomRange && !implementsTextRange) {
            fail("Neither Range nor TextRange are implemented");
        }

        api.initialized = true;
        api.features = {
            implementsDomRange: implementsDomRange,
            implementsTextRange: implementsTextRange
        };

        // Initialize modules and call init listeners
        var allListeners = moduleInitializers.concat(initListeners);
        for (var i = 0, len = allListeners.length; i < len; ++i) {
            try {
                allListeners[i](api);
            } catch (ex) {
                if (isHostObject(window, "console") && isHostMethod(window.console, "log")) {
                    window.console.log("Init listener threw an exception. Continuing.", ex);
                }

            }
        }
    }

    // Allow external scripts to initialize this library in case it's loaded after the document has loaded
    api.init = init;

    // Execute listener immediately if already initialized
    api.addInitListener = function(listener) {
        if (api.initialized) {
            listener(api);
        } else {
            initListeners.push(listener);
        }
    };

    var createMissingNativeApiListeners = [];

    api.addCreateMissingNativeApiListener = function(listener) {
        createMissingNativeApiListeners.push(listener);
    };

    function createMissingNativeApi(win) {
        win = win || window;
        init();

        // Notify listeners
        for (var i = 0, len = createMissingNativeApiListeners.length; i < len; ++i) {
            createMissingNativeApiListeners[i](win);
        }
    }

    api.createMissingNativeApi = createMissingNativeApi;

    /**
     * @constructor
     */
    function Module(name) {
        this.name = name;
        this.initialized = false;
        this.supported = false;
    }

    Module.prototype.fail = function(reason) {
        this.initialized = true;
        this.supported = false;

        throw new Error("Module '" + this.name + "' failed to load: " + reason);
    };

    Module.prototype.warn = function(msg) {
        api.warn("Module " + this.name + ": " + msg);
    };

    Module.prototype.createError = function(msg) {
        return new Error("Error in Rangy " + this.name + " module: " + msg);
    };

    api.createModule = function(name, initFunc) {
        var module = new Module(name);
        api.modules[name] = module;

        moduleInitializers.push(function(api) {
            initFunc(api, module);
            module.initialized = true;
            module.supported = true;
        });
    };

    api.requireModules = function(modules) {
        for (var i = 0, len = modules.length, module, moduleName; i < len; ++i) {
            moduleName = modules[i];
            module = api.modules[moduleName];
            if (!module || !(module instanceof Module)) {
                throw new Error("Module '" + moduleName + "' not found");
            }
            if (!module.supported) {
                throw new Error("Module '" + moduleName + "' not supported");
            }
        }
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Wait for document to load before running tests

    var docReady = false;

    var loadHandler = function(e) {

        if (!docReady) {
            docReady = true;
            if (!api.initialized) {
                init();
            }
        }
    };

    // Test whether we have window and document objects that we will need
    if (typeof window == UNDEFINED) {
        fail("No window found");
        return;
    }
    if (typeof document == UNDEFINED) {
        fail("No document found");
        return;
    }

    if (isHostMethod(document, "addEventListener")) {
        document.addEventListener("DOMContentLoaded", loadHandler, false);
    }

    // Add a fallback in case the DOMContentLoaded event isn't supported
    if (isHostMethod(window, "addEventListener")) {
        window.addEventListener("load", loadHandler, false);
    } else if (isHostMethod(window, "attachEvent")) {
        window.attachEvent("onload", loadHandler);
    } else {
        fail("Window does not have required addEventListener or attachEvent method");
    }

    return api;
})();
rangy.createModule("DomUtil", function(api, module) {

    var UNDEF = "undefined";
    var util = api.util;

    // Perform feature tests
    if (!util.areHostMethods(document, ["createDocumentFragment", "createElement", "createTextNode"])) {
        module.fail("document missing a Node creation method");
    }

    if (!util.isHostMethod(document, "getElementsByTagName")) {
        module.fail("document missing getElementsByTagName method");
    }

    var el = document.createElement("div");
    if (!util.areHostMethods(el, ["insertBefore", "appendChild", "cloneNode"] ||
            !util.areHostObjects(el, ["previousSibling", "nextSibling", "childNodes", "parentNode"]))) {
        module.fail("Incomplete Element implementation");
    }

    // innerHTML is required for Range's createContextualFragment method
    if (!util.isHostProperty(el, "innerHTML")) {
        module.fail("Element is missing innerHTML property");
    }

    var textNode = document.createTextNode("test");
    if (!util.areHostMethods(textNode, ["splitText", "deleteData", "insertData", "appendData", "cloneNode"] ||
            !util.areHostObjects(el, ["previousSibling", "nextSibling", "childNodes", "parentNode"]) ||
            !util.areHostProperties(textNode, ["data"]))) {
        module.fail("Incomplete Text Node implementation");
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Removed use of indexOf because of a bizarre bug in Opera that is thrown in one of the Acid3 tests. I haven't been
    // able to replicate it outside of the test. The bug is that indexOf returns -1 when called on an Array that
    // contains just the document as a single element and the value searched for is the document.
    var arrayContains = /*Array.prototype.indexOf ?
        function(arr, val) {
            return arr.indexOf(val) > -1;
        }:*/

        function(arr, val) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === val) {
                    return true;
                }
            }
            return false;
        };

    // Opera 11 puts HTML elements in the null namespace, it seems, and IE 7 has undefined namespaceURI
    function isHtmlNamespace(node) {
        var ns;
        return typeof node.namespaceURI == UNDEF || ((ns = node.namespaceURI) === null || ns == "http://www.w3.org/1999/xhtml");
    }

    function parentElement(node) {
        var parent = node.parentNode;
        return (parent.nodeType == 1) ? parent : null;
    }

    function getNodeIndex(node) {
        var i = 0;
        while( (node = node.previousSibling) ) {
            i++;
        }
        return i;
    }

    function getNodeLength(node) {
        var childNodes;
        return isCharacterDataNode(node) ? node.length : ((childNodes = node.childNodes) ? childNodes.length : 0);
    }

    function getCommonAncestor(node1, node2) {
        var ancestors = [], n;
        for (n = node1; n; n = n.parentNode) {
            ancestors.push(n);
        }

        for (n = node2; n; n = n.parentNode) {
            if (arrayContains(ancestors, n)) {
                return n;
            }
        }

        return null;
    }

    function isAncestorOf(ancestor, descendant, selfIsAncestor) {
        var n = selfIsAncestor ? descendant : descendant.parentNode;
        while (n) {
            if (n === ancestor) {
                return true;
            } else {
                n = n.parentNode;
            }
        }
        return false;
    }

    function getClosestAncestorIn(node, ancestor, selfIsAncestor) {
        var p, n = selfIsAncestor ? node : node.parentNode;
        while (n) {
            p = n.parentNode;
            if (p === ancestor) {
                return n;
            }
            n = p;
        }
        return null;
    }

    function isCharacterDataNode(node) {
        var t = node.nodeType;
        return t == 3 || t == 4 || t == 8 ; // Text, CDataSection or Comment
    }

    function insertAfter(node, precedingNode) {
        var nextNode = precedingNode.nextSibling, parent = precedingNode.parentNode;
        if (nextNode) {
            parent.insertBefore(node, nextNode);
        } else {
            parent.appendChild(node);
        }
        return node;
    }

    // Note that we cannot use splitText() because it is bugridden in IE 9.
    function splitDataNode(node, index) {
        var newNode = node.cloneNode(false);
        newNode.deleteData(0, index);
        node.deleteData(index, node.length - index);
        insertAfter(newNode, node);
        return newNode;
    }

    function getDocument(node) {
        if (node.nodeType == 9) {
            return node;
        } else if (typeof node.ownerDocument != UNDEF) {
            return node.ownerDocument;
        } else if (typeof node.document != UNDEF) {
            return node.document;
        } else if (node.parentNode) {
            return getDocument(node.parentNode);
        } else {
            throw new Error("getDocument: no document found for node");
        }
    }

    function getWindow(node) {
        var doc = getDocument(node);
        if (typeof doc.defaultView != UNDEF) {
            return doc.defaultView;
        } else if (typeof doc.parentWindow != UNDEF) {
            return doc.parentWindow;
        } else {
            throw new Error("Cannot get a window object for node");
        }
    }

    function getIframeDocument(iframeEl) {
        if (typeof iframeEl.contentDocument != UNDEF) {
            return iframeEl.contentDocument;
        } else if (typeof iframeEl.contentWindow != UNDEF) {
            return iframeEl.contentWindow.document;
        } else {
            throw new Error("getIframeWindow: No Document object found for iframe element");
        }
    }

    function getIframeWindow(iframeEl) {
        if (typeof iframeEl.contentWindow != UNDEF) {
            return iframeEl.contentWindow;
        } else if (typeof iframeEl.contentDocument != UNDEF) {
            return iframeEl.contentDocument.defaultView;
        } else {
            throw new Error("getIframeWindow: No Window object found for iframe element");
        }
    }

    function getBody(doc) {
        return util.isHostObject(doc, "body") ? doc.body : doc.getElementsByTagName("body")[0];
    }

    function getRootContainer(node) {
        var parent;
        while ( (parent = node.parentNode) ) {
            node = parent;
        }
        return node;
    }

    function comparePoints(nodeA, offsetA, nodeB, offsetB) {
        // See http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level-2-Range-Comparing
        var nodeC, root, childA, childB, n;
        if (nodeA == nodeB) {

            // Case 1: nodes are the same
            return offsetA === offsetB ? 0 : (offsetA < offsetB) ? -1 : 1;
        } else if ( (nodeC = getClosestAncestorIn(nodeB, nodeA, true)) ) {

            // Case 2: node C (container B or an ancestor) is a child node of A
            return offsetA <= getNodeIndex(nodeC) ? -1 : 1;
        } else if ( (nodeC = getClosestAncestorIn(nodeA, nodeB, true)) ) {

            // Case 3: node C (container A or an ancestor) is a child node of B
            return getNodeIndex(nodeC) < offsetB  ? -1 : 1;
        } else {

            // Case 4: containers are siblings or descendants of siblings
            root = getCommonAncestor(nodeA, nodeB);
            childA = (nodeA === root) ? root : getClosestAncestorIn(nodeA, root, true);
            childB = (nodeB === root) ? root : getClosestAncestorIn(nodeB, root, true);

            if (childA === childB) {
                // This shouldn't be possible

                throw new Error("comparePoints got to case 4 and childA and childB are the same!");
            } else {
                n = root.firstChild;
                while (n) {
                    if (n === childA) {
                        return -1;
                    } else if (n === childB) {
                        return 1;
                    }
                    n = n.nextSibling;
                }
                throw new Error("Should not be here!");
            }
        }
    }

    function fragmentFromNodeChildren(node) {
        var fragment = getDocument(node).createDocumentFragment(), child;
        while ( (child = node.firstChild) ) {
            fragment.appendChild(child);
        }
        return fragment;
    }

    function inspectNode(node) {
        if (!node) {
            return "[No node]";
        }
        if (isCharacterDataNode(node)) {
            return '"' + node.data + '"';
        } else if (node.nodeType == 1) {
            var idAttr = node.id ? ' id="' + node.id + '"' : "";
            return "<" + node.nodeName + idAttr + ">[" + node.childNodes.length + "]";
        } else {
            return node.nodeName;
        }
    }

    /**
     * @constructor
     */
    function NodeIterator(root) {
        this.root = root;
        this._next = root;
    }

    NodeIterator.prototype = {
        _current: null,

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            var n = this._current = this._next;
            var child, next;
            if (this._current) {
                child = n.firstChild;
                if (child) {
                    this._next = child;
                } else {
                    next = null;
                    while ((n !== this.root) && !(next = n.nextSibling)) {
                        n = n.parentNode;
                    }
                    this._next = next;
                }
            }
            return this._current;
        },

        detach: function() {
            this._current = this._next = this.root = null;
        }
    };

    function createIterator(root) {
        return new NodeIterator(root);
    }

    /**
     * @constructor
     */
    function DomPosition(node, offset) {
        this.node = node;
        this.offset = offset;
    }

    DomPosition.prototype = {
        equals: function(pos) {
            return this.node === pos.node & this.offset == pos.offset;
        },

        inspect: function() {
            return "[DomPosition(" + inspectNode(this.node) + ":" + this.offset + ")]";
        }
    };

    /**
     * @constructor
     */
    function DOMException(codeName) {
        this.code = this[codeName];
        this.codeName = codeName;
        this.message = "DOMException: " + this.codeName;
    }

    DOMException.prototype = {
        INDEX_SIZE_ERR: 1,
        HIERARCHY_REQUEST_ERR: 3,
        WRONG_DOCUMENT_ERR: 4,
        NO_MODIFICATION_ALLOWED_ERR: 7,
        NOT_FOUND_ERR: 8,
        NOT_SUPPORTED_ERR: 9,
        INVALID_STATE_ERR: 11
    };

    DOMException.prototype.toString = function() {
        return this.message;
    };

    api.dom = {
        arrayContains: arrayContains,
        isHtmlNamespace: isHtmlNamespace,
        parentElement: parentElement,
        getNodeIndex: getNodeIndex,
        getNodeLength: getNodeLength,
        getCommonAncestor: getCommonAncestor,
        isAncestorOf: isAncestorOf,
        getClosestAncestorIn: getClosestAncestorIn,
        isCharacterDataNode: isCharacterDataNode,
        insertAfter: insertAfter,
        splitDataNode: splitDataNode,
        getDocument: getDocument,
        getWindow: getWindow,
        getIframeWindow: getIframeWindow,
        getIframeDocument: getIframeDocument,
        getBody: getBody,
        getRootContainer: getRootContainer,
        comparePoints: comparePoints,
        inspectNode: inspectNode,
        fragmentFromNodeChildren: fragmentFromNodeChildren,
        createIterator: createIterator,
        DomPosition: DomPosition
    };

    api.DOMException = DOMException;
});rangy.createModule("DomRange", function(api, module) {
    api.requireModules( ["DomUtil"] );


    var dom = api.dom;
    var DomPosition = dom.DomPosition;
    var DOMException = api.DOMException;
    
    /*----------------------------------------------------------------------------------------------------------------*/

    // Utility functions

    function isNonTextPartiallySelected(node, range) {
        return (node.nodeType != 3) &&
               (dom.isAncestorOf(node, range.startContainer, true) || dom.isAncestorOf(node, range.endContainer, true));
    }

    function getRangeDocument(range) {
        return dom.getDocument(range.startContainer);
    }

    function dispatchEvent(range, type, args) {
        var listeners = range._listeners[type];
        if (listeners) {
            for (var i = 0, len = listeners.length; i < len; ++i) {
                listeners[i].call(range, {target: range, args: args});
            }
        }
    }

    function getBoundaryBeforeNode(node) {
        return new DomPosition(node.parentNode, dom.getNodeIndex(node));
    }

    function getBoundaryAfterNode(node) {
        return new DomPosition(node.parentNode, dom.getNodeIndex(node) + 1);
    }

    function insertNodeAtPosition(node, n, o) {
        var firstNodeInserted = node.nodeType == 11 ? node.firstChild : node;
        if (dom.isCharacterDataNode(n)) {
            if (o == n.length) {
                dom.insertAfter(node, n);
            } else {
                n.parentNode.insertBefore(node, o == 0 ? n : dom.splitDataNode(n, o));
            }
        } else if (o >= n.childNodes.length) {
            n.appendChild(node);
        } else {
            n.insertBefore(node, n.childNodes[o]);
        }
        return firstNodeInserted;
    }

    function cloneSubtree(iterator) {
        var partiallySelected;
        for (var node, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator; node = iterator.next(); ) {
            partiallySelected = iterator.isPartiallySelectedSubtree();

            node = node.cloneNode(!partiallySelected);
            if (partiallySelected) {
                subIterator = iterator.getSubtreeIterator();
                node.appendChild(cloneSubtree(subIterator));
                subIterator.detach(true);
            }

            if (node.nodeType == 10) { // DocumentType
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }
            frag.appendChild(node);
        }
        return frag;
    }

    function iterateSubtree(rangeIterator, func, iteratorState) {
        var it, n;
        iteratorState = iteratorState || { stop: false };
        for (var node, subRangeIterator; node = rangeIterator.next(); ) {
            //log.debug("iterateSubtree, partially selected: " + rangeIterator.isPartiallySelectedSubtree(), nodeToString(node));
            if (rangeIterator.isPartiallySelectedSubtree()) {
                // The node is partially selected by the Range, so we can use a new RangeIterator on the portion of the
                // node selected by the Range.
                if (func(node) === false) {
                    iteratorState.stop = true;
                    return;
                } else {
                    subRangeIterator = rangeIterator.getSubtreeIterator();
                    iterateSubtree(subRangeIterator, func, iteratorState);
                    subRangeIterator.detach(true);
                    if (iteratorState.stop) {
                        return;
                    }
                }
            } else {
                // The whole node is selected, so we can use efficient DOM iteration to iterate over the node and its
                // descendant
                it = dom.createIterator(node);
                while ( (n = it.next()) ) {
                    if (func(n) === false) {
                        iteratorState.stop = true;
                        return;
                    }
                }
            }
        }
    }

    function deleteSubtree(iterator) {
        var subIterator;
        while (iterator.next()) {
            if (iterator.isPartiallySelectedSubtree()) {
                subIterator = iterator.getSubtreeIterator();
                deleteSubtree(subIterator);
                subIterator.detach(true);
            } else {
                iterator.remove();
            }
        }
    }

    function extractSubtree(iterator) {

        for (var node, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator; node = iterator.next(); ) {


            if (iterator.isPartiallySelectedSubtree()) {
                node = node.cloneNode(false);
                subIterator = iterator.getSubtreeIterator();
                node.appendChild(extractSubtree(subIterator));
                subIterator.detach(true);
            } else {
                iterator.remove();
            }
            if (node.nodeType == 10) { // DocumentType
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }
            frag.appendChild(node);
        }
        return frag;
    }

    function getNodesInRange(range, nodeTypes, filter) {
        //log.info("getNodesInRange, " + nodeTypes.join(","));
        var filterNodeTypes = !!(nodeTypes && nodeTypes.length), regex;
        var filterExists = !!filter;
        if (filterNodeTypes) {
            regex = new RegExp("^(" + nodeTypes.join("|") + ")$");
        }

        var nodes = [];
        iterateSubtree(new RangeIterator(range, false), function(node) {
            if ((!filterNodeTypes || regex.test(node.nodeType)) && (!filterExists || filter(node))) {
                nodes.push(node);
            }
        });
        return nodes;
    }

    function inspect(range) {
        var name = (typeof range.getName == "undefined") ? "Range" : range.getName();
        return "[" + name + "(" + dom.inspectNode(range.startContainer) + ":" + range.startOffset + ", " +
                dom.inspectNode(range.endContainer) + ":" + range.endOffset + ")]";
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // RangeIterator code partially borrows from IERange by Tim Ryan (http://github.com/timcameronryan/IERange)

    /**
     * @constructor
     */
    function RangeIterator(range, clonePartiallySelectedTextNodes) {
        this.range = range;
        this.clonePartiallySelectedTextNodes = clonePartiallySelectedTextNodes;



        if (!range.collapsed) {
            this.sc = range.startContainer;
            this.so = range.startOffset;
            this.ec = range.endContainer;
            this.eo = range.endOffset;
            var root = range.commonAncestorContainer;

            if (this.sc === this.ec && dom.isCharacterDataNode(this.sc)) {
                this.isSingleCharacterDataNode = true;
                this._first = this._last = this._next = this.sc;
            } else {
                this._first = this._next = (this.sc === root && !dom.isCharacterDataNode(this.sc)) ?
                    this.sc.childNodes[this.so] : dom.getClosestAncestorIn(this.sc, root, true);
                this._last = (this.ec === root && !dom.isCharacterDataNode(this.ec)) ?
                    this.ec.childNodes[this.eo - 1] : dom.getClosestAncestorIn(this.ec, root, true);
            }

        }
    }

    RangeIterator.prototype = {
        _current: null,
        _next: null,
        _first: null,
        _last: null,
        isSingleCharacterDataNode: false,

        reset: function() {
            this._current = null;
            this._next = this._first;
        },

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            // Move to next node
            var current = this._current = this._next;
            if (current) {
                this._next = (current !== this._last) ? current.nextSibling : null;

                // Check for partially selected text nodes
                if (dom.isCharacterDataNode(current) && this.clonePartiallySelectedTextNodes) {
                    if (current === this.ec) {

                        (current = current.cloneNode(true)).deleteData(this.eo, current.length - this.eo);
                    }
                    if (this._current === this.sc) {

                        (current = current.cloneNode(true)).deleteData(0, this.so);
                    }
                }
            }

            return current;
        },

        remove: function() {
            var current = this._current, start, end;

            if (dom.isCharacterDataNode(current) && (current === this.sc || current === this.ec)) {
                start = (current === this.sc) ? this.so : 0;
                end = (current === this.ec) ? this.eo : current.length;
                if (start != end) {
                    current.deleteData(start, end - start);
                }
            } else {
                if (current.parentNode) {
                    current.parentNode.removeChild(current);
                } else {

                }
            }
        },

        // Checks if the current node is partially selected
        isPartiallySelectedSubtree: function() {
            var current = this._current;
            return isNonTextPartiallySelected(current, this.range);
        },

        getSubtreeIterator: function() {
            var subRange;
            if (this.isSingleCharacterDataNode) {
                subRange = this.range.cloneRange();
                subRange.collapse();
            } else {
                subRange = new Range(getRangeDocument(this.range));
                var current = this._current;
                var startContainer = current, startOffset = 0, endContainer = current, endOffset = dom.getNodeLength(current);

                if (dom.isAncestorOf(current, this.sc, true)) {
                    startContainer = this.sc;
                    startOffset = this.so;
                }
                if (dom.isAncestorOf(current, this.ec, true)) {
                    endContainer = this.ec;
                    endOffset = this.eo;
                }

                updateBoundaries(subRange, startContainer, startOffset, endContainer, endOffset);
            }
            return new RangeIterator(subRange, this.clonePartiallySelectedTextNodes);
        },

        detach: function(detachRange) {
            if (detachRange) {
                this.range.detach();
            }
            this.range = this._current = this._next = this._first = this._last = this.sc = this.so = this.ec = this.eo = null;
        }
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Exceptions

    /**
     * @constructor
     */
    function RangeException(codeName) {
        this.code = this[codeName];
        this.codeName = codeName;
        this.message = "RangeException: " + this.codeName;
    }

    RangeException.prototype = {
        BAD_BOUNDARYPOINTS_ERR: 1,
        INVALID_NODE_TYPE_ERR: 2
    };

    RangeException.prototype.toString = function() {
        return this.message;
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    /**
     * Currently iterates through all nodes in the range on creation until I think of a decent way to do it
     * TODO: Look into making this a proper iterator, not requiring preloading everything first
     * @constructor
     */
    function RangeNodeIterator(range, nodeTypes, filter) {
        this.nodes = getNodesInRange(range, nodeTypes, filter);
        this._next = this.nodes[0];
        this._position = 0;
    }

    RangeNodeIterator.prototype = {
        _current: null,

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            this._current = this._next;
            this._next = this.nodes[ ++this._position ];
            return this._current;
        },

        detach: function() {
            this._current = this._next = this.nodes = null;
        }
    };

    var beforeAfterNodeTypes = [1, 3, 4, 5, 7, 8, 10];
    var rootContainerNodeTypes = [2, 9, 11];
    var readonlyNodeTypes = [5, 6, 10, 12];
    var insertableNodeTypes = [1, 3, 4, 5, 7, 8, 10, 11];
    var surroundNodeTypes = [1, 3, 4, 5, 7, 8];

    function createAncestorFinder(nodeTypes) {
        return function(node, selfIsAncestor) {
            var t, n = selfIsAncestor ? node : node.parentNode;
            while (n) {
                t = n.nodeType;
                if (dom.arrayContains(nodeTypes, t)) {
                    return n;
                }
                n = n.parentNode;
            }
            return null;
        };
    }

    var getRootContainer = dom.getRootContainer;
    var getDocumentOrFragmentContainer = createAncestorFinder( [9, 11] );
    var getReadonlyAncestor = createAncestorFinder(readonlyNodeTypes);
    var getDocTypeNotationEntityAncestor = createAncestorFinder( [6, 10, 12] );

    function assertNoDocTypeNotationEntityAncestor(node, allowSelf) {
        if (getDocTypeNotationEntityAncestor(node, allowSelf)) {
            throw new RangeException("INVALID_NODE_TYPE_ERR");
        }
    }

    function assertNotDetached(range) {
        if (!range.startContainer) {
            throw new DOMException("INVALID_STATE_ERR");
        }
    }

    function assertValidNodeType(node, invalidTypes) {
        if (!dom.arrayContains(invalidTypes, node.nodeType)) {
            throw new RangeException("INVALID_NODE_TYPE_ERR");
        }
    }

    function assertValidOffset(node, offset) {
        if (offset < 0 || offset > (dom.isCharacterDataNode(node) ? node.length : node.childNodes.length)) {
            throw new DOMException("INDEX_SIZE_ERR");
        }
    }

    function assertSameDocumentOrFragment(node1, node2) {
        if (getDocumentOrFragmentContainer(node1, true) !== getDocumentOrFragmentContainer(node2, true)) {
            throw new DOMException("WRONG_DOCUMENT_ERR");
        }
    }

    function assertNodeNotReadOnly(node) {
        if (getReadonlyAncestor(node, true)) {
            throw new DOMException("NO_MODIFICATION_ALLOWED_ERR");
        }
    }

    function assertNode(node, codeName) {
        if (!node) {
            throw new DOMException(codeName);
        }
    }

    function isOrphan(node) {
        return !dom.arrayContains(rootContainerNodeTypes, node.nodeType) && !getDocumentOrFragmentContainer(node, true);
    }

    function isValidOffset(node, offset) {
        return offset <= (dom.isCharacterDataNode(node) ? node.length : node.childNodes.length);
    }

    function isRangeValid(range) {
        return (!!range.startContainer && !!range.endContainer
                && !isOrphan(range.startContainer)
                && !isOrphan(range.endContainer)
                && isValidOffset(range.startContainer, range.startOffset)
                && isValidOffset(range.endContainer, range.endOffset));
    }

    function assertRangeValid(range) {
        assertNotDetached(range);
        if (!isRangeValid(range)) {
            throw new Error("Range error: Range is no longer valid after DOM mutation (" + range.inspect() + ")");
        }
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Test the browser's innerHTML support to decide how to implement createContextualFragment
    var styleEl = document.createElement("style");
    var htmlParsingConforms = false;
    try {
        styleEl.innerHTML = "<b>x</b>";
        htmlParsingConforms = (styleEl.firstChild.nodeType == 3); // Opera incorrectly creates an element node
    } catch (e) {
        // IE 6 and 7 throw
    }

    api.features.htmlParsingConforms = htmlParsingConforms;

    var createContextualFragment = htmlParsingConforms ?

        // Implementation as per HTML parsing spec, trusting in the browser's implementation of innerHTML. See
        // discussion and base code for this implementation at issue 67.
        // Spec: http://html5.org/specs/dom-parsing.html#extensions-to-the-range-interface
        // Thanks to Aleks Williams.
        function(fragmentStr) {
            // "Let node the context object's start's node."
            var node = this.startContainer;
            var doc = dom.getDocument(node);

            // "If the context object's start's node is null, raise an INVALID_STATE_ERR
            // exception and abort these steps."
            if (!node) {
                throw new DOMException("INVALID_STATE_ERR");
            }

            // "Let element be as follows, depending on node's interface:"
            // Document, Document Fragment: null
            var el = null;

            // "Element: node"
            if (node.nodeType == 1) {
                el = node;

            // "Text, Comment: node's parentElement"
            } else if (dom.isCharacterDataNode(node)) {
                el = dom.parentElement(node);
            }

            // "If either element is null or element's ownerDocument is an HTML document
            // and element's local name is "html" and element's namespace is the HTML
            // namespace"
            if (el === null || (
                el.nodeName == "HTML"
                && dom.isHtmlNamespace(dom.getDocument(el).documentElement)
                && dom.isHtmlNamespace(el)
            )) {

            // "let element be a new Element with "body" as its local name and the HTML
            // namespace as its namespace.""
                el = doc.createElement("body");
            } else {
                el = el.cloneNode(false);
            }

            // "If the node's document is an HTML document: Invoke the HTML fragment parsing algorithm."
            // "If the node's document is an XML document: Invoke the XML fragment parsing algorithm."
            // "In either case, the algorithm must be invoked with fragment as the input
            // and element as the context element."
            el.innerHTML = fragmentStr;

            // "If this raises an exception, then abort these steps. Otherwise, let new
            // children be the nodes returned."

            // "Let fragment be a new DocumentFragment."
            // "Append all new children to fragment."
            // "Return fragment."
            return dom.fragmentFromNodeChildren(el);
        } :

        // In this case, innerHTML cannot be trusted, so fall back to a simpler, non-conformant implementation that
        // previous versions of Rangy used (with the exception of using a body element rather than a div)
        function(fragmentStr) {
            assertNotDetached(this);
            var doc = getRangeDocument(this);
            var el = doc.createElement("body");
            el.innerHTML = fragmentStr;

            return dom.fragmentFromNodeChildren(el);
        };

    /*----------------------------------------------------------------------------------------------------------------*/

    var rangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed",
        "commonAncestorContainer"];

    var s2s = 0, s2e = 1, e2e = 2, e2s = 3;
    var n_b = 0, n_a = 1, n_b_a = 2, n_i = 3;

    function RangePrototype() {}

    RangePrototype.prototype = {
        attachListener: function(type, listener) {
            this._listeners[type].push(listener);
        },

        compareBoundaryPoints: function(how, range) {
            assertRangeValid(this);
            assertSameDocumentOrFragment(this.startContainer, range.startContainer);

            var nodeA, offsetA, nodeB, offsetB;
            var prefixA = (how == e2s || how == s2s) ? "start" : "end";
            var prefixB = (how == s2e || how == s2s) ? "start" : "end";
            nodeA = this[prefixA + "Container"];
            offsetA = this[prefixA + "Offset"];
            nodeB = range[prefixB + "Container"];
            offsetB = range[prefixB + "Offset"];
            return dom.comparePoints(nodeA, offsetA, nodeB, offsetB);
        },

        insertNode: function(node) {
            assertRangeValid(this);
            assertValidNodeType(node, insertableNodeTypes);
            assertNodeNotReadOnly(this.startContainer);

            if (dom.isAncestorOf(node, this.startContainer, true)) {
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }

            // No check for whether the container of the start of the Range is of a type that does not allow
            // children of the type of node: the browser's DOM implementation should do this for us when we attempt
            // to add the node

            var firstNodeInserted = insertNodeAtPosition(node, this.startContainer, this.startOffset);
            this.setStartBefore(firstNodeInserted);
        },

        cloneContents: function() {
            assertRangeValid(this);

            var clone, frag;
            if (this.collapsed) {
                return getRangeDocument(this).createDocumentFragment();
            } else {
                if (this.startContainer === this.endContainer && dom.isCharacterDataNode(this.startContainer)) {
                    clone = this.startContainer.cloneNode(true);
                    clone.data = clone.data.slice(this.startOffset, this.endOffset);
                    frag = getRangeDocument(this).createDocumentFragment();
                    frag.appendChild(clone);
                    return frag;
                } else {
                    var iterator = new RangeIterator(this, true);
                    clone = cloneSubtree(iterator);
                    iterator.detach();
                }
                return clone;
            }
        },

        canSurroundContents: function() {
            assertRangeValid(this);
            assertNodeNotReadOnly(this.startContainer);
            assertNodeNotReadOnly(this.endContainer);

            // Check if the contents can be surrounded. Specifically, this means whether the range partially selects
            // no non-text nodes.
            var iterator = new RangeIterator(this, true);
            var boundariesInvalid = (iterator._first && (isNonTextPartiallySelected(iterator._first, this)) ||
                    (iterator._last && isNonTextPartiallySelected(iterator._last, this)));
            iterator.detach();
            return !boundariesInvalid;
        },

        surroundContents: function(node) {
            assertValidNodeType(node, surroundNodeTypes);

            if (!this.canSurroundContents()) {
                throw new RangeException("BAD_BOUNDARYPOINTS_ERR");
            }

            // Extract the contents
            var content = this.extractContents();

            // Clear the children of the node
            if (node.hasChildNodes()) {
                while (node.lastChild) {
                    node.removeChild(node.lastChild);
                }
            }

            // Insert the new node and add the extracted contents
            insertNodeAtPosition(node, this.startContainer, this.startOffset);
            node.appendChild(content);

            this.selectNode(node);
        },

        cloneRange: function() {
            assertRangeValid(this);
            var range = new Range(getRangeDocument(this));
            var i = rangeProperties.length, prop;
            while (i--) {
                prop = rangeProperties[i];
                range[prop] = this[prop];
            }
            return range;
        },

        toString: function() {
            assertRangeValid(this);
            var sc = this.startContainer;
            if (sc === this.endContainer && dom.isCharacterDataNode(sc)) {
                return (sc.nodeType == 3 || sc.nodeType == 4) ? sc.data.slice(this.startOffset, this.endOffset) : "";
            } else {
                var textBits = [], iterator = new RangeIterator(this, true);

                iterateSubtree(iterator, function(node) {
                    // Accept only text or CDATA nodes, not comments

                    if (node.nodeType == 3 || node.nodeType == 4) {
                        textBits.push(node.data);
                    }
                });
                iterator.detach();
                return textBits.join("");
            }
        },

        // The methods below are all non-standard. The following batch were introduced by Mozilla but have since
        // been removed from Mozilla.

        compareNode: function(node) {
            assertRangeValid(this);

            var parent = node.parentNode;
            var nodeIndex = dom.getNodeIndex(node);

            if (!parent) {
                throw new DOMException("NOT_FOUND_ERR");
            }

            var startComparison = this.comparePoint(parent, nodeIndex),
                endComparison = this.comparePoint(parent, nodeIndex + 1);

            if (startComparison < 0) { // Node starts before
                return (endComparison > 0) ? n_b_a : n_b;
            } else {
                return (endComparison > 0) ? n_a : n_i;
            }
        },

        comparePoint: function(node, offset) {
            assertRangeValid(this);
            assertNode(node, "HIERARCHY_REQUEST_ERR");
            assertSameDocumentOrFragment(node, this.startContainer);

            if (dom.comparePoints(node, offset, this.startContainer, this.startOffset) < 0) {
                return -1;
            } else if (dom.comparePoints(node, offset, this.endContainer, this.endOffset) > 0) {
                return 1;
            }
            return 0;
        },

        createContextualFragment: createContextualFragment,

        toHtml: function() {
            assertRangeValid(this);
            var container = getRangeDocument(this).createElement("div");
            container.appendChild(this.cloneContents());
            return container.innerHTML;
        },

        // touchingIsIntersecting determines whether this method considers a node that borders a range intersects
        // with it (as in WebKit) or not (as in Gecko pre-1.9, and the default)
        intersectsNode: function(node, touchingIsIntersecting) {
            assertRangeValid(this);
            assertNode(node, "NOT_FOUND_ERR");
            if (dom.getDocument(node) !== getRangeDocument(this)) {
                return false;
            }

            var parent = node.parentNode, offset = dom.getNodeIndex(node);
            assertNode(parent, "NOT_FOUND_ERR");

            var startComparison = dom.comparePoints(parent, offset, this.endContainer, this.endOffset),
                endComparison = dom.comparePoints(parent, offset + 1, this.startContainer, this.startOffset);

            return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
        },


        isPointInRange: function(node, offset) {
            assertRangeValid(this);
            assertNode(node, "HIERARCHY_REQUEST_ERR");
            assertSameDocumentOrFragment(node, this.startContainer);

            return (dom.comparePoints(node, offset, this.startContainer, this.startOffset) >= 0) &&
                   (dom.comparePoints(node, offset, this.endContainer, this.endOffset) <= 0);
        },

        // The methods below are non-standard and invented by me.

        // Sharing a boundary start-to-end or end-to-start does not count as intersection.
        intersectsRange: function(range, touchingIsIntersecting) {
            assertRangeValid(this);

            if (getRangeDocument(range) != getRangeDocument(this)) {
                throw new DOMException("WRONG_DOCUMENT_ERR");
            }

            var startComparison = dom.comparePoints(this.startContainer, this.startOffset, range.endContainer, range.endOffset),
                endComparison = dom.comparePoints(this.endContainer, this.endOffset, range.startContainer, range.startOffset);

            return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
        },

        intersection: function(range) {
            if (this.intersectsRange(range)) {
                var startComparison = dom.comparePoints(this.startContainer, this.startOffset, range.startContainer, range.startOffset),
                    endComparison = dom.comparePoints(this.endContainer, this.endOffset, range.endContainer, range.endOffset);

                var intersectionRange = this.cloneRange();

                if (startComparison == -1) {
                    intersectionRange.setStart(range.startContainer, range.startOffset);
                }
                if (endComparison == 1) {
                    intersectionRange.setEnd(range.endContainer, range.endOffset);
                }
                return intersectionRange;
            }
            return null;
        },

        union: function(range) {
            if (this.intersectsRange(range, true)) {
                var unionRange = this.cloneRange();
                if (dom.comparePoints(range.startContainer, range.startOffset, this.startContainer, this.startOffset) == -1) {
                    unionRange.setStart(range.startContainer, range.startOffset);
                }
                if (dom.comparePoints(range.endContainer, range.endOffset, this.endContainer, this.endOffset) == 1) {
                    unionRange.setEnd(range.endContainer, range.endOffset);
                }
                return unionRange;
            } else {
                throw new RangeException("Ranges do not intersect");
            }
        },

        containsNode: function(node, allowPartial) {
            if (allowPartial) {
                return this.intersectsNode(node, false);
            } else {
                return this.compareNode(node) == n_i;
            }
        },

        containsNodeContents: function(node) {
            return this.comparePoint(node, 0) >= 0 && this.comparePoint(node, dom.getNodeLength(node)) <= 0;
        },

        containsRange: function(range) {
            return this.intersection(range).equals(range);
        },

        containsNodeText: function(node) {
            var nodeRange = this.cloneRange();
            nodeRange.selectNode(node);
            var textNodes = nodeRange.getNodes([3]);
            if (textNodes.length > 0) {
                nodeRange.setStart(textNodes[0], 0);
                var lastTextNode = textNodes.pop();
                nodeRange.setEnd(lastTextNode, lastTextNode.length);
                var contains = this.containsRange(nodeRange);
                nodeRange.detach();
                return contains;
            } else {
                return this.containsNodeContents(node);
            }
        },

        createNodeIterator: function(nodeTypes, filter) {
            assertRangeValid(this);
            return new RangeNodeIterator(this, nodeTypes, filter);
        },

        getNodes: function(nodeTypes, filter) {
            assertRangeValid(this);
            return getNodesInRange(this, nodeTypes, filter);
        },

        getDocument: function() {
            return getRangeDocument(this);
        },

        collapseBefore: function(node) {
            assertNotDetached(this);

            this.setEndBefore(node);
            this.collapse(false);
        },

        collapseAfter: function(node) {
            assertNotDetached(this);

            this.setStartAfter(node);
            this.collapse(true);
        },

        getName: function() {
            return "DomRange";
        },

        equals: function(range) {
            return Range.rangesEqual(this, range);
        },

        isValid: function() {
            return isRangeValid(this);
        },

        inspect: function() {
            return inspect(this);
        }
    };

    function copyComparisonConstantsToObject(obj) {
        obj.START_TO_START = s2s;
        obj.START_TO_END = s2e;
        obj.END_TO_END = e2e;
        obj.END_TO_START = e2s;

        obj.NODE_BEFORE = n_b;
        obj.NODE_AFTER = n_a;
        obj.NODE_BEFORE_AND_AFTER = n_b_a;
        obj.NODE_INSIDE = n_i;
    }

    function copyComparisonConstants(constructor) {
        copyComparisonConstantsToObject(constructor);
        copyComparisonConstantsToObject(constructor.prototype);
    }

    function createRangeContentRemover(remover, boundaryUpdater) {
        return function() {
            assertRangeValid(this);

            var sc = this.startContainer, so = this.startOffset, root = this.commonAncestorContainer;

            var iterator = new RangeIterator(this, true);

            // Work out where to position the range after content removal
            var node, boundary;
            if (sc !== root) {
                node = dom.getClosestAncestorIn(sc, root, true);
                boundary = getBoundaryAfterNode(node);
                sc = boundary.node;
                so = boundary.offset;
            }

            // Check none of the range is read-only
            iterateSubtree(iterator, assertNodeNotReadOnly);

            iterator.reset();

            // Remove the content
            var returnValue = remover(iterator);
            iterator.detach();

            // Move to the new position
            boundaryUpdater(this, sc, so, sc, so);

            return returnValue;
        };
    }

    function createPrototypeRange(constructor, boundaryUpdater, detacher) {
        function createBeforeAfterNodeSetter(isBefore, isStart) {
            return function(node) {
                assertNotDetached(this);
                assertValidNodeType(node, beforeAfterNodeTypes);
                assertValidNodeType(getRootContainer(node), rootContainerNodeTypes);

                var boundary = (isBefore ? getBoundaryBeforeNode : getBoundaryAfterNode)(node);
                (isStart ? setRangeStart : setRangeEnd)(this, boundary.node, boundary.offset);
            };
        }

        function setRangeStart(range, node, offset) {
            var ec = range.endContainer, eo = range.endOffset;
            if (node !== range.startContainer || offset !== range.startOffset) {
                // Check the root containers of the range and the new boundary, and also check whether the new boundary
                // is after the current end. In either case, collapse the range to the new position
                if (getRootContainer(node) != getRootContainer(ec) || dom.comparePoints(node, offset, ec, eo) == 1) {
                    ec = node;
                    eo = offset;
                }
                boundaryUpdater(range, node, offset, ec, eo);
            }
        }

        function setRangeEnd(range, node, offset) {
            var sc = range.startContainer, so = range.startOffset;
            if (node !== range.endContainer || offset !== range.endOffset) {
                // Check the root containers of the range and the new boundary, and also check whether the new boundary
                // is after the current end. In either case, collapse the range to the new position
                if (getRootContainer(node) != getRootContainer(sc) || dom.comparePoints(node, offset, sc, so) == -1) {
                    sc = node;
                    so = offset;
                }
                boundaryUpdater(range, sc, so, node, offset);
            }
        }

        function setRangeStartAndEnd(range, node, offset) {
            if (node !== range.startContainer || offset !== range.startOffset || node !== range.endContainer || offset !== range.endOffset) {
                boundaryUpdater(range, node, offset, node, offset);
            }
        }

        constructor.prototype = new RangePrototype();

        api.util.extend(constructor.prototype, {
            setStart: function(node, offset) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);

                setRangeStart(this, node, offset);
            },

            setEnd: function(node, offset) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);

                setRangeEnd(this, node, offset);
            },

            setStartBefore: createBeforeAfterNodeSetter(true, true),
            setStartAfter: createBeforeAfterNodeSetter(false, true),
            setEndBefore: createBeforeAfterNodeSetter(true, false),
            setEndAfter: createBeforeAfterNodeSetter(false, false),

            collapse: function(isStart) {
                assertRangeValid(this);
                if (isStart) {
                    boundaryUpdater(this, this.startContainer, this.startOffset, this.startContainer, this.startOffset);
                } else {
                    boundaryUpdater(this, this.endContainer, this.endOffset, this.endContainer, this.endOffset);
                }
            },

            selectNodeContents: function(node) {
                // This doesn't seem well specified: the spec talks only about selecting the node's contents, which
                // could be taken to mean only its children. However, browsers implement this the same as selectNode for
                // text nodes, so I shall do likewise
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);

                boundaryUpdater(this, node, 0, node, dom.getNodeLength(node));
            },

            selectNode: function(node) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, false);
                assertValidNodeType(node, beforeAfterNodeTypes);

                var start = getBoundaryBeforeNode(node), end = getBoundaryAfterNode(node);
                boundaryUpdater(this, start.node, start.offset, end.node, end.offset);
            },

            extractContents: createRangeContentRemover(extractSubtree, boundaryUpdater),

            deleteContents: createRangeContentRemover(deleteSubtree, boundaryUpdater),

            canSurroundContents: function() {
                assertRangeValid(this);
                assertNodeNotReadOnly(this.startContainer);
                assertNodeNotReadOnly(this.endContainer);

                // Check if the contents can be surrounded. Specifically, this means whether the range partially selects
                // no non-text nodes.
                var iterator = new RangeIterator(this, true);
                var boundariesInvalid = (iterator._first && (isNonTextPartiallySelected(iterator._first, this)) ||
                        (iterator._last && isNonTextPartiallySelected(iterator._last, this)));
                iterator.detach();
                return !boundariesInvalid;
            },

            detach: function() {
                detacher(this);
            },

            splitBoundaries: function() {
                assertRangeValid(this);


                var sc = this.startContainer, so = this.startOffset, ec = this.endContainer, eo = this.endOffset;
                var startEndSame = (sc === ec);

                if (dom.isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
                    dom.splitDataNode(ec, eo);

                }

                if (dom.isCharacterDataNode(sc) && so > 0 && so < sc.length) {

                    sc = dom.splitDataNode(sc, so);
                    if (startEndSame) {
                        eo -= so;
                        ec = sc;
                    } else if (ec == sc.parentNode && eo >= dom.getNodeIndex(sc)) {
                        eo++;
                    }
                    so = 0;

                }
                boundaryUpdater(this, sc, so, ec, eo);
            },

            normalizeBoundaries: function() {
                assertRangeValid(this);

                var sc = this.startContainer, so = this.startOffset, ec = this.endContainer, eo = this.endOffset;

                var mergeForward = function(node) {
                    var sibling = node.nextSibling;
                    if (sibling && sibling.nodeType == node.nodeType) {
                        ec = node;
                        eo = node.length;
                        node.appendData(sibling.data);
                        sibling.parentNode.removeChild(sibling);
                    }
                };

                var mergeBackward = function(node) {
                    var sibling = node.previousSibling;
                    if (sibling && sibling.nodeType == node.nodeType) {
                        sc = node;
                        var nodeLength = node.length;
                        so = sibling.length;
                        node.insertData(0, sibling.data);
                        sibling.parentNode.removeChild(sibling);
                        if (sc == ec) {
                            eo += so;
                            ec = sc;
                        } else if (ec == node.parentNode) {
                            var nodeIndex = dom.getNodeIndex(node);
                            if (eo == nodeIndex) {
                                ec = node;
                                eo = nodeLength;
                            } else if (eo > nodeIndex) {
                                eo--;
                            }
                        }
                    }
                };

                var normalizeStart = true;

                if (dom.isCharacterDataNode(ec)) {
                    if (ec.length == eo) {
                        mergeForward(ec);
                    }
                } else {
                    if (eo > 0) {
                        var endNode = ec.childNodes[eo - 1];
                        if (endNode && dom.isCharacterDataNode(endNode)) {
                            mergeForward(endNode);
                        }
                    }
                    normalizeStart = !this.collapsed;
                }

                if (normalizeStart) {
                    if (dom.isCharacterDataNode(sc)) {
                        if (so == 0) {
                            mergeBackward(sc);
                        }
                    } else {
                        if (so < sc.childNodes.length) {
                            var startNode = sc.childNodes[so];
                            if (startNode && dom.isCharacterDataNode(startNode)) {
                                mergeBackward(startNode);
                            }
                        }
                    }
                } else {
                    sc = ec;
                    so = eo;
                }

                boundaryUpdater(this, sc, so, ec, eo);
            },

            collapseToPoint: function(node, offset) {
                assertNotDetached(this);

                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);

                setRangeStartAndEnd(this, node, offset);
            }
        });

        copyComparisonConstants(constructor);
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Updates commonAncestorContainer and collapsed after boundary change
    function updateCollapsedAndCommonAncestor(range) {
        range.collapsed = (range.startContainer === range.endContainer && range.startOffset === range.endOffset);
        range.commonAncestorContainer = range.collapsed ?
            range.startContainer : dom.getCommonAncestor(range.startContainer, range.endContainer);
    }

    function updateBoundaries(range, startContainer, startOffset, endContainer, endOffset) {
        var startMoved = (range.startContainer !== startContainer || range.startOffset !== startOffset);
        var endMoved = (range.endContainer !== endContainer || range.endOffset !== endOffset);

        range.startContainer = startContainer;
        range.startOffset = startOffset;
        range.endContainer = endContainer;
        range.endOffset = endOffset;

        updateCollapsedAndCommonAncestor(range);
        dispatchEvent(range, "boundarychange", {startMoved: startMoved, endMoved: endMoved});
    }

    function detach(range) {
        assertNotDetached(range);
        range.startContainer = range.startOffset = range.endContainer = range.endOffset = null;
        range.collapsed = range.commonAncestorContainer = null;
        dispatchEvent(range, "detach", null);
        range._listeners = null;
    }

    /**
     * @constructor
     */
    function Range(doc) {
        this.startContainer = doc;
        this.startOffset = 0;
        this.endContainer = doc;
        this.endOffset = 0;
        this._listeners = {
            boundarychange: [],
            detach: []
        };
        updateCollapsedAndCommonAncestor(this);
    }

    createPrototypeRange(Range, updateBoundaries, detach);

    api.rangePrototype = RangePrototype.prototype;

    Range.rangeProperties = rangeProperties;
    Range.RangeIterator = RangeIterator;
    Range.copyComparisonConstants = copyComparisonConstants;
    Range.createPrototypeRange = createPrototypeRange;
    Range.inspect = inspect;
    Range.getRangeDocument = getRangeDocument;
    Range.rangesEqual = function(r1, r2) {
        return r1.startContainer === r2.startContainer &&
               r1.startOffset === r2.startOffset &&
               r1.endContainer === r2.endContainer &&
               r1.endOffset === r2.endOffset;
    };

    api.DomRange = Range;
    api.RangeException = RangeException;
});rangy.createModule("WrappedRange", function(api, module) {
    api.requireModules( ["DomUtil", "DomRange"] );

    /**
     * @constructor
     */
    var WrappedRange;
    var dom = api.dom;
    var DomPosition = dom.DomPosition;
    var DomRange = api.DomRange;



    /*----------------------------------------------------------------------------------------------------------------*/

    /*
    This is a workaround for a bug where IE returns the wrong container element from the TextRange's parentElement()
    method. For example, in the following (where pipes denote the selection boundaries):

    <ul id="ul"><li id="a">| a </li><li id="b"> b |</li></ul>

    var range = document.selection.createRange();
    alert(range.parentElement().id); // Should alert "ul" but alerts "b"

    This method returns the common ancestor node of the following:
    - the parentElement() of the textRange
    - the parentElement() of the textRange after calling collapse(true)
    - the parentElement() of the textRange after calling collapse(false)
     */
    function getTextRangeContainerElement(textRange) {
        var parentEl = textRange.parentElement();

        var range = textRange.duplicate();
        range.collapse(true);
        var startEl = range.parentElement();
        range = textRange.duplicate();
        range.collapse(false);
        var endEl = range.parentElement();
        var startEndContainer = (startEl == endEl) ? startEl : dom.getCommonAncestor(startEl, endEl);

        return startEndContainer == parentEl ? startEndContainer : dom.getCommonAncestor(parentEl, startEndContainer);
    }

    function textRangeIsCollapsed(textRange) {
        return textRange.compareEndPoints("StartToEnd", textRange) == 0;
    }

    // Gets the boundary of a TextRange expressed as a node and an offset within that node. This function started out as
    // an improved version of code found in Tim Cameron Ryan's IERange (http://code.google.com/p/ierange/) but has
    // grown, fixing problems with line breaks in preformatted text, adding workaround for IE TextRange bugs, handling
    // for inputs and images, plus optimizations.
    function getTextRangeBoundaryPosition(textRange, wholeRangeContainerElement, isStart, isCollapsed) {
        var workingRange = textRange.duplicate();

        workingRange.collapse(isStart);
        var containerElement = workingRange.parentElement();

        // Sometimes collapsing a TextRange that's at the start of a text node can move it into the previous node, so
        // check for that
        // TODO: Find out when. Workaround for wholeRangeContainerElement may break this
        if (!dom.isAncestorOf(wholeRangeContainerElement, containerElement, true)) {
            containerElement = wholeRangeContainerElement;

        }



        // Deal with nodes that cannot "contain rich HTML markup". In practice, this means form inputs, images and
        // similar. See http://msdn.microsoft.com/en-us/library/aa703950%28VS.85%29.aspx
        if (!containerElement.canHaveHTML) {
            return new DomPosition(containerElement.parentNode, dom.getNodeIndex(containerElement));
        }

        var workingNode = dom.getDocument(containerElement).createElement("span");
        var comparison, workingComparisonType = isStart ? "StartToStart" : "StartToEnd";
        var previousNode, nextNode, boundaryPosition, boundaryNode;

        // Move the working range through the container's children, starting at the end and working backwards, until the
        // working range reaches or goes past the boundary we're interested in
        do {
            containerElement.insertBefore(workingNode, workingNode.previousSibling);
            workingRange.moveToElementText(workingNode);
        } while ( (comparison = workingRange.compareEndPoints(workingComparisonType, textRange)) > 0 &&
                workingNode.previousSibling);

        // We've now reached or gone past the boundary of the text range we're interested in
        // so have identified the node we want
        boundaryNode = workingNode.nextSibling;

        if (comparison == -1 && boundaryNode && dom.isCharacterDataNode(boundaryNode)) {
            // This is a character data node (text, comment, cdata). The working range is collapsed at the start of the
            // node containing the text range's boundary, so we move the end of the working range to the boundary point
            // and measure the length of its text to get the boundary's offset within the node.
            workingRange.setEndPoint(isStart ? "EndToStart" : "EndToEnd", textRange);


            var offset;

            if (/[\r\n]/.test(boundaryNode.data)) {
                /*
                For the particular case of a boundary within a text node containing line breaks (within a <pre> element,
                for example), we need a slightly complicated approach to get the boundary's offset in IE. The facts:

                - Each line break is represented as \r in the text node's data/nodeValue properties
                - Each line break is represented as \r\n in the TextRange's 'text' property
                - The 'text' property of the TextRange does not contain trailing line breaks

                To get round the problem presented by the final fact above, we can use the fact that TextRange's
                moveStart() and moveEnd() methods return the actual number of characters moved, which is not necessarily
                the same as the number of characters it was instructed to move. The simplest approach is to use this to
                store the characters moved when moving both the start and end of the range to the start of the document
                body and subtracting the start offset from the end offset (the "move-negative-gazillion" method).
                However, this is extremely slow when the document is large and the range is near the end of it. Clearly
                doing the mirror image (i.e. moving the range boundaries to the end of the document) has the same
                problem.

                Another approach that works is to use moveStart() to move the start boundary of the range up to the end
                boundary one character at a time and incrementing a counter with the value returned by the moveStart()
                call. However, the check for whether the start boundary has reached the end boundary is expensive, so
                this method is slow (although unlike "move-negative-gazillion" is largely unaffected by the location of
                the range within the document).

                The method below is a hybrid of the two methods above. It uses the fact that a string containing the
                TextRange's 'text' property with each \r\n converted to a single \r character cannot be longer than the
                text of the TextRange, so the start of the range is moved that length initially and then a character at
                a time to make up for any trailing line breaks not contained in the 'text' property. This has good
                performance in most situations compared to the previous two methods.
                */
                var tempRange = workingRange.duplicate();
                var rangeLength = tempRange.text.replace(/\r\n/g, "\r").length;

                offset = tempRange.moveStart("character", rangeLength);
                while ( (comparison = tempRange.compareEndPoints("StartToEnd", tempRange)) == -1) {
                    offset++;
                    tempRange.moveStart("character", 1);
                }
            } else {
                offset = workingRange.text.length;
            }
            boundaryPosition = new DomPosition(boundaryNode, offset);
        } else {


            // If the boundary immediately follows a character data node and this is the end boundary, we should favour
            // a position within that, and likewise for a start boundary preceding a character data node
            previousNode = (isCollapsed || !isStart) && workingNode.previousSibling;
            nextNode = (isCollapsed || isStart) && workingNode.nextSibling;



            if (nextNode && dom.isCharacterDataNode(nextNode)) {
                boundaryPosition = new DomPosition(nextNode, 0);
            } else if (previousNode && dom.isCharacterDataNode(previousNode)) {
                boundaryPosition = new DomPosition(previousNode, previousNode.length);
            } else {
                boundaryPosition = new DomPosition(containerElement, dom.getNodeIndex(workingNode));
            }
        }

        // Clean up
        workingNode.parentNode.removeChild(workingNode);

        return boundaryPosition;
    }

    // Returns a TextRange representing the boundary of a TextRange expressed as a node and an offset within that node.
    // This function started out as an optimized version of code found in Tim Cameron Ryan's IERange
    // (http://code.google.com/p/ierange/)
    function createBoundaryTextRange(boundaryPosition, isStart) {
        var boundaryNode, boundaryParent, boundaryOffset = boundaryPosition.offset;
        var doc = dom.getDocument(boundaryPosition.node);
        var workingNode, childNodes, workingRange = doc.body.createTextRange();
        var nodeIsDataNode = dom.isCharacterDataNode(boundaryPosition.node);

        if (nodeIsDataNode) {
            boundaryNode = boundaryPosition.node;
            boundaryParent = boundaryNode.parentNode;
        } else {
            childNodes = boundaryPosition.node.childNodes;
            boundaryNode = (boundaryOffset < childNodes.length) ? childNodes[boundaryOffset] : null;
            boundaryParent = boundaryPosition.node;
        }

        // Position the range immediately before the node containing the boundary
        workingNode = doc.createElement("span");

        // Making the working element non-empty element persuades IE to consider the TextRange boundary to be within the
        // element rather than immediately before or after it, which is what we want
        workingNode.innerHTML = "&#feff;";

        // insertBefore is supposed to work like appendChild if the second parameter is null. However, a bug report
        // for IERange suggests that it can crash the browser: http://code.google.com/p/ierange/issues/detail?id=12
        if (boundaryNode) {
            boundaryParent.insertBefore(workingNode, boundaryNode);
        } else {
            boundaryParent.appendChild(workingNode);
        }

        workingRange.moveToElementText(workingNode);
        workingRange.collapse(!isStart);

        // Clean up
        boundaryParent.removeChild(workingNode);

        // Move the working range to the text offset, if required
        if (nodeIsDataNode) {
            workingRange[isStart ? "moveStart" : "moveEnd"]("character", boundaryOffset);
        }

        return workingRange;
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    if (api.features.implementsDomRange && (!api.features.implementsTextRange || !api.config.preferTextRange)) {
        // This is a wrapper around the browser's native DOM Range. It has two aims:
        // - Provide workarounds for specific browser bugs
        // - provide convenient extensions, which are inherited from Rangy's DomRange

        (function() {
            var rangeProto;
            var rangeProperties = DomRange.rangeProperties;
            var canSetRangeStartAfterEnd;

            function updateRangeProperties(range) {
                var i = rangeProperties.length, prop;
                while (i--) {
                    prop = rangeProperties[i];
                    range[prop] = range.nativeRange[prop];
                }
            }

            function updateNativeRange(range, startContainer, startOffset, endContainer,endOffset) {
                var startMoved = (range.startContainer !== startContainer || range.startOffset != startOffset);
                var endMoved = (range.endContainer !== endContainer || range.endOffset != endOffset);

                // Always set both boundaries for the benefit of IE9 (see issue 35)
                if (startMoved || endMoved) {
                    range.setEnd(endContainer, endOffset);
                    range.setStart(startContainer, startOffset);
                }
            }

            function detach(range) {
                range.nativeRange.detach();
                range.detached = true;
                var i = rangeProperties.length, prop;
                while (i--) {
                    prop = rangeProperties[i];
                    range[prop] = null;
                }
            }

            var createBeforeAfterNodeSetter;

            WrappedRange = function(range) {
                if (!range) {
                    throw new Error("Range must be specified");
                }
                this.nativeRange = range;
                updateRangeProperties(this);
            };

            DomRange.createPrototypeRange(WrappedRange, updateNativeRange, detach);

            rangeProto = WrappedRange.prototype;

            rangeProto.selectNode = function(node) {
                this.nativeRange.selectNode(node);
                updateRangeProperties(this);
            };

            rangeProto.deleteContents = function() {
                this.nativeRange.deleteContents();
                updateRangeProperties(this);
            };

            rangeProto.extractContents = function() {
                var frag = this.nativeRange.extractContents();
                updateRangeProperties(this);
                return frag;
            };

            rangeProto.cloneContents = function() {
                return this.nativeRange.cloneContents();
            };

            // TODO: Until I can find a way to programmatically trigger the Firefox bug (apparently long-standing, still
            // present in 3.6.8) that throws "Index or size is negative or greater than the allowed amount" for
            // insertNode in some circumstances, all browsers will have to use the Rangy's own implementation of
            // insertNode, which works but is almost certainly slower than the native implementation.
/*
            rangeProto.insertNode = function(node) {
                this.nativeRange.insertNode(node);
                updateRangeProperties(this);
            };
*/

            rangeProto.surroundContents = function(node) {
                this.nativeRange.surroundContents(node);
                updateRangeProperties(this);
            };

            rangeProto.collapse = function(isStart) {
                this.nativeRange.collapse(isStart);
                updateRangeProperties(this);
            };

            rangeProto.cloneRange = function() {
                return new WrappedRange(this.nativeRange.cloneRange());
            };

            rangeProto.refresh = function() {
                updateRangeProperties(this);
            };

            rangeProto.toString = function() {
                return this.nativeRange.toString();
            };

            // Create test range and node for feature detection

            var testTextNode = document.createTextNode("test");
            dom.getBody(document).appendChild(testTextNode);
            var range = document.createRange();

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for Firefox 2 bug that prevents moving the start of a Range to a point after its current end and
            // correct for it

            range.setStart(testTextNode, 0);
            range.setEnd(testTextNode, 0);

            try {
                range.setStart(testTextNode, 1);
                canSetRangeStartAfterEnd = true;

                rangeProto.setStart = function(node, offset) {
                    this.nativeRange.setStart(node, offset);
                    updateRangeProperties(this);
                };

                rangeProto.setEnd = function(node, offset) {
                    this.nativeRange.setEnd(node, offset);
                    updateRangeProperties(this);
                };

                createBeforeAfterNodeSetter = function(name) {
                    return function(node) {
                        this.nativeRange[name](node);
                        updateRangeProperties(this);
                    };
                };

            } catch(ex) {


                canSetRangeStartAfterEnd = false;

                rangeProto.setStart = function(node, offset) {
                    try {
                        this.nativeRange.setStart(node, offset);
                    } catch (ex) {
                        this.nativeRange.setEnd(node, offset);
                        this.nativeRange.setStart(node, offset);
                    }
                    updateRangeProperties(this);
                };

                rangeProto.setEnd = function(node, offset) {
                    try {
                        this.nativeRange.setEnd(node, offset);
                    } catch (ex) {
                        this.nativeRange.setStart(node, offset);
                        this.nativeRange.setEnd(node, offset);
                    }
                    updateRangeProperties(this);
                };

                createBeforeAfterNodeSetter = function(name, oppositeName) {
                    return function(node) {
                        try {
                            this.nativeRange[name](node);
                        } catch (ex) {
                            this.nativeRange[oppositeName](node);
                            this.nativeRange[name](node);
                        }
                        updateRangeProperties(this);
                    };
                };
            }

            rangeProto.setStartBefore = createBeforeAfterNodeSetter("setStartBefore", "setEndBefore");
            rangeProto.setStartAfter = createBeforeAfterNodeSetter("setStartAfter", "setEndAfter");
            rangeProto.setEndBefore = createBeforeAfterNodeSetter("setEndBefore", "setStartBefore");
            rangeProto.setEndAfter = createBeforeAfterNodeSetter("setEndAfter", "setStartAfter");

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for and correct Firefox 2 behaviour with selectNodeContents on text nodes: it collapses the range to
            // the 0th character of the text node
            range.selectNodeContents(testTextNode);
            if (range.startContainer == testTextNode && range.endContainer == testTextNode &&
                    range.startOffset == 0 && range.endOffset == testTextNode.length) {
                rangeProto.selectNodeContents = function(node) {
                    this.nativeRange.selectNodeContents(node);
                    updateRangeProperties(this);
                };
            } else {
                rangeProto.selectNodeContents = function(node) {
                    this.setStart(node, 0);
                    this.setEnd(node, DomRange.getEndOffset(node));
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for WebKit bug that has the beahviour of compareBoundaryPoints round the wrong way for constants
            // START_TO_END and END_TO_START: https://bugs.webkit.org/show_bug.cgi?id=20738

            range.selectNodeContents(testTextNode);
            range.setEnd(testTextNode, 3);

            var range2 = document.createRange();
            range2.selectNodeContents(testTextNode);
            range2.setEnd(testTextNode, 4);
            range2.setStart(testTextNode, 2);

            if (range.compareBoundaryPoints(range.START_TO_END, range2) == -1 &
                    range.compareBoundaryPoints(range.END_TO_START, range2) == 1) {
                // This is the wrong way round, so correct for it


                rangeProto.compareBoundaryPoints = function(type, range) {
                    range = range.nativeRange || range;
                    if (type == range.START_TO_END) {
                        type = range.END_TO_START;
                    } else if (type == range.END_TO_START) {
                        type = range.START_TO_END;
                    }
                    return this.nativeRange.compareBoundaryPoints(type, range);
                };
            } else {
                rangeProto.compareBoundaryPoints = function(type, range) {
                    return this.nativeRange.compareBoundaryPoints(type, range.nativeRange || range);
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for existence of createContextualFragment and delegate to it if it exists
            if (api.util.isHostMethod(range, "createContextualFragment")) {
                rangeProto.createContextualFragment = function(fragmentStr) {
                    return this.nativeRange.createContextualFragment(fragmentStr);
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Clean up
            dom.getBody(document).removeChild(testTextNode);
            range.detach();
            range2.detach();
        })();

        api.createNativeRange = function(doc) {
            doc = doc || document;
            return doc.createRange();
        };
    } else if (api.features.implementsTextRange) {
        // This is a wrapper around a TextRange, providing full DOM Range functionality using rangy's DomRange as a
        // prototype

        WrappedRange = function(textRange) {
            this.textRange = textRange;
            this.refresh();
        };

        WrappedRange.prototype = new DomRange(document);

        WrappedRange.prototype.refresh = function() {
            var start, end;

            // TextRange's parentElement() method cannot be trusted. getTextRangeContainerElement() works around that.
            var rangeContainerElement = getTextRangeContainerElement(this.textRange);

            if (textRangeIsCollapsed(this.textRange)) {
                end = start = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, true);
            } else {

                start = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, false);
                end = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, false, false);
            }

            this.setStart(start.node, start.offset);
            this.setEnd(end.node, end.offset);
        };

        DomRange.copyComparisonConstants(WrappedRange);

        // Add WrappedRange as the Range property of the global object to allow expression like Range.END_TO_END to work
        var globalObj = (function() { return this; })();
        if (typeof globalObj.Range == "undefined") {
            globalObj.Range = WrappedRange;
        }

        api.createNativeRange = function(doc) {
            doc = doc || document;
            return doc.body.createTextRange();
        };
    }

    if (api.features.implementsTextRange) {
        WrappedRange.rangeToTextRange = function(range) {
            if (range.collapsed) {
                var tr = createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);



                return tr;

                //return createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
            } else {
                var startRange = createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
                var endRange = createBoundaryTextRange(new DomPosition(range.endContainer, range.endOffset), false);
                var textRange = dom.getDocument(range.startContainer).body.createTextRange();
                textRange.setEndPoint("StartToStart", startRange);
                textRange.setEndPoint("EndToEnd", endRange);
                return textRange;
            }
        };
    }

    WrappedRange.prototype.getName = function() {
        return "WrappedRange";
    };

    api.WrappedRange = WrappedRange;

    api.createRange = function(doc) {
        doc = doc || document;
        return new WrappedRange(api.createNativeRange(doc));
    };

    api.createRangyRange = function(doc) {
        doc = doc || document;
        return new DomRange(doc);
    };

    api.createIframeRange = function(iframeEl) {
        return api.createRange(dom.getIframeDocument(iframeEl));
    };

    api.createIframeRangyRange = function(iframeEl) {
        return api.createRangyRange(dom.getIframeDocument(iframeEl));
    };

    api.addCreateMissingNativeApiListener(function(win) {
        var doc = win.document;
        if (typeof doc.createRange == "undefined") {
            doc.createRange = function() {
                return api.createRange(this);
            };
        }
        doc = win = null;
    });
});rangy.createModule("WrappedSelection", function(api, module) {
    // This will create a selection object wrapper that follows the Selection object found in the WHATWG draft DOM Range
    // spec (http://html5.org/specs/dom-range.html)

    api.requireModules( ["DomUtil", "DomRange", "WrappedRange"] );

    api.config.checkSelectionRanges = true;

    var BOOLEAN = "boolean",
        windowPropertyName = "_rangySelection",
        dom = api.dom,
        util = api.util,
        DomRange = api.DomRange,
        WrappedRange = api.WrappedRange,
        DOMException = api.DOMException,
        DomPosition = dom.DomPosition,
        getSelection,
        selectionIsCollapsed,
        CONTROL = "Control";



    function getWinSelection(winParam) {
        return (winParam || window).getSelection();
    }

    function getDocSelection(winParam) {
        return (winParam || window).document.selection;
    }

    // Test for the Range/TextRange and Selection features required
    // Test for ability to retrieve selection
    var implementsWinGetSelection = api.util.isHostMethod(window, "getSelection"),
        implementsDocSelection = api.util.isHostObject(document, "selection");

    var useDocumentSelection = implementsDocSelection && (!implementsWinGetSelection || api.config.preferTextRange);

    if (useDocumentSelection) {
        getSelection = getDocSelection;
        api.isSelectionValid = function(winParam) {
            var doc = (winParam || window).document, nativeSel = doc.selection;

            // Check whether the selection TextRange is actually contained within the correct document
            return (nativeSel.type != "None" || dom.getDocument(nativeSel.createRange().parentElement()) == doc);
        };
    } else if (implementsWinGetSelection) {
        getSelection = getWinSelection;
        api.isSelectionValid = function() {
            return true;
        };
    } else {
        module.fail("Neither document.selection or window.getSelection() detected.");
    }

    api.getNativeSelection = getSelection;

    var testSelection = getSelection();
    var testRange = api.createNativeRange(document);
    var body = dom.getBody(document);

    // Obtaining a range from a selection
    var selectionHasAnchorAndFocus = util.areHostObjects(testSelection, ["anchorNode", "focusNode"] &&
                                     util.areHostProperties(testSelection, ["anchorOffset", "focusOffset"]));
    api.features.selectionHasAnchorAndFocus = selectionHasAnchorAndFocus;

    // Test for existence of native selection extend() method
    var selectionHasExtend = util.isHostMethod(testSelection, "extend");
    api.features.selectionHasExtend = selectionHasExtend;

    // Test if rangeCount exists
    var selectionHasRangeCount = (typeof testSelection.rangeCount == "number");
    api.features.selectionHasRangeCount = selectionHasRangeCount;

    var selectionSupportsMultipleRanges = false;
    var collapsedNonEditableSelectionsSupported = true;

    if (util.areHostMethods(testSelection, ["addRange", "getRangeAt", "removeAllRanges"]) &&
            typeof testSelection.rangeCount == "number" && api.features.implementsDomRange) {

        (function() {
            var iframe = document.createElement("iframe");
            iframe.frameBorder = 0;
            iframe.style.position = "absolute";
            iframe.style.left = "-10000px";
            body.appendChild(iframe);

            var iframeDoc = dom.getIframeDocument(iframe);
            iframeDoc.open();
            iframeDoc.write("<html><head></head><body>12</body></html>");
            iframeDoc.close();

            var sel = dom.getIframeWindow(iframe).getSelection();
            var docEl = iframeDoc.documentElement;
            var iframeBody = docEl.lastChild, textNode = iframeBody.firstChild;

            // Test whether the native selection will allow a collapsed selection within a non-editable element
            var r1 = iframeDoc.createRange();
            r1.setStart(textNode, 1);
            r1.collapse(true);
            sel.addRange(r1);
            collapsedNonEditableSelectionsSupported = (sel.rangeCount == 1);
            sel.removeAllRanges();

            // Test whether the native selection is capable of supporting multiple ranges
            var r2 = r1.cloneRange();
            r1.setStart(textNode, 0);
            r2.setEnd(textNode, 2);
            sel.addRange(r1);
            sel.addRange(r2);

            selectionSupportsMultipleRanges = (sel.rangeCount == 2);

            // Clean up
            r1.detach();
            r2.detach();

            body.removeChild(iframe);
        })();
    }

    api.features.selectionSupportsMultipleRanges = selectionSupportsMultipleRanges;
    api.features.collapsedNonEditableSelectionsSupported = collapsedNonEditableSelectionsSupported;

    // ControlRanges
    var implementsControlRange = false, testControlRange;

    if (body && util.isHostMethod(body, "createControlRange")) {
        testControlRange = body.createControlRange();
        if (util.areHostProperties(testControlRange, ["item", "add"])) {
            implementsControlRange = true;
        }
    }
    api.features.implementsControlRange = implementsControlRange;

    // Selection collapsedness
    if (selectionHasAnchorAndFocus) {
        selectionIsCollapsed = function(sel) {
            return sel.anchorNode === sel.focusNode && sel.anchorOffset === sel.focusOffset;
        };
    } else {
        selectionIsCollapsed = function(sel) {
            return sel.rangeCount ? sel.getRangeAt(sel.rangeCount - 1).collapsed : false;
        };
    }

    function updateAnchorAndFocusFromRange(sel, range, backwards) {
        var anchorPrefix = backwards ? "end" : "start", focusPrefix = backwards ? "start" : "end";
        sel.anchorNode = range[anchorPrefix + "Container"];
        sel.anchorOffset = range[anchorPrefix + "Offset"];
        sel.focusNode = range[focusPrefix + "Container"];
        sel.focusOffset = range[focusPrefix + "Offset"];
    }

    function updateAnchorAndFocusFromNativeSelection(sel) {
        var nativeSel = sel.nativeSelection;
        sel.anchorNode = nativeSel.anchorNode;
        sel.anchorOffset = nativeSel.anchorOffset;
        sel.focusNode = nativeSel.focusNode;
        sel.focusOffset = nativeSel.focusOffset;
    }

    function updateEmptySelection(sel) {
        sel.anchorNode = sel.focusNode = null;
        sel.anchorOffset = sel.focusOffset = 0;
        sel.rangeCount = 0;
        sel.isCollapsed = true;
        sel._ranges.length = 0;
    }

    function getNativeRange(range) {
        var nativeRange;
        if (range instanceof DomRange) {
            nativeRange = range._selectionNativeRange;
            if (!nativeRange) {
                nativeRange = api.createNativeRange(dom.getDocument(range.startContainer));
                nativeRange.setEnd(range.endContainer, range.endOffset);
                nativeRange.setStart(range.startContainer, range.startOffset);
                range._selectionNativeRange = nativeRange;
                range.attachListener("detach", function() {

                    this._selectionNativeRange = null;
                });
            }
        } else if (range instanceof WrappedRange) {
            nativeRange = range.nativeRange;
        } else if (api.features.implementsDomRange && (range instanceof dom.getWindow(range.startContainer).Range)) {
            nativeRange = range;
        }
        return nativeRange;
    }

    function rangeContainsSingleElement(rangeNodes) {
        if (!rangeNodes.length || rangeNodes[0].nodeType != 1) {
            return false;
        }
        for (var i = 1, len = rangeNodes.length; i < len; ++i) {
            if (!dom.isAncestorOf(rangeNodes[0], rangeNodes[i])) {
                return false;
            }
        }
        return true;
    }

    function getSingleElementFromRange(range) {
        var nodes = range.getNodes();
        if (!rangeContainsSingleElement(nodes)) {
            throw new Error("getSingleElementFromRange: range " + range.inspect() + " did not consist of a single element");
        }
        return nodes[0];
    }

    function isTextRange(range) {
        return !!range && typeof range.text != "undefined";
    }

    function updateFromTextRange(sel, range) {
        // Create a Range from the selected TextRange
        var wrappedRange = new WrappedRange(range);
        sel._ranges = [wrappedRange];

        updateAnchorAndFocusFromRange(sel, wrappedRange, false);
        sel.rangeCount = 1;
        sel.isCollapsed = wrappedRange.collapsed;
    }

    function updateControlSelection(sel) {
        // Update the wrapped selection based on what's now in the native selection
        sel._ranges.length = 0;
        if (sel.docSelection.type == "None") {
            updateEmptySelection(sel);
        } else {
            var controlRange = sel.docSelection.createRange();
            if (isTextRange(controlRange)) {
                // This case (where the selection type is "Control" and calling createRange() on the selection returns
                // a TextRange) can happen in IE 9. It happens, for example, when all elements in the selected
                // ControlRange have been removed from the ControlRange and removed from the document.
                updateFromTextRange(sel, controlRange);
            } else {
                sel.rangeCount = controlRange.length;
                var range, doc = dom.getDocument(controlRange.item(0));
                for (var i = 0; i < sel.rangeCount; ++i) {
                    range = api.createRange(doc);
                    range.selectNode(controlRange.item(i));
                    sel._ranges.push(range);
                }
                sel.isCollapsed = sel.rangeCount == 1 && sel._ranges[0].collapsed;
                updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], false);
            }
        }
    }

    function addRangeToControlSelection(sel, range) {
        var controlRange = sel.docSelection.createRange();
        var rangeElement = getSingleElementFromRange(range);

        // Create a new ControlRange containing all the elements in the selected ControlRange plus the element
        // contained by the supplied range
        var doc = dom.getDocument(controlRange.item(0));
        var newControlRange = dom.getBody(doc).createControlRange();
        for (var i = 0, len = controlRange.length; i < len; ++i) {
            newControlRange.add(controlRange.item(i));
        }
        try {
            newControlRange.add(rangeElement);
        } catch (ex) {
            throw new Error("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)");
        }
        newControlRange.select();

        // Update the wrapped selection based on what's now in the native selection
        updateControlSelection(sel);
    }

    var getSelectionRangeAt;

    if (util.isHostMethod(testSelection,  "getRangeAt")) {
        getSelectionRangeAt = function(sel, index) {
            try {
                return sel.getRangeAt(index);
            } catch(ex) {
                return null;
            }
        };
    } else if (selectionHasAnchorAndFocus) {
        getSelectionRangeAt = function(sel) {
            var doc = dom.getDocument(sel.anchorNode);
            var range = api.createRange(doc);
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);

            // Handle the case when the selection was selected backwards (from the end to the start in the
            // document)
            if (range.collapsed !== this.isCollapsed) {
                range.setStart(sel.focusNode, sel.focusOffset);
                range.setEnd(sel.anchorNode, sel.anchorOffset);
            }

            return range;
        };
    }

    /**
     * @constructor
     */
    function WrappedSelection(selection, docSelection, win) {
        this.nativeSelection = selection;
        this.docSelection = docSelection;
        this._ranges = [];
        this.win = win;
        this.refresh();
    }

    api.getSelection = function(win) {
        win = win || window;
        var sel = win[windowPropertyName];
        var nativeSel = getSelection(win), docSel = implementsDocSelection ? getDocSelection(win) : null;
        if (sel) {
            sel.nativeSelection = nativeSel;
            sel.docSelection = docSel;
            sel.refresh(win);
        } else {
            sel = new WrappedSelection(nativeSel, docSel, win);
            win[windowPropertyName] = sel;
        }
        return sel;
    };

    api.getIframeSelection = function(iframeEl) {
        return api.getSelection(dom.getIframeWindow(iframeEl));
    };

    var selProto = WrappedSelection.prototype;

    function createControlSelection(sel, ranges) {
        // Ensure that the selection becomes of type "Control"
        var doc = dom.getDocument(ranges[0].startContainer);
        var controlRange = dom.getBody(doc).createControlRange();
        for (var i = 0, el; i < rangeCount; ++i) {
            el = getSingleElementFromRange(ranges[i]);
            try {
                controlRange.add(el);
            } catch (ex) {
                throw new Error("setRanges(): Element within the one of the specified Ranges could not be added to control selection (does it have layout?)");
            }
        }
        controlRange.select();

        // Update the wrapped selection based on what's now in the native selection
        updateControlSelection(sel);
    }

    // Selecting a range
    if (!useDocumentSelection && selectionHasAnchorAndFocus && util.areHostMethods(testSelection, ["removeAllRanges", "addRange"])) {
        selProto.removeAllRanges = function() {
            this.nativeSelection.removeAllRanges();
            updateEmptySelection(this);
        };

        var addRangeBackwards = function(sel, range) {
            var doc = DomRange.getRangeDocument(range);
            var endRange = api.createRange(doc);
            endRange.collapseToPoint(range.endContainer, range.endOffset);
            sel.nativeSelection.addRange(getNativeRange(endRange));
            sel.nativeSelection.extend(range.startContainer, range.startOffset);
            sel.refresh();
        };

        if (selectionHasRangeCount) {
            selProto.addRange = function(range, backwards) {
                if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
                    addRangeToControlSelection(this, range);
                } else {
                    if (backwards && selectionHasExtend) {
                        addRangeBackwards(this, range);
                    } else {
                        var previousRangeCount;
                        if (selectionSupportsMultipleRanges) {
                            previousRangeCount = this.rangeCount;
                        } else {
                            this.removeAllRanges();
                            previousRangeCount = 0;
                        }
                        this.nativeSelection.addRange(getNativeRange(range));

                        // Check whether adding the range was successful
                        this.rangeCount = this.nativeSelection.rangeCount;

                        if (this.rangeCount == previousRangeCount + 1) {
                            // The range was added successfully

                            // Check whether the range that we added to the selection is reflected in the last range extracted from
                            // the selection
                            if (api.config.checkSelectionRanges) {
                                var nativeRange = getSelectionRangeAt(this.nativeSelection, this.rangeCount - 1);
                                if (nativeRange && !DomRange.rangesEqual(nativeRange, range)) {
                                    // Happens in WebKit with, for example, a selection placed at the start of a text node
                                    range = new WrappedRange(nativeRange);
                                }
                            }
                            this._ranges[this.rangeCount - 1] = range;
                            updateAnchorAndFocusFromRange(this, range, selectionIsBackwards(this.nativeSelection));
                            this.isCollapsed = selectionIsCollapsed(this);
                        } else {
                            // The range was not added successfully. The simplest thing is to refresh
                            this.refresh();
                        }
                    }
                }
            };
        } else {
            selProto.addRange = function(range, backwards) {
                if (backwards && selectionHasExtend) {
                    addRangeBackwards(this, range);
                } else {
                    this.nativeSelection.addRange(getNativeRange(range));
                    this.refresh();
                }
            };
        }

        selProto.setRanges = function(ranges) {
            if (implementsControlRange && ranges.length > 1) {
                createControlSelection(this, ranges);
            } else {
                this.removeAllRanges();
                for (var i = 0, len = ranges.length; i < len; ++i) {
                    this.addRange(ranges[i]);
                }
            }
        };
    } else if (util.isHostMethod(testSelection, "empty") && util.isHostMethod(testRange, "select") &&
               implementsControlRange && useDocumentSelection) {

        selProto.removeAllRanges = function() {
            // Added try/catch as fix for issue #21
            try {
                this.docSelection.empty();

                // Check for empty() not working (issue #24)
                if (this.docSelection.type != "None") {
                    // Work around failure to empty a control selection by instead selecting a TextRange and then
                    // calling empty()
                    var doc;
                    if (this.anchorNode) {
                        doc = dom.getDocument(this.anchorNode);
                    } else if (this.docSelection.type == CONTROL) {
                        var controlRange = this.docSelection.createRange();
                        if (controlRange.length) {
                            doc = dom.getDocument(controlRange.item(0)).body.createTextRange();
                        }
                    }
                    if (doc) {
                        var textRange = doc.body.createTextRange();
                        textRange.select();
                        this.docSelection.empty();
                    }
                }
            } catch(ex) {}
            updateEmptySelection(this);
        };

        selProto.addRange = function(range) {
            if (this.docSelection.type == CONTROL) {
                addRangeToControlSelection(this, range);
            } else {
                WrappedRange.rangeToTextRange(range).select();
                this._ranges[0] = range;
                this.rangeCount = 1;
                this.isCollapsed = this._ranges[0].collapsed;
                updateAnchorAndFocusFromRange(this, range, false);
            }
        };

        selProto.setRanges = function(ranges) {
            this.removeAllRanges();
            var rangeCount = ranges.length;
            if (rangeCount > 1) {
                createControlSelection(this, ranges);
            } else if (rangeCount) {
                this.addRange(ranges[0]);
            }
        };
    } else {
        module.fail("No means of selecting a Range or TextRange was found");
        return false;
    }

    selProto.getRangeAt = function(index) {
        if (index < 0 || index >= this.rangeCount) {
            throw new DOMException("INDEX_SIZE_ERR");
        } else {
            return this._ranges[index];
        }
    };

    var refreshSelection;

    if (useDocumentSelection) {
        refreshSelection = function(sel) {
            var range;
            if (api.isSelectionValid(sel.win)) {
                range = sel.docSelection.createRange();
            } else {
                range = dom.getBody(sel.win.document).createTextRange();
                range.collapse(true);
            }


            if (sel.docSelection.type == CONTROL) {
                updateControlSelection(sel);
            } else if (isTextRange(range)) {
                updateFromTextRange(sel, range);
            } else {
                updateEmptySelection(sel);
            }
        };
    } else if (util.isHostMethod(testSelection, "getRangeAt") && typeof testSelection.rangeCount == "number") {
        refreshSelection = function(sel) {
            if (implementsControlRange && implementsDocSelection && sel.docSelection.type == CONTROL) {
                updateControlSelection(sel);
            } else {
                sel._ranges.length = sel.rangeCount = sel.nativeSelection.rangeCount;
                if (sel.rangeCount) {
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        sel._ranges[i] = new api.WrappedRange(sel.nativeSelection.getRangeAt(i));
                    }
                    updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], selectionIsBackwards(sel.nativeSelection));
                    sel.isCollapsed = selectionIsCollapsed(sel);
                } else {
                    updateEmptySelection(sel);
                }
            }
        };
    } else if (selectionHasAnchorAndFocus && typeof testSelection.isCollapsed == BOOLEAN && typeof testRange.collapsed == BOOLEAN && api.features.implementsDomRange) {
        refreshSelection = function(sel) {
            var range, nativeSel = sel.nativeSelection;
            if (nativeSel.anchorNode) {
                range = getSelectionRangeAt(nativeSel, 0);
                sel._ranges = [range];
                sel.rangeCount = 1;
                updateAnchorAndFocusFromNativeSelection(sel);
                sel.isCollapsed = selectionIsCollapsed(sel);
            } else {
                updateEmptySelection(sel);
            }
        };
    } else {
        module.fail("No means of obtaining a Range or TextRange from the user's selection was found");
        return false;
    }

    selProto.refresh = function(checkForChanges) {
        var oldRanges = checkForChanges ? this._ranges.slice(0) : null;
        refreshSelection(this);
        if (checkForChanges) {
            var i = oldRanges.length;
            if (i != this._ranges.length) {
                return false;
            }
            while (i--) {
                if (!DomRange.rangesEqual(oldRanges[i], this._ranges[i])) {
                    return false;
                }
            }
            return true;
        }
    };

    // Removal of a single range
    var removeRangeManually = function(sel, range) {
        var ranges = sel.getAllRanges(), removed = false;
        sel.removeAllRanges();
        for (var i = 0, len = ranges.length; i < len; ++i) {
            if (removed || range !== ranges[i]) {
                sel.addRange(ranges[i]);
            } else {
                // According to the draft WHATWG Range spec, the same range may be added to the selection multiple
                // times. removeRange should only remove the first instance, so the following ensures only the first
                // instance is removed
                removed = true;
            }
        }
        if (!sel.rangeCount) {
            updateEmptySelection(sel);
        }
    };

    if (implementsControlRange) {
        selProto.removeRange = function(range) {
            if (this.docSelection.type == CONTROL) {
                var controlRange = this.docSelection.createRange();
                var rangeElement = getSingleElementFromRange(range);

                // Create a new ControlRange containing all the elements in the selected ControlRange minus the
                // element contained by the supplied range
                var doc = dom.getDocument(controlRange.item(0));
                var newControlRange = dom.getBody(doc).createControlRange();
                var el, removed = false;
                for (var i = 0, len = controlRange.length; i < len; ++i) {
                    el = controlRange.item(i);
                    if (el !== rangeElement || removed) {
                        newControlRange.add(controlRange.item(i));
                    } else {
                        removed = true;
                    }
                }
                newControlRange.select();

                // Update the wrapped selection based on what's now in the native selection
                updateControlSelection(this);
            } else {
                removeRangeManually(this, range);
            }
        };
    } else {
        selProto.removeRange = function(range) {
            removeRangeManually(this, range);
        };
    }

    // Detecting if a selection is backwards
    var selectionIsBackwards;
    if (!useDocumentSelection && selectionHasAnchorAndFocus && api.features.implementsDomRange) {
        selectionIsBackwards = function(sel) {
            var backwards = false;
            if (sel.anchorNode) {
                backwards = (dom.comparePoints(sel.anchorNode, sel.anchorOffset, sel.focusNode, sel.focusOffset) == 1);
            }
            return backwards;
        };

        selProto.isBackwards = function() {
            return selectionIsBackwards(this);
        };
    } else {
        selectionIsBackwards = selProto.isBackwards = function() {
            return false;
        };
    }

    // Selection text
    // This is conformant to the new WHATWG DOM Range draft spec but differs from WebKit and Mozilla's implementation
    selProto.toString = function() {

        var rangeTexts = [];
        for (var i = 0, len = this.rangeCount; i < len; ++i) {
            rangeTexts[i] = "" + this._ranges[i];
        }
        return rangeTexts.join("");
    };

    function assertNodeInSameDocument(sel, node) {
        if (sel.anchorNode && (dom.getDocument(sel.anchorNode) !== dom.getDocument(node))) {
            throw new DOMException("WRONG_DOCUMENT_ERR");
        }
    }

    // No current browsers conform fully to the HTML 5 draft spec for this method, so Rangy's own method is always used
    selProto.collapse = function(node, offset) {
        assertNodeInSameDocument(this, node);
        var range = api.createRange(dom.getDocument(node));
        range.collapseToPoint(node, offset);
        this.removeAllRanges();
        this.addRange(range);
        this.isCollapsed = true;
    };

    selProto.collapseToStart = function() {
        if (this.rangeCount) {
            var range = this._ranges[0];
            this.collapse(range.startContainer, range.startOffset);
        } else {
            throw new DOMException("INVALID_STATE_ERR");
        }
    };

    selProto.collapseToEnd = function() {
        if (this.rangeCount) {
            var range = this._ranges[this.rangeCount - 1];
            this.collapse(range.endContainer, range.endOffset);
        } else {
            throw new DOMException("INVALID_STATE_ERR");
        }
    };

    // The HTML 5 spec is very specific on how selectAllChildren should be implemented so the native implementation is
    // never used by Rangy.
    selProto.selectAllChildren = function(node) {
        assertNodeInSameDocument(this, node);
        var range = api.createRange(dom.getDocument(node));
        range.selectNodeContents(node);
        this.removeAllRanges();
        this.addRange(range);
    };

    selProto.deleteFromDocument = function() {
        // Sepcial behaviour required for Control selections
        if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
            var controlRange = this.docSelection.createRange();
            var element;
            while (controlRange.length) {
                element = controlRange.item(0);
                controlRange.remove(element);
                element.parentNode.removeChild(element);
            }
            this.refresh();
        } else if (this.rangeCount) {
            var ranges = this.getAllRanges();
            this.removeAllRanges();
            for (var i = 0, len = ranges.length; i < len; ++i) {
                ranges[i].deleteContents();
            }
            // The HTML5 spec says nothing about what the selection should contain after calling deleteContents on each
            // range. Firefox moves the selection to where the final selected range was, so we emulate that
            this.addRange(ranges[len - 1]);
        }
    };

    // The following are non-standard extensions
    selProto.getAllRanges = function() {
        return this._ranges.slice(0);
    };

    selProto.setSingleRange = function(range) {
        this.setRanges( [range] );
    };

    selProto.containsNode = function(node, allowPartial) {
        for (var i = 0, len = this._ranges.length; i < len; ++i) {
            if (this._ranges[i].containsNode(node, allowPartial)) {
                return true;
            }
        }
        return false;
    };

    selProto.toHtml = function() {
        var html = "";
        if (this.rangeCount) {
            var container = DomRange.getRangeDocument(this._ranges[0]).createElement("div");
            for (var i = 0, len = this._ranges.length; i < len; ++i) {
                container.appendChild(this._ranges[i].cloneContents());
            }
            html = container.innerHTML;
        }
        return html;
    };

    function inspect(sel) {
        var rangeInspects = [];
        var anchor = new DomPosition(sel.anchorNode, sel.anchorOffset);
        var focus = new DomPosition(sel.focusNode, sel.focusOffset);
        var name = (typeof sel.getName == "function") ? sel.getName() : "Selection";

        if (typeof sel.rangeCount != "undefined") {
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                rangeInspects[i] = DomRange.inspect(sel.getRangeAt(i));
            }
        }
        return "[" + name + "(Ranges: " + rangeInspects.join(", ") +
                ")(anchor: " + anchor.inspect() + ", focus: " + focus.inspect() + "]";

    }

    selProto.getName = function() {
        return "WrappedSelection";
    };

    selProto.inspect = function() {
        return inspect(this);
    };

    selProto.detach = function() {
        this.win[windowPropertyName] = null;
        this.win = this.anchorNode = this.focusNode = null;
    };

    WrappedSelection.inspect = inspect;

    api.Selection = WrappedSelection;

    api.selectionPrototype = selProto;

    api.addCreateMissingNativeApiListener(function(win) {
        if (typeof win.getSelection == "undefined") {
            win.getSelection = function() {
                return api.getSelection(this);
            };
        }
        win = null;
    });
});
;

/**
 * @license Selection save and restore module for Rangy.
 * Saves and restores user selections using marker invisible elements in the DOM.
 *
 * Part of Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Depends on Rangy core.
 *
 * Copyright 2012, Tim Down
 * Licensed under the MIT license.
 * Version: 1.2.3
 * Build date: 26 February 2012
 */
rangy.createModule("SaveRestore", function(api, module) {
    api.requireModules( ["DomUtil", "DomRange", "WrappedRange"] );

    var dom = api.dom;

    var markerTextChar = "\ufeff";

    function gEBI(id, doc) {
        return (doc || document).getElementById(id);
    }

    function insertRangeBoundaryMarker(range, atStart) {
        var markerId = "selectionBoundary_" + (+new Date()) + "_" + ("" + Math.random()).slice(2);
        var markerEl;
        var doc = dom.getDocument(range.startContainer);

        // Clone the Range and collapse to the appropriate boundary point
        var boundaryRange = range.cloneRange();
        boundaryRange.collapse(atStart);

        // Create the marker element containing a single invisible character using DOM methods and insert it
        markerEl = doc.createElement("span");
        markerEl.id = markerId;
        markerEl.style.lineHeight = "0";
        markerEl.style.display = "none";
        markerEl.className = "rangySelectionBoundary";
        markerEl.appendChild(doc.createTextNode(markerTextChar));

        boundaryRange.insertNode(markerEl);
        boundaryRange.detach();
        return markerEl;
    }

    function setRangeBoundary(doc, range, markerId, atStart) {
        var markerEl = gEBI(markerId, doc);
        if (markerEl) {
            range[atStart ? "setStartBefore" : "setEndBefore"](markerEl);
            markerEl.parentNode.removeChild(markerEl);
        } else {
            module.warn("Marker element has been removed. Cannot restore selection.");
        }
    }

    function compareRanges(r1, r2) {
        return r2.compareBoundaryPoints(r1.START_TO_START, r1);
    }

    function saveSelection(win) {
        win = win || window;
        var doc = win.document;
        if (!api.isSelectionValid(win)) {
            module.warn("Cannot save selection. This usually happens when the selection is collapsed and the selection document has lost focus.");
            return;
        }
        var sel = api.getSelection(win);
        var ranges = sel.getAllRanges();
        var rangeInfos = [], startEl, endEl, range;

        // Order the ranges by position within the DOM, latest first
        ranges.sort(compareRanges);

        for (var i = 0, len = ranges.length; i < len; ++i) {
            range = ranges[i];
            if (range.collapsed) {
                endEl = insertRangeBoundaryMarker(range, false);
                rangeInfos.push({
                    markerId: endEl.id,
                    collapsed: true
                });
            } else {
                endEl = insertRangeBoundaryMarker(range, false);
                startEl = insertRangeBoundaryMarker(range, true);

                rangeInfos[i] = {
                    startMarkerId: startEl.id,
                    endMarkerId: endEl.id,
                    collapsed: false,
                    backwards: ranges.length == 1 && sel.isBackwards()
                };
            }
        }

        // Now that all the markers are in place and DOM manipulation over, adjust each range's boundaries to lie
        // between its markers
        for (i = len - 1; i >= 0; --i) {
            range = ranges[i];
            if (range.collapsed) {
                range.collapseBefore(gEBI(rangeInfos[i].markerId, doc));
            } else {
                range.setEndBefore(gEBI(rangeInfos[i].endMarkerId, doc));
                range.setStartAfter(gEBI(rangeInfos[i].startMarkerId, doc));
            }
        }

        // Ensure current selection is unaffected
        sel.setRanges(ranges);
        return {
            win: win,
            doc: doc,
            rangeInfos: rangeInfos,
            restored: false
        };
    }

    function restoreSelection(savedSelection, preserveDirection) {
        if (!savedSelection.restored) {
            var rangeInfos = savedSelection.rangeInfos;
            var sel = api.getSelection(savedSelection.win);
            var ranges = [];

            // Ranges are in reverse order of appearance in the DOM. We want to restore earliest first to avoid
            // normalization affecting previously restored ranges.
            for (var len = rangeInfos.length, i = len - 1, rangeInfo, range; i >= 0; --i) {
                rangeInfo = rangeInfos[i];
                range = api.createRange(savedSelection.doc);
                if (rangeInfo.collapsed) {
                    var markerEl = gEBI(rangeInfo.markerId, savedSelection.doc);
                    if (markerEl) {
                        markerEl.style.display = "inline";
                        var previousNode = markerEl.previousSibling;

                        // Workaround for issue 17
                        if (previousNode && previousNode.nodeType == 3) {
                            markerEl.parentNode.removeChild(markerEl);
                            range.collapseToPoint(previousNode, previousNode.length);
                        } else {
                            range.collapseBefore(markerEl);
                            markerEl.parentNode.removeChild(markerEl);
                        }
                    } else {
                        module.warn("Marker element has been removed. Cannot restore selection.");
                    }
                } else {
                    setRangeBoundary(savedSelection.doc, range, rangeInfo.startMarkerId, true);
                    setRangeBoundary(savedSelection.doc, range, rangeInfo.endMarkerId, false);
                }

                // Normalizing range boundaries is only viable if the selection contains only one range. For example,
                // if the selection contained two ranges that were both contained within the same single text node,
                // both would alter the same text node when restoring and break the other range.
                if (len == 1) {
                    range.normalizeBoundaries();
                }
                ranges[i] = range;
            }
            if (len == 1 && preserveDirection && api.features.selectionHasExtend && rangeInfos[0].backwards) {
                sel.removeAllRanges();
                sel.addRange(ranges[0], true);
            } else {
                sel.setRanges(ranges);
            }

            savedSelection.restored = true;
        }
    }

    function removeMarkerElement(doc, markerId) {
        var markerEl = gEBI(markerId, doc);
        if (markerEl) {
            markerEl.parentNode.removeChild(markerEl);
        }
    }

    function removeMarkers(savedSelection) {
        var rangeInfos = savedSelection.rangeInfos;
        for (var i = 0, len = rangeInfos.length, rangeInfo; i < len; ++i) {
            rangeInfo = rangeInfos[i];
            if (rangeInfo.collapsed) {
                removeMarkerElement(savedSelection.doc, rangeInfo.markerId);
            } else {
                removeMarkerElement(savedSelection.doc, rangeInfo.startMarkerId);
                removeMarkerElement(savedSelection.doc, rangeInfo.endMarkerId);
            }
        }
    }

    api.saveSelection = saveSelection;
    api.restoreSelection = restoreSelection;
    api.removeMarkerElement = removeMarkerElement;
    api.removeMarkers = removeMarkers;
});
;

/*

 Style HTML
---------------

  Written by Nochum Sossonko, (nsossonko@hotmail.com)

  Based on code initially developed by: Einar Lielmanis, <elfz@laacz.lv>
    http://jsbeautifier.org/


  You are free to use this in any way you want, in case you find this useful or working for you.

  Usage:
    style_html(html_source);

    style_html(html_source, options);

  The options are:
    indent_size (default 4)          — indentation size,
    indent_char (default space)      — character to indent with,
    max_char (default 70)            -  maximum amount of characters per line,
    brace_style (default "collapse") - "collapse" | "expand" | "end-expand"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.
    unformatted (default ['a'])      - list of tags, that shouldn't be reformatted
    indent_scripts (default normal)  - "keep"|"separate"|"normal"

    e.g.

    style_html(html_source, {
      'indent_size': 2,
      'indent_char': ' ',
      'max_char': 78,
      'brace_style': 'expand',
      'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u']
    });
*/

function style_html(html_source, options) {
//Wrapper function to invoke all the necessary constructors and deal with the output.

  var multi_parser,
      indent_size,
      indent_character,
      max_char,
      brace_style;

  options = options || {};
  indent_size = options.indent_size || 4;
  indent_character = options.indent_char || ' ';
  brace_style = options.brace_style || 'collapse';
  max_char = options.max_char || '70';
  unformatted = options.unformatted || ['a'];

  function Parser() {

    this.pos = 0; //Parser position
    this.token = '';
    this.current_mode = 'CONTENT'; //reflects the current Parser mode: TAG/CONTENT
    this.tags = { //An object to hold tags, their position, and their parent-tags, initiated with default values
      parent: 'parent1',
      parentcount: 1,
      parent1: ''
    };
    this.tag_type = '';
    this.token_text = this.last_token = this.last_text = this.token_type = '';

    this.Utils = { //Uilities made available to the various functions
      whitespace: "\n\r\t ".split(''),
      single_token: 'br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed'.split(','), //all the single tags for HTML
      extra_liners: 'head,body,/html'.split(','), //for tags that need a line of whitespace before them
      in_array: function (what, arr) {
        for (var i=0; i<arr.length; i++) {
          if (what === arr[i]) {
            return true;
          }
        }
        return false;
      }
    }

    this.get_content = function () { //function to capture regular content between tags

      var input_char = '';
      var content = [];
      var space = false; //if a space is needed
      while (this.input.charAt(this.pos) !== '<') {
        if (this.pos >= this.input.length) {
          return content.length?content.join(''):['', 'TK_EOF'];
        }

        input_char = this.input.charAt(this.pos);
        this.pos++;
        this.line_char_count++;

        if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
          if (content.length) {
            space = true;
          }
          this.line_char_count--;
          continue; //don't want to insert unnecessary space
        }
        else if (space) {
          if (this.line_char_count >= this.max_char) { //insert a line when the max_char is reached
            content.push('\n');
            for (var i=0; i<this.indent_level; i++) {
              content.push(this.indent_string);
            }
            this.line_char_count = 0;
          }
          else{
            content.push(' ');
            this.line_char_count++;
          }
          space = false;
        }
        content.push(input_char); //letter at-a-time (or string) inserted to an array
      }
      return content.length?content.join(''):'';
    }

    this.get_contents_to = function (name) { //get the full content of a script or style to pass to js_beautify
      if (this.pos == this.input.length) {
        return ['', 'TK_EOF'];
      }
      var input_char = '';
      var content = '';
      var reg_match = new RegExp('\<\/' + name + '\\s*\>', 'igm');
      reg_match.lastIndex = this.pos;
      var reg_array = reg_match.exec(this.input);
      var end_script = reg_array?reg_array.index:this.input.length; //absolute end of script
      if(this.pos < end_script) { //get everything in between the script tags
        content = this.input.substring(this.pos, end_script);
        this.pos = end_script;
      }
      return content;
    }

    this.record_tag = function (tag){ //function to record a tag and its parent in this.tags Object
      if (this.tags[tag + 'count']) { //check for the existence of this tag type
        this.tags[tag + 'count']++;
        this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
      }
      else { //otherwise initialize this tag type
        this.tags[tag + 'count'] = 1;
        this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
      }
      this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent; //set the parent (i.e. in the case of a div this.tags.div1parent)
      this.tags.parent = tag + this.tags[tag + 'count']; //and make this the current parent (i.e. in the case of a div 'div1')
    }

    this.retrieve_tag = function (tag) { //function to retrieve the opening tag to the corresponding closer
      if (this.tags[tag + 'count']) { //if the openener is not in the Object we ignore it
        var temp_parent = this.tags.parent; //check to see if it's a closable tag.
        while (temp_parent) { //till we reach '' (the initial value);
          if (tag + this.tags[tag + 'count'] === temp_parent) { //if this is it use it
            break;
          }
          temp_parent = this.tags[temp_parent + 'parent']; //otherwise keep on climbing up the DOM Tree
        }
        if (temp_parent) { //if we caught something
          this.indent_level = this.tags[tag + this.tags[tag + 'count']]; //set the indent_level accordingly
          this.tags.parent = this.tags[temp_parent + 'parent']; //and set the current parent
        }
        delete this.tags[tag + this.tags[tag + 'count'] + 'parent']; //delete the closed tags parent reference...
        delete this.tags[tag + this.tags[tag + 'count']]; //...and the tag itself
        if (this.tags[tag + 'count'] == 1) {
          delete this.tags[tag + 'count'];
        }
        else {
          this.tags[tag + 'count']--;
        }
      }
    }

    this.get_tag = function () { //function to get a full tag and parse its type
      var input_char = '';
      var content = [];
      var space = false;

      do {
        if (this.pos >= this.input.length) {
          return content.length?content.join(''):['', 'TK_EOF'];
        }

        input_char = this.input.charAt(this.pos);
        this.pos++;
        this.line_char_count++;

        if (this.Utils.in_array(input_char, this.Utils.whitespace)) { //don't want to insert unnecessary space
          space = true;
          this.line_char_count--;
          continue;
        }

        if (input_char === "'" || input_char === '"') {
          if (!content[1] || content[1] !== '!') { //if we're in a comment strings don't get treated specially
            input_char += this.get_unformatted(input_char);
            space = true;
          }
        }

        if (input_char === '=') { //no space before =
          space = false;
        }

        if (content.length && content[content.length-1] !== '=' && input_char !== '>'
            && space) { //no space after = or before >
          if (this.line_char_count >= this.max_char) {
            this.print_newline(false, content);
            this.line_char_count = 0;
          }
          else {
            content.push(' ');
            this.line_char_count++;
          }
          space = false;
        }
        content.push(input_char); //inserts character at-a-time (or string)
      } while (input_char !== '>');

      var tag_complete = content.join('');
      var tag_index;
      if (tag_complete.indexOf(' ') != -1) { //if there's whitespace, thats where the tag name ends
        tag_index = tag_complete.indexOf(' ');
      }
      else { //otherwise go with the tag ending
        tag_index = tag_complete.indexOf('>');
      }
      var tag_check = tag_complete.substring(1, tag_index).toLowerCase();
      if (tag_complete.charAt(tag_complete.length-2) === '/' ||
          this.Utils.in_array(tag_check, this.Utils.single_token)) { //if this tag name is a single tag type (either in the list or has a closing /)
        this.tag_type = 'SINGLE';
      }
      else if (tag_check === 'script') { //for later script handling
        this.record_tag(tag_check);
        this.tag_type = 'SCRIPT';
      }
      else if (tag_check === 'style') { //for future style handling (for now it justs uses get_content)
        this.record_tag(tag_check);
        this.tag_type = 'STYLE';
      }
      else if (this.Utils.in_array(tag_check, unformatted)) { // do not reformat the "unformatted" tags
        var comment = this.get_unformatted('</'+tag_check+'>', tag_complete); //...delegate to get_unformatted function
        content.push(comment);
        this.tag_type = 'SINGLE';
      }
      else if (tag_check.charAt(0) === '!') { //peek for <!-- comment
        if (tag_check.indexOf('[if') != -1) { //peek for <!--[if conditional comment
          if (tag_complete.indexOf('!IE') != -1) { //this type needs a closing --> so...
            var comment = this.get_unformatted('-->', tag_complete); //...delegate to get_unformatted
            content.push(comment);
          }
          this.tag_type = 'START';
        }
        else if (tag_check.indexOf('[endif') != -1) {//peek for <!--[endif end conditional comment
          this.tag_type = 'END';
          this.unindent();
        }
        else if (tag_check.indexOf('[cdata[') != -1) { //if it's a <[cdata[ comment...
          var comment = this.get_unformatted(']]>', tag_complete); //...delegate to get_unformatted function
          content.push(comment);
          this.tag_type = 'SINGLE'; //<![CDATA[ comments are treated like single tags
        }
        else {
          var comment = this.get_unformatted('-->', tag_complete);
          content.push(comment);
          this.tag_type = 'SINGLE';
        }
      }
      else {
        if (tag_check.charAt(0) === '/') { //this tag is a double tag so check for tag-ending
          this.retrieve_tag(tag_check.substring(1)); //remove it and all ancestors
          this.tag_type = 'END';
        }
        else { //otherwise it's a start-tag
          this.record_tag(tag_check); //push it on the tag stack
          this.tag_type = 'START';
        }
        if (this.Utils.in_array(tag_check, this.Utils.extra_liners)) { //check if this double needs an extra line
          this.print_newline(true, this.output);
        }
      }
      return content.join(''); //returns fully formatted tag
    }

    this.get_unformatted = function (delimiter, orig_tag) { //function to return unformatted content in its entirety

      if (orig_tag && orig_tag.indexOf(delimiter) != -1) {
        return '';
      }
      var input_char = '';
      var content = '';
      var space = true;
      do {

        if (this.pos >= this.input.length) {
          return content;
        }

        input_char = this.input.charAt(this.pos);
        this.pos++

        if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
          if (!space) {
            this.line_char_count--;
            continue;
          }
          if (input_char === '\n' || input_char === '\r') {
            content += '\n';
            /*  Don't change tab indention for unformatted blocks.  If using code for html editing, this will greatly affect <pre> tags if they are specified in the 'unformatted array'
            for (var i=0; i<this.indent_level; i++) {
              content += this.indent_string;
            }
            space = false; //...and make sure other indentation is erased
            */
            this.line_char_count = 0;
            continue;
          }
        }
        content += input_char;
        this.line_char_count++;
        space = true;


      } while (content.indexOf(delimiter) == -1);
      return content;
    }

    this.get_token = function () { //initial handler for token-retrieval
      var token;

      if (this.last_token === 'TK_TAG_SCRIPT' || this.last_token === 'TK_TAG_STYLE') { //check if we need to format javascript
       var type = this.last_token.substr(7)
       token = this.get_contents_to(type);
        if (typeof token !== 'string') {
          return token;
        }
        return [token, 'TK_' + type];
      }
      if (this.current_mode === 'CONTENT') {
        token = this.get_content();
        if (typeof token !== 'string') {
          return token;
        }
        else {
          return [token, 'TK_CONTENT'];
        }
      }

      if (this.current_mode === 'TAG') {
        token = this.get_tag();
        if (typeof token !== 'string') {
          return token;
        }
        else {
          var tag_name_type = 'TK_TAG_' + this.tag_type;
          return [token, tag_name_type];
        }
      }
    }

    this.get_full_indent = function (level) {
      level = this.indent_level + level || 0;
      if (level < 1)
        return '';

      return Array(level + 1).join(this.indent_string);
    }


    this.printer = function (js_source, indent_character, indent_size, max_char, brace_style) { //handles input/output and some other printing functions

      this.input = js_source || ''; //gets the input for the Parser
      this.output = [];
      this.indent_character = indent_character;
      this.indent_string = '';
      this.indent_size = indent_size;
      this.brace_style = brace_style;
      this.indent_level = 0;
      this.max_char = max_char;
      this.line_char_count = 0; //count to see if max_char was exceeded

      for (var i=0; i<this.indent_size; i++) {
        this.indent_string += this.indent_character;
      }

      this.print_newline = function (ignore, arr) {
        this.line_char_count = 0;
        if (!arr || !arr.length) {
          return;
        }
        if (!ignore) { //we might want the extra line
          while (this.Utils.in_array(arr[arr.length-1], this.Utils.whitespace)) {
            arr.pop();
          }
        }
        arr.push('\n');
        for (var i=0; i<this.indent_level; i++) {
          arr.push(this.indent_string);
        }
      }

      this.print_token = function (text) {
        this.output.push(text);
      }

      this.indent = function () {
        this.indent_level++;
      }

      this.unindent = function () {
        if (this.indent_level > 0) {
          this.indent_level--;
        }
      }
    }
    return this;
  }

  /*_____________________--------------------_____________________*/

  multi_parser = new Parser(); //wrapping functions Parser
  multi_parser.printer(html_source, indent_character, indent_size, max_char, brace_style); //initialize starting values

  while (true) {
      var t = multi_parser.get_token();
      multi_parser.token_text = t[0];
      multi_parser.token_type = t[1];

    if (multi_parser.token_type === 'TK_EOF') {
      break;
    }

    switch (multi_parser.token_type) {
      case 'TK_TAG_START':
        multi_parser.print_newline(false, multi_parser.output);
        multi_parser.print_token(multi_parser.token_text);
        multi_parser.indent();
        multi_parser.current_mode = 'CONTENT';
        break;
      case 'TK_TAG_STYLE':
      case 'TK_TAG_SCRIPT':
        multi_parser.print_newline(false, multi_parser.output);
        multi_parser.print_token(multi_parser.token_text);
        multi_parser.current_mode = 'CONTENT';
        break;
      case 'TK_TAG_END':
        //Print new line only if the tag has no content and has child
        if (multi_parser.last_token === 'TK_CONTENT' && multi_parser.last_text === '') {
            var tag_name = multi_parser.token_text.match(/\w+/)[0];
            var tag_extracted_from_last_output = multi_parser.output[multi_parser.output.length -1].match(/<\s*(\w+)/);
            if (tag_extracted_from_last_output === null || tag_extracted_from_last_output[1] !== tag_name)
                multi_parser.print_newline(true, multi_parser.output);
        }
        multi_parser.print_token(multi_parser.token_text);
        multi_parser.current_mode = 'CONTENT';
        break;
      case 'TK_TAG_SINGLE':
        multi_parser.print_newline(false, multi_parser.output);
        multi_parser.print_token(multi_parser.token_text);
        multi_parser.current_mode = 'CONTENT';
        break;
      case 'TK_CONTENT':
        if (multi_parser.token_text !== '') {
          multi_parser.print_token(multi_parser.token_text);
        }
        multi_parser.current_mode = 'TAG';
        break;
      case 'TK_STYLE':
      case 'TK_SCRIPT':
        if (multi_parser.token_text !== '') {
          multi_parser.output.push('\n');
          var text = multi_parser.token_text;
          if (multi_parser.token_type == 'TK_SCRIPT') {
            var _beautifier = typeof js_beautify == 'function' && js_beautify;
          } else if (multi_parser.token_type == 'TK_STYLE') {
            var _beautifier = typeof css_beautify == 'function' && css_beautify;
          }

          if (options.indent_scripts == "keep") {
            var script_indent_level = 0;
          } else if (options.indent_scripts == "separate") {
            var script_indent_level = -multi_parser.indent_level;
          } else {
            var script_indent_level = 1;
          }

          var indentation = multi_parser.get_full_indent(script_indent_level);
          if (_beautifier) {
            // call the Beautifier if avaliable
            text = _beautifier(text.replace(/^\s*/, indentation), options);
          } else {
            // simply indent the string otherwise
            var white = text.match(/^\s*/)[0];
            var _level = white.match(/[^\n\r]*$/)[0].split(multi_parser.indent_string).length - 1;
            var reindent = multi_parser.get_full_indent(script_indent_level -_level);
            text = text.replace(/^\s*/, indentation)
                   .replace(/\r\n|\r|\n/g, '\n' + reindent)
                   .replace(/\s*$/, '');
          }
          if (text) {
            multi_parser.print_token(text);
            multi_parser.print_newline(true, multi_parser.output);
          }
        }
        multi_parser.current_mode = 'TAG';
        break;
    }
    multi_parser.last_token = multi_parser.token_type;
    multi_parser.last_text = multi_parser.token_text;
  }
  return multi_parser.output.join('');
}
;

/*jslint onevar: false, plusplus: false */
/*

 JS Beautifier
---------------


  Written by Einar Lielmanis, <einar@jsbeautifier.org>
      http://jsbeautifier.org/

  Originally converted to javascript by Vital, <vital76@gmail.com>
  "End braces on own line" added by Chris J. Shull, <chrisjshull@gmail.com>

  You are free to use this in any way you want, in case you find this useful or working for you.

  Usage:
    js_beautify(js_source_text);
    js_beautify(js_source_text, options);

  The options are:
    indent_size (default 4)          — indentation size,
    indent_char (default space)      — character to indent with,
    preserve_newlines (default true) — whether existing line breaks should be preserved,
    preserve_max_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk,

    jslint_happy (default false) — if true, then jslint-stricter mode is enforced.

            jslint_happy   !jslint_happy
            ---------------------------------
             function ()      function()

    brace_style (default "collapse") - "collapse" | "expand" | "end-expand" | "expand-strict"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.

            expand-strict: put brace on own line even in such cases:

                var a =
                {
                    a: 5,
                    b: 6
                }
            This mode may break your scripts - e.g "return { a: 1 }" will be broken into two lines, so beware.

    space_before_conditional: should the space before conditional statement be added, "if(true)" vs "if (true)"

    e.g

    js_beautify(js_source_text, {
      'indent_size': 1,
      'indent_char': '\t'
    });


*/



function js_beautify(js_source_text, options) {

    var input, output, token_text, last_type, last_text, last_last_text, last_word, flags, flag_store, indent_string;
    var whitespace, wordchar, punct, parser_pos, line_starters, digits;
    var prefix, token_type, do_block_just_closed;
    var wanted_newline, just_added_newline, n_newlines;
    var preindent_string = '';


    // Some interpreters have unexpected results with foo = baz || bar;
    options = options ? options : {};

    var opt_brace_style;

    // compatibility
    if (options.space_after_anon_function !== undefined && options.jslint_happy === undefined) {
        options.jslint_happy = options.space_after_anon_function;
    }
    if (options.braces_on_own_line !== undefined) { //graceful handling of deprecated option
        opt_brace_style = options.braces_on_own_line ? "expand" : "collapse";
    }
    opt_brace_style = options.brace_style ? options.brace_style : (opt_brace_style ? opt_brace_style : "collapse");


    var opt_indent_size = options.indent_size ? options.indent_size : 4;
    var opt_indent_char = options.indent_char ? options.indent_char : ' ';
    var opt_preserve_newlines = typeof options.preserve_newlines === 'undefined' ? true : options.preserve_newlines;
    var opt_max_preserve_newlines = typeof options.max_preserve_newlines === 'undefined' ? false : options.max_preserve_newlines;
    var opt_jslint_happy = options.jslint_happy === 'undefined' ? false : options.jslint_happy;
    var opt_keep_array_indentation = typeof options.keep_array_indentation === 'undefined' ? false : options.keep_array_indentation;
    var opt_space_before_conditional = typeof options.space_before_conditional === 'undefined' ? true : options.space_before_conditional;
    var opt_indent_case = typeof options.indent_case === 'undefined' ? false : options.indent_case;

    just_added_newline = false;

    // cache the source's length.
    var input_length = js_source_text.length;

    function trim_output(eat_newlines) {
        eat_newlines = typeof eat_newlines === 'undefined' ? false : eat_newlines;
        while (output.length && (output[output.length - 1] === ' '
            || output[output.length - 1] === indent_string
            || output[output.length - 1] === preindent_string
            || (eat_newlines && (output[output.length - 1] === '\n' || output[output.length - 1] === '\r')))) {
            output.pop();
        }
    }

    function trim(s) {
        return s.replace(/^\s\s*|\s\s*$/, '');
    }

    function force_newline()
    {
        var old_keep_array_indentation = opt_keep_array_indentation;
        opt_keep_array_indentation = false;
        print_newline()
        opt_keep_array_indentation = old_keep_array_indentation;
    }

    function print_newline(ignore_repeated) {

        flags.eat_next_space = false;
        if (opt_keep_array_indentation && is_array(flags.mode)) {
            return;
        }

        ignore_repeated = typeof ignore_repeated === 'undefined' ? true : ignore_repeated;

        flags.if_line = false;
        trim_output();

        if (!output.length) {
            return; // no newline on start of file
        }

        if (output[output.length - 1] !== "\n" || !ignore_repeated) {
            just_added_newline = true;
            output.push("\n");
        }
        if (preindent_string) {
            output.push(preindent_string);
        }
        for (var i = 0; i < flags.indentation_level; i += 1) {
            output.push(indent_string);
        }
        if (flags.var_line && flags.var_line_reindented) {
            output.push(indent_string); // skip space-stuffing, if indenting with a tab
        }
        if (flags.case_body) {
          output.push(indent_string);
        }
    }



    function print_single_space() {
        if (flags.eat_next_space) {
            flags.eat_next_space = false;
            return;
        }
        var last_output = ' ';
        if (output.length) {
            last_output = output[output.length - 1];
        }
        if (last_output !== ' ' && last_output !== '\n' && last_output !== indent_string) { // prevent occassional duplicate space
            output.push(' ');
        }
    }


    function print_token() {
        just_added_newline = false;
        flags.eat_next_space = false;
        output.push(token_text);
    }

    function indent() {
        flags.indentation_level += 1;
    }


    function remove_indent() {
        if (output.length && output[output.length - 1] === indent_string) {
            output.pop();
        }
    }

    function set_mode(mode) {
        if (flags) {
            flag_store.push(flags);
        }
        flags = {
            previous_mode: flags ? flags.mode : 'BLOCK',
            mode: mode,
            var_line: false,
            var_line_tainted: false,
            var_line_reindented: false,
            in_html_comment: false,
            if_line: false,
            in_case: false,
            case_body: false,
            eat_next_space: false,
            indentation_baseline: -1,
            indentation_level: (flags ? flags.indentation_level + (flags.case_body?1:0) + ((flags.var_line && flags.var_line_reindented) ? 1 : 0) : 0),
            ternary_depth: 0
        };
    }

    function is_array(mode) {
        return mode === '[EXPRESSION]' || mode === '[INDENTED-EXPRESSION]';
    }

    function is_expression(mode) {
        return mode === '[EXPRESSION]' || mode === '[INDENTED-EXPRESSION]' || mode === '(EXPRESSION)';
    }

    function restore_mode() {
        do_block_just_closed = flags.mode === 'DO_BLOCK';
        if (flag_store.length > 0) {
            flags = flag_store.pop();
        }
    }

    function all_lines_start_with(lines, c) {
        for (var i = 0; i < lines.length; i++) {
            if (trim(lines[i])[0] != c) {
                return false;
            }
        }
        return true;
    }

    function in_array(what, arr) {
        for (var i = 0; i < arr.length; i += 1) {
            if (arr[i] === what) {
                return true;
            }
        }
        return false;
    }

    function look_up(exclude) {
        var local_pos = parser_pos;
        var c = input.charAt(local_pos);
        while (in_array(c, whitespace) && c != exclude) {
            local_pos++;
            if (local_pos >= input_length) return 0;
            c = input.charAt(local_pos);
        }
        return c;
    }

    function get_next_token() {
        n_newlines = 0;

        if (parser_pos >= input_length) {
            return ['', 'TK_EOF'];
        }

        wanted_newline = false;

        var c = input.charAt(parser_pos);
        parser_pos += 1;


        var keep_whitespace = opt_keep_array_indentation && is_array(flags.mode);

        if (keep_whitespace) {

            //
            // slight mess to allow nice preservation of array indentation and reindent that correctly
            // first time when we get to the arrays:
            // var a = [
            // ....'something'
            // we make note of whitespace_count = 4 into flags.indentation_baseline
            // so we know that 4 whitespaces in original source match indent_level of reindented source
            //
            // and afterwards, when we get to
            //    'something,
            // .......'something else'
            // we know that this should be indented to indent_level + (7 - indentation_baseline) spaces
            //
            var whitespace_count = 0;

            while (in_array(c, whitespace)) {

                if (c === "\n") {
                    trim_output();
                    output.push("\n");
                    just_added_newline = true;
                    whitespace_count = 0;
                } else {
                    if (c === '\t') {
                        whitespace_count += 4;
                    } else if (c === '\r') {
                        // nothing
                    } else {
                        whitespace_count += 1;
                    }
                }

                if (parser_pos >= input_length) {
                    return ['', 'TK_EOF'];
                }

                c = input.charAt(parser_pos);
                parser_pos += 1;

            }
            if (flags.indentation_baseline === -1) {
                flags.indentation_baseline = whitespace_count;
            }

            if (just_added_newline) {
                var i;
                for (i = 0; i < flags.indentation_level + 1; i += 1) {
                    output.push(indent_string);
                }
                if (flags.indentation_baseline !== -1) {
                    for (i = 0; i < whitespace_count - flags.indentation_baseline; i++) {
                        output.push(' ');
                    }
                }
            }

        } else {
            while (in_array(c, whitespace)) {

                if (c === "\n") {
                    n_newlines += ( (opt_max_preserve_newlines) ? (n_newlines <= opt_max_preserve_newlines) ? 1: 0: 1 );
                }


                if (parser_pos >= input_length) {
                    return ['', 'TK_EOF'];
                }

                c = input.charAt(parser_pos);
                parser_pos += 1;

            }

            if (opt_preserve_newlines) {
                if (n_newlines > 1) {
                    for (i = 0; i < n_newlines; i += 1) {
                        print_newline(i === 0);
                        just_added_newline = true;
                    }
                }
            }
            wanted_newline = n_newlines > 0;
        }


        if (in_array(c, wordchar)) {
            if (parser_pos < input_length) {
                while (in_array(input.charAt(parser_pos), wordchar)) {
                    c += input.charAt(parser_pos);
                    parser_pos += 1;
                    if (parser_pos === input_length) {
                        break;
                    }
                }
            }

            // small and surprisingly unugly hack for 1E-10 representation
            if (parser_pos !== input_length && c.match(/^[0-9]+[Ee]$/) && (input.charAt(parser_pos) === '-' || input.charAt(parser_pos) === '+')) {

                var sign = input.charAt(parser_pos);
                parser_pos += 1;

                var t = get_next_token(parser_pos);
                c += sign + t[0];
                return [c, 'TK_WORD'];
            }

            if (c === 'in') { // hack for 'in' operator
                return [c, 'TK_OPERATOR'];
            }
            if (wanted_newline && last_type !== 'TK_OPERATOR'
                && last_type !== 'TK_EQUALS'
                && !flags.if_line && (opt_preserve_newlines || last_text !== 'var')) {
                print_newline();
            }
            return [c, 'TK_WORD'];
        }

        if (c === '(' || c === '[') {
            return [c, 'TK_START_EXPR'];
        }

        if (c === ')' || c === ']') {
            return [c, 'TK_END_EXPR'];
        }

        if (c === '{') {
            return [c, 'TK_START_BLOCK'];
        }

        if (c === '}') {
            return [c, 'TK_END_BLOCK'];
        }

        if (c === ';') {
            return [c, 'TK_SEMICOLON'];
        }

        if (c === '/') {
            var comment = '';
            // peek for comment /* ... */
            var inline_comment = true;
            if (input.charAt(parser_pos) === '*') {
                parser_pos += 1;
                if (parser_pos < input_length) {
                    while (! (input.charAt(parser_pos) === '*' && input.charAt(parser_pos + 1) && input.charAt(parser_pos + 1) === '/') && parser_pos < input_length) {
                        c = input.charAt(parser_pos);
                        comment += c;
                        if (c === '\x0d' || c === '\x0a') {
                            inline_comment = false;
                        }
                        parser_pos += 1;
                        if (parser_pos >= input_length) {
                            break;
                        }
                    }
                }
                parser_pos += 2;
                if (inline_comment) {
                    return ['/*' + comment + '*/', 'TK_INLINE_COMMENT'];
                } else {
                    return ['/*' + comment + '*/', 'TK_BLOCK_COMMENT'];
                }
            }
            // peek for comment // ...
            if (input.charAt(parser_pos) === '/') {
                comment = c;
                while (input.charAt(parser_pos) !== '\r' && input.charAt(parser_pos) !== '\n') {
                    comment += input.charAt(parser_pos);
                    parser_pos += 1;
                    if (parser_pos >= input_length) {
                        break;
                    }
                }
                parser_pos += 1;
                if (wanted_newline) {
                    print_newline();
                }
                return [comment, 'TK_COMMENT'];
            }

        }

        if (c === "'" || // string
        c === '"' || // string
        (c === '/' &&
            ((last_type === 'TK_WORD' && in_array(last_text, ['return', 'do'])) ||
                (last_type === 'TK_COMMENT' || last_type === 'TK_START_EXPR' || last_type === 'TK_START_BLOCK' || last_type === 'TK_END_BLOCK' || last_type === 'TK_OPERATOR' || last_type === 'TK_EQUALS' || last_type === 'TK_EOF' || last_type === 'TK_SEMICOLON')))) { // regexp
            var sep = c;
            var esc = false;
            var resulting_string = c;

            if (parser_pos < input_length) {
                if (sep === '/') {
                    //
                    // handle regexp separately...
                    //
                    var in_char_class = false;
                    while (esc || in_char_class || input.charAt(parser_pos) !== sep) {
                        resulting_string += input.charAt(parser_pos);
                        if (!esc) {
                            esc = input.charAt(parser_pos) === '\\';
                            if (input.charAt(parser_pos) === '[') {
                                in_char_class = true;
                            } else if (input.charAt(parser_pos) === ']') {
                                in_char_class = false;
                            }
                        } else {
                            esc = false;
                        }
                        parser_pos += 1;
                        if (parser_pos >= input_length) {
                            // incomplete string/rexp when end-of-file reached.
                            // bail out with what had been received so far.
                            return [resulting_string, 'TK_STRING'];
                        }
                    }

                } else {
                    //
                    // and handle string also separately
                    //
                    while (esc || input.charAt(parser_pos) !== sep) {
                        resulting_string += input.charAt(parser_pos);
                        if (!esc) {
                            esc = input.charAt(parser_pos) === '\\';
                        } else {
                            esc = false;
                        }
                        parser_pos += 1;
                        if (parser_pos >= input_length) {
                            // incomplete string/rexp when end-of-file reached.
                            // bail out with what had been received so far.
                            return [resulting_string, 'TK_STRING'];
                        }
                    }
                }



            }

            parser_pos += 1;

            resulting_string += sep;

            if (sep === '/') {
                // regexps may have modifiers /regexp/MOD , so fetch those, too
                while (parser_pos < input_length && in_array(input.charAt(parser_pos), wordchar)) {
                    resulting_string += input.charAt(parser_pos);
                    parser_pos += 1;
                }
            }
            return [resulting_string, 'TK_STRING'];
        }

        if (c === '#') {


            if (output.length === 0 && input.charAt(parser_pos) === '!') {
                // shebang
                resulting_string = c;
                while (parser_pos < input_length && c != '\n') {
                    c = input.charAt(parser_pos);
                    resulting_string += c;
                    parser_pos += 1;
                }
                output.push(trim(resulting_string) + '\n');
                print_newline();
                return get_next_token();
            }



            // Spidermonkey-specific sharp variables for circular references
            // https://developer.mozilla.org/En/Sharp_variables_in_JavaScript
            // http://mxr.mozilla.org/mozilla-central/source/js/src/jsscan.cpp around line 1935
            var sharp = '#';
            if (parser_pos < input_length && in_array(input.charAt(parser_pos), digits)) {
                do {
                    c = input.charAt(parser_pos);
                    sharp += c;
                    parser_pos += 1;
                } while (parser_pos < input_length && c !== '#' && c !== '=');
                if (c === '#') {
                    //
                } else if (input.charAt(parser_pos) === '[' && input.charAt(parser_pos + 1) === ']') {
                    sharp += '[]';
                    parser_pos += 2;
                } else if (input.charAt(parser_pos) === '{' && input.charAt(parser_pos + 1) === '}') {
                    sharp += '{}';
                    parser_pos += 2;
                }
                return [sharp, 'TK_WORD'];
            }
        }

        if (c === '<' && input.substring(parser_pos - 1, parser_pos + 3) === '<!--') {
            parser_pos += 3;
            flags.in_html_comment = true;
            return ['<!--', 'TK_COMMENT'];
        }

        if (c === '-' && flags.in_html_comment && input.substring(parser_pos - 1, parser_pos + 2) === '-->') {
            flags.in_html_comment = false;
            parser_pos += 2;
            if (wanted_newline) {
                print_newline();
            }
            return ['-->', 'TK_COMMENT'];
        }

        if (in_array(c, punct)) {
            while (parser_pos < input_length && in_array(c + input.charAt(parser_pos), punct)) {
                c += input.charAt(parser_pos);
                parser_pos += 1;
                if (parser_pos >= input_length) {
                    break;
                }
            }

            if (c === '=') {
                return [c, 'TK_EQUALS'];
            } else {
                return [c, 'TK_OPERATOR'];
            }
        }

        return [c, 'TK_UNKNOWN'];
    }

    //----------------------------------
    indent_string = '';
    while (opt_indent_size > 0) {
        indent_string += opt_indent_char;
        opt_indent_size -= 1;
    }

    while (js_source_text && (js_source_text[0] === ' ' || js_source_text[0] === '\t')) {
        preindent_string += js_source_text[0];
        js_source_text = js_source_text.substring(1);
    }
    input = js_source_text;

    last_word = ''; // last 'TK_WORD' passed
    last_type = 'TK_START_EXPR'; // last token type
    last_text = ''; // last token text
    last_last_text = ''; // pre-last token text
    output = [];

    do_block_just_closed = false;

    whitespace = "\n\r\t ".split('');
    wordchar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$'.split('');
    digits = '0123456789'.split('');

    punct = '+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! !! , : ? ^ ^= |= ::';
    punct += ' <%= <% %> <?= <? ?>'; // try to be a good boy and try not to break the markup language identifiers
    punct = punct.split(' ');

    // words which should always start on new line.
    line_starters = 'continue,try,throw,return,var,if,switch,case,default,for,while,break,function'.split(',');

    // states showing if we are currently in expression (i.e. "if" case) - 'EXPRESSION', or in usual block (like, procedure), 'BLOCK'.
    // some formatting depends on that.
    flag_store = [];
    set_mode('BLOCK');

    parser_pos = 0;
    while (true) {
        var t = get_next_token(parser_pos);
        token_text = t[0];
        token_type = t[1];
        if (token_type === 'TK_EOF') {
            break;
        }

        switch (token_type) {

        case 'TK_START_EXPR':

            if (token_text === '[') {

                if (last_type === 'TK_WORD' || last_text === ')') {
                    // this is array index specifier, break immediately
                    // a[x], fn()[x]
                    if (in_array(last_text, line_starters)) {
                        print_single_space();
                    }
                    set_mode('(EXPRESSION)');
                    print_token();
                    break;
                }

                if (flags.mode === '[EXPRESSION]' || flags.mode === '[INDENTED-EXPRESSION]') {
                    if (last_last_text === ']' && last_text === ',') {
                        // ], [ goes to new line
                        if (flags.mode === '[EXPRESSION]') {
                            flags.mode = '[INDENTED-EXPRESSION]';
                            if (!opt_keep_array_indentation) {
                                indent();
                            }
                        }
                        set_mode('[EXPRESSION]');
                        if (!opt_keep_array_indentation) {
                            print_newline();
                        }
                    } else if (last_text === '[') {
                        if (flags.mode === '[EXPRESSION]') {
                            flags.mode = '[INDENTED-EXPRESSION]';
                            if (!opt_keep_array_indentation) {
                                indent();
                            }
                        }
                        set_mode('[EXPRESSION]');

                        if (!opt_keep_array_indentation) {
                            print_newline();
                        }
                    } else {
                        set_mode('[EXPRESSION]');
                    }
                } else {
                    set_mode('[EXPRESSION]');
                }



            } else {
                set_mode('(EXPRESSION)');
            }

            if (last_text === ';' || last_type === 'TK_START_BLOCK') {
                print_newline();
            } else if (last_type === 'TK_END_EXPR' || last_type === 'TK_START_EXPR' || last_type === 'TK_END_BLOCK' || last_text === '.') {
                // do nothing on (( and )( and ][ and ]( and .(
            } else if (last_type !== 'TK_WORD' && last_type !== 'TK_OPERATOR') {
                print_single_space();
            } else if (last_word === 'function' || last_word === 'typeof') {
                // function() vs function ()
                if (opt_jslint_happy) {
                    print_single_space();
                }
            } else if (in_array(last_text, line_starters) || last_text === 'catch') {
                if (opt_space_before_conditional) {
                    print_single_space();
                }
            }
            print_token();

            break;

        case 'TK_END_EXPR':
            if (token_text === ']') {
                if (opt_keep_array_indentation) {
                    if (last_text === '}') {
                        // trim_output();
                        // print_newline(true);
                        remove_indent();
                        print_token();
                        restore_mode();
                        break;
                    }
                } else {
                    if (flags.mode === '[INDENTED-EXPRESSION]') {
                        if (last_text === ']') {
                            restore_mode();
                            print_newline();
                            print_token();
                            break;
                        }
                    }
                }
            }
            restore_mode();
            print_token();
            break;

        case 'TK_START_BLOCK':

            if (last_word === 'do') {
                set_mode('DO_BLOCK');
            } else {
                set_mode('BLOCK');
            }
            if (opt_brace_style=="expand" || opt_brace_style=="expand-strict") {
                var empty_braces = false;
                if (opt_brace_style == "expand-strict")
                {
                    empty_braces = (look_up() == '}');
                    if (!empty_braces) {
                        print_newline(true);
                    }
                } else {
                    if (last_type !== 'TK_OPERATOR') {
                        if (last_text === 'return' || last_text === '=') {
                            print_single_space();
                        } else {
                            print_newline(true);
                        }
                    }
                }
                print_token();
                if (!empty_braces) indent();
            } else {
                if (last_type !== 'TK_OPERATOR' && last_type !== 'TK_START_EXPR') {
                    if (last_type === 'TK_START_BLOCK') {
                        print_newline();
                    } else {
                        print_single_space();
                    }
                } else {
                    // if TK_OPERATOR or TK_START_EXPR
                    if (is_array(flags.previous_mode) && last_text === ',') {
                        if (last_last_text === '}') {
                            // }, { in array context
                            print_single_space();
                        } else {
                            print_newline(); // [a, b, c, {
                        }
                    }
                }
                indent();
                print_token();
            }

            break;

        case 'TK_END_BLOCK':
            restore_mode();
            if (opt_brace_style=="expand" || opt_brace_style == "expand-strict") {
                if (last_text !== '{') {
                    print_newline();
                }
                print_token();
            } else {
                if (last_type === 'TK_START_BLOCK') {
                    // nothing
                    if (just_added_newline) {
                        remove_indent();
                    } else {
                        // {}
                        trim_output();
                    }
                } else {
                    if (is_array(flags.mode) && opt_keep_array_indentation) {
                        // we REALLY need a newline here, but newliner would skip that
                        opt_keep_array_indentation = false;
                        print_newline();
                        opt_keep_array_indentation = true;

                    } else {
                        print_newline();
                    }
                }
                print_token();
            }
            break;

        case 'TK_WORD':

            // no, it's not you. even I have problems understanding how this works
            // and what does what.
            if (do_block_just_closed) {
                // do {} ## while ()
                print_single_space();
                print_token();
                print_single_space();
                do_block_just_closed = false;
                break;
            }

            if (token_text === 'function') {
                if (flags.var_line) {
                    flags.var_line_reindented = true;
                }
                if ((just_added_newline || last_text === ';') && last_text !== '{'
                && last_type != 'TK_BLOCK_COMMENT' && last_type != 'TK_COMMENT') {
                    // make sure there is a nice clean space of at least one blank line
                    // before a new function definition
                    n_newlines = just_added_newline ? n_newlines : 0;
                    if ( ! opt_preserve_newlines) {
                        n_newlines = 1;
                    }

                    for (var i = 0; i < 2 - n_newlines; i++) {
                        print_newline(false);
                    }
                }
            }

            if (token_text === 'case' || token_text === 'default') {
                if (last_text === ':' || flags.case_body) {
                    // switch cases following one another
                    remove_indent();
                } else {
                    // case statement starts in the same line where switch
                    if (!opt_indent_case)
                        flags.indentation_level--;
                    print_newline();
                    if (!opt_indent_case)
                        flags.indentation_level++;
                }
                print_token();
                flags.in_case = true;
                flags.case_body = false;
                break;
            }

            prefix = 'NONE';

            if (last_type === 'TK_END_BLOCK') {

                if (!in_array(token_text.toLowerCase(), ['else', 'catch', 'finally'])) {
                    prefix = 'NEWLINE';
                } else {
                    if (opt_brace_style=="expand" || opt_brace_style=="end-expand" || opt_brace_style == "expand-strict") {
                        prefix = 'NEWLINE';
                    } else {
                        prefix = 'SPACE';
                        print_single_space();
                    }
                }
            } else if (last_type === 'TK_SEMICOLON' && (flags.mode === 'BLOCK' || flags.mode === 'DO_BLOCK')) {
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_SEMICOLON' && is_expression(flags.mode)) {
                prefix = 'SPACE';
            } else if (last_type === 'TK_STRING') {
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_WORD') {
                if (last_text === 'else') {
                    // eat newlines between ...else *** some_op...
                    // won't preserve extra newlines in this place (if any), but don't care that much
                    trim_output(true);
                }
                prefix = 'SPACE';
            } else if (last_type === 'TK_START_BLOCK') {
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_END_EXPR') {
                print_single_space();
                prefix = 'NEWLINE';
            }

            if (in_array(token_text, line_starters) && last_text !== ')') {
                if (last_text == 'else') {
                    prefix = 'SPACE';
                } else {
                    prefix = 'NEWLINE';
                }
            }

            if (flags.if_line && last_type === 'TK_END_EXPR') {
                flags.if_line = false;
            }
            if (in_array(token_text.toLowerCase(), ['else', 'catch', 'finally'])) {
                if (last_type !== 'TK_END_BLOCK' || opt_brace_style=="expand" || opt_brace_style=="end-expand" || opt_brace_style == "expand-strict") {
                    print_newline();
                } else {
                    trim_output(true);
                    print_single_space();
                }
            } else if (prefix === 'NEWLINE') {
                if ((last_type === 'TK_START_EXPR' || last_text === '=' || last_text === ',') && token_text === 'function') {
                    // no need to force newline on 'function': (function
                    // DONOTHING
                } else if (token_text === 'function' && last_text == 'new') {
                    print_single_space();
                } else if (last_text === 'return' || last_text === 'throw') {
                    // no newline between 'return nnn'
                    print_single_space();
                } else if (last_type !== 'TK_END_EXPR') {
                    if ((last_type !== 'TK_START_EXPR' || token_text !== 'var') && last_text !== ':') {
                        // no need to force newline on 'var': for (var x = 0...)
                        if (token_text === 'if' && last_word === 'else' && last_text !== '{') {
                            // no newline for } else if {
                            print_single_space();
                        } else {
                            flags.var_line = false;
                            flags.var_line_reindented = false;
                            print_newline();
                        }
                    }
                } else if (in_array(token_text, line_starters) && last_text != ')') {
                    flags.var_line = false;
                    flags.var_line_reindented = false;
                    print_newline();
                }
            } else if (is_array(flags.mode) && last_text === ',' && last_last_text === '}') {
                print_newline(); // }, in lists get a newline treatment
            } else if (prefix === 'SPACE') {
                print_single_space();
            }
            print_token();
            last_word = token_text;

            if (token_text === 'var') {
                flags.var_line = true;
                flags.var_line_reindented = false;
                flags.var_line_tainted = false;
            }

            if (token_text === 'if') {
                flags.if_line = true;
            }
            if (token_text === 'else') {
                flags.if_line = false;
            }

            break;

        case 'TK_SEMICOLON':

            print_token();
            flags.var_line = false;
            flags.var_line_reindented = false;
            if (flags.mode == 'OBJECT') {
                // OBJECT mode is weird and doesn't get reset too well.
                flags.mode = 'BLOCK';
            }
            break;

        case 'TK_STRING':

            if (last_type === 'TK_START_BLOCK' || last_type === 'TK_END_BLOCK' || last_type === 'TK_SEMICOLON') {
                print_newline();
            } else if (last_type === 'TK_WORD') {
                print_single_space();
            }
            print_token();
            break;

        case 'TK_EQUALS':
            if (flags.var_line) {
                // just got an '=' in a var-line, different formatting/line-breaking, etc will now be done
                flags.var_line_tainted = true;
            }
            print_single_space();
            print_token();
            print_single_space();
            break;

        case 'TK_OPERATOR':

            var space_before = true;
            var space_after = true;

            if (flags.var_line && token_text === ',' && (is_expression(flags.mode))) {
                // do not break on comma, for(var a = 1, b = 2)
                flags.var_line_tainted = false;
            }

            if (flags.var_line) {
                if (token_text === ',') {
                    if (flags.var_line_tainted) {
                        print_token();
                        flags.var_line_reindented = true;
                        flags.var_line_tainted = false;
                        print_newline();
                        break;
                    } else {
                        flags.var_line_tainted = false;
                    }
                // } else if (token_text === ':') {
                    // hmm, when does this happen? tests don't catch this
                    // flags.var_line = false;
                }
            }

            if (last_text === 'return' || last_text === 'throw') {
                // "return" had a special handling in TK_WORD. Now we need to return the favor
                print_single_space();
                print_token();
                break;
            }

            if (token_text === ':' && flags.in_case) {
                if (opt_indent_case)
                    flags.case_body = true;
                print_token(); // colon really asks for separate treatment
                print_newline();
                flags.in_case = false;
                break;
            }

            if (token_text === '::') {
                // no spaces around exotic namespacing syntax operator
                print_token();
                break;
            }

            if (token_text === ',') {
                if (flags.var_line) {
                    if (flags.var_line_tainted) {
                        print_token();
                        print_newline();
                        flags.var_line_tainted = false;
                    } else {
                        print_token();
                        print_single_space();
                    }
                } else if (last_type === 'TK_END_BLOCK' && flags.mode !== "(EXPRESSION)") {
                    print_token();
                    if (flags.mode === 'OBJECT' && last_text === '}') {
                        print_newline();
                    } else {
                        print_single_space();
                    }
                } else {
                    if (flags.mode === 'OBJECT') {
                        print_token();
                        print_newline();
                    } else {
                        // EXPR or DO_BLOCK
                        print_token();
                        print_single_space();
                    }
                }
                break;
            // } else if (in_array(token_text, ['--', '++', '!']) || (in_array(token_text, ['-', '+']) && (in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS']) || in_array(last_text, line_starters) || in_array(last_text, ['==', '!=', '+=', '-=', '*=', '/=', '+', '-'])))) {
            } else if (in_array(token_text, ['--', '++', '!']) || (in_array(token_text, ['-', '+']) && (in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS', 'TK_OPERATOR']) || in_array(last_text, line_starters)))) {
                // unary operators (and binary +/- pretending to be unary) special cases

                space_before = false;
                space_after = false;

                if (last_text === ';' && is_expression(flags.mode)) {
                    // for (;; ++i)
                    //        ^^^
                    space_before = true;
                }
                if (last_type === 'TK_WORD' && in_array(last_text, line_starters)) {
                    space_before = true;
                }

                if (flags.mode === 'BLOCK' && (last_text === '{' || last_text === ';')) {
                    // { foo; --i }
                    // foo(); --bar;
                    print_newline();
                }
            } else if (token_text === '.') {
                // decimal digits or object.property
                space_before = false;

            } else if (token_text === ':') {
                if (flags.ternary_depth == 0) {
                    flags.mode = 'OBJECT';
                    space_before = false;
                } else {
                    flags.ternary_depth -= 1;
                }
            } else if (token_text === '?') {
                flags.ternary_depth += 1;
            }
            if (space_before) {
                print_single_space();
            }

            print_token();

            if (space_after) {
                print_single_space();
            }

            if (token_text === '!') {
                // flags.eat_next_space = true;
            }

            break;

        case 'TK_BLOCK_COMMENT':

            var lines = token_text.split(/\x0a|\x0d\x0a/);

            if (all_lines_start_with(lines.slice(1), '*')) {
                // javadoc: reformat and reindent
                print_newline();
                output.push(lines[0]);
                for (i = 1; i < lines.length; i++) {
                    print_newline();
                    output.push(' ');
                    output.push(trim(lines[i]));
                }

            } else {

                // simple block comment: leave intact
                if (lines.length > 1) {
                    // multiline comment block starts with a new line
                    print_newline();
                    trim_output();
                } else {
                    // single-line /* comment */ stays where it is
                    print_single_space();

                }

                for (i = 0; i < lines.length; i++) {
                    output.push(lines[i]);
                    output.push('\n');
                }

            }
            if(look_up('\n') != '\n')
                print_newline();
            break;

        case 'TK_INLINE_COMMENT':

            print_single_space();
            print_token();
            if (is_expression(flags.mode)) {
                print_single_space();
            } else {
                force_newline();
            }
            break;

        case 'TK_COMMENT':

            // print_newline();
            if (wanted_newline) {
                print_newline();
            } else {
                print_single_space();
            }
            print_token();
            if(look_up('\n') != '\n')
                force_newline();
            break;

        case 'TK_UNKNOWN':
            if (last_text === 'return' || last_text === 'throw') {
                print_single_space();
            }
            print_token();
            break;
        }

        last_last_text = last_text;
        last_type = token_type;
        last_text = token_text;
    }

    var sweet_code = preindent_string + output.join('').replace(/[\n ]+$/, '');
    return sweet_code;

}

// Add support for CommonJS. Just put this file somewhere on your require.paths
// and you will be able to `var js_beautify = require("beautify").js_beautify`.
if (typeof exports !== "undefined")
    exports.js_beautify = js_beautify;
;

/* ===================================================
 * bootstrap-transition.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  $(function () {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT DATA-API
  * ============== */

  $(function () {
    $('body').on('click.alert.data-api', dismiss, Alert.prototype.close)
  })

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.parent('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON DATA-API
  * =============== */

  $(function () {
    $('body').on('click.button.data-api', '[data-toggle^=button]', function ( e ) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      $btn.button('toggle')
    })
  })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.options = options
    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , to: function (pos) {
      var $active = this.$element.find('.item.active')
        , children = $active.parent().children()
        , activePos = children.index($active)
        , that = this

      if (pos > (children.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activePos == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle()
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e = $.Event('slide', {
            relatedTarget: $next[0]
          })

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      if ($next.hasClass('active')) return

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(function () {
    $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
      $target.carousel(options)
      e.preventDefault()
    })
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSIBLE PLUGIN DEFINITION
  * ============================== */

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = typeof option == 'object' && option
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSIBLE DATA-API
  * ==================== */

  $(function () {
    $('body').on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
      var $this = $(this), href
        , target = $this.attr('data-target')
          || e.preventDefault()
          || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
        , option = $(target).data('collapse') ? 'toggle' : $this.data()
      $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
      $(target).collapse(option)
    })
  })

}(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        $parent.toggleClass('open')
        $this.focus()
      }

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) return $this.click()

      $items = $('[role=menu] li:not(.divider) a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    getParent($(toggle))
      .removeClass('open')
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)
    $parent.length || ($parent = $this.parent())

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(function () {
    $('html')
      .on('click.dropdown.data-api touchstart.dropdown.data-api', clearMenus)
    $('body')
      .on('click.dropdown touchstart.dropdown.data-api', '.dropdown', function (e) { e.stopPropagation() })
      .on('click.dropdown.data-api touchstart.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
      .on('keydown.dropdown.data-api touchstart.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)
  })

}(window.jQuery);/* =========================================================
 * bootstrap-modal.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)
            .focus()

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
            that.$element.trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        $('body').removeClass('modal-open')

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function (that) {
        this.$element
          .hide()
          .trigger('hidden')

        this.backdrop()
      }

    , removeBackdrop: function () {
        this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          if (this.options.backdrop != 'static') {
            this.$backdrop.click($.proxy(this.hide, this))
          }

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, $.proxy(this.removeBackdrop, this)) :
            this.removeBackdrop()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL DATA-API
  * ============== */

  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      var $this = $(this)
        , href = $this.attr('href')
        , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

      e.preventDefault()

      $target
        .modal(option)
        .one('hide', function () {
          $this.focus()
        })
    })
  })

}(window.jQuery);/* ===========================================================
 * bootstrap-tooltip.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (this.options.trigger != 'manual') {
        eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  , html: true
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content > *')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  })

}(window.jQuery);/* =============================================================
 * bootstrap-scrollspy.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top, href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = !~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /*   TYPEAHEAD DATA-API
  * ================== */

  $(function () {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      e.preventDefault()
      $this.typeahead($this.data())
    })
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window).on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);;


var jade = (function(exports){
/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  } 
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj){
  var buf = []
    , terse = obj.terse;
  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;
  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];
      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else {
        buf.push(key + '="' + exports.escape(val) + '"');
      }
    }
  }
  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = require('fs').readFileSync(filename, 'utf8')
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context); 

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno 
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

  return exports;

})({});;

/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);
;

/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

(function(jQuery){
	
	jQuery.hotkeys = {
		version: "0.8",

		specialKeys: {
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
		},
	
		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
			".": ">",  "/": "?",  "\\": "|"
		}
	};

	function keyHandler( handleObj ) {
		// Only care when a possible input has been specified
		if ( typeof handleObj.data !== "string" ) {
			return;
		}
		
		var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" ");
	
		handleObj.handler = function( event ) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				 event.target.type === "text") ) {
				return;
			}
			
			// Keypress represents characters, not special keys
			var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				key, modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt+";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl+";
			}
			
			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta+";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift+";
			}

			if ( special ) {
				possible[ modif + special ] = true;

			} else {
				possible[ modif + character ] = true;
				possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
					possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
				}
			}

			for ( var i = 0, l = keys.length; i < l; i++ ) {
				if ( possible[ keys[i] ] ) {
					return origHandler.apply( this, arguments );
				}
			}
		};
	}

	jQuery.each([ "keydown", "keyup", "keypress" ], function() {
		jQuery.event.special[ this ] = { add: keyHandler };
	});

})( jQuery );;

/*
* This function is a plugin for jstree search method. It allows the search method
* to make a multiple word search in jstree. The search string has to separate each
* word by an underscore.
* input:
*   a: represent the a balise in each node from jstree (contains node title)
*   i: no idea (I only saw two values: 0 and 1)
*   m: an array which the last term is the search string
* output: return true if "a" contains one word from the search string 
*/


(function ($) {

    $.expr[':'].jstree_contains_multi = function(a,i,m){
        
        var word, words = [];
        //var searchFor = m[3].toLowerCase().replace(/^\s+/g,'').replace(/\s+$/g,'');
        var searchFor = m[3].toLowerCase().replace(/^_+/g,'').replace(/_+$/g,'');
        //if(searchFor.indexOf(' ') >= 0) {
        //    words = searchFor.split(' ');
        if(searchFor.indexOf('_') >= 0) {
            words = searchFor.split('_');
        }
        else {
            words = [searchFor];
        }
        for (var i=0; i < words.length; i++) {
            word = words[i];
            if((a.textContent || a.innerText || "").toLowerCase().indexOf(word) >= 0) {
                return true;
           }
        }
        return false;

    };

    $.expr[':'].jstree_contains = function(a,i,m){

        return (a.textContent || a.innerText || "").toLowerCase().indexOf(m[3].toLowerCase())>=0;

    };
})(jQuery);
;

/**
 * jQuery TextExt Plugin
 * http://textextjs.com
 *
 * @version 1.3.0
 * @copyright Copyright (C) 2011 Alex Gorbatchev. All rights reserved.
 * @license MIT License
 */
;(function(a,b){function c(){}function d(){}function e(){}function x(a,b){typeof b=="string"&&(b=b.split("."));var c=b.join(".").replace(/\.(\w)/g,function(a,b){return b.toUpperCase()}),d=b.shift(),e;return typeof (e=a[c])!=h?e=e:typeof (e=a[d])!=h&&b.length>0&&(e=x(e,b)),e}function y(){function e(a,d){c.bind(a,function(){return d.apply(b,arguments)})}var a=g.apply(arguments),b=this,c=a.length===1?b:a.shift(),d;a=a[0]||{};for(d in a)e(d,a[d])}function z(a,b){return{input:a,form:b}}var f=(JSON||{}).stringify,g=Array.prototype.slice,h="undefined",i="item.manager",j="plugins",k="ext",l="html.wrap",m="html.hidden",n="keys",o="preInvalidate",q="postInvalidate",r="getFormData",s="setFormData",t="setInputData",u="postInit",v="ready",w={itemManager:d,plugins:[],ext:{},html:{wrap:'<div class="text-core"><div class="text-wrap"/></div>',hidden:'<input type="hidden" />'},keys:{8:"backspace",9:"tab",13:"enter!",27:"escape!",37:"left",38:"up!",39:"right",40:"down!",46:"delete",108:"numpadEnter"}};if(!f)throw new Error("JSON.stringify() not found");p=d.prototype,p.init=function(a){},p.filter=function(a,b){var c=[],d,e;for(d=0;d<a.length;d++)e=a[d],this.itemContains(e,b)&&c.push(e);return c},p.itemContains=function(a,b){return this.itemToString(a).toLowerCase().indexOf(b.toLowerCase())==0},p.stringToItem=function(a){return a},p.itemToString=function(a){return a},p.compareItems=function(a,b){return a==b},p=c.prototype,p.init=function(b,c){var d=this,e,f,g;d._defaults=a.extend({},w),d._opts=c||{},d._plugins={},d._itemManager=f=new(d.opts(i)),b=a(b),g=a(d.opts(l)),e=a(d.opts(m)),b.wrap(g).keydown(function(a){return d.onKeyDown(a)}).keyup(function(a){return d.onKeyUp(a)}).data("textext",d),a(d).data({hiddenInput:e,wrapElement:b.parents(".text-wrap").first(),input:b}),e.attr("name",b.attr("name")),b.attr("name",null),e.insertAfter(b),a.extend(!0,f,d.opts(k+".item.manager")),a.extend(!0,d,d.opts(k+".*"),d.opts(k+".core")),d.originalWidth=b.outerWidth(),d.invalidateBounds(),f.init(d),d.initPatches(),d.initPlugins(d.opts(j),a.fn.textext.plugins),d.on({setFormData:d.onSetFormData,getFormData:d.onGetFormData,setInputData:d.onSetInputData,anyKeyUp:d.onAnyKeyUp}),d.trigger(u),d.trigger(v),d.getFormData(0)},p.initPatches=function(){var b=[],c=a.fn.textext.patches,d;for(d in c)b.push(d);this.initPlugins(b,c)},p.initPlugins=function(b,c){var d=this,e,f,g,h=[],i;typeof b=="string"&&(b=b.split(/\s*,\s*|\s+/g));for(i=0;i<b.length;i++)f=b[i],g=c[f],g&&(d._plugins[f]=g=new g,d[f]=function(a){return function(){return a}}(g),h.push(g),a.extend(!0,g,d.opts(k+".*"),d.opts(k+"."+f)));h.sort(function(a,b){return a=a.initPriority(),b=b.initPriority(),a===b?0:a<b?1:-1});for(i=0;i<h.length;i++)h[i].init(d)},p.hasPlugin=function(a){return!!this._plugins[a]},p.on=y,p.bind=function(a,b){this.input().bind(a,b)},p.trigger=function(){var a=arguments;this.input().trigger(a[0],g.call(a,1))},p.itemManager=function(){return this._itemManager},p.input=function(){return a(this).data("input")},p.opts=function(a){var b=x(this._opts,a);return typeof b=="undefined"?x(this._defaults,a):b},p.wrapElement=function(){return a(this).data("wrapElement")},p.invalidateBounds=function(){var a=this,b=a.input(),c=a.wrapElement(),d=c.parent(),e=a.originalWidth,f;a.trigger(o),f=b.outerHeight(),b.width(e),c.width(e).height(f),d.height(f),a.trigger(q)},p.focusInput=function(){this.input()[0].focus()},p.serializeData=f,p.hiddenInput=function(b){return a(this).data("hiddenInput")},p.getWeightedEventResponse=function(a,b){var c=this,d={},e=0;c.trigger(a,d,b);for(var f in d)e=Math.max(e,f);return d[e]},p.getFormData=function(a){var b=this,c=b.getWeightedEventResponse(r,a||0);b.trigger(s,c.form),b.trigger(t,c.input)},p.onAnyKeyUp=function(a,b){this.getFormData(b)},p.onSetInputData=function(a,b){this.input().val(b)},p.onSetFormData=function(a,b){var c=this;c.hiddenInput().val(c.serializeData(b))},p.onGetFormData=function(a,b){var c=this.input().val();b[0]=z(c,c)},a(["Down","Up"]).each(function(){var a=this.toString();p["onKey"+a]=function(b){var c=this,d=c.opts(n)[b.keyCode],e=!0;return d&&(e=d.substr(-1)!="!",d=d.replace("!",""),c.trigger(d+"Key"+a),a=="Up"&&c._lastKeyDown==b.keyCode&&(c._lastKeyDown=null,c.trigger(d+"KeyPress")),a=="Down"&&(c._lastKeyDown=b.keyCode)),c.trigger("anyKey"+a,b.keyCode),e}}),p=e.prototype,p.on=y,p.formDataObject=z,p.init=function(a){throw new Error("Not implemented")},p.baseInit=function(b,c){var d=this;b._defaults=a.extend(!0,b._defaults,c),d._core=b,d._timers={}},p.startTimer=function(a,b,c){var d=this;d.stopTimer(a),d._timers[a]=setTimeout(function(){delete d._timers[a],c.apply(d)},b*1e3)},p.stopTimer=function(a){clearTimeout(this._timers[a])},p.core=function(){return this._core},p.opts=function(a){return this.core().opts(a)},p.itemManager=function(){return this.core().itemManager()},p.input=function(){return this.core().input()},p.val=function(a){var b=this.input();if(typeof a===h)return b.val();b.val(a)},p.trigger=function(){var a=this.core();a.trigger.apply(a,arguments)},p.bind=function(a,b){this.core().bind(a,b)},p.initPriority=function(){return 0};var A=!1,B=a.fn.textext=function(b){var d;return!A&&(d=a.fn.textext.css)!=null&&(a("head").append("<style>"+d+"</style>"),A=!0),this.map(function(){var d=a(this);if(b==null)return d.data("textext");var e=new c;return e.init(d,b),d.data("textext",e),e.input()[0]})};B.addPlugin=function(a,b){B.plugins[a]=b,b.prototype=new B.TextExtPlugin},B.addPatch=function(a,b){B.patches[a]=b,b.prototype=new B.TextExtPlugin},B.TextExt=c,B.TextExtPlugin=e,B.ItemManager=d,B.plugins={},B.patches={}})(jQuery),function(a){function b(){}a.fn.textext.TextExtIE9Patches=b,a.fn.textext.addPatch("ie9",b);var c=b.prototype;c.init=function(a){if(navigator.userAgent.indexOf("MSIE 9")==-1)return;var b=this;a.on({postInvalidate:b.onPostInvalidate})},c.onPostInvalidate=function(){var a=this,b=a.input(),c=b.val();b.val(Math.random()),b.val(c)}}(jQuery);(function(a){function b(){}a.fn.textext.TextExtAjax=b,a.fn.textext.addPlugin("ajax",b);var c=b.prototype,d="ajax.data.callback",e="ajax.cache.results",f="ajax.loading.delay",g="ajax.loading.message",h="ajax.type.delay",i="setSuggestions",j="showDropdown",k="loading",l={ajax:{typeDelay:.5,loadingMessage:"Loading...",loadingDelay:.5,cacheResults:!1,dataCallback:null}};c.init=function(a){var b=this;b.baseInit(a,l),b.on({getSuggestions:b.onGetSuggestions}),b._suggestions=null},c.load=function(b){var c=this,e=c.opts(d)||function(a){return{q:a}},f;f=a.extend(!0,{data:e(b),success:function(a){c.onComplete(a,b)},error:function(a,c){console.error(c,b)}},c.opts("ajax")),a.ajax(f)},c.onComplete=function(a,b){var c=this,d=a;c.dontShowLoading(),c.opts(e)==1&&(c._suggestions=a,d=c.itemManager().filter(a,b)),c.trigger(i,{result:d})},c.dontShowLoading=function(){this.stopTimer(k)},c.showLoading=function(){var a=this;a.dontShowLoading(),a.startTimer(k,a.opts(f),function(){a.trigger(j,function(b){b.clearItems();var c=b.addDropdownItem(a.opts(g));c.addClass("text-loading")})})},c.onGetSuggestions=function(a,b){var c=this,d=c._suggestions,f=(b||{}).query||"";if(d&&c.opts(e)===!0)return c.onComplete(d,f);c.startTimer("ajax",c.opts(h),function(){c.showLoading(),c.load(f)})}})(jQuery);(function(a){function b(){}a.fn.textext.TextExtArrow=b,a.fn.textext.addPlugin("arrow",b);var c=b.prototype,d="html.arrow",e={html:{arrow:'<div class="text-arrow"/>'}};c.init=function(b){var c=this,f;c.baseInit(b,e),c._arrow=f=a(c.opts(d)),c.core().wrapElement().append(f),f.bind("click",function(a){c.onArrowClick(a)})},c.onArrowClick=function(a){this.trigger("toggleDropdown"),this.core().focusInput()}})(jQuery);(function(a){function b(){}a.fn.textext.TextExtAutocomplete=b,a.fn.textext.addPlugin("autocomplete",b);var c=b.prototype,d=".",e="text-selected",f=d+e,g="text-suggestion",h=d+g,i="text-label",j=d+i,k="autocomplete.enabled",l="autocomplete.dropdown.position",m="autocomplete.dropdown.maxHeight",n="autocomplete.render",o="html.dropdown",p="html.suggestion",q="hideDropdown",r="showDropdown",s="getSuggestions",t="getFormData",u="toggleDropdown",v="above",w="below",x="mousedownOnAutocomplete",y={autocomplete:{enabled:!0,dropdown:{position:w,maxHeight:"100px"}},html:{dropdown:'<div class="text-dropdown"><div class="text-list"/></div>',suggestion:'<div class="text-suggestion"><span class="text-label"/></div>'}};c.init=function(b){var c=this;c.baseInit(b,y);var d=c.input(),e;c.opts(k)===!0&&(c.on({blur:c.onBlur,anyKeyUp:c.onAnyKeyUp,deleteKeyUp:c.onAnyKeyUp,backspaceKeyPress:c.onBackspaceKeyPress,enterKeyPress:c.onEnterKeyPress,escapeKeyPress:c.onEscapeKeyPress,setSuggestions:c.onSetSuggestions,showDropdown:c.onShowDropdown,hideDropdown:c.onHideDropdown,toggleDropdown:c.onToggleDropdown,postInvalidate:c.positionDropdown,getFormData:c.onGetFormData,downKeyDown:c.onDownKeyDown,upKeyDown:c.onUpKeyDown}),e=a(c.opts(o)),e.insertAfter(d),c.on(e,{mouseover:c.onMouseOver,mousedown:c.onMouseDown,click:c.onClick}),e.css("maxHeight",c.opts(m)).addClass("text-position-"+c.opts(l)),a(c).data("container",e),a(document.body).click(function(a){c.isDropdownVisible()&&!c.withinWrapElement(a.target)&&c.trigger(q)}),c.positionDropdown())},c.containerElement=function(){return a(this).data("container")},c.onMouseOver=function(b){var c=this,d=a(b.target);d.is(h)&&(c.clearSelected(),d.addClass(e))},c.onMouseDown=function(a){this.containerElement().data(x,!0)},c.onClick=function(b){var c=this,d=a(b.target);(d.is(h)||d.is(j))&&c.trigger("enterKeyPress"),c.core().hasPlugin("tags")&&c.val("")},c.onBlur=function(a){var b=this,c=b.containerElement(),d=c.data(x)===!0;b.isDropdownVisible()&&(d?b.core().focusInput():b.trigger(q)),c.removeData(x)},c.onBackspaceKeyPress=function(a){var b=this,c=b.val().length>0;(c||b.isDropdownVisible())&&b.getSuggestions()},c.onAnyKeyUp=function(a,b){var c=this,d=c.opts("keys."+b)!=null;c.val().length>0&&!d&&c.getSuggestions()},c.onDownKeyDown=function(a){var b=this;b.isDropdownVisible()?b.toggleNextSuggestion():b.getSuggestions()},c.onUpKeyDown=function(a){this.togglePreviousSuggestion()},c.onEnterKeyPress=function(a){var b=this;b.isDropdownVisible()&&b.selectFromDropdown()},c.onEscapeKeyPress=function(a){var b=this;b.isDropdownVisible()&&b.trigger(q)},c.positionDropdown=function(){var a=this,b=a.containerElement(),c=a.opts(l),d=a.core().wrapElement().outerHeight(),e={};e[c===v?"bottom":"top"]=d+"px",b.css(e)},c.suggestionElements=function(){return this.containerElement().find(h)},c.setSelectedSuggestion=function(b){if(!b)return;var c=this,d=c.suggestionElements(),f=d.first(),h,i;c.clearSelected();for(i=0;i<d.length;i++){h=a(d[i]);if(c.itemManager().compareItems(h.data(g),b)){f=h.addClass(e);break}}f.addClass(e),c.scrollSuggestionIntoView(f)},c.selectedSuggestionElement=function(){return this.suggestionElements().filter(f).first()},c.isDropdownVisible=function(){return this.containerElement().is(":visible")===!0},c.onGetFormData=function(a,b,c){var d=this,e=d.val(),f=e,g=e;b[100]=d.formDataObject(f,g)},c.initPriority=function(){return 200},c.onHideDropdown=function(a){this.hideDropdown()},c.onToggleDropdown=function(a){var b=this;b.trigger(b.containerElement().is(":visible")?q:r)},c.onShowDropdown=function(b,c){var d=this,e=d.selectedSuggestionElement().data(g),f=d._suggestions;if(!f)return d.trigger(s);a.isFunction(c)?c(d):(d.renderSuggestions(d._suggestions),d.toggleNextSuggestion()),d.showDropdown(d.containerElement()),d.setSelectedSuggestion(e)},c.onSetSuggestions=function(a,b){var c=this,d=c._suggestions=b.result;b.showHideDropdown!==!1&&c.trigger(d===null||d.length===0?q:r)},c.getSuggestions=function(){var a=this,b=a.val();if(a._previousInputValue==b)return;b==""&&(current=null),a._previousInputValue=b,a.trigger(s,{query:b})},c.clearItems=function(){this.containerElement().find(".text-list").children().remove()},c.renderSuggestions=function(b){var c=this;c.clearItems(),a.each(b||[],function(a,b){c.addSuggestion(b)})},c.showDropdown=function(){this.containerElement().show()},c.hideDropdown=function(){var a=this,b=a.containerElement();a._previousInputValue=null,b.hide()},c.addSuggestion=function(a){var b=this,c=b.opts(n),d=b.addDropdownItem(c?c.call(b,a):b.itemManager().itemToString(a));d.data(g,a)},c.addDropdownItem=function(b){var c=this,d=c.containerElement().find(".text-list"),e=a(c.opts(p));return e.find(".text-label").html(b),d.append(e),e},c.clearSelected=function(){this.suggestionElements().removeClass(e)},c.toggleNextSuggestion=function(){var a=this,b=a.selectedSuggestionElement(),c;b.length>0?(c=b.next(),c.length>0&&b.removeClass(e)):c=a.suggestionElements().first(),c.addClass(e),a.scrollSuggestionIntoView(c)},c.togglePreviousSuggestion=function(){var a=this,b=a.selectedSuggestionElement(),c=b.prev();if(c.length==0)return;a.clearSelected(),c.addClass(e),a.scrollSuggestionIntoView(c)},c.scrollSuggestionIntoView=function(a){var b=a.outerHeight(),c=this.containerElement(),d=c.innerHeight(),e=c.scrollTop(),f=(a.position()||{}).top,g=null,h=parseInt(c.css("paddingTop"));if(f==null)return;f+b>d&&(g=f+e+b-d+h),f<0&&(g=f+e-h),g!=null&&c.scrollTop(g)},c.selectFromDropdown=function(){var a=this,b=a.selectedSuggestionElement().data(g);b&&(a.val(a.itemManager().itemToString(b)),a.core().getFormData()),a.trigger(q)},c.withinWrapElement=function(a){return this.core().wrapElement().find(a).size()>0}})(jQuery);(function(a){function b(){}a.fn.textext.TextExtFilter=b,a.fn.textext.addPlugin("filter",b);var c=b.prototype,d="filter.enabled",e="filter.items",f={filter:{enabled:!0,items:null}};c.init=function(a){var b=this;b.baseInit(a,f),b.on({getFormData:b.onGetFormData,isTagAllowed:b.onIsTagAllowed,setSuggestions:b.onSetSuggestions}),b._suggestions=null},c.onGetFormData=function(a,b,c){var d=this,e=d.val(),f=e,g="";d.core().hasPlugin("tags")||(d.isValueAllowed(f)&&(g=e),b[300]=d.formDataObject(f,g))},c.isValueAllowed=function(a){var b=this,c=b.opts("filterItems")||b._suggestions||[],e=b.itemManager(),f=!b.opts(d),g;for(g=0;g<c.length&&!f;g++)e.compareItems(a,c[g])&&(f=!0);return f},c.onIsTagAllowed=function(a,b){b.result=this.isValueAllowed(b.tag)},c.onSetSuggestions=function(a,b){this._suggestions=b.result}})(jQuery);(function(a){function b(){}a.fn.textext.TextExtFocus=b,a.fn.textext.addPlugin("focus",b);var c=b.prototype,d="html.focus",e={html:{focus:'<div class="text-focus"/>'}};c.init=function(a){var b=this;b.baseInit(a,e),b.core().wrapElement().append(b.opts(d)),b.on({blur:b.onBlur,focus:b.onFocus}),b._timeoutId=0},c.onBlur=function(a){var b=this;clearTimeout(b._timeoutId),b._timeoutId=setTimeout(function(){b.getFocus().hide()},100)},c.onFocus=function(a){var b=this;clearTimeout(b._timeoutId),b.getFocus().show()},c.getFocus=function(){return this.core().wrapElement().find(".text-focus")}})(jQuery);(function(a){function b(){}a.fn.textext.TextExtPrompt=b,a.fn.textext.addPlugin("prompt",b);var c=b.prototype,d="text-hide-prompt",e="prompt",f="html.prompt",g={prompt:"Awaiting input...",html:{prompt:'<div class="text-prompt"/>'}};c.init=function(b){var c=this,d="placeholder",h,i;c.baseInit(b,g),h=a(c.opts(f)),a(c).data("container",h),c.core().wrapElement().append(h),c.setPrompt(c.opts(e)),i=b.input().attr(d),i||(i=c.opts(e)),b.input().attr(d,""),i&&c.setPrompt(i),a.trim(c.val()).length>0&&c.hidePrompt(),c.on({blur:c.onBlur,focus:c.onFocus,postInvalidate:c.onPostInvalidate,postInit:c.onPostInit})},c.onPostInit=function(a){this.invalidateBounds()},c.onPostInvalidate=function(a){this.invalidateBounds()},c.invalidateBounds=function(){var a=this,b=a.input();a.containerElement().css({paddingLeft:b.css("paddingLeft"),paddingTop:b.css("paddingTop")})},c.onBlur=function(a){var b=this;b.startTimer("prompt",.1,function(){b.showPrompt()})},c.showPrompt=function(){var b=this,c=b.input();a.trim(b.val()).length===0&&!c.is(":focus")&&b.containerElement().removeClass(d)},c.hidePrompt=function(){this.stopTimer("prompt"),this.containerElement().addClass(d)},c.onFocus=function(a){this.hidePrompt()},c.setPrompt=function(a){this.containerElement().text(a)},c.containerElement=function(){return a(this).data("container")}})(jQuery);(function(a){function b(){}a.fn.textext.TextExtSuggestions=b,a.fn.textext.addPlugin("suggestions",b);var c=b.prototype,d="suggestions",e={suggestions:null};c.init=function(a){var b=this;b.baseInit(a,e),b.on({getSuggestions:b.onGetSuggestions,postInit:b.onPostInit})},c.setSuggestions=function(a,b){this.trigger("setSuggestions",{result:a,showHideDropdown:b!=0})},c.onPostInit=function(a){var b=this;b.setSuggestions(b.opts(d),!1)},c.onGetSuggestions=function(a,b){var c=this,e=c.opts(d);e.sort(),c.setSuggestions(c.itemManager().filter(e,b.query))}})(jQuery);(function(a){function b(){}a.fn.textext.TextExtTags=b,a.fn.textext.addPlugin("tags",b);var c=b.prototype,d=".",e="text-tags-on-top",f=d+e,g="text-tag",h=d+g,i="text-tags",j=d+i,k="text-label",l=d+k,m="text-remove",n=d+m,o="tags.enabled",p="tags.items",q="html.tag",r="html.tags",s="isTagAllowed",t="tagClick",u={tags:{enabled:!0,items:null},html:{tags:'<div class="text-tags"/>',tag:'<div class="text-tag"><div class="text-button"><span class="text-label"/><a class="text-remove"/></div></div>'}};c.init=function(b){this.baseInit(b,u);var c=this,d=c.input(),e;c.opts(o)&&(e=a(c.opts(r)),d.after(e),a(c).data("container",e),c.on({enterKeyPress:c.onEnterKeyPress,backspaceKeyDown:c.onBackspaceKeyDown,preInvalidate:c.onPreInvalidate,postInit:c.onPostInit,getFormData:c.onGetFormData}),c.on(e,{click:c.onClick,mousemove:c.onContainerMouseMove}),c.on(d,{mousemove:c.onInputMouseMove})),c._originalPadding={left:parseInt(d.css("paddingLeft")||0),top:parseInt(d.css("paddingTop")||0)},c._paddingBox={left:0,top:0},c.updateFormCache()},c.containerElement=function(){return a(this).data("container")},c.onPostInit=function(a){var b=this;b.addTags(b.opts(p))},c.onGetFormData=function(a,b,c){var d=this,e=c===13?"":d.val(),f=d._formData;b[200]=d.formDataObject(e,f)},c.initPriority=function(){return 100},c.onInputMouseMove=function(a){this.toggleZIndex(a)},c.onContainerMouseMove=function(a){this.toggleZIndex(a)},c.onBackspaceKeyDown=function(a){var b=this,c=b.tagElements().last();b.val().length==0&&b.removeTag(c)},c.onPreInvalidate=function(a){var b=this,c=b.tagElements().last(),d=c.position();c.length>0?d.left+=c.innerWidth():d=b._originalPadding,b._paddingBox=d,b.input().css({paddingLeft:d.left,paddingTop:d.top})},c.onClick=function(b){function k(a,b){i.data(g,a),i.find(l).text(c.itemManager().itemToString(a)),c.updateFormCache(),d.getFormData(),d.invalidateBounds(),b&&d.focusInput()}var c=this,d=c.core(),e=a(b.target),f=0,i;e.is(j)?f=1:e.is(n)?(c.removeTag(e.parents(h+":first")),f=1):e.is(l)&&(i=e.parents(h+":first"),c.trigger(t,i,i.data(g),k)),f&&d.focusInput()},c.onEnterKeyPress=function(a){var b=this,c=b.val(),d=b.itemManager().stringToItem(c);b.isTagAllowed(d)&&(b.addTags([d]),b.core().focusInput())},c.updateFormCache=function(){var b=this,c=[];b.tagElements().each(function(){c.push(a(this).data(g))}),b._formData=c},c.toggleZIndex=function(a){var b=this,c=b.input().offset(),d=a.clientX-c.left,g=a.clientY-c.top,h=b._paddingBox,i=b.containerElement(),j=i.is(f),k=d>h.left&&g>h.top;(!j&&!k||j&&k)&&i[(j?"remove":"add")+"Class"](e)},c.tagElements=function(){return this.containerElement().find(h)},c.isTagAllowed=function(a){var b={tag:a,result:!0};return this.trigger(s,b),b.result===!0},c.addTags=function(a){if(!a||a.length==0)return;var b=this,c=b.core(),d=b.containerElement(),e,f;for(e=0;e<a.length;e++)f=a[e],f&&b.isTagAllowed(f)&&d.append(b.renderTag(f));b.updateFormCache(),c.getFormData(),c.invalidateBounds()},c.getTagElement=function(b){var c=this,d=c.tagElements(),e,f;for(e=0;e<d.length,f=a(d[e]);e++)if(c.itemManager().compareItems(f.data(g),b))return f},c.removeTag=function(b){var c=this,d=c.core(),e;b instanceof a?(e=b,b=b.data(g)):e=c.getTagElement(b),e.remove(),c.updateFormCache(),d.getFormData(),d.invalidateBounds()},c.renderTag=function(b){var c=this,d=a(c.opts(q));return d.find(".text-label").text(c.itemManager().itemToString(b)),d.data(g,b),d}})(jQuery);(function(a){var b=document,c="getElementsByTagName",d=b[c]("head")[0]||b[c]("body")[0],e=b.createElement("style");e.innerHTML=a,d.appendChild(e)})('\n.text-core{position:relative;}\n.text-core .text-wrap{background:#fff;position:absolute;}\n.text-core .text-wrap textarea,.text-core .text-wrap input{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;-webkit-border-radius:0px;-moz-border-radius:0px;border-radius:0px;border:1px solid #9daccc;outline:none;resize:none;position:absolute;z-index:1;background:none;overflow:hidden;margin:0;padding:3px 5px 4px 5px;white-space:nowrap;font:11px "lucida grande",tahoma,verdana,arial,sans-serif;line-height:13px;height:auto;}\n\n.text-core .text-wrap .text-arrow{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;top:0;right:0;width:22px;height:22px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAOAQMAAADHWqTrAAAAA3NCSVQICAjb4U/gAAAABlBMVEX///8yXJnt8Ns4AAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABpJREFUCJljYEAF/xsY6hkY7BgYZBgYOFBkADkdAmFDagYFAAAAAElFTkSuQmCC") 50% 50% no-repeat;cursor:pointer;z-index:2;}\n\n.text-core .text-wrap .text-dropdown{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:0;position:absolute;z-index:3;background:#fff;border:1px solid #9daccc;width:100%;max-height:100px;padding:1px;font:11px "lucida grande",tahoma,verdana,arial,sans-serif;display:none;overflow-x:hidden;overflow-y:auto;}\n.text-core .text-wrap .text-dropdown.text-position-below{margin-top:1px;}\n.text-core .text-wrap .text-dropdown.text-position-above{margin-bottom:1px;}\n.text-core .text-wrap .text-dropdown .text-list .text-suggestion{padding:3px 5px;cursor:pointer;}\n.text-core .text-wrap .text-dropdown .text-list .text-suggestion em{font-style:normal;text-decoration:underline;}\n.text-core .text-wrap .text-dropdown .text-list .text-suggestion.text-selected{color:#fff;background:#6d84b4;}\n\n.text-core .text-wrap .text-focus{-webkit-box-shadow:0px 0px 6px #6d84b4;-moz-box-shadow:0px 0px 6px #6d84b4;box-shadow:0px 0px 6px #6d84b4;position:absolute;width:100%;height:100%;display:none;}\n.text-core .text-wrap .text-focus.text-show-focus{display:block;}\n\n.text-core .text-wrap .text-prompt{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;width:100%;height:100%;margin:1px 0 0 2px;font:11px "lucida grande",tahoma,verdana,arial,sans-serif;color:#c0c0c0;overflow:hidden;white-space:pre;}\n.text-core .text-wrap .text-prompt.text-hide-prompt{display:none;}\n\n.text-core .text-wrap .text-tags{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;width:100%;height:100%;padding:3px 35px 3px 3px;cursor:text;}\n.text-core .text-wrap .text-tags.text-tags-on-top{z-index:2;}\n.text-core .text-wrap .text-tags .text-tag{float:left;}\n.text-core .text-wrap .text-tags .text-tag .text-button{-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;float:left;border:1px solid #9daccc;background:#e2e6f0;color:#000;padding:0px 17px 0px 3px;margin:0 2px 2px 0;cursor:pointer;height:16px;font:11px "lucida grande",tahoma,verdana,arial,sans-serif;}\n.text-core .text-wrap .text-tags .text-tag .text-button a.text-remove{position:absolute;right:3px;top:2px;display:block;width:11px;height:11px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAhCAYAAAAPm1F2AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAB50RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNS4xqx9I6wAAAQ5JREFUOI2dlD0WwiAQhCc8L6HHgAPoASwtSYvX8BrQxtIyveYA8RppLO1jE+LwE8lzms2yH8MCj1QoaBzH+VuUYNYMS213UlvDRamtUbXb5ZyPHuDoxwGgip3ipfvGuGzPz+vZ/coDONdzFuYCO6ramQQG0DJIE1oPBBvM6e9LqaS2FwD7FWwnVoIAsOc2Xn1jDlyd8pfPBRVOBHA8cc/3yCmQqt0jcY4LuTyAF3pOYS6wI48LAm4MUrx5JthgSQJAt5LtNgAUgEMBBIC3AL2xgo58dEPfhE9wygef89FtCeC49UwltR1pQrK2qr9vNr7uRTCBF3pOYS6wI4/zdQ8MUpxPI9hgSQL0Xyio/QBt54DzsHQx6gAAAABJRU5ErkJggg==") 0 0 no-repeat;}\n.text-core .text-wrap .text-tags .text-tag .text-button a.text-remove:hover{background-position:0 -11px;}\n.text-core .text-wrap .text-tags .text-tag .text-button a.text-remove:active{background-position:0 -22px;}\n');
;

/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();;

