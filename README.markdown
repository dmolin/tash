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

Prototype currently targets the following platforms:

* Microsoft Internet Explorer for Windows, version 6.0 and higher
* Mozilla Firefox 4 and higher
* Apple Safari 4 and higher
* Opera 10 and higher
* Chrome

### Note to the reader ###

This library is still in development and currently in version 0.1.
I've still to add aggregation/minification support and normalize the code. 
The library, as it is now, is not yet ready to be used. It will be ready when it will reach
version 0.2, around November 25th 2011.

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

To declare what event are we going to deal with, we have to execute this line of code:

    tash.events.require( "eventName" );

The name of the event can be namespaced, using "." for separating scopes, as in:

    tash.events.require( "account.UserJustLoggedIn" );

The call to the require function will 'create' the requested namespace. the event name becomes thus a namespace, with 3 functions in it, created for us:

    - publish( event data );
    - subscribe( callback, [scope] );
    - unsubscribe( subscriptionHandle );

All the functions are automatically generated and bound to the namespace we required. So, following the previous example, after the call to require() we have:

    tash.events.account.UserJustLoggedIn.publish = function
    tash.events.account.UserJustLoggedIn.subscribe = function
    tash.events.account.UserJustLoggedIn.unsubscribe = function


#### Publishing an Event ####

To publish an event is simply a matter of calling tash.event.<namespace passed in in the require>.publish( optional data ).
if we require "account.UserJustLoggedIn", we can call:

  tash.events.account.UserJustLoggedIn.publish();
or
  tash.events.account.UserJustLoggedIn.publish( userId );


#### Subscribing to an Event ####

Subscribing is really that simple; just require the namespace (if not already done) and then call subscribe:

  var subscription = tash.events.account.UserJustLoggedIn.subscribe( function( <same values passed to publish> ) { 
	//do what we want...
  })

#### UnSubscribing from an Event ####

Unsubscribing is even more simpler:

  tash.events.account.UserJustLoggedIn.unsubscribe( subscription );
