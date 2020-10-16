type ErrorFilter<E> = (error: E, handled?: boolean) => boolean;
export type ErrorTrap<E> = (error: E, handled?: boolean) => boolean | ErrorTrap<E>;

export function errorTrap<E extends Error>(handler: ErrorTrap<E>[] | ErrorTrap<E>, ...filters: ErrorFilter<E>[]): ErrorTrap<E> {
	return (error: E, handled: boolean = false) => filters.every(f => f(error, handled))
		? (error) => {
			const handlers: ErrorTrap<E>[] = [].concat(handler);
			let handled = false;

			for (let handler of handlers) {
				handled = handler(error, handled);
			}

			return handled;
		}
		: false;
}

function processTrap<E>(error: E): boolean {
	const handlers: ErrorTrap<E>[] = [].concat(handler);
	let handled = false;

	for (let handler of handlers) {
		const res = handler(error, handled);

		if(typeof res === 'function') {
			handled = processTrap(error);
		} else {
			handled = res;
		}
	}

	return handled;
}
