'use strict';

class TestResult {

	constructor({ success, error, returnValue, testStep, runNumber }) {
		this.success = success;
		this.error = error;
		this.returnValue = returnValue;
		this.testStep = testStep;
		this.runNumber = runNumber;
	}

}

module.exports = TestResult;