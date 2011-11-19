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
	
	$.namespace( 'events' );

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
		// dmolin: TODO: we have to allow for passing specific scope for bound events
		
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
	* Example: if you want to have brandx.events.game.GameInfo with publish, subscribe, unsubscribe,
	* you just need to call (before actually using it):
	*
	*   brandx.events.require( "game.GameInfo" );
	*
	* After that, you will be able to access:
	*
	*	brandx.events.game.GameInfo.publish()/subscribe()/unsubscribe()
	*
	* that's all!
	*/
	$.events.require = function( namespacedEvent ) {
		var completeNamespace = "events",
			nspace;
			
		if( !namespacedEvent || namespacedEvent.length === 0 ) {
			return; //no-op
		}
		
		completeNamespace += (namespacedEvent.charAt(0) === '.' ? namespacedEvent : "." + namespacedEvent );
		
		nspace = $.namespace( completeNamespace );
		
		//if namespace function is already in place, nothing happens
		if( typeof nspace.publish === 'function' ) {
			return nspace; //nothing to do, namespace already existing
		}
		
		//create the publish/subscribe/unsubscribe functions in the namespace
		nspace.publish = function( data ) { 
			//$.log( "publishing " + namespacedEvent );
			_publish( namespacedEvent, ( $.isArray(data) ? data : [data]) ); 
		};
		nspace.subscribe = function( callback ) { return _subscribe( namespacedEvent, callback ); };
		nspace.unsubscribe = function( handleFromSubscribe ) { return _unsubscribe( handleFromSubscribe ); };
		
		return nspace; //useful for chaining
	};
	
}(tash));