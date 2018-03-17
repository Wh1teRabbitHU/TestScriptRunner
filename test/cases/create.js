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
const defaultCurrentStepId = 0;

const testStepName = 'Test step name';
const testStepDescription = 'Test step description';

function testStepFn() {}

describe('Creating "TestRunner" instance and checking for its attributes', function() {
	it('contains all the main attributes', function() {
		let testRunner = new testCaseRunner.TestRunner();

		assert.deepEqual(testRunner.testCases, defaultTestCases);
		assert.deepEqual(testRunner.caseCounter, defaultCaseCounter);
	});
});

describe('Creating "TestCase" instance and checking for its attributes', function() {
	it('contains all the main attributes', function() {
		let testCase = new testCaseRunner.TestCase({ name: testCaseName, description: testCaseDescription });

		assert.deepEqual(testCase.name, testCaseName);
		assert.deepEqual(testCase.description, testCaseDescription);
		assert.deepEqual(testCase.steps, defaultTestSteps);
		assert.deepEqual(testCase.stepCounter, defaultStepCounter);
		assert.deepEqual(testCase.currentStepId, defaultCurrentStepId);
	});
});

describe('Creating "TestStep" instance and checking for its attributes', function() {
	it('contains all the main attributes', function() {
		let teststep = new testCaseRunner.TestStep({ name: testStepName, description: testStepDescription, fn: testStepFn });

		assert.deepEqual(teststep.name, testStepName);
		assert.deepEqual(teststep.description, testStepDescription);
		assert.deepEqual(teststep.fn, testStepFn);
	});
});