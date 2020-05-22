# Yap vs Express

Philosophically, Yap aims to "low-code approach", whereas Express "augments node". Yap uses promises and async functions to rid apps of callback hell and simplify error handling. It exposes its own `ctx.request` and `ctx.response` objects instead of node's `req` and `res` objects. Yap use policies for manage security application.

Express, on the other hand, augments node's `req` and `res` objects with additional properties and methods and includes many other "framework" features, such as routing and templating, which Yap does not.

Thus, Yap can be viewed as an abstraction of AWS Lambda server with GraphQL, no `http` node module, where as Express is an application framework for node.js.

| Feature | Yap | Express |
| ---: | :--- | :--- |
| GraphQL Kernel | ✓ |  |
| Policies | ✓ |  |
| API Connectors | ✓ |  |
| Sending Files |  | ✓ |
| Templating |  | ✓ |
| Sending Files |  | ✓ |
| JSONP |  | ✓ |

Thus, if you'd like to be closer to node.js and traditional node.js-style coding, you probably want to stick to Connect/Express or similar frameworks. If you want to get rid of callbacks with more secuirty with policies, use Yap.

As result of this different philosophy is that traditional node.js "middleware", i.e. functions of the form `(req, res, next)`, are incompatible with Yap. Your application will essentially have to be rewritten from the ground, up.

### Does Yap replace Express?

It's more like Connect, but a lot of the Express goodies were moved to the middleware level in Yap to help form a stronger foundation. This makes middleware more enjoyable and less error-prone to write, for the entire stack, not just the end application code.

Typically many middleware would re-implement similar features, or even worse incorrectly implement them, when features like signed cookie secrets among others are typically application-specific, not middleware specific.

### Why isn't Yap just Express 4.0?

Yap is a pretty large departure from what people know about Express, the design is fundamentally much different, so the migration from Express 3.0 to this Express 4.0 would effectively mean rewriting the entire application, so we thought it would be more appropriate to create a new library. Yap use GraphQL as API Gateway and Router.

### How is Yap different than Connect/Express?

#### GraphQL control flow

* No callback hell.
* Better error handling through try/catch.
* No need for domains.
* No router

#### Yap is barebones

* Unlike both Connect and Express and Rest, Yap does not include any middleware.
* Unlike Express, routing is not provided.
* Unlike Express, many convenience utilities are not provided. For example, sending files.
* Yap is more modular.

#### Yap abstracts node's request/response 

* Less hackery.
* Better user experience.
* Proper stream handling.

