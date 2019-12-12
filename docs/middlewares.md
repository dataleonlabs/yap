## YAP application

The object created when executing `new Yap()` is known as the Yap application object.

The application object is Yap's interface with node's HTTP server and handles the registration
of middleware, dispatching to the middleware from HTTP, default error handling, as well as
configuration of the context, request and response objects.

Learn more about the application object in the [Application API reference](docs/api/index.md).

Please distinguish **Yap** (the core project of Young App) and **YAP** (the platform of Young App).

## Middleware

Yap is a middleware framework that can take two different kinds of functions as middleware:

  * async function
  * common function

Here is an example of logger middleware with each of the different functions:

### ___async___ functions (node v7.6+)

```js
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
```

### Common function

```js
// Middleware normally takes two parameters (ctx, next), ctx is the context for one request,
// next is a function that is invoked to execute the downstream middleware. It returns a Promise with a then function for running code after completion.

app.use((ctx, next) => {
  const start = Date.now();
  return next().then(() => {
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });
});
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
HTTP requests, which delegate to an [IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage)
from the node `http` module.

Here is an example of checking that a requesting client supports XML.

```js
app.use(async (ctx, next) => {
  ctx.assert(ctx.request.accepts('xml'), 406);
  // equivalent to:
  // if (!ctx.request.accepts('xml')) ctx.throw(406);
  await next();
});
```

Yap provides a `Response` object as the `response` property of the `Context`.  
Yap's `Response` object provides helpful methods for working with
HTTP responses which delegate to a [ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse).  

Yap's pattern of delegating to Node's request and response objects rather than extending them
provides a cleaner interface and reduces conflicts between different middleware and with Node
itself as well as providing better support for stream handling. The `IncomingMessage` can still be
directly accessed as the `req` property on the `Context` and `ServerResponse` can be directly
accessed as the `res` property on the `Context`.

Here is an example using YAP's `Response` object to stream a file as the response body.

```js
app.use(async (ctx, next) => {
  await next();
  ctx.response.type = 'xml';
  ctx.response.body = fs.createReadStream('really_large.xml');
});
```

The `Context` object also provides shortcuts for methods on its `request` and `response`. In the prior
examples, `ctx.type` can be used instead of `ctx.response.type` and `ctx.accepts` can be used
instead of `ctx.request.accepts`.

For more information on `Request`, `Response`, and `Context`, see the [Request API reference](docs/api/request.md),
[Response API reference](docs/api/response.md) and [Context API reference](docs/api/context.md).
