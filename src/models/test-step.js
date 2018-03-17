'use strict';

const TestResult                = require('./test-result');
const FunctionNotFoundException = require('../exceptions/function-not-found');

class TestStep {

	constructor({ name, description, fn }) {
		this.name = name;
		this.description = description;
		this.fn = fn;
		this.runNumber = 0;
		this.lastResult = null;
	}

	setTestCase(parentCase) {
		this.parentCase = parentCase;
		this.stepNumber = ++parentCase.stepCounter;
	}

	run() {
		if (typeof this.fn == 'undefined' || this.fn === null) {
			throw new FunctionNotFoundException('No test function provided to this step function!', {
				caseNumber: this.parentCase.caseNumber,
				stepNumber: this.stepNumber
			});
		}

		let testResult;

		this.runNumber++;

		try {
			let returnValue = this.fn();

			testResult = new TestResult({
				success: true,
				error: null,
				returnValue: returnValue,
				testStep: this,
				runNumber: this.runNumber
			});
		} catch (error) {
			testResult = new TestResult({
				success: false,
				error: error,
				returnValue: null,
				testStep: this,
				runNumber: this.runNumber
			});
		}

		this.lastResult = testResult;

		return testResult;
	}

	reset() {
		this.runNumber = 0;
		this.lastResult = null;
	}

}

module.exports = TestStep;