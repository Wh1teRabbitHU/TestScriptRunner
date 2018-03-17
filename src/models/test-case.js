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