(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var TestRunner = require('./models/test-runner');
var TestCase   = require('./models/test-case');
var TestStep   = require('./models/test-step');

if (typeof window.TestScriptRunner == 'undefined') {
	window.TestScriptRunner = {
		TestRunner: TestRunner,
		TestCase: TestCase,
		TestStep: TestStep
	};
} else {
	window.console.log('"TestScriptRunner" global variable already taken!');
}
},{"./models/test-case":6,"./models/test-runner":8,"./models/test-step":9}],2:[function(require,module,exports){
'use strict';

class BaseException {

	constructor(message, errorObj) {
		this.name = this.constructor.name;
		this.message = message + (typeof errorObj == 'undefined' ? '' : '\nDetails: ' + JSON.stringify(errorObj, null, 4)) + '\nStacktrace:';

		Error.captureStackTrace(this, this.constructor);
	}

}

module.exports = BaseException;
},{}],3:[function(require,module,exports){
'use strict';

const BaseException = require('./base');

class FunctionNotFound extends BaseException {}

module.exports = FunctionNotFound;
},{"./base":2}],4:[function(require,module,exports){
'use strict';

const BaseException = require('./base');

class OutOfBound extends BaseException {}

module.exports = OutOfBound;
},{"./base":2}],5:[function(require,module,exports){
'use strict';

const BaseException = require('./base');

class StepNotFound extends BaseException {}

module.exports = StepNotFound;
},{"./base":2}],6:[function(require,module,exports){
'use strict';

const OutOfBoundException   = require('../exceptions/out-of-bound');
const StepNotFoundException = require('../exceptions/step-not-found');

class TestCase {

	constructor({ name, description }) {
		this.name = name;
		this.description = description;
		this.testSteps = [];
		this.currentStepNumber = 0;
	}

	get stepCounter() {
		return this.testSteps.length;
	}

	get currentStep() {
		var self = this;

		return self.testSteps.find((step) => {
			return step.stepNumber === self.currentStepNumber;
		});
	}

	setTestRunner(testRunner) {
		this.testRunner = testRunner;
		this.caseNumber = testRunner.caseCounter - 1;
	}

	addTestStep(testStep) {
		this.testSteps.push(testStep);

		testStep.setTestCase(this);
	}

	hasPrevStep() {
		return this.currentStepNumber > 0;
	}

	hasNextStep() {
		return this.currentStepNumber < this.stepCounter;
	}

	runPrevStep(async = false) {
		if (this.currentStepNumber <= 0) {
			throw new OutOfBoundException('Cannot run the previous step, because the current one is the first one!', {
				caseNumber: this.caseNumber,
				currentStepNumber: this.currentStepNumber
			});
		}

		this.currentStepNumber--;

		return this.runCurrentStep(async);
	}

	runNextStep(async = false) {
		if (this.currentStepNumber + 1 >= this.stepCounter) {
			throw new OutOfBoundException('Cannot run the next step, because the current one is the last one!', {
				caseNumber: this.caseNumber,
				currentStepNumber: this.currentStepNumber
			});
		}

		this.currentStepNumber++;

		return this.runCurrentStep(async);
	}

	runStep(stepId, async = false) {
		if (stepId > this.stepCounter || stepId < 0) {
			throw new OutOfBoundException('The given ID is not valid, its out of bound: ' + stepId, {
				caseNumber: this.caseNumber,
				currentStepNumber: this.currentStepNumber
			});
		}

		this.currentStepNumber = stepId;

		return this.runCurrentStep(async);
	}

	runCurrentStep(async = false) {
		if (typeof this.currentStep == 'undefined') {
			throw new StepNotFoundException('Step not found with the following ID: ' + this.currentStepNumber, {
				caseNumber: this.caseNumber,
				currentStepNumber: this.currentStepNumber
			});
		}

		return async ? this.currentStep.runAsync() : this.currentStep.run();
	}

}

module.exports = TestCase;
},{"../exceptions/out-of-bound":4,"../exceptions/step-not-found":5}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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

	setTestCase(testCase) {
		this.testCase = testCase;
		this.stepNumber = testCase.stepCounter - 1;
	}

	run() {
		if (typeof this.fn == 'undefined' || this.fn === null) {
			throw new FunctionNotFoundException('No test function provided to this step function!', {
				caseNumber: this.testCase.caseNumber,
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

	runAsync() {
		let self = this;

		if (typeof self.fn == 'undefined' || self.fn === null) {
			throw new FunctionNotFoundException('No test function provided to this step function!', {
				caseNumber: self.testCase.caseNumber,
				stepNumber: self.stepNumber
			});
		}

		self.runNumber++;

		return new Promise(function(resolve, reject) {
			try {
				resolve(self.fn());
			} catch (error) {
				reject(error);
			}
		}).then((returnValue) => {
			let testResult = new TestResult({
				success: true,
				error: null,
				returnValue: returnValue,
				testStep: self,
				runNumber: self.runNumber
			});

			self.lastResult = testResult;

			return testResult;
		}).catch((error) => {
			let testResult = new TestResult({
				success: false,
				error: error,
				returnValue: null,
				testStep: self,
				runNumber: self.runNumber
			});

			self.lastResult = testResult;

			throw testResult;
		});
	}

	reset() {
		this.runNumber = 0;
		this.lastResult = null;
	}

}

module.exports = TestStep;
},{"../exceptions/function-not-found":3,"./test-result":7}]},{},[1]);

//# sourceMappingURL=test-script-runner.js.map
