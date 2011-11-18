CommonTest = TestCase( "common functions", (function(){
	//local scope
	return {
		setUp: function() {
		},
		
		testTashNamespaceShouldExist: function() {
			assertObject( "tash namespace should exist" );
		},
		
		testNamespaceFunctionShouldExist: function() {
			assertFunction( "namespace function should exist", tash.namespace );
		},
		
		testNamespaceFunctionShouldCreateNamespaces: function() {
			tash.namespace('tash.test' );
			assertObject( "tast.test scope should exist", tash.test );
		}
	};
}()) );
