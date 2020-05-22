# Usage and getting started

## Introduction

Yap is a microservices API gateway that shines at the heart of any microservices or serverless architecture, which aims to be a smaller, more expressive, and more robust foundation for API management and automation workflows with low-code approach and security.

### 1. GraphQL schema <a id="step-3-define-your-graphql-schema"></a>

**GraphQL schema** define the structure of data that clients can query. In this example, we'll create a server for querying a collection of books by title and author.

```graphql
# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

# This "Book" type defines the queryable fields for every book in our data source.
type Book {
  title: String
  author: String
}

# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
type Query {
  books: [Book]
}
```

### Resolvers

Yap is a resolvers framework work only on GraphQL. Each resolvers receives a Yap `Context` object that encapsulates an incoming HTTP AWS Lambda trigger message and the corresponding response to that message, and arguments from GraphQL  
`ctx` is often used as the parameter name for the context object similar to Koa or ExpressJS.

```javascript
const resolvers = {
  Query: {
    books: async (parent: any, args: Argument, context: Context, info: Info) => {
      // ...
    },
  },
};
```

### Connectors

API management is the process of creating and publishing web application programming interfaces \(APIs\), enforcing their usage policies, controlling access, nurturing the subscriber community, collecting and analyzing usage statistics, and reporting performance. API management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security, and protection.

```javascript
import { Info, Argument, Context } from "@youngapp/yap";
import { DataConnector } from "@youngapp/rds";
import conn from "./connections.ts";

// Connections
const dataConnector = new DataConnector(...conn.DATAQ);

const resolvers = {
  Query: {
    books: async (parent: any, args: Argument, context: Context, info: Info) => {
      return dataConnector.findOne({ table: 'books' });
    },
  },
};
```

### Policies

It’s important to realize that exposing your API services makes easier to manage them. Why?   
When you keep your API policies separate, you ensure control over their performance and delivery. Independence is the key to your API policies’ success and future deployment.

Further, it’s important to modernize your API strategy.   
  
Keeping API well-structured prevents overexposing API that results in stucking in little things. Unifying API policies simplifies API management.

```markup
<check-header name="Authorization" failed-check-httpcode="401" failed-check-error-message="Not authorized" ignore-case="false">
    <value>f6dc69a089844cf6b2019bae6d36fac8</value>
</check-header>
```

### Application

Yap application is an object containing an array of middleware functions and policies which are composed and executed in a stack-like manner upon request. Yap is similar to many other middleware systems that you may have encountered such as Koa, Connect.

The obligatory workflow application:

```typescript
import { Yap } from "@youngapp/yap";
import typeDefs from "./schema.graphql";
import resolvers from "./resolvers.ts";
import policies from "./policies.xml";

// The Yap constructor requires three parameters: your schema
// definition, policies and your set of resolvers.
const app = new Yap({ typeDefs, resolvers, policies });

// A simple typescript node project for AWS Lambda.
exports.handler = app.handler;
```

**Usage with TypeScript**

The Yap for JavaScript bundles TypeScript definition files for use in TypeScript projects and to support tools that can read `.d.ts` files. Our goal is to keep these TypeScript definition files updated with each release for any public API.

**Pre-requisites**

Before you can begin using these TypeScript definitions with your project, you need to make sure your project meets a few of these requirements:

* Use TypeScript v2.x
* Includes the TypeScript definitions for node. You can use `npm` to install this by typing the following into a terminal window:

```bash
 npm install --save-dev @types/node
```

* If you are targeting at es5 or older ECMA standards, your `tsconfig.json` has to include `'es5'` and `'es2015.promise'` under `compilerOptions.lib`. See [tsconfig.json](https://github.com/youngapp/yap-sdk-js/blob/master/ts/tsconfig.json) for an example.

### Installing

It's an official version for JavaScript, available for Node.js backends, Serverless and AWS Lambda.

**With yarn**

```text
yarn install yap
```

**With npm**

```text
npm install yap
```

### Hello API

Yap application is an object containing resolvers functions and policies which are composed and executed in a stack-like manner upon request. Yap is similar to many other middleware systems that you may have encountered such as Koa, Connect.

**Minimalist application with http.Server**

```typescript
import { Yap } from "@youngapp/yap";
import typeDefs from "./schema.graphql";
import resolvers from "./resolvers.ts";

// Your schema definition and resolvers GraphQL
const app = new Yap({ typeDefs, resolvers });

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
```

_\(_[_npx_](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) _comes with npm 5.2+ and higher, see_ [_instructions for older npm versions_](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f)_\)_

Then open [http://localhost:3000/](http://localhost:3000/) to see your api.  
 When you’re ready to deploy to production, create a minified bundle with `npm run build` or `yarn build`.

```text
my-api
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── serverless.yml
├── tslint.json
├── tsconfig.json
└── src
    ├── policies.xml
    ├── schema.graphql
    ├── resolvers.ts
    ├── scenarios.yaml
    └── app.ts
```

