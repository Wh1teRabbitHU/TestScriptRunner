'use strict';

class TestRunner {

	constructor() {
		this.testCases = [];
	}

	get caseCounter() {
		return this.testCases.length;
	}

	addTestCase(testCase) {
		this.testCases.push(testCase);

		testCase.setTestRunner(this);
	}
}

module.exports = TestRunner;