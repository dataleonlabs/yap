# Connectors
API management is the process of creating and publishing web application programming interfaces (APIs), enforcing their usage policies, controlling access, nurturing subscriber communities, collecting and analyzing usage statistics, and reporting performance.

## API management
API Management helps organizations to publish APIs to external, partner, and internal developers to unlock the potential of their data and services. Businesses everywhere are looking to extend their operations as a digital platform, creating new channels, finding new customers and driving deeper engagement with existing ones. API Management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security, and protection.

To explore YAP deeper, visit Connectors, Process Flow, and Young App website pages.

### Integration challenges
The average enterprise uses over 200 different applications – both cloud-based and on-premise – they are personal and business productivity programs with key part of daily work and data. Such applications are often not integrated with other business data.

Without automated integration, organizations cannot leverage the full power of data in multiple applications, for example, to re-enter data in applications or constantly switch context across applications to accomplish tasks.
Automated integration solves the problem of data silos and manual workflows. But if you are going to automate transactions that cross over applications, these processes must be reliable, secure, and manageable.

Business and IT users need visibility into the running integrations and the capability to take appropriate action if an error or exception occurs.

### Citizen integrator
YAP is the only integration platform that was built from the ground to support a single design interface for developer/IT and for citizen integrators.
Citizen integrators are designed for those who would like to integrate applications quickly but isn’t deeply technical. 
YAP ensures that citizens and IT have access to the same easy-to-use driven productivity improvements, as well as offers citizens advanced power and capability available to IT.


## How to use connectors?
```js
// Middleware normally takes two parameters (ctx, next), ctx is the context for one request,
// next is a function that is invoked to execute the downstream middleware. It returns a Promise with a then function for running code after completion.

app.use((ctx, next) => {
  const start = Date.now();
  return next().then(() => {
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });
});
```
