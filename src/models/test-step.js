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