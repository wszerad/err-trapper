import 'mocha';
import { expect } from 'chai';
import { errorTrap } from '../src/trap';
import { trapCode, trapErrorType } from '../src/traps';

describe('errorTrap', () => {
	let errorReject: Promise<never>;

	beforeEach(() => {
		errorReject = errorEmitter();
	});

	it('parallel patch of catching', next => {
		errorReject
			.catch(errorTrap([
				errorTrap(() => true),
				errorTrap(() => true, trapCode(200)),
			]))
			.then(t => {
				expect(t).to.be.equal(true);
				next();
			});
	});

	it('parallel patch of catching witch handled flag', next => {
		errorReject
			.catch(errorTrap([
				errorTrap(() => true),
				errorTrap((error, handled) => expect(handled).to.be.equal(true)),
			]))
			.then(t => {
				expect(t).to.be.equal(true);
				next();
			});
	});

	it('parallel patch of catching (unchatched)', next => {
		errorReject
			.catch(errorTrap([
				errorTrap(() => true, trapCode(200)),
				errorTrap(() => true, trapCode(200)),
			]))
			.catch(t => {
				expect(t).to.be.an('error');
				next();
			});
	});

	it('flat patch of catching', next => {
		errorReject
			.catch(errorTrap(() => true, trapErrorType(Error)))
			.then(t => {
				expect(t).to.be.equal(true);
				next();
			});
	});

	it('flat patch of catching (unchatched)', next => {
		errorReject
			.catch(errorTrap(() => true, trapCode(200)))
			.catch(t => {
				expect(t).to.be.an('error');
				next();
			});
	});
});

function errorEmitter() {
	return Promise.reject(new Error());
}
