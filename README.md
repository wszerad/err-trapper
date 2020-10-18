# error-trap
Simple library created to help with handling complicated logic of Errors 

## Usage
```ts
// typical usage
someXhrPost()
    .catch(errorTrap([
        errorTrap(e => console.log('server error'), trapStatus(500, 503)),
        errorTrap(e => console.log('connection error'), trapStatus(403, 404)),
        errorTrap([
            errorTrap(e => console.log('Unknown user'), trapCode('1001')),
            errorTrap(e => console.log('Bad password'), trapCode('1002'))
        ], trapStatus(400)),
    ]))
    .catch(e => console.log('Uncatched error!'))

// multiple handlers
Promise.reject(new AnyError())
    .catch(
        errorTrap([
                () => handler1(),
                () => handler2(),
            ],
            e => e instanceof ValidationError 
        )
    )

// handled flag
Promise.reject(new AnyError())
    .catch(
        errorTrap([
            errorTrap(() => handler1(), e => e instanceof ValidationError),
            errorTrap((e, handled) => {
                if (handled) {
                    console.log('error already handled by previous handler');
                } else {
                    handler2();
                }   
            }),
            errorTrap(() => console.log('never call'), (e, handled) => !handled)
        ])
    )
```

## errorTrap(handler, ...filters)

* handler: ErrorTrap | ErrorTrap[]
> handler or list of error handlers 
* filters: ErrorFilter[]
> list of filters required to match before run handlers

```ts
type ErrorFilter<E> = (error: E, handled?: boolean) => boolean;
type ErrorTrap<E, R = any> = (error: E, handled?: boolean) => R;
```

## helper filter functions

### trapStatus(...statuses) 
### trapErrorType(...types)
### trapCode(...codes)
### trapUnhandled
