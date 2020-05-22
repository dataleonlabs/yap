# Error handling

By providing a throw object, API management allows publishers to respond to error conditions, which may occur during requests processing. The throw object is accessed through the `context.LastError` property and can be used by policies in the on-error policy section. This article provides a reference for the error handling capabilities in API management.

Policies in API management are divided into `inbound`, `outbound`, and `on-error` sections as shown in the following example.

During the processing of a request, built-in steps are executed along with any policies, which are in scope for the request. If an error occurs, processing immediately jumps to the on-error policy section. The on-error policy section can be used at any scope. API publishers can configure custom behavior such as logging the error to event hubs or creating a new response to return to the caller.

```markup
<policies>    
  <on-error>  
    <!-- statements to be applied if there is an error condition go here -->  
  </on-error>  
</policies>
```

### Apollo Server

Apollo Server provides a collection of predefined errors, including `AuthenticationError`, `ForbiddenError`, `UserInputError`, and a generic `ApolloError`. These errors are designed to enhance errors thrown before and during GraphQL execution, making it easier to debug your Apollo Server integration and enabling clients to take specific actions based on an error.

When an error occurs in Apollo Server both inside and outside of resolvers, each error inside of the `errors` array contains an `extensions` object that contains the information added by Apollo Server.

```javascript
import { Info, Arguments, Context, UserInputError } from "@youngapp/yap";

const resolvers = {
  Mutation: {
    userInputError: async (parent, args: Arguments, context: Context, info: Info) => {
      try {
        if (args.input !== 'expected') {
          throw new UserInputError('Form Arguments invalid', {
            invalidArgs: Object.keys(args),
          });
        }
      } catch (err) {
        err.status = err.statusCode || err.status || 500;
        throw err;
      }
    },
  },
};
```

#### Default error handler

The default error handler is essentially a try-catch at the very beginning of the middleware chain. To use a different error handler, simply put another try-catch at the beginning of the middleware chain, and handle the error there.

However, the default error handler is good enough for the most use cases. It will use a status code of `err.status` or by default 500. If `err.expose` is true, then `err.message` will be the reply. Otherwise, a message generated from the error code will be used \(e.g. for the code 500, the message "Internal Server Error" will be used\). All headers will be cleared from the request, but any headers in `err.headers` will then be set. You can use a try-catch, as specified above, to add a header to this list.

Here is an example of creating your own error handler:

```javascript
import { Info, Arguments, Context, UserInputError } from "@youngapp/yap";

const resolvers = {
  Mutation: {
    userInputError: async (parent, args: Arguments, context: Context, info: Info) => {
      try {
        if (args.input !== 'expected') {
          throw new UserInputError('Form Arguments invalid', {
            invalidArgs: Object.keys(args),
          });
        }
      } catch (err) {
        // will only respond with JSON
        context.status = err.statusCode || err.status || 500;
        context.body = {
          message: err.message
        };
      }
    },
  },
};
```

