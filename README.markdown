Tash
=========

#### An event-based common JavaScript Library ####

Tash is a small, simple Javascript library, containing a set of common namespaced 
functions, useful for common tasks. Its intent is to group in a reusable library
the basic patterns and functions that should be the base of any Javascript application.

Tash offers:

* A namespacing system (module pattern)
* A publish/subscribe system (synchronous and asynchronous)
* other common utilities under development

### Targeted platforms ###

Tash currently targets the following platforms:

* Microsoft Internet Explorer for Windows, version 6.0 and higher
* Mozilla Firefox 4 and higher
* Apple Safari 4 and higher
* Opera 10 and higher
* Chrome

### Note to the reader ###

This library is still in development and currently in version 0.1.
I've still to add aggregation/minification support and normalize the code. 
The library, as it is now, is not yet ready to be used in production systems but only for personal or experimental use.

Using Tash
---------------

To use Tash in your application, download the latest release 
and copy 
`dist/tash.js` to a suitable location. Then include it in your HTML
like so:

    <script type="text/javascript" src="/path/to/tash.js"></script>

### publishing/suscribing events ###

Publishing/Subscribing is done relative to a namespace.
In order to publish/subscribe, it's only necessary:
- to declare what event name we want to use (namespaced if we want)
- publish or subscribe

#### Requiring an event before usage ####

In our page, first we have to declare what event are we going to deal with:

    tash.events.require( "eventName" );

The name of the event can be namespaced, using "." for separating scopes, as in:

    tash.events.require( "account.UserJustLoggedIn" );

The call to the require function will 'create' the requested namespace, if not already existing (multiple calls are perfectly fine). The event name becomes a namespace, with 3 functions available, created for us:

    - publish( event data );
    - subscribe( callback, [scope] );
    - unsubscribe( subscriptionHandle );

All the functions are automatically generated and bound to the namespace we required. So, following the previous example, after the call to require() we have:

    typeof tash.events.account.UserJustLoggedIn.publish = "function"
    typeof tash.events.account.UserJustLoggedIn.subscribe = "function"
    typeof tash.events.account.UserJustLoggedIn.unsubscribe = "function"


#### Publishing an Event ####

Publishing an event is simply a matter of calling tash.events.<namespace passed in in the require>.publish( optional data ).

If we required "account.UserJustLoggedIn", we can call:

    tash.events.account.UserJustLoggedIn.publish();
or

    tash.events.account.UserJustLoggedIn.publish( <whatever data we want to pass>, ... );

This call will immediately notify all subscribers. At this time, the event system is synchronous, thus at the end of this call all the subscriber will've been notified.
An Asynchronous interface is still under development.


#### Subscribing to an Event ####

Subscribing is really that simple; just require the namespace (if not already done) and then call subscribe:

    var subscription = tash.events.account.UserJustLoggedIn.subscribe( function( <same arguments passed to publish> ) { 
        //do what we want...
    })

#### UnSubscribing from an Event ####

Unsubscribing is even more simpler:

    tash.events.account.UserJustLoggedIn.unsubscribe( subscription );

