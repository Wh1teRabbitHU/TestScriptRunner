'use strict';

var assert                    = require('assert'),
	mocha                     = require('mocha'),
	testCaseRunner            = require('../../index'),
	OutOfBoundException       = require('../../src/exceptions/out-of-bound'),
	StepNotFoundException     = require('../../src/exceptions/step-not-found'),
	FunctionNotFoundException = require('../../src/exceptions/function-not-found');

var describe = mocha.describe,
	it       = mocha.it,
	before   = mocha.before;

const testCaseName = 'Test case name';
const testCaseDescription = 'Test case description';

const testStepName = 'Test step name';
const testStepDescription = 'Test step description';
const testFn1ReturnValue = 'Returned from test function 1';
const testFn2ReturnValue = 'Returned from test function 2';
const testFn3ReturnValue = 'Returned from test function 3';
const testFn4ReturnValue = 'Returned from test function 4';
const testFnErrorReturnValue = 'It should not returned';

function testFn1() {
	return testFn1ReturnValue;
}

function testFn2() {
	return testFn2ReturnValue;
}

function testFn3() {
	return testFn3ReturnValue;
}

function testFn4() {
	return testFn4ReturnValue;
}

function testFnError() {
	assert.equal(true, false);

	return testFnErrorReturnValue;
}

var testCase, testStep1, testStep2, testStep3, testStep4, testStepError;

describe('Checking test runs', function() {

	before(function() {
		testCase = new testCaseRunner.TestCase({ name: testCaseName, description: testCaseDescription });
		testStep1 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testFn1 });
		testStep2 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testFn2 });
		testStep3 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testFn3 });
		testStep4 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testFn4 });
		testStepError = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testFnError });

		testCase.addTestStep(testStep1);
		testCase.addTestStep(testStep2);
		testCase.addTestStep(testStep3);
		testCase.addTestStep(testStep4);
		testCase.addTestStep(testStepError);
	});

	it('run a "TestStep" test successfully and check the returned "TestResult" object', function() {
		let testResult = testStep1.run();

		assert.notEqual(testResult, null);
		assert.equal(testResult.success, true);
		assert.equal(testResult.error, null);
		assert.equal(testResult.returnValue, testFn1ReturnValue);
		assert.deepEqual(testResult.testStep, testStep1);
	});

	it('run a "TestStep" test and check the "lastResult" and "runNumber" attributes', function() {
		let currentRunNumber = testStep2.runNumber,
			testResult = testStep2.run();

		assert.equal(testResult.runNumber, currentRunNumber + 1);
		assert.equal(testStep2.runNumber, currentRunNumber + 1);
		assert.deepEqual(testResult, testStep2.lastResult);
	});

	it('run a "TestStep" test multiple times and reset all the previous runs statistics', function() {
		testStep2.run();
		testStep2.run();
		testStep2.run();

		assert.notEqual(testStep2.runNumber, 0);
		assert.notEqual(testStep2.lastResult, null);

		testStep2.reset();

		assert.equal(testStep2.runNumber, 0);
		assert.equal(testStep2.lastResult, null);
	});

	it('run a "TestStep" test async multiple times and reset all the previous runs statistics', function(done) {
		Promise.all([ testStep2.runAsync(), testStep2.runAsync(), testStep2.runAsync() ])
			.then(function() {
				assert.notEqual(testStep2.runNumber, 0);
				assert.notEqual(testStep2.lastResult, null);

				testStep2.reset();

				assert.equal(testStep2.runNumber, 0);
				assert.equal(testStep2.lastResult, null);

				done();
			})
			.catch(done);
	});

	it('run a "TestStep" test function with error and check the returned "TestResult" object', function() {
		let testResult = testStepError.run();

		assert.notEqual(testResult, null);
		assert.equal(testResult.success, false);
		assert.notEqual(testResult.error, null);
		assert.notEqual(testResult.returnValue, testFnErrorReturnValue);
		assert.equal(testResult.returnValue, null);
		assert.deepEqual(testResult.testStep, testStepError);
	});

	it('run a "TestStep" test async function with error and check the returned "TestResult" object', function(done) {
		testStepError.runAsync()
			.catch(function(testResult) {
				assert.notEqual(testResult, null);
				assert.equal(testResult.success, false);
				assert.notEqual(testResult.error, null);
				assert.notEqual(testResult.returnValue, testFnErrorReturnValue);
				assert.equal(testResult.returnValue, null);
				assert.deepEqual(testResult.testStep, testStepError);

				done();
			})
			.catch(done);
	});

	it('run the "TestCase"\'s "TestStep"\'s and returns with a valid returnValue', function() {
		assert.equal(testCase.runCurrentStep().returnValue, testFn1ReturnValue);
		assert.equal(testCase.currentStepNumber, testStep1.stepNumber);

		assert.equal(testCase.runNextStep().returnValue, testFn2ReturnValue);
		assert.equal(testCase.currentStepNumber, testStep2.stepNumber);

		assert.equal(testCase.runNextStep().returnValue, testFn3ReturnValue);
		assert.equal(testCase.currentStepNumber, testStep3.stepNumber);

		assert.equal(testCase.runPrevStep().returnValue, testFn2ReturnValue);
		assert.equal(testCase.currentStepNumber, testStep2.stepNumber);

		assert.equal(testCase.runPrevStep().returnValue, testFn1ReturnValue);
		assert.equal(testCase.currentStepNumber, testStep1.stepNumber);

		assert.equal(testCase.runStep(3).returnValue, testFn3ReturnValue);
		assert.equal(testCase.currentStepNumber, testStep3.stepNumber);
	});

	it('run the "TestCase"\'s "TestStep"\'s async and returns with a valid returnValue', function(done) {
		testCase.currentStepNumber = 1;

		Promise.resolve()
			.then(function() { return testCase.runCurrentStep(true); })
			.then(function(result) {
				assert.equal(result.returnValue, testFn1ReturnValue);
			})
			.then(function() { return testCase.runNextStep(true); })
			.then(function(result) {
				assert.equal(result.returnValue, testFn2ReturnValue);
			})
			.then(function() { return testCase.runNextStep(true); })
			.then(function(result) {
				assert.equal(result.returnValue, testFn3ReturnValue);
			})
			.then(function() { return testCase.runPrevStep(true); })
			.then(function(result) {
				assert.equal(result.returnValue, testFn2ReturnValue);
			})
			.then(function() { return testCase.runPrevStep(true); })
			.then(function(result) {
				assert.equal(result.returnValue, testFn1ReturnValue);
			})
			.then(function() { return testCase.runStep(3, true); })
			.then(function(result) {
				assert.equal(result.returnValue, testFn3ReturnValue);
			})
			.then(done)
			.catch(done);
	});

	it('check a "TestCase"\'s hasNextStep and hasPrevStep functions', function() {
		let currentStepNumber = testCase.currentStepNumber;

		testCase.currentStepNumber = 1;

		assert.equal(testCase.hasNextStep(), true);
		assert.equal(testCase.hasPrevStep(), false);

		testCase.currentStepNumber = testCase.testSteps.length - 1;

		assert.equal(testCase.hasNextStep(), true);
		assert.equal(testCase.hasPrevStep(), true);

		testCase.currentStepNumber = testCase.testSteps.length;

		assert.equal(testCase.hasNextStep(), false);
		assert.equal(testCase.hasPrevStep(), true);

		testCase.currentStepNumber = currentStepNumber;
	});

	it('check for "stepNumber" errors, OutOfBoundExceptions, FunctionNotFoundException and StepNotFoundException', function() {
		assert.throws(function() {
			testCase.currentStepNumber = testCase.testSteps.length;
			testCase.runNextStep();
		}, OutOfBoundException);

		assert.doesNotThrow(function() {
			testCase.currentStepNumber = testCase.testSteps.length - 1;
			testCase.runNextStep();
		}, OutOfBoundException);

		assert.throws(function() {
			testCase.currentStepNumber = 1;
			testCase.runPrevStep();
		}, OutOfBoundException);

		assert.doesNotThrow(function() {
			testCase.currentStepNumber = 2;
			testCase.runPrevStep();
		}, OutOfBoundException);

		assert.throws(function() {
			testCase.runStep(99);
		}, OutOfBoundException);

		assert.doesNotThrow(function() {
			testCase.runStep(testCase.testSteps.length);
		}, OutOfBoundException);

		assert.throws(function() {
			testCase.currentStepNumber = 99;
			testCase.runCurrentStep();
		}, StepNotFoundException);

		assert.doesNotThrow(function() {
			testCase.currentStepNumber = testCase.testSteps.length;
			testCase.runCurrentStep();
		}, StepNotFoundException);

		assert.throws(function() {
			testStep1.fn = null;
			testStep1.run();
		}, FunctionNotFoundException);

		assert.doesNotThrow(function() {
			testStep1.fn = testFn1;
			testStep1.run();
		}, FunctionNotFoundException);
	});
});