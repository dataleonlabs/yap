---
description: >-
  The community supports development of Yap – micro-services API gateway – the
  core project of Young App.
---

# Yap community

## Less code, safer API

[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/yap) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/youngapp/yap/blob/master/CONTRIBUTING.md) ![GitHub Workflow Status \(branch\)](https://img.shields.io/github/workflow/status/youngapp/yap/PublishNPM/master) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/570597c92b1e4ca9b67b2a49d9c2aa51)](https://www.codacy.com/gh/youngapp/yap?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=youngapp/yap&amp;utm_campaign=Badge_Grade)  ![GitHub last commit](https://img.shields.io/github/last-commit/youngapp/yap) [![Requirements Status](https://requires.io/github/youngapp/yap/requirements.svg?branch=master)](https://requires.io/github/youngapp/yap/requirements/?branch=master)

Yap is the lightweight microservices API gateway that shines at the heart of any microservices or serverless architecture, which aims to be a smaller, more expressive, and more robust foundation for API management and automation workflows with low-code approach and security.

{% hint style="warning" %}
You can contribute or [click ⭐️ on GitHub](https://github.com/youngapp/yap/blob/master/README.md) to support us. The first release to be available early February. Follow our news 🏅 on [Twitter](https://twitter.com/youngapp_pf).
{% endhint %}

{% hint style="info" %}
Please distinguish:  
**Yap** – the **core project** of Young App.   
**YAP** – the **platform** of Young App.
{% endhint %}

### Motivation

Young App helps to automate business workflows across cloud and on-premise apps providing employees with prompt communication and building in teams sophisticated collaboration. As an illustration, YAP automates quotes processing for cash business, which may involve multiple apps.

Without API Management, we using Express, Koa or Hapi on Nodejs without security security handler, and all others NodeJS frameworks are based on http module, yap is different, designed only for serverless functions \(event-driven\).

### Key features of Yap project 🙌

Yap offers powerful, yet lightweight features that allow fine-grained control over your API ecosystem.

\*\*\*\*◽ **Elegant XML policies**  
The powerful capability of the system that allows the publisher to change API behavior through configuration in elegant XML files.

◽ **GraphQL as API gateway**  
GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. Yap use only GraphQL as API Gateway.

◽ **Connectors**  
YAP is the only integration platform that was built from the ground to support a single design interface for developer/IT and for citizen integrators.

◽ **Designed for serverless**  
Yap is designed for serverless event functions on AWS, GCP, or Azure functions.

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

**With AWS Lambda**

```typescript
import { Yap } from "@youngapp/yap";
import typeDefs from "./schema.graphql";
import resolvers from "./resolvers.ts";

// Your schema definition and resolvers GraphQL
const app = new Yap({ typeDefs, resolvers });

// A simple handler for AWS Lambda.
exports.handler = app.handler;
```

Find more details on [Usage guide](https://manual.youngapp.co/community/usage-and-getting-started)

Enjoy 🎉

### Documentation

* [Usage guide](https://manual.youngapp.co/community/usage-and-getting-started)
* [Gateway](https://manual.youngapp.co/community/application-and-middlewares)
* [Connectors](https://manual.youngapp.co/community/connectors)
* [Policies](https://manual.youngapp.co/community/policies)
* [Error handling](https://manual.youngapp.co/community/error-handling)
* [Yap for Express Users](https://manual.youngapp.co/community/faq/faq-error-policies)
* [FAQ](https://manual.youngapp.co/community/faq/frequently-asked-questions)

### Opening issues

If you encounter a bug with YAP, we would appreciate if you inform us about it. Before opening a new issue, please go through [existing issues](https://github.com/youngapp/yap/issues) to find the solution right away if your problem was solved before.

Attach the following details if appropriate:

* SDK, Node.js
* Environment and OS
* Stack trace

The GitHub issues are intended for bug reports and feature requests. For quick help and questions on using the Yap SDK for JavaScript, please use the resources listed within [Getting Help](https://github.com/youngapp/yap#getting-help) section. The time of our support experts is rushingly flying but even so, they would like to help you in time, and therefore, will appreciate your help in applying for support reasonably by providing full details and excluding duplicated issues.

### Contribute

Yap is the open source and we love contributions! If you have an idea for a great improvement or spy an issue you’re keen to fix, follow our [Contributing Guide](https://github.com/youngapp/yap/blob/master/CONTRIBUTING.md).

No contribution is too small – we encourage you to provide feedback and [report issues](https://github.com/youngapp/yap/issues).

### Community support 🌍

For general help using Yap, please refer to [the official Yap documentation](https://manual.youngapp.co/community/). For additional help, you can use one of these channels to ask a question:

* [StackOverflow](http://stackoverflow.com/questions/tagged/yap)
* [Slack](https://join.slack.com/t/yapcommunity/shared_invite/enQtOTA2NTcxNjc1OTI2LTA3YmNjMWRhY2E1NjdkODE2MjU4ZTcxZmU0ZmYyMzkyMDliYjM3Nzk4YzI1NTEzYjA1MjYxNWJlNGFlMjIzMDY) \(Channel community\)
* [GitHub](https://github.com/youngapp/yap) \(Bug reports, feature requests, contributions\)
* [Roadmap](https://github.com/youngapp/yap/projects/1) \(Roadmap\)
* [Twitter](https://twitter.com/youngapp_pf) \(Get the news fast\)
* [YouTube Channel](https://www.youtube.com/channel/UCPY1PeAXPQIgo29e4Z9u5cA) \(Learn from Video Tutorials\)

### License

This SDK is distributed under Apache License 2.0. See [LICENSE.txt](LICENSE.txt) for more information.

