/*  Tash! Compact JavaScript Library, version 0.0.1
 *  (c) 2011- Davide A. Molin
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
			$.each( obj, function( o, index ) {
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

	
}(window.tash));

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this === void 0 || this === null) {
            throw new TypeError();
        }
        //var t = new Object( this );
        var t = Array.concat( [], this );
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
/**
* Module used for Publishing/Subscribing to events
*
* Note: the pub/sub logic, though simple, is HEAVILY based on Peter Higgins (dante@dojotoolkit.org) implementation, 
*       Loosely based on Dojo publish/subscribe API, limited in scope. 
*       Original is (c) Dojo Foundation 2004-2009. Released under either AFL or new BSD, see:
*       http://dojofoundation.org/license for more information.
*
* @author D.Molin
*/
(function($){
	
	$.namespace( $, 'events' );

	/*----------------------------------------
	* Internal privileged functions
	*-----------------------------------------*/
	
	// the topic/subscription hash
	var cache = {};

	function _publish(/* String */topic, /* Array? */args){
		// summary: 
		//    Publish some data on a named topic.
		// topic: String
		//    The channel to publish on
		// args: Array?
		//    The data to publish. Each array item is converted into an ordered
		//    arguments on the subscribed functions. 
		//
		// example:
		//    Publish stuff on '/some/topic'. Anything subscribed will be called
		//    with a function signature like: function(a,b,c){ ... }
		//
		//  |   tash.events.publish("/some/topic", ["a","b","c"]);
		if( !cache[topic]) {
			return;
		}
		
		$.each( cache[topic], function( elem, index ){
			elem.callback.apply( elem.scope, args || []);
		});
	}

	function _subscribe(/* String */topic, /* Function */callback, /* Object */scope ){
		// summary:
		//    Register a callback on a named topic.
		// topic: String
		//    The channel to subscribe to (accept also namespaced topics)
		// callback: Function
		//    The handler event. Anytime something is $.publish'ed on a 
		//    subscribed channel, the callback will be called with the
		//    published array as ordered arguments.
		// scope: Object
		//    the scope to use as 'this' when invoking the callback. if not given, the scope will be Tash
		//
		// returns: Array
		//    A handle which can be used to unsubscribe this particular subscription or false if subscription fails.
		//  
		// example:
		//  | tash.events.subscribe("/some/topic", function(a, b, c){ /* handle data */ });
		//
		if( !topic || typeof callback !== 'function' ) {
			return false;
		}
		
		if(!cache[topic]){
			cache[topic] = [];
		}
		cache[topic].push( { callback: callback, scope: (scope ? scope : $) } );
		return [topic, callback ]; // Array
	}

	function _unsubscribe(/* Array */handle){
		// summary:
		//    Disconnect a subscribed function for a topic.
		// handle: Array
		//    The return value from a $.subscribe call.
		// example:
		//  | var handle = $.subscribe("/something", function(){});
		//  | $.unsubscribe(handle);
		var t;
		
		if( typeof handle === 'undefined' || !$.isArray(handle) ) {
			return;
		}
		
		t = handle[0];
		if( cache[t] ) {
			$.each(cache[t], function(elem, idx){
				if( elem == handle[1]) {
					cache[t].splice(idx, 1);
				}
			});
		} 
	}
	
	/*----------------------------------------
	* Exposed API interface
	*-----------------------------------------*/
	
	/**
	* Verify that the required scoped event namespace object exists.
	* If not, it is created with the corresponding publishing/subscribing functions
	* Example: if you want to have tash.events.game.GameInfo with publish, subscribe, unsubscribe,
	* you just need to call (before actually using it):
	*
	*   tash.events.require( "game.GameInfo" );
	*
	* After that, you will be able to access:
	*
	*	tash.events.game.GameInfo.publish()/subscribe()/unsubscribe()
	*
	* that's all!
	*/
	$.events.require = function( namespacedEvent ) {
		var completeNamespace = $.config.namespaceEventsRoot || $.config.namespaceRoot,
			nspace;
			
		if( !namespacedEvent || namespacedEvent.length === 0 ) {
			return; //no-op
		}
		
		completeNamespace += completeNamespace ? ( namespacedEvent.charAt(0) === '.' ? namespacedEvent : "." + namespacedEvent ) : namespacedEvent;
		
		nspace = $.namespace( completeNamespace );
		
		//if namespace function is already in place, nothing happens
		if( typeof nspace.publish === 'function' ) {
			return nspace; //nothing to do, namespace already existing
		}
		
		//create the publish/subscribe/unsubscribe functions in the namespace
		nspace.publish = function( data ) { _publish( namespacedEvent, ( $.isArray(data) ? data : [data]) ); };
		nspace.subscribe = function( callback ) { return _subscribe( namespacedEvent, callback ); };
		nspace.unsubscribe = function( handleFromSubscribe ) { return _unsubscribe( handleFromSubscribe ); };
		
		return nspace; //let's allow chaining
	};
	
}(tash));tash.namespace( tash, 'debug' );

