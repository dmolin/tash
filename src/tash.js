/*  Tash! Compact JavaScript framework, version 0.1
 *  (c) 2011-??? Davide A. Molin
 *
 * Tash! is freely distributable and released under the MIT, BSD, and GPL Licenses. 
 *
 *--------------------------------------------------------------------------*/

//Define or recapture tash global instance
window.tash = window.tash || {};

(function($){

	$.version = {
		major: 0,
		minor: 0,
		sub: 1
	};

	$.config = { 
		debug: (function(){
			var consoleEl = null;

			function _getConsole() {
				var consoleWrapper;
				var consoleStyle;

				if( consoleEl === null ) {
					consoleEl = document.getElementById( $.config.debug.consoleId );
					if( !consoleEl ) {
						consoleStyle = document.createElement( "style" );
						consoleStyle.appendChild( document.createTextNode(
							[
								"#" + $.config.debug.consoleId + "-wrapper {",
									"display: block;",
									"position: absolute;",
									"bottom: 0;",
									"height: 100px;",
									"width: 100%;",
									"overflow: hidden;",
								"}",
								"#" + $.config.debug.consoleId + "{",
									"padding: 5px;",
									"height: 100%;",
									"background-color: #444;",
									"color: #eee;",
									"overflow: auto;",
								"}"
							].join('')
						) );
						document.body.appendChild( consoleStyle );
						
						consoleWrapper = document.createElement( "div");
						consoleWrapper.id = $.config.debug.consoleId + "-wrapper";
						/*
						consoleWrapper.style.display = "block";
						consoleWrapper.style.position = "absolute";
						consoleWrapper.style.bottom = "0";
						consoleWrapper.style.height = "100px";
						consoleWrapper.style.width = "100%";
						consoleWrapper.style.overflow="hidden";
						*/
						consoleEl = document.createElement( "div" );
						consoleEl.id = $.config.debug.consoleId;
						/*
						consoleEl.style.padding = "5px";
						consoleEl.style.height = "100%";
						consoleEl.style.backgroundColor = "#444";
						consoleEl.style.color="#eee";
						consoleEl.style.overflow="auto";
						*/
						consoleWrapper.appendChild( consoleEl );
						document.body.appendChild( consoleWrapper );
					}
				}
				return consoleEl;
			}
			
			return {
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
		if( !$.config.debug.isDebug ) {
			return;
		}

		/** test
		if( typeof console !== 'undefined' && typeof console.log === 'function' ) {
			return console.log.apply( console, arguments );
		}
		**/
		
		var p = document.createElement('p');
		p.appendChild( document.createTextNode( msg ) );
		$.config.debug.getConsole().appendChild( p );
	};
}(window.tash));