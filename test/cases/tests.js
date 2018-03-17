'use strict';

var assert         = require('assert'),
	mocha          = require('mocha'),
	testCaseRunner = require('../../index');

var describe = mocha.describe,
	it       = mocha.it;

const testCaseName = 'Test case name';
const testCaseDescription = 'Test case description';

const testStepName = 'Test step name';
const testStepDescription = 'Test step description';
const testFn1ReturnValue = 'Returned from test function 1';
const testFn2ReturnValue = 'Returned from test function 2';
const testFn3ReturnValue = 'Returned from test function 3';
const testFn4ReturnValue = 'Returned from test function 4';

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

describe('Checking test runs', function() {
	it('run "TestStep" test function and returns with its return value', function() {
		let testStep1 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testFn1 }),
			testStep2 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testFn2 });

		assert.equal(testStep1.run(), testFn1ReturnValue);
		assert.equal(testStep2.run(), testFn2ReturnValue);
	});

	it('run "TestCase" current "TestStep" and returns with its return value', function() {
		let testCase = new testCaseRunner.TestCase({ name: testCaseName, description: testCaseDescription }),
			testStep1 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testFn1 }),
			testStep2 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testFn2 }),
			testStep3 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testFn3 }),
			testStep4 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testFn4 });

		testCase.addTestStep(testStep1);
		testCase.addTestStep(testStep2);
		testCase.addTestStep(testStep3);
		testCase.addTestStep(testStep4);

		assert.equal(testCase.runCurrentStep(), testFn1ReturnValue);
		assert.equal(testCase.currentStepNumber, testStep1.stepNumber);

		assert.equal(testCase.runNextStep(), testFn2ReturnValue);
		assert.equal(testCase.currentStepNumber, testStep2.stepNumber);

		assert.equal(testCase.runNextStep(), testFn3ReturnValue);
		assert.equal(testCase.currentStepNumber, testStep3.stepNumber);

		assert.equal(testCase.runPrevStep(), testFn2ReturnValue);
		assert.equal(testCase.currentStepNumber, testStep2.stepNumber);

		assert.equal(testCase.runPrevStep(), testFn1ReturnValue);
		assert.equal(testCase.currentStepNumber, testStep1.stepNumber);

		assert.equal(testCase.runStep(4), testFn4ReturnValue);
		assert.equal(testCase.currentStepNumber, testStep4.stepNumber);
	});
});