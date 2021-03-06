import { ErrorTrap } from './trap';

type ErrorWithStatus = Error & { status: number };
type ErrorWithCode<C> = Error & { code: C };

export function trapStatus<E extends ErrorWithStatus>(...statuses: number[]) {
	return (error: E) => error.status && statuses.includes(error.status);
}

export function trapErrorType<E extends Error>(...types: ErrorConstructor[]) {
	return (error: E) => {
		return types.some(type => error instanceof type);
	};
}

export function trapCode<C, E extends ErrorWithCode<C>>(...codes: C[]) {
	return (error: E) => {
		return codes.includes(error.code);
	};
}

export const trapUnhandled: ErrorTrap<any> = (e, h) => !h;
