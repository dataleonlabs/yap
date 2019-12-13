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

Here is an example of logger middleware with different functions:

### ___async___ functions (node v7.6+)

```js
// Middleware normally takes two parameters (ctx, next), ctx is the context for one request,
// next is a function that is invoked to execute the downstream middleware. It returns a Promise with a then function for running code after completion.

app.post('/hello', async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
```

### Sequence function

```js
app.post('/hello', new Sequence([
  twillio({ API_KEY }).send({ in: 'user' }),
  csv().create({ in: 'data' })
]))
```

## Context, request, and response

Each middleware receives a Yap `Context` object that encapsulates an incoming
HTTP message and the corresponding response to that message.  `ctx` is often used
as the parameter name for the context object.

```js
app.use(async (ctx, next) => { await next(); });
```

Yap provides a `Request` object as the `request` property of the `Context`.  
Yap's `Request` object provides helpful methods for working with
HTTP requests from serverless functions. 

Yap's pattern of delegating to Node's request and response objects rather than extending them
provides a cleaner interface and reduces conflicts between different middleware and with Node
itself as well as providing better support for stream handling. The `IncomingMessage` can still be
directly accessed as the `req` property on the `Context` and `ServerResponse` can be directly
accessed as the `res` property on the `Context`.
