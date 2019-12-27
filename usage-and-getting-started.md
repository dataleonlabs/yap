# Usage and getting started

## Usage and getting started

Yap is a microservices API gateway that shines at the heart of any microservices or serverless architecture, which aims to be a smaller, more expressive, and more robust foundation for API management and automation workflows with low-code approach and security.

#### Middleware

Yap is a middleware framework work only on async functions, Each middleware receives a Yap `Context` object that encapsulates an incoming HTTP AWS Lambda trigger message and the corresponding response to that message.  
`ctx` is often used as the parameter name for the context object similar to koa or ExpressJS.

```javascript
app.post('/hello', async (ctx: Context) => { })
```

#### Connectors

API management is the process of creating and publishing web application programming interfaces \(APIs\), enforcing their usage policies, controlling access, nurturing the subscriber community, collecting and analyzing usage statistics, and reporting performance. API management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security, and protection.

```javascript
app.post('/posts/:id', async (ctx: Context) => {
    const data = await mysql.findOne({ table: 'posts', values: { name: ctx.req.params.id } });
    ctx.body = data;
})
```

#### Policies

It’s important to realize that exposing your API services makes easier to manage them. Why? When you keep your API policies separate, you ensure control over their performance and delivery. Independence is the key to your API policies’ success and future deployment.

Further, it’s important to modernize your API strategy. Keeping API well-structured prevents overexposing API that results in stucking in little things. Unifying API policies simplifies API management.

```markup
<check-header name="Authorization" failed-check-httpcode="401" failed-check-error-message="Not authorized" ignore-case="false">
    <value>f6dc69a089844cf6b2019bae6d36fac8</value>
</check-header>
```

#### Application

Yap application is an object containing an array of middleware functions and policies which are composed and executed in a stack-like manner upon request. Yap is similar to many other middleware systems that you may have encountered such as Koa, Connect.

The obligatory workflow application:

```typescript
import { Yap } from "@youngapp/yap";
import { MySQL } from "@youngapp/rds";
import conn from "./connections.ts";

// Connections
const mysql = new MySQL(...conn.MySQL);

const Yap = require('@youngapp/yap');
const app = new Yap();

app.post('/posts/:id', async (ctx: Context) => {
    const data = await mysql.findOne({ table: 'posts', values: { name: ctx.req.params.id } });
    ctx.body = data;
})

export default app
```

**Usage with TypeScript**

The Yap for JavaScript bundles TypeScript definition files for use in TypeScript projects and to support tools that can read `.d.ts` files. Our goal is to keep these TypeScript definition files updated with each release for any public API.

**Pre-requisites**

Before you can begin using these TypeScript definitions with your project, you need to make sure your project meets a few of these requirements:

* Use TypeScript v2.x
* Includes the TypeScript definitions for node. You can use npm to install this by typing the following into a terminal window:

  ```bash
   npm install --save-dev @types/node
  ```

* If you are targeting at es5 or older ECMA standards, your `tsconfig.json` has to include `'es5'` and `'es2015.promise'` under `compilerOptions.lib`. See [tsconfig.json](https://github.com/youngapp/yap-sdk-js/blob/master/ts/tsconfig.json) for an example.

### Installing

It's a official version for JavaScript, available for Node.js backends, Serverless and AWS Lambda

**With yarm**

```text
npx create yap my-api
cd my-api
yarn start
```

**With npm**

```text
npx create-yap my-api
cd my-api
npm start
```

_\(_[_npx_](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) _comes with npm 5.2+ and higher, see_ [_instructions for older npm versions_](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f)_\)_

Then open [http://localhost:3000/](http://localhost:3000/) to see your app.  
 When you’re ready to deploy to production, create a minified bundle with `npm run build` or `yarn build`.

It will create a directory called `my-api` inside the current folder.  
 Inside that directory, it will generate the initial project structure and install the transitive dependencies:

```text
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

No configuration or complicated folder structures, only the files you need to build your app.  
 Once the installation is done, you can open your project folder:

```bash
cd my-app
```

#### `npm test` or `yarn test`

Runs the test watcher in an interactive mode.  
 By default, runs tests related to files changed since the last commit.

#### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.  
 It correctly bundles in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes with TypeScript.  


Your API is ready to be deployed.

#### `npm run deploy` or `yarn deploy`

Deploy the app for production with serverless with `build` folder.  
 It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  


Your API is available on the platforms of cloud function providers \(AWS, GCP, and Azure\).

