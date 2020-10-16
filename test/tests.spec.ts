import { errorTrap } from '../src/trap';
import { trapCode } from '../src/traps';


describe('', () => {
	let errorReject: Promise<never>;

	beforeEach(() => {
		errorReject = errorEmitter();
	});

	it('', () => {
		errorReject.catch(errorTrap([
			errorTrap(() => {}, trapCode(200)),
			errorTrap(() => {}, trapCode(200)),
		]));
	});
});

function errorEmitter() {
	return Promise.reject(new Error());
}
