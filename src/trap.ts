export type ErrorFilter<E> = (error: E, handled?: boolean) => boolean;
export type ErrorTrap<E, R = any> = (error: E, handled?: boolean) => R;
export type ErrorHandler<E> = ErrorTrap<E> | ErrorTrap<E>[];

export function errorTrap<E extends Error>(handler: ErrorHandler<E>, ...filters: ErrorFilter<E>[]): ErrorTrap<E, true> {
	return (error: E, handled: boolean = false) => {
		const pass = filters.every(f => f(error, handled));

		if (pass) {
			const handlers = [].concat(handler);
			try {
				processTraps<E>(handlers, error, handled);
				return true;
			} catch (e) {
			}
		}

		throw error;
	};
}

function processTraps<E extends Error>(handlers: ErrorTrap<E>[], error: E, handled: boolean) {
	for (let handler of handlers) {
		try {
			const ret = handler(error, handled);

			if (typeof ret === 'function') {
				processTraps([ret], error, handled);
			}

			handled = true;
		} catch (e) {
		}
	}

	if (!handled) {
		throw error;
	}
}
