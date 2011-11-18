/*  Tash! Compact JavaScript framework, version 0.1
 *  (c) 2011-??? Davide Alberto Molin
 *
 *  Tash! is freely distributable under the terms of an MIT-style license.
 *
 *--------------------------------------------------------------------------*/

/**
* This function define a new namespace, under its own containing namespace.
* (ex.: tash.namespace( 'mine' ) will resolve to "tash.mine" )
* This tricky function defines a namespace function and, at the same time, 
* put that same function into the given namespace ;)
*/
(function(name){
	function namespace(nspace) {
		var nspaces = !nspace ? '' : nspace.split('.'),
			parent = this,
			i = 0;
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
	}
	namespace(name).namespace = namespace;
}('tash'));

