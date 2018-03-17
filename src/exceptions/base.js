'use strict';

class BaseException {

	constructor(message, errorObj) {
		this.name = this.constructor.name;
		this.message = message + (typeof errorObj == 'undefined' ? '' : '\nDetails: ' + JSON.stringify(errorObj, null, 4)) + '\nStacktrace:';

		Error.captureStackTrace(this, this.constructor);
	}

}

module.exports = BaseException;