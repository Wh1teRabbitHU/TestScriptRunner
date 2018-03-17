'use strict';

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

	runPrevStep() {
		if (this.currentStepNumber <= FIRST_STEP_ID) {
			return null;
		}

		this.currentStepNumber--;

		return this.runCurrentStep();
	}

	runNextStep() {
		if (this.currentStepNumber >= this.stepCounter) {
			return null;
		}

		this.currentStepNumber++;

		return this.runCurrentStep();
	}

	runStep(stepId) {
		if (stepId > this.stepCounter || stepId < FIRST_STEP_ID) {
			console.log('The given ID is not valid, its out of bound: ' + stepId);

			return null;
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
			console.log('Cannot be found step with the following ID: ' + self.currentStepNumber);

			return null;
		}

		return currentStep.run();
	}

}

module.exports = TestCase;