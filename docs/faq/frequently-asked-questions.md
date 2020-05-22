# Frequently asked questions

### Does Yap replace Express?

It's more like Connect, but a lot of the Express goodies were moved to the middleware level in Yap to help form a stronger foundation. This makes middleware more enjoyable and less error-prone to write, for the entire stack, not just the end application code.

Typically many middleware would re-implement similar features, or even worse incorrectly implement them, when features like signed cookie secrets among others are typically application-specific, not middleware specific.

### Does Yap include routing?

No – out of the box Yap has no form of routing, Yap use GraphQL

### Why isn't Yap just Express 4.0?

Yap is a pretty large departure from what people know about Express, the design is fundamentally much different, so the migration from Express 3.0 to this Express 4.0 would effectively mean rewriting the entire application, so we thought it would be more appropriate to create a new library.

### What custom properties do the Yap objects have?

Yap uses its own custom objects: `ctx`, `ctx.request`, and `ctx.response`. These objects abstract node's `req` and `res` objects with convenience methods and getters/setters. Generally, properties added to these objects must obey the following rules:

* They must be either very commonly used and/or must do something useful
* If a property exists as a setter, then it will also exist as a getter, but not vice versa

Many of `ctx.request` and `ctx.response`'s properties are delegated to `ctx`. If it's a getter/setter, then both the getter and the setter will strictly correspond to either `ctx.request` or `ctx.response`.

Please think about these rules before suggesting additional properties.

