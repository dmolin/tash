CommonTest = AsyncTestCase( "publish/subscribe tests", (function($){
	//local scope
	return {
		setUp: function() {
		},
		
		testRequireFunctionShouldExist: function() {
			assertFunction( "require function should exist", $.events.require );
		},
		
		testRequireShouldReturnNamespace: function() {
			assertObject( "require function should return a namespace", $.events.require('account.UserLoggedIn' ) );
		},
		
		testRequireShouldReturnNamespaceWithPubSubFunctions: function() {
			var nspace = $.events.require( 'account.UserLoggedIn' );
			assertFunction( "publish function should exist", nspace.publish );
			assertFunction( "subcribe function should exist", nspace.subscribe );
			assertFunction( "unsubscribe function should exist", nspace.unsubscribe );
		},
		
		testSubscribingToAnEventShouldReturnAHandle: function() {
			var nspace = $.events.require( 'account.UserLoggedIn' ),
				handle = $.events.account.UserLoggedIn.subscribe( function(){} );
				
			assertNotNull( "handle returned from subscribe shouldn't be null", handle );
		},
		
		testPublishingAnEventShouldNotifySubscribers: function( queue ) {
			$.events.require( 'account.UserLoggedIn' );
			
			var notified = false;
			
			//look at that! a user just logged In! let's publish an event..
			//that must be done asynchronously, to wait until the event is
			//received..
			queue.call( "publish an event", function( callback )  {
				var subscriber = callback.add( function() { 
					notified = true;
				} );
				//subscribe for an event, let's say we are interested in loggedIn events
				$.events.account.UserLoggedIn.subscribe( subscriber );
				$.events.account.UserLoggedIn.publish( "some data" );
			});
			
			//now check (asynchronously too) if the event was forwarded
			queue.call( "assert event was received", function() {
				assertTrue( "subscriber should've been notified", notified );
			});
		}
	};
}(tash)) );