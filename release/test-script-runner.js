(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var TestRunner = require('./modules/test-script-runner');
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
},{"./models/test-case":2,"./models/test-step":3,"./modules/test-script-runner":4}],2:[function(require,module,exports){
'use strict';

const FIRST_STEP_ID = 1;

class TestCase {

	constructor({ name, description }) {
		this.name = name;
		this.description = description;
		this.steps = [];
		this.stepCounter = 0;
		this.currentStepId = FIRST_STEP_ID - 1;
	}

	setTestRunner(testRunner) {
		this.testRunner = testRunner;
		this.caseNumber = ++testRunner.caseCounter;
	}

	addTestStep(testStep) {
		this.steps.push(testStep);

		testStep.setTestCase(this);
	}

	runPrevStep() {
		if (this.currentStepId <= FIRST_STEP_ID) {
			return;
		}

		this.currentStepId--;
		this.runCurrentStep();
	}

	runNextStep() {
		if (this.currentStepId >= this.stepCounter) {
			return;
		}

		this.currentStepId++;
		this.runCurrentStep();
	}

	runStep(stepId) {
		if (stepId > this.stepCounter || stepId < FIRST_STEP_ID) {
			console.log('The given ID is not valid, its out of bound: ' + stepId);

			return;
		}

		this.currentStepId = stepId;
		this.runCurrentStep();
	}

	runCurrentStep() {
		let self = this,
			currentStep = self.steps.find((step) => {
				return step.stepNumber === self.currentStepId;
			});

		if (typeof currentStep == 'undefined') {
			console.log('Cannot be found step with the following ID: ' + self.currentStepId);

			return;
		}

		currentStep.run();
	}

}

module.exports = TestCase;
},{}],3:[function(require,module,exports){
'use strict';

class TestStep {

	constructor({ name, description, fn }) {
		this.name = name;
		this.description = description;
		this.fn = fn;
	}

	setTestCase(parentCase) {
		this.parentCase = parentCase;
		this.stepNumber = ++parentCase.stepCounter;
	}

	run() {
		if (typeof this.fn == 'undefined') {
			return;
		}

		this.fn();
	}

}

module.exports = TestStep;
},{}],4:[function(require,module,exports){
'use strict';

let cases = [];

var caseCounter = 0;

function testCases() {
	return cases;
}

function addCase(testCase) {
	cases.push(testCase);

	testCase.caseNumber = ++caseCounter;
}

module.exports = {
	testCases: testCases,
	addCase: addCase
};
},{}]},{},[1]);

//# sourceMappingURL=test-script-runner.js.map
