/*  Tash! Compact JavaScript framework, version 0.1
 *  (c) 2011-??? Davide A. Molin
 *
 * Tash! is freely distributable and released under the MIT, BSD, and GPL Licenses. 
 *
 *--------------------------------------------------------------------------*/

//Define or recapture tash global instance
window.tash = window.tash || {};

(function($){

	$.config = { 
		debug: (function(){
			var consoleEl = null;

			function _getConsole() {
				if( consoleEl === null ) {
					consoleEl = document.getElementById( $.config.debug.consoleId );
				}
				return consoleEl;
			}
			
			function _set( /* Object */conf ) {
				
			}
			
			return {
				set: _set,
				consoleId : 'debugConsole',
				isDebug: false,
				getConsole: _getConsole
			};
			
		}()),
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
	* Internal iterator over a collection.
	* Iterates over the collection and calls the given callback function.
	* a third argument can be passed in as the callback scope. If not present, the callback scope
	* whill be "this", resolving to the actual call context (normally tash itself).
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
				if( cb.call( (scope ? scope : this), obj[index], index ) === false ) {
					break;
				}
			}
		}
	};
	
	$.log = function log( msg ) {
		if( typeof console !== 'undefined' && typeof console.log === 'function' ) {
			return console.log.apply( console, arguments );
		}
		
		if( $.config.debug.isDebug ) {
			var p = document.createElement('p');
			p.appendChild( document.createTextNode( msg ) );
			$.config.debug.getConsole().appendChild( p );
		}
	};
}(window.tash));