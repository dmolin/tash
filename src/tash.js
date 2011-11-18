/*  Tash! Compact JavaScript framework, version 0.1
 *  (c) 2011-??? Davide Alberto Molin
 *
 *  Tash! is freely distributable under the terms of an MIT-style license.
 *
 *--------------------------------------------------------------------------*/

/**
 * To define a namespace function and, at the same time, 
 * put that same function into a "scope" ;)
 */
(function(name){
	function namespace(nspace) {
		var nspaces = !nspace ? '' : nspace.split('.'),
			parent = window,
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
}(tash));

