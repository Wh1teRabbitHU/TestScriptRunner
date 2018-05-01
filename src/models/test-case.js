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