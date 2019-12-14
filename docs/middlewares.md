## Yap application

The object created when executing `new Yap()` is known as the Yap application object.

The application object is Yap's interface with functions. The application handles the registration
of middleware, dispatching to the middleware from HTTP, default error handling, as well as
configuration of the context, request and response objects.

Please distinguish **Yap** (the core project of Young App) and **YAP** (the platform of Young App).

## Middleware

Yap is a middleware framework that can take two different kinds of functions as middleware:

  * async function
  * sequence function

Here is an example of send sms and create csv:

### Sequence function

```js
app.post('/request?phone', new Sequence([
    async (_, ctx) => twillio.send({ in: ctx.query.phone }),
    async (res) => await csv.save({ data: res }),
]))
```

## Context, request, and response

Each middleware receives a Yap `Context` object that encapsulates an incoming
HTTP message and the corresponding response to that message.  `ctx` is often used
as the parameter name for the context object.

```js
app.all('/', async (ctx, next) => { await next(); });
```

Yap provides a `Request` object as the `request` property of the `Context`.  
Yap's `Request` object provides helpful methods for working with
HTTP requests from serverless functions. 

Yap's pattern of delegating to Node's request and response objects rather than extending them
provides a cleaner interface and reduces conflicts between different middleware and with Node
itself as well as providing better support for stream handling. The `IncomingMessage` can still be
directly accessed as the `req` property on the `Context` and `ServerResponse` can be directly
accessed as the `res` property on the `Context`.

## Documentation

 - [Usage guide](../docs/guide.md)
 - [Application and middlewares](../docs/middlewares.md)
 - [Connectors](../docs/connectors.md)
 - [Policies](../docs/policies.md)
 - [Error handling](../docs/error-handling.md)
 - [FAQ](../docs/faq.md)
