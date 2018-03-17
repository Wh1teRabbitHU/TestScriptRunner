'use strict';

var assert         = require('assert'),
	mocha          = require('mocha'),
	testCaseRunner = require('../../index');

var describe = mocha.describe,
	it       = mocha.it;

describe('Basic module check', function() {
	it('contains all the main components', function() {
		assert.notEqual(testCaseRunner.TestRunner, 'undefined');
		assert.notEqual(testCaseRunner.TestCase, 'undefined');
		assert.notEqual(testCaseRunner.TestStep, 'undefined');
	});
});