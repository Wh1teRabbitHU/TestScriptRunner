'use strict';

class TestRunner {

	constructor() {
		this.testCases = [];
		this.caseCounter = 0;
	}

	addTestCase(testCase) {
		this.testCases.push(testCase);

		testCase.setTestRunner(this);
	}
}

module.exports = TestRunner;