---
description: How do I create a connector in Yap ?
---

# How to create connector?

### Introduction

Welcome to the Young App Platform \(YAP\)!

AWS's serverless Lambda functions open a world of possibilities for running on-demand, server-side code without having to run a dedicated server. However, managing service discovery, configuring API gateways, and coordinating deployments between your app and your serverless functions can quickly become overwhelming.

In this tutorial, we’ll walk you through the process of building and testing of connector example on YAP.

API management is the process of creating and publishing web application programming interfaces \(APIs\), enforcing their usage policies, controlling access, nurturing subscriber communities, collecting and analyzing usage statistics, and reporting performance.

### My custom connector

#### Example

```typescript
import { IConnection, IConnector, IField, YapConnector } from "@youngapp/yap";

@YapConnector({
  id: 'example-connector',
  name: 'Example connector',
  category: 'data-processing',
  description: 'The example-connector connector to set the message body for incoming and outgoing requests.',
})
export class ExampleConnector implements IConnector {

    private connection: IConnection;

    constructor(connection: IConnection = {}) {
        this.connection = connection;
    }

    /**
     * Simple action to apply reporting data aws lambda
     */
    public async reporting(fields:IField) {
        // Some manipulations with fields.data...
        return true;
    }

    public test() {
        return true;
    }
}
```

### How to use my connector ?

```javascript
import { Info, Argument, Context } from "@youngapp/yap";
import { ExampleConnector } from "./ExampleConnector.ts";
import conn from "./connections.ts";

// My custom connector
const exampleConnector = new ExampleConnector();

const resolvers = {
  Query: {
    reporting: async (parent: any, args: Argument, context: Context, info: Info) => {
      return exampleConnector.reporting({ data: args.body });
    },
  },
};
```

