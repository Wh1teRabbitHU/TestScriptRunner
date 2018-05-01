'use strict';

var assert         = require('assert'),
	mocha          = require('mocha'),
	testCaseRunner = require('../../index');

var describe = mocha.describe,
	it       = mocha.it;

const defaultTestCases = [];
const defaultCaseCounter = 0;

const testCaseName = 'Test case name';
const testCaseDescription = 'Test case description';
const defaultTestSteps = [];
const defaultStepCounter = 0;
const defaultCurrentStepNumber = 0;

const testStepName = 'Test step name';
const testStepDescription = 'Test step description';

function testStepFn() {}

describe('Creating instances and checking for its attributes', function() {
	it('create "TestRunner" instance and it contains all the main attributes', function() {
		let testRunner = new testCaseRunner.TestRunner();

		assert.deepEqual(testRunner.testCases, defaultTestCases);
		assert.deepEqual(testRunner.caseCounter, defaultCaseCounter);
	});

	it('create "TestCase" instance and it contains all the main attributes', function() {
		let testCase = new testCaseRunner.TestCase({ name: testCaseName, description: testCaseDescription });

		assert.deepEqual(testCase.name, testCaseName);
		assert.deepEqual(testCase.description, testCaseDescription);
		assert.deepEqual(testCase.testSteps, defaultTestSteps);
		assert.deepEqual(testCase.stepCounter, defaultStepCounter);
		assert.deepEqual(testCase.currentStepNumber, defaultCurrentStepNumber);
	});

	it('create "TestStep" instance and it contains all the main attributes', function() {
		let teststep = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testStepFn });

		assert.deepEqual(teststep.name, testStepName);
		assert.deepEqual(teststep.description, testStepDescription);
		assert.deepEqual(teststep.fn, testStepFn);
	});

	it('create "TestRunner" instance and assign "TestCase" instances to it', function() {
		let testRunner = new testCaseRunner.TestRunner(),
			testCase1 = new testCaseRunner.TestCase({ name: testCaseName, description: testCaseDescription }),
			testCase2 = new testCaseRunner.TestCase({ name: testCaseName, description: testCaseDescription });

		testRunner.addTestCase(testCase1);
		testRunner.addTestCase(testCase2);

		assert.equal(testRunner.caseCounter, 2);
		assert.deepEqual(testRunner.testCases, [ testCase1, testCase2 ]);
	});

	it('create "TestCase" instance and assign "TestStep" instances to it', function() {
		let testCase = new testCaseRunner.TestCase({ name: testCaseName, description: testCaseDescription }),
			testStep1 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testStepFn }),
			testStep2 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testStepFn });

		testCase.addTestStep(testStep1);
		testCase.addTestStep(testStep2);

		assert.equal(testCase.stepCounter, 2);
		assert.deepEqual(testCase.testSteps, [ testStep1, testStep2 ]);
	});

	it('create "TestRunner" instance and assign both "TestCase" and "TestStep" instances to it', function() {
		let testRunner = new testCaseRunner.TestRunner(),
			testCase1 = new testCaseRunner.TestCase({ name: testCaseName, description: testCaseDescription }),
			testCase2 = new testCaseRunner.TestCase({ name: testCaseName, description: testCaseDescription }),
			testStep11 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testStepFn }),
			testStep12 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testStepFn }),
			testStep21 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testStepFn }),
			testStep22 = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testStepFn });

		testCase1.addTestStep(testStep11);
		testCase1.addTestStep(testStep12);

		testCase2.addTestStep(testStep21);
		testCase2.addTestStep(testStep22);

		testRunner.addTestCase(testCase1);
		testRunner.addTestCase(testCase2);

		assert.equal(testRunner.caseCounter, 2);
		assert.equal(testCase1.stepCounter, 2);
		assert.equal(testCase2.stepCounter, 2);
		assert.deepEqual(testRunner.testCases, [ testCase1, testCase2 ]);
		assert.deepEqual(testCase1.testSteps, [ testStep11, testStep12 ]);
		assert.deepEqual(testCase2.testSteps, [ testStep21, testStep22 ]);
	});
});