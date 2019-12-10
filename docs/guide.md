# Usage and Getting Started
Yap is a microservices API gateway that sits at the heart of any microservices or serverless architecture, which aims to be a smaller, more expressive, and more robust foundation for API management and automation workflows with low-code approach and security.

### Middleware

Yap is a middleware framework work only on async functions:
Here is an example of logger middleware with each of the different functions:

##### ___async___ functions

```js
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
```

### Context, Request and Response

Each middleware receives a Yap `Context` object that encapsulates an incoming
http aws lambda trigger message and the corresponding response to that message.  `ctx` is often used
as the parameter name for the context object similar to koa or ExpressJS.

```js
app.use(async (ctx, next) => { await next(); });
```

Yap provides a `Request` object as the `request` property of the `Context`.

### Connectors

API management is the process of creating and publishing web application programming interfaces (APIs), enforcing their usage policies, controlling access, nurturing the subscriber community, collecting and analyzing usage statistics, and reporting performance. API Management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security, and protection.

### Policies

It’s important to realize that exposing your API services makes easier to manage them. Why? When you keep your API policies separate, you ensure control over their performance and delivery. Independence is the key to your API policies’ success and future deployment.

Further, it’s important to modernize your API strategy. Keeping API well-structured prevents overexposing API that results in stucking in little things. Unifying API policies simplifies API management.

### Application

A Yap application is an object containing an array of middleware functions and policies which are composed and executed in a stack-like manner upon request. Yap is similar to many other middleware systems that you may have encountered such as Koa, Connect.

The obligatory hello world application:

```
const Yap = require('@youngapp/yap');
const app = new Yap();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

export default app
```

#### Usage with TypeScript
The YAP for JavaScript bundles TypeScript definition files for use in TypeScript projects and to support tools that can read `.d.ts` files.
Our goal is to keep these TypeScript definition files updated with each release for any public api.

#### Pre-requisites
Before you can begin using these TypeScript definitions with your project, you need to make sure your project meets a few of these requirements:

 * Use TypeScript v2.x
 * Includes the TypeScript definitions for node. You can use npm to install this by typing the following into a terminal window:

    ```sh
    npm install --save-dev @types/node
    ```

 * If you are targeting at es5 or older ECMA standards, your `tsconfig.json` has to include `'es5'` and `'es2015.promise'` under `compilerOptions.lib`.
 See [tsconfig.json](https://github.com/youngapp/yap-sdk-js/blob/master/ts/tsconfig.json) for an example.
 

## Documentation

 - [Usage Guide](docs/guide.md)
 - [Connectors](docs/connectors.md)
 - [Policies](docs/connectors.md)
 - [Error Handling](docs/error-handling.md)
 - [FAQ](docs/faq.md)
 - [API documentation](docs/api/index.md)
