'use strict';

const OutOfBoundException   = require('../exceptions/out-of-bound');
const StepNotFoundException = require('../exceptions/step-not-found');

const FIRST_STEP_ID = 1;

class TestCase {

	constructor({ name, description }) {
		this.name = name;
		this.description = description;
		this.testSteps = [];
		this.stepCounter = 0;
		this.currentStepNumber = FIRST_STEP_ID;
	}

	setTestRunner(testRunner) {
		this.testRunner = testRunner;
		this.caseNumber = ++testRunner.caseCounter;
	}

	addTestStep(testStep) {
		this.testSteps.push(testStep);

		testStep.setTestCase(this);
	}

	hasPrevStep() {
		return this.currentStepNumber > FIRST_STEP_ID;
	}

	hasNextStep() {
		return this.currentStepNumber < this.stepCounter;
	}

	runPrevStep() {
		if (this.currentStepNumber <= FIRST_STEP_ID) {
			throw new OutOfBoundException('Cannot run the previous step, because the current one is the first one!', {
				caseNumber: this.caseNumber,
				currentStepNumber: this.currentStepNumber
			});
		}

		this.currentStepNumber--;

		return this.runCurrentStep();
	}

	runNextStep() {
		if (this.currentStepNumber >= this.stepCounter) {
			throw new OutOfBoundException('Cannot run the next step, because the current one is the last one!', {
				caseNumber: this.caseNumber,
				currentStepNumber: this.currentStepNumber
			});
		}

		this.currentStepNumber++;

		return this.runCurrentStep();
	}

	runStep(stepId) {
		if (stepId > this.stepCounter || stepId < FIRST_STEP_ID) {
			throw new OutOfBoundException('The given ID is not valid, its out of bound: ' + stepId, {
				caseNumber: this.caseNumber,
				currentStepNumber: this.currentStepNumber
			});
		}

		this.currentStepNumber = stepId;

		return this.runCurrentStep();
	}

	runCurrentStep() {
		let self = this,
			currentStep = self.testSteps.find((step) => {
				return step.stepNumber === self.currentStepNumber;
			});

		if (typeof currentStep == 'undefined') {
			throw new StepNotFoundException('Step not found with the following ID: ' + self.currentStepNumber, {
				caseNumber: this.caseNumber,
				currentStepNumber: this.currentStepNumber
			});
		}

		return currentStep.run();
	}

}

module.exports = TestCase;