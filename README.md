# Yap API Gateway
Yap is a microservices API gateway that sits at the heart of any microservices or serverless architecture, which aims to be a smaller, more expressive, and more robust foundation for API management and automation workflows with low-code approach and security.

By leveraging async functions, Yap allows you to ditch callbacks and greatly increase error-handling and policies. provides an elegant suite of methods that make writing servers fast and enjoyable, based on Webhooks and HTTP.

## Motivation
The Young App Platform (YAP) helps to automate business workflows across cloud and on-premise apps providing employees with prompt communication and building in teams advanced collaboration. For example, YAP automates quotes processing for cash business, which may involve multiple apps.

Without automated integration, organizations cannot leverage the full power of data in multiple applications, for example, to re-enter data in applications or constantly switch context across applications to accomplish tasks.

YAP combines the enterprise-grade workflow automation platform and ease of use expected from client apps supporting both cloud-based and on-premise systems.


## Key Features of Yap

Yap offers powerful, yet lightweight features that allow fine grained control over your API ecosystem.

* **RESTFul API** - Full programmatic access to the internals makes it easy to manage your API users, keys and Api Configuration from within your systems
* **Multiple access protocols** - Out of the box, Tyk supports Token-based, HMAC Signed, Basic Auth and Keyless access methods
* **Rate Limiting** - Easily rate limit your API users, rate limiting is granular and can be applied on a per-key basis
* **Quotas** - Enforce usage quotas on users to manage capacity or charge for tiered access
* **Granular Access Control** - Grant api access on a version by version basis, grant keys access to multiple API's or just a single version
* **API Versioning** - API Versions can be easily set and deprecated at a specific time and date
* **Blacklist/Whitelist/Ignored endpoint access** - Enforce strict security models on a version-by-version basis to your access points
* **Webhooks** - Trigger webhooks against events such as Quota Violations and Authentication failures
* **IP Whitelisting** - Block access to non-trusted IP addresses for more secure interactions

Yap is written in NodeJS, which makes it fast and easy to set up.

## Yap API Management Platform
The Yap Desktop can be used with the Yap API Gateway, to provide a full lifecycle API Management platform. You can find more details at https://youngapp.io and for a full featureset, you can visit https://manual.youngapp.co

## Documentation

 - [Usage Guide](docs/guide.md)
 - [Application and Middlewares](docs/middlewares.md)
 - [Connectors](docs/connectors.md)
 - [Policies](docs/policies.md)
 - [Error Handling](docs/error-handling.md)
 - [FAQ](docs/faq.md)

## Installing
It's a official version for JavaScript, available for Node.js backends and AWS Lambda

##### With yarm
```
    yarn add @youngapp/yap
```

##### With npm
```
    npm install @youngapp/yap
```
 
## Opening Issues
If you encounter a bug with YAP we would like to hear
about it. Search the [existing issues](https://github.com/youngapp/yap/issues)
and try to make sure your problem doesn’t already exist before opening a new
issue. It’s helpful if you include the version of the SDK, Node.js or browser
environment and OS you’re using. Please include a stack trace and reduced repro
case when appropriate, too.

The GitHub issues are intended for bug reports and feature requests. For help
and questions with using the YAP SDK for JavaScript please make use of the
resources listed in the [Getting Help](https://github.com/youngapp/yap#getting-help)
section. There are limited resources available for handling issues and by
keeping the list of open issues lean we can respond in a timely manner.

## License

This SDK is distributed under the GNU General Public License v3.0
see LICENSE.txt and NOTICE.txt for more information.