(function($){

	//add some debug options to global config object
	$.config.debug =  {
			isDebug: false,
			consoleId: 'debugConsole'
	};

	$.debug.getConsole = ( function _getConsole() {
		var consoleEl = null;

		return function() {
			var consoleWrapper,
				consoleScroller,
				computedStyles = [],
				consoleStyle,
				mainStyleSelector = "#" + $.config.debug.consoleId + "-wrapper",
				logLineSelector = "#" + $.config.debug.consoleId + " p";

			function createTitleBar( mainStyleSelector, styles ) {
				var consoleTitleBar,
					buttons,
					clearAll,
					titleBarStyles;

				titleBarStyles = [
					mainStyleSelector + " .debugConsole-titlebar {",
						"height: 20px;",
						"background-color: #333;",
						"border-bottom: 1px solid #666;",
						"border-top: 1px solid #888;",
					"}",
					mainStyleSelector + " .debugConsole-titlebar .titlebar-buttons {",
						"float: right;",
						"overflow: hidden;",
					"}",
					mainStyleSelector + " .debugConsole-titlebar .titlebar-buttons .clear-all{",
						"background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABBZJREFUeNpMVGtIm1cYfpN8akzUWKPGeIn3GDVacThFYXUqE1eEFmVsxX+tPwqlCO1wqShlP8ag/SGsjLmx7gJDHR2DldJF67zMab2EoquiMXhJTIzRRqNG4zV73tBtPXDQk++c931u54iam5vp5OSEqqqqKCIigra3tykzMzNyf3//cnJycm5QUNB2aGgo/y7zeDy+nZ2droODA7PD4aCsrCzq6uqivb09EtPr4ff7A3+jo6OvJiQkPI2Nja07Pj52OJ3OpZGRkTmpVLpyenqq0Wq1P6nV6gchISHRZ2dn/x4ngQvwPDw8lGRnZ9+Xy+UF8/PzLWtra3+Eh4cTENDm5iYFBweTy+XqcLvdSSjWXFFR8WhhYaERxRf4vCCRSAgLSklJ+RQdMmw22yWsPehIR0dHNDk5GWgkFospJiaGQMkGdDcgQ1NGRsZ3oH0ZIDZE3d3dvOHd0tLSe8PDw+/7fD4XJoGeKCoq6iKKfYQGqsjISAuQ/TIxMdGbn58vn5qa8ubl5X2blJR0MDo6ekMABTFg3hwfH/8aE+hdlJqaKi0vL/9CqVReg042CO5EsSsajeaaQqF4jCa9aPal0WhsaWtrewyztGJUP49NGpPJ9Mjr9RI0IHT6mIsMDQ096Ojo0K6vr7/d2tqavYKRnp5+CdQSQYtEIpFzenr6RUFBwQcCDuplMplTr9e72XoIriwpKWlaXV0d6ezsvIm1HAffwncHqP4Mg+Kg2WRcXBxVVlYSEE4gDoVCfHy8DnS8oBDIErRQY3MUxDWiq7+wsPAWNt8F3au7u7sGdhJIAk4ia+ykG/teCVtbW17ADVKpVITKvOkYB9lJJQJIr6EPDgwMvOQIVFdXk9VqJehFjApxCQYrqaSxsfFcYmLihcHBwR/Hxsaor6/Pm5ubexHBvIDEPgGNP0H5e3S3Q7dk6Oltb28/4yY88dt7KKYW2+32F+h+DlR0DBUu+vr7+w3Ikay2ttYI924jlB/i/8/q6ur+hhSfMDJoGCiE6FQsLi6OitlecH9WVFR0HfpwMJm/cWlp6Qq+7eC+3auvr+8EagPWJnzr5QDjO6HZO4iCEvL8KgJMgisJDQ0Nvy0vL9+ZnZ01cgx0Oh1fCwXWxUCrRJKtEPz5xsbGKRuDhCtqamp6oeFXMzMzDwWLxcJXwZ6WltaCYH4OFwRsfMJdoZEHYethE6BDwCm+Ljk5OaqysrJvQO2vnp6ehyyJBFcjYCcoWIBghanAjRzoYoV7LlyBwD0rLi4m5DEWqBpgxH0UfY5pwAX38zMk/PcMCAIL/bvZbH6JQ00I4g8I6ivotw8tjqBfGHRUcTMMA/Y9wyvw/zNCbwx+CWDvKq7EbUwN0Jyfm5vTI4QyaGMOCwubRWETvwzc+M3xjwADALPAUrORzSeCAAAAAElFTkSuQmCC);",
						"height: 18px;",
						"width: 18px;",
						"float: left;",
						"text-indent: -9999px;",
					"}"
				];
				$.addToArray( styles, titleBarStyles );
				consoleTitleBar = document.createElement( "div" );
				consoleTitleBar.setAttribute( "class", "debugConsole-titlebar");
				
				buttons = document.createElement( "div" );
				buttons.setAttribute( "class", "titlebar-buttons" );
				
				clearAll = document.createElement( "a" );
				clearAll.setAttribute( "href", "#" );
				clearAll.setAttribute( "class", "clear-all" );
				clearAll.onclick = function() {
					//consoleEl.parentNode.removeChild( consoleEl );
					consoleEl.parentNode.parentNode.removeChild( consoleEl.parentNode );
					consoleScroller = null;
					consoleEl = null;
					return false;
				};
				clearAll.appendChild( document.createTextNode( 'clear' ) );
				buttons.appendChild( clearAll );

				consoleTitleBar.appendChild( buttons );
				return consoleTitleBar;
			}

			function createConsoleWrapper( styles ) {
				var st = [
					mainStyleSelector + " {",
						"font-size: 0.60em;",
						"font-family: Monaco, 'Andale Mono', 'Courier New', 'Lucida Console', 'Lucida Sans Unicode', 'Lucida Grande', courier, sans-serif;",
						"line-height: 1.4em;",
						"display: block;",
						"position: absolute;",
						"bottom: 0;",
						"height: 100px;",
						"width: 100%;",
						"overflow: hidden;",
						"background-color: #000;",
						"opacity: 0.8;",
					"}"
				];

				consoleWrapper = document.getElementById( mainStyleSelector.substr(1) );

				if( !consoleWrapper ) {
					
					$.addToArray( styles, st );

					consoleWrapper = document.createElement( "div");
					//note: the class 'overload-hook' is given to allow overriding styles ;)
					consoleWrapper.id = $.config.debug.consoleId + "-wrapper";
					consoleWrapper.setAttribute( 'class', 'overload-hook' );
					
					consoleWrapper.appendChild( createTitleBar( mainStyleSelector, computedStyles ) );
					return true;
				}
				return false;
			}

			function createScroller( id, styles ) {
				var st = [
					"#" + id + " {",
						"overflow: auto;",
						"position: absolute;",
						"top: 22px;",
						"bottom: 0;",
						"width: 100%;",
					"}"
				];

				consoleScroller = document.getElementById( id );
				if( !consoleScroller ) {
					$.addToArray( styles, st );
					consoleScroller = document.createElement( "div" );
					consoleScroller.id = id;
				}
				return consoleScroller;
			}

			if( consoleEl === null ) {
				consoleEl = document.getElementById( $.config.debug.consoleId );
				if( !consoleEl ) {

					computedStyles = [
							"#" + $.config.debug.consoleId + "{",
								"padding: 5px;",
								"color: #aaa;",
								"overflow: auto;",
							"}",
							logLineSelector + " {",
								"padding: 0;",
								"margin: 0;",
							"}",
							logLineSelector + ".log-level-INFO {",
								"color: #12C474;",
							"}",
							logLineSelector + ".log-level-WARN {",
								"color: #FFC869;",
							"}",
							logLineSelector + ".log-level-ERR {",
								"color: #FC3232;",
							"}"
						];

					var created = createConsoleWrapper( computedStyles );

					createScroller( $.config.debug.consoleId + "-scroller", computedStyles );
					consoleEl = document.createElement( "div" );
					consoleEl.id = $.config.debug.consoleId;
					consoleScroller.appendChild( consoleEl );
					consoleWrapper.appendChild( consoleScroller );

					consoleStyle = document.createElement( "style" );
					consoleStyle.appendChild( document.createTextNode( computedStyles.join('') ) );
					

					if( created ) {
						document.body.appendChild( consoleStyle );
						document.body.appendChild( consoleWrapper );
					}
				}
			}
			return consoleEl;
		};
	}());

	$.log = function log( msg, level ) {
		
		var message = msg,
			levelLabel = $.log.INFO;

		if( !$.config.debug.isDebug ) {
			return;
		}

		if( ['INFO', 'WARN', 'ERR '].indexOf( level ) >= 0 ) {
			levelLabel = level;
		}

		message = '[' + levelLabel + '] ' + msg;

		if( typeof console !== 'undefined' && typeof console.log === 'function' ) {
			return console.log.call( console, message );
		}

		
		var p = document.createElement('p');
		p.setAttribute( "class", "log-level-" + (level ? level.toUpperCase() : "INFO" ) );
		p.appendChild( document.createTextNode( message ) );
		$.debug.getConsole().appendChild( p );
		//$.debug.getConsole().scrollTop( $.debug.getConsole().height() );
		p.scrollIntoView();
	};
	$.log.INFO = "INFO";
	$.log.WARN = "WARN";
	$.log.ERR  = "ERR ";

	$.info = function info( msg ) {
		$.log( msg, $.log.INFO );
	};
	$.warn = function err( msg ) {
		$.log( msg, $.log.WARN );
	};
	$.err = function err( msg ) {
		$.log( msg, $.log.ERR );
	};

			
}(tash));