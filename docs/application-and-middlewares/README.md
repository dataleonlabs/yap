# Application and resolvers

### Yap application

The object created when executing `new Yap()` is known as the Yap application object.

The application object is Yap's interface with functions. The application handles the registration of resolvers, dispatching to the resolvers from GraphQL, default error handling, as well as configuration of the arguments, context, request and response objects.

{% hint style="info" %}
Please distinguish:  
**Yap** – the **core project** of Young App.   
**YAP** – the **platform** of Young App.
{% endhint %}

### Resolvers

Yap is the middleware framework that can take two different kinds of functions as middleware:

* async function

### Arguments, Context, request, and response

Each resolvers receives a Yap `Context` object that encapsulates an incoming HTTP message and the corresponding response to that message. `ctx` is often used as the parameter name for the context object.

```typescript
import { Info, Arguments, Context } from "@youngapp/yap";
import { DataConnector } from "@youngapp/rds";
import conn from "./connections.ts";

// Connections
const dataConnector = new DataConnector(...conn.DATAQ);

const resolvers = {
  Query: {
    book: async (parent: any, args: Arguments, context: Context, info: Info) => {
      return dataConnector.findOne({ table: 'books', where: { name: args.id } });
    },
  },
};
```

Yap provides a `Request` object as the `request` property of the `Context`.  
Yap's `Request` object provides helpful methods for working with HTTP requests from serverless functions.

Yap's pattern of delegating to Node's request and response objects rather than extending them provides a cleaner interface and reduces conflicts between different middleware and with Node itself as well as providing better support for stream handling. The `IncomingMessage` can still be directly accessed as the `req` property on the `Context` and `ServerResponse` can be directly accessed as the `res` property on the `Context`.

