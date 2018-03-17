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