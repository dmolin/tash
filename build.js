#!/usr/bin/env node

//#package: ....
//#compress: java -jar ~/bin/yuicompressor.jar -o '.js$:-min.js' *.js

//if dist folder does not exist, create it

var sys = require('sys'),
	fs = require('fs'),
	util = require('util'),
	dist;
	
function checkDir( dir ) {
	try {
		fs.lstatSync( dir );
	} catch( unreadable ) {
		return false;
	}
	return true;
}

function createDir( dirname ) {
	//tokenize dirname using '/'
	var paths = dirname.split('/'),
		parent;
		
	parent = (paths.length === 1 ? dirname : paths.slice(0, -1).join("/") );
	
	//util.log( "checking " + parent );
	if( !checkDir( parent ) ) {
		//recurse with parent
		createDir( parent );
	} 
	
	//create dir, if necessary
	if( !checkDir( dirname ) ) {
		fs.mkdirSync( dirname, '0755' );
	}

}

createDir( 'dist/tmp' );
//move all JS into dist/tmp for compression

