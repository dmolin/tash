//Define or recapture tash global instance
/*jshint unused:false */
/*global window:true */
/*  Tash! Reactive JavaScript Library, version 0.0.1
 *  (c) 2011-2012 Davide A. Molin
 *
 * Tash! is freely distributable and released under the MIT, BSD, and GPL Licenses.
 *
 *--------------------------------------------------------------------------*/
window.tash = window.tash || {};

(function($){

	$.version = {
		major: 0,
		minor: 0,
		sub: 1
	};

	$.config = {
		namespaceRoot: '',   //base parent to use when calling namespace function
		namespaceEventsRoot: ''  //base parent namespace for events (used in require())
	};

	/**
	* This function define a new namespace, under its own containing namespace.
	* (ex.: tash.namespace( 'mine' ) will resolve to "tash.mine" )
	*/
	$.namespace = function( instance, nspace ) {
		var nspaces,
			parent = instance,
			i = 0;

		if( typeof instance == 'string' ) {
			nspace = ($.config.namespaceRoot ? $.config.namespaceRoot + '.' : '') + instance;
			parent = window;
		}

		nspaces = !nspace ? '' : nspace.split('.');

		for( i in nspaces ) {
			if( nspaces.hasOwnProperty(i) ) {
				if( typeof parent[nspaces[i]] === 'undefined' ) {
					parent[nspaces[i]] = {};
				}
				parent = parent[nspaces[i]];
			}
		}
		//let's return the innermost namespace, to allow for
		//immediate use..
		return parent;
	};

	/**
	* Determines if the passed in Object IS an Array
	*/
	$.isArray = (typeof Array.isArray === 'function' ? Array.isArray : function isArray( /* Array */ obj ){
		return obj !== undefined && Object.prototype.toString.call(obj).match(/Array/) !== null;
	});

	/**
	* Adds an object/arrat to a given array
	* Returns the number of elements added to the array. 0 if nothing has been done
	*/
	$.addToArray = function( destArray, obj ) {
		var added = 0;
		if( !$.isArray(destArray)) {
			return added;
		}

		if( $.isArray(destArray) ) {
			$.each( obj, function( o/*, index*/ ) {
				destArray.push( o );
				added++;
			} );
		} else {
			destArray.push( obj );
			added++;
		}
		return added;
	};

	/**
	* Internal iterator over a collection.
	* Iterates over the collection and calls the given callback function.
	* a third argument can be passed in as the callback scope. If not present, "this"
	* will be set as the iteration element.
	*
	* NOTE: Returning false from the callback will stop the iteration.
	*/
	$.each = function each( /* Array */obj, /* Function */cb, /* object */scope ) {
		var index;

		if( !$.isArray( obj ) ) {
			return; //no array, no loop
		}

		for( index in obj ) {
			if( obj.hasOwnProperty( index ) ) {
				if( cb.call( (scope ? scope : obj[index]), obj[index], index ) === false ) {
					break;
				}
			}
		}
	};

	/*----------------------------------------
	 *  Utility module
	 *----------------------------------------*/
	$.util = {
		/**
		* Microtemplating facility
		*/
		template: function( tmpl, obj ) {
			var i,
				matches = tmpl.match(/\{\{(\w+)\}\}/g);
			if( matches ) {
				for( i = 0; i < matches.length; i+=1 ) {
					var matched = matches[i];
					if( matched.charAt(0) !== '{' ) {
						return; //skip non matching elements
					}
					tmpl = tmpl.replace( matched, obj[matched.substr(2, matched.length-4)]||matched );
				}
			}
			return tmpl;
		},

		trimAt: function( str, length ) {
			if( str && str.length && str.length > length ) {
				str = str.substr( 0, length-3 ) + '...';
			}
			return str;
		},

		isDefined: function( objectName ) {
			var parts = objectName.split('.'),
				parent = window,
				i;

			for( i in parts ) {
				if( parts.hasOwnProperty(i) ) {
					if( typeof parent[parts[i]] === 'undefined' ) {
						return false;
					}
					parent = parent[parts[i]];
				}
			}
			return true;
		},

		mixin: function( dest, proto ) {
			//mix an object into another
			var prop, orig;

			for( prop in proto ) {
				orig = null;
				//console.log( "adding " + prop + " to dest" );
				if( proto.hasOwnProperty( prop ) ) {
					if (typeof dest[prop] === "function") {
						orig = dest[prop];
					}
					dest[prop] = proto[prop];

					if (orig) {
						dest[prop].parent = proto[prop];
					}
				}
			}
			return dest;
		}

	};


}(window.tash));

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
		"use strict";
		if (this === void 0 || this === null) {
			throw new TypeError();
		}
		var t = [].concat( this );
		var len = t.length >>> 0;
		if (len === 0) {
			return -1;
		}
		var n = 0;
		if (arguments.length > 0) {
			n = Number(arguments[1]);
			if (n !== n) { // shortcut for verifying if it's NaN
				n = 0;
			} else if (n !== 0 && n !== Infinity && n !== -Infinity) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		if (n >= len) {
			return -1;
		}
		var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
		for (; k < len; k++) {
			if (k in t && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
	};
}
