CommonTest = TestCase( "common functions", (function(){
	//local scope
	return {
		setUp: function() {
		},
		
		testTashNamespaceShouldExist: function() {
			assertObject( "tash namespace should exist", tash );
		},
		
		testNamespaceFunctionShouldExist: function() {
			assertFunction( "namespace function should exist", tash.namespace );
		},
		
		testNamespaceFunctionShouldCreateNamespaces: function() {
			tash.namespace( 'tash.test' );
			assertObject( "tast.test scope should exist", tash.test );
		},

		testNamespaceFunctionShouldCreateNamespacesWithConfigurableParent: function() {
			tash.config.namespaceRoot = 'test';
			tash.namespace( 'tash.test' );
			assertObject( "test.tast.test scope should exist", test.tash.test );
			tash.config.namespaceRoot = '';
		},

		testNamespaceFunctionShouldAcceptTwoArguments: function() {
			assertEquals( "tash.namespace should accept 2 arguments", 2, tash.namespace.length );
			tash.namespace( window, 'test' );
			assertObject( "tash.namespace(window, 'test') should create window.test object", window.test );
		},
		
		testIsArrayWithArrayShouldReturnTrue: function() {
			assertTrue( "tash.isArray should return true with an Array literal", tash.isArray( ["first","second","third"] ) );
		},
		
		testIsArrayWithNonArrayShouldReturnFalse: function() {
			assertFalse( "tash.isArray should return false with an Object", tash.isArray( {"prop":"val" } ) );
			assertFalse( "tash.isArray should return false with a String", tash.isArray( "no, it's not" ) );
			assertFalse( "tash.isArray should return false with a primitive value", tash.isArray( 1 ) );
			assertFalse( "tash.isArray should return false with undefined value", tash.isArray( window.someUndefinedVar ) );
		},
		
		testEachIterateOverEachElement: function() {
			var testArr = ["first", "second", "third" ],
				called = 0;

			tash.each( testArr, function(obj,index) {
				called ++;
			});
			assertEquals( "callback should've been called " + testArr.length + " times", testArr.length, called );
		},

		testEachIterationShouldStopWhenReturningFalse: function() {
			var testArr = ["first", "second", "third" ],
				called = 0;

			tash.each( testArr, function(obj,index) {
				called++;
				return false;
			});
			assertEquals( "callback should've been called only once", 1, called );
		},

		testIterationShouldCallbackWithParameters: function() {
			var testArr = ["first", "second", "third" ],
				externalIndex = 0,
				that = this;
			
			tash.each( testArr, function( obj, index ) {
				assertEquals( "first argument should be the array element", typeof obj, "string" );
				assertEquals( "second argument should be the array index", index, externalIndex );
				externalIndex++;
			} );
		},
		
		testIterationShouldCallbackWithCorrectScope: function() {
			var testArr = ["first", "second", "third" ],
				that = this;
			
			tash.each( testArr, function( obj, index ) {
				assertEquals( "this inside the callback should be the passed-in scope", this, that );
			}, this );
			
			tash.each( testArr, function( obj, index ) {
				assertEquals( "default this inside the callback should be the context call", this, tash );
			} );
		}
		
	};
}()) );
