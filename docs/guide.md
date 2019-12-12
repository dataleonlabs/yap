# Usage and getting started
YAP is a microservices API gateway that shines at the heart of any microservices or serverless architecture, which aims to be a smaller, more expressive, and more robust foundation for API management and automation workflows with low-code approach and security.

### Middleware

YAP is a middleware framework work only on async functions:
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

### Context, request and response

Each middleware receives a YAP `Context` object that encapsulates an incoming
HTTP AWS Lambda trigger message and the corresponding response to that message.  `ctx` is often used
as the parameter name for the context object similar to koa or ExpressJS.

```js
app.use(async (ctx, next) => { await next(); });
```

YAP provides a `Request` object as the `request` property of the `Context`.

### Connectors

API management is the process of creating and publishing web application programming interfaces (APIs), enforcing their usage policies, controlling access, nurturing the subscriber community, collecting and analyzing usage statistics, and reporting performance. API management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security, and protection.

### Policies

It’s important to realize that exposing your API services makes easier to manage them. 
Why? When you keep your API policies separate, you ensure control over their performance and delivery. 
Independence is the key to your API policies’ success and future deployment.

Further, it’s important to modernize your API strategy. Keeping API well-structured prevents overexposing API that results in stucking in little things. Unifying API policies simplifies API management.

### Application

YAP application is an object containing an array of middleware functions and policies which are composed and executed in a stack-like manner upon request. Yap is similar to many other middleware systems that you may have encountered such as Koa, Connect.

The obligatory hello-world application:

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
Our goal is to keep these TypeScript definition files updated with each release for any public API.

#### Pre-requisites
Before you can begin using these TypeScript definitions with your project, you need to make sure your project meets a few of these requirements:

 * Use TypeScript v2.x
 * Includes the TypeScript definitions for node. You can use npm to install this by typing the following into a terminal window:

    ```sh
    npm install --save-dev @types/node
    ```

 * If you are targeting at es5 or older ECMA standards, your `tsconfig.json` has to include `'es5'` and `'es2015.promise'` under `compilerOptions.lib`.
 See [tsconfig.json](https://github.com/youngapp/yap-sdk-js/blob/master/ts/tsconfig.json) for an example.
 

## Installing
It's a official version for JavaScript, available for Node.js backends, Serverless and AWS Lambda

##### With yarm
```
npx @youngapp/yap my-api
cd my-apy
yarn start
```

##### With npm
```
npx @youngapp/yap my-api
cd my-apy
npm start
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))_

Then open [http://localhost:3000/](http://localhost:3000/) to see your app.<br>
When you’re ready to deploy to production, create a minified bundle with `npm run build` or `yarn build`.

It will create a directory called `my-api` inside the current folder.<br>
Inside that directory, it will generate the initial project structure and install the transitive dependencies:

```
my-app
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── serverless.yml
├── tslint.json
├── tsconfig.json
├── jest.config.js
└── src
    ├── app.ts
    └── app.test.js
```

No configuration or complicated folder structures, only the files you need to build your app.<br>
Once the installation is done, you can open your project folder:

```sh
cd my-app
```

### `npm test` or `yarn test`

Runs the test watcher in an interactive mode.<br>
By default, runs tests related to files changed since the last commit.

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes with TypeScript.<br>

Your API is ready to be deployed.

### `npm run deploy` or `yarn deploy`

Deploy the app for production with serverless with `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

Your API is available on a cloud function provider.

## Documentation

 - [Usage Guide](docs/guide.md)
 - [Application and Middlewares](docs/middlewares.md)
 - [Connectors](docs/connectors.md)
 - [Policies](docs/policies.md)
 - [Error Handling](docs/error-handling.md)
 - [FAQ](docs/faq.md)
