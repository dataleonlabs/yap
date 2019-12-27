---
description: How do I create a connector in Yap ?
---

# How do I create a connector ?

### Introduction

Welcome to the Young App Platform \(YAP\)!

AWS's serverless Lambda functions open a world of possibilities for running on-demand, server-side code without having to run a dedicated server. However, managing service discovery, configuring API gateways, and coordinating deployments between your app and your serverless functions can quickly become overwhelming.

In this tutorial, we’ll walk you through the process of building, testing an example connector to YAP.

API management is the process of creating and publishing web application programming interfaces \(APIs\), enforcing their usage policies, controlling access, nurturing subscriber communities, collecting and analyzing usage statistics, and reporting performance.

#### Integration challenges

The average enterprise uses over 200 different applications – both cloud-based and on-premise – they are personal and business productivity programs with key part of daily work and data. Such applications are often not integrated with other business data.

Without automated integration, organizations cannot leverage the full power of data in multiple applications, for example, to re-enter data in applications or constantly switch context across applications to accomplish tasks. Automated integration solves the problem of data silos and manual workflows. But if you are going to automate transactions that cross over applications, these processes must be reliable, secure, and manageable.

Business and IT users need visibility into the running integrations and the capability to take appropriate action if an error or exception occurs.

#### Citizen integrator

YAP is the only integration platform that was built from the ground to support a single design interface for developer/IT and for citizen integrators. Citizen integrators are designed for those who would like to integrate applications quickly but isn’t deeply technical. YAP ensures that citizens and IT have access to the same easy-to-use driven productivity improvements, as well as offers citizens advanced power and capability available to IT.

### Understanding connector

#### Example

```javascript
exports.handler = async function(event, context) {
    // your server-side functionality
}
```

### Custom Connector

Follow instructions to create a custom connector with [create-yap-connector](https://github.com/youngapp/create-yap/blob/master/docs/connector.md)

