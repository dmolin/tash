describe("Tash tests", function () {
	it("should provide a namespace", function () {
		expect( tash ).toBeDefined();
	});

	it("tash should provide a namespace function", function () {
		expect(typeof tash.namespace).toBe("function");
	});

	describe("Namespace creation", function () {

		it("namespace function should work as expected", function () {
			tash.namespace("test.namespace");
			expect(typeof test.namespace).toBe("object");
			delete test;
		});

		it("namespace creation should be configurable", function () {
			tash.config.namespaceRoot = "test";
			tash.namespace("undertest");
			expect(typeof test).toBe("object");
			expect(typeof test.undertest).toBe("object");
			tash.config.namespaceRoot = "";
			delete test;
		});


	});

});

