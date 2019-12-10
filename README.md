# Yap API Gateway
Yap is a microservices API gateway that sits at the heart of any microservices or serverless architecture, which aims to be a smaller, more expressive, and more robust foundation for API management and automation workflows with low-code approach and security.

By leveraging async functions, Yap allows you to ditch callbacks and greatly increase error-handling and policies. provides an elegant suite of methods that make writing servers fast and enjoyable, based on Webhooks and HTTP.

## Motivation

The Young App Platform (YAP) helps to automate business workflows across cloud and on-premise apps providing employees with prompt communication and building in teams advanced collaboration. For example, YAP automates quotes processing for cash business, which may involve multiple apps.

Without automated integration, organizations cannot leverage the full power of data in multiple applications, for example, to re-enter data in applications or constantly switch context across applications to accomplish tasks.

YAP combines the enterprise-grade workflow automation platform and ease of use expected from client apps supporting both cloud-based and on-premise systems.


## Installing
It's a official version for JavaScript, available for Node.js backends and AWS Lambda

##### With yarm
```
    yarn add @youngapp/yap
```

##### With npm
```
    npm install @youngapp/yap
```


## Usage and Getting Started

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

 
## Opening Issues
If you encounter a bug with YAP we would like to hear
about it. Search the [existing issues](https://github.com/youngapp/yap/issues)
and try to make sure your problem doesn’t already exist before opening a new
issue. It’s helpful if you include the version of the SDK, Node.js or browser
environment and OS you’re using. Please include a stack trace and reduced repro
case when appropriate, too.

The GitHub issues are intended for bug reports and feature requests. For help
and questions with using the YAP SDK for JavaScript please make use of the
resources listed in the [Getting Help](https://github.com/youngapp/yap#getting-help)
section. There are limited resources available for handling issues and by
keeping the list of open issues lean we can respond in a timely manner.

## License

This SDK is distributed under the GNU General Public License v3.0
see LICENSE.txt and NOTICE.txt for more information.
