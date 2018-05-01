# TestScriptRunner

## Description

It helps to connect selenium with javascript modules. You can define functions both synchronously and asynchronously to run them directly or bind to buttons, or other HTML elements. (It's all up to you and your implementation!) This library is lightweight, does not contain any GUI solution, only the runner classes.

## Table of contents

- Requirements
- Installation
- Usage
- API descriptions
- Example
- Plans

## Requirements

By default this library written for es-6, but if you need to support older browsers or ie, you can pick the babelified version from the release folder!
No external libraries are needed!

## Installation

It can be installed from npm:

```sh
npm install --save-dev test-script-runner
```

Also you can download directly from this github page. The release folder contains 3 different version of this library:

- Normal js file, without any compression or transformation (test-script-runner.js)
- Minified version (test-script-runner.min.js)
- Babelified version with js-5 compability (test-script-runner-babel.min.js)

All three version has its own map file if it needed! If you choose manual installation, no other libraries are needed, all the required codes are included in these files!

## Usage

The root module contains the following 3 classes:

- TestRunner
- TestCase
- TestStep

If you use this library from your browser, these classes can be found in the ``` window.TestScriptRunner ``` object. It will only work if the 'TestScriptRunner' name is not taken in the global namespace!

### TestRunner

The root element, it holds all the test cases assigned to it. You can make many instances if you need.

- testCases: All the TestCases assigned to this instance
- caseCounter: Its just an inner counter

### TestCase

The main test handler class. It can be added to a TestRunner instance. Every test case has its own TestStep list. It has methods that can run or jump between test steps.

- name: The given name for this test case instance
- description: The given descriptionn for this test case instance
- caseNumber: The current instances unique ID. (relative to its parent TestRunner)
- testRunner: The parent TestRunner instance
- testSteps: All the TestSteps assigned to this instance
- currentStepNumber: The current index number of the test steps. When you run and step forward or backwards, this variable will follow these actions.

### TestStep

The smallest tester unit in this library. It holds a runnable function and the last run's result.

- name: The given name for this test step instance
- description: The given descriptionn for this test step instance
- fn: It contains the runnable function. Not required when creating a new instance, but it is when you try to run the step!
- stepNumber: The current instances unique ID. (relative to its parent TestCase)
- testCase: The parent TestCase instance
- runNumber: A run counter, it will be increased when an execution finished and it not depends on the result! (both success and error count!)
- lastResult: The result information of the last run.

Other classes:

### TestResult

This is a model class. It contains many information about a certain test step execution:

- success: True if the execution didn't throw an error
- error: When an error occured, this variable contains the error object
- returnValue: The given functions return value.
- testStep: The corresponding TestStep intance.
- runNumber: Indicates that how many times this step executed

## API descriptions

| Class name |  Method name   |                             Arguments                              |                                                                                                                                                                                            Description                                                                                                                                                                                            |
|------------|----------------|--------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| TestRunner | [Constructor]  | -                                                                  | The default constructor for the TestRunner class. It will initialize all the inner attributes.                                                                                                                                                                                                                                                                                                    |
|            | addTestCase    | TestCase testCase (required)                                       | Adding a test case to the runner. It will set the parent-child connection .                                                                                                                                                                                                                                                                                                                       |
| TestCase   | [Constructor]  | Object data (optional) { name, description }                       | The default constructor for the TestCase class. Optionaly you can provide some basic information to the instance. (name and description)                                                                                                                                                                                                                                                          |
|            | stepCounter    | -                                                                  | Count the steps and return with it                                                                                                                                                                                                                                                                                                                                                                                                  |
|            | currentStep    | -                                                                  | Returns the current step from the steps array                                                                                                                                                                                                                                                                                                                                                     |
|            | setTestRunner  | TestRunner testRunner (required)                                   | It set the parent runner entity for this instance.                                                                                                                                                                                                                                                                                                                                                |
|            | addTestStep    | TestStep testStep (required)                                       | Adding a test step to the case. It will set the parent-child connection.                                                                                                                                                                                                                                                                                                                          |
|            | hasPrevStep    | -                                                                  | If the current step index point to the first step, then it returns false, otherwise true.                                                                                                                                                                                                                                                                                                         |
|            | hasNextStep    | -                                                                  | If the current step index point to the last step, then it returns false, otherwise true.                                                                                                                                                                                                                                                                                                          |
|            | runPrevStep    | Boolean async (optional, default false)                            | First it will check if it has any previous step. (if not, it will throw an OutOfBoundException) then it will change the current step index and run the step. If the async attribute is true, then it will run the step's task async and returns a Promise object                                                                                                                                  |
|            | runNextStep    | Boolean async (optional, default false)                            | First it will check if it has any next step. (if not, it will throw an OutOfBoundException) then it will change the current step index and run the step. If the async attribute is true, then it will run the step's task async and returns a Promise object                                                                                                                                      |
|            | runStep        | Integer stepId (required), Boolean async (optional, default false) | First it will check if the given step ID is valid. (if not, it will throw an OutOfBoundException) then it will change the current step index and run the step. If the async attribute is true, then it will run the step's task async and returns a Promise object                                                                                                                                |
|            | runCurrentStep | Boolean async (optional, default false)                            | It will run the current test step. If the async attribute is true, then it will run the step's task async and returns a Promise object                                                                                                                                                                                                                                                            |
| TestStep   | [Constructor]  | Object data (optional) { name, description, fn }                   | The default constructor for the TestStep class. It will initialize all the inner attributes.                                                                                                                                                                                                                                                                                                      |
|            | setTestCase    | TestCase testCase (required)                                       | It set the parent case entity for this instance.                                                                                                                                                                                                                                                                                                                                                  |
|            | run            | -                                                                  | It will execute the given function. If no function provided or the fn variable is null, then it will throw a FunctionNotFoundException. When the function's execution finished, the instance create a result entity and return with it. (Also it will update the lastResult variable)                                                                                                             |
|            | runAsync       | -                                                                  | It will execute the given function asynchronously. If no function provided or the fn variable is null, then it will throw a FunctionNotFoundException. When the function's execution started, the instance return with a Promise object. When the execution is finished it will trigger either the resolve or reject branch and forward the result. (Also it will update the lastResult variable) |
|            | reset          | -                                                                  | This method will reset both this instance's runNumber and the lastResult variable                                                                                                                                                                                                                                                                                                                 |

## Example

The following example is just a basic test case, with 3 simple steps:

```js
'use strict';

var assert         = require('assert'), // Optional assertion library
	testCaseRunner = require('test-case-runner'); // If you use from your browser, change this row to the following: var testCaseRunner = window.TestScriptRunner;

var TestRunner = testCaseRunner.TestRunner,
	TestCase   = testCaseRunner.TestCase,
	TestStep   = testCaseRunner.TestStep;

var myTestRunner = new TestRunner(),
	myTestCase   = new TestCase({ name: 'My test case', description: 'Small checks and tests here and there!' }),
	myTestStep1  = new TestStep({ name: 'First step', description: 'It will check some arbitrary operations.', fn: function() {
		var a = 8,
			b = 2,
			sum = 10,
			sub = 6,
			mul = 16,
			div = 4;

		assert.equal(a + b, sum);
		assert.equal(a - b, sub);
		assert.equal(a * b, mul);
		assert.equal(a / b, div);
	} }),
	myTestStep2  = new TestStep({ name: 'Second step', description: 'Beware, it should throw an assertion error!', fn: function() {
		var a = 100,
			b = 200;

		assert.equal(a, b);
	} }),
	myTestStep3  = new TestStep({ name: 'Third step', description: 'Just an other test step, dont worry about it!', fn: function() {
		var a = 'I am a text',
			b = 'me too!';

		assert.notEqual(a, b);
		assert.equal(typeof a, typeof b);
	} });

myTestRunner.addTestCase(myTestCase);

myTestCase.addTestStep(myTestStep1);
myTestCase.addTestStep(myTestStep2);
myTestCase.addTestStep(myTestStep3);

var result = myTestCase.runCurrentStep();

console.log(result); // It will log the result information of the first test step run

result = myTestCase.runNextStep(); // Wont throw an error, just collecting the data to the result object

console.log(result); // It will log the result information of the first test step run

myTestCase.runCurrentStep(true) // Running the next step wrapped in a Promise object!
	.then(console.log)
	.catch(console.error); // catching the error with all the data

myTestCase.currentStepNumber = 0; // Starting from 0

while (myTestCase.hasNextStep()) {
	var stepResult = myTestCase.runNextStep();

	console.log(stepResult);
}

console.log(myTestStep3.lastResult); // Did you missed this step's result? Dont worry, it will be stored for you!

```

## Plans

- Adding helper functions to the runner, like the ones in the TestCase (hasPrevCase, hasNextCase, selectCase, currentCase)
- More detailed history, not just the last run's result
- Adding TestCase level result entity (some kind of summary for all the test steps results)
- Adding statistic to the TestRunner entity