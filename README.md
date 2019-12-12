# YAP API Gateway
YAP is the lightweight microservices API gateway that sits at the heart of any microservices or serverless architecture, which aims to be a smaller, more expressive, and more robust foundation for API management and automation workflows with low-code approach and security.

By leveraging async functions, YAP allows you to exclude callbacks and greatly improve error handling and policies at the same time providing an elegant suite of Webhook- and HTTP-based methods, which make writing servers fast and enjoyable.

## Motivation
The Young App Platform (YAP) helps to automate business workflows across cloud and on-premise apps providing employees with prompt communication and building in teams advanced collaboration. As an illustration, YAP automates quotes processing for cash business, which may involve multiple apps.

Without automated integration, organizations cannot leverage the full power of data in multiple applications, for example, to re-enter data in applications or constantly switch context across applications to accomplish tasks.

YAP combines the enterprise-grade workflow automation platform and ease of use expected from client apps supporting both cloud-based and on-premise systems.


## Key features of YAP

Yap offers powerful, yet lightweight features that allow fine-grained control over your API ecosystem.

* **RESTFul API** – full programmatic access to the internals makes it easy to manage your API users, keys and API configuration from within your systems.
* **Multiple access protocols** – out of the box, YAP supports token-based, HMAC-signed, basic auth and keyless access methods.
* **Rate Limiting** – easily rate limit of your API users; rate limiting is granular and can be applied on a per-key basis.
* **Quotas** – enforce usage quotas on users to manage capacity or charge for tiered access.
* **Granular Access Control** – grant API access on a version-by-version basis, grant keys access to multiple APIs or just a single version.
* **API Versioning** – API versions can be easily set and deprecated at a specific time and date.
* **Blacklist/Whitelist/Ignored endpoint access** – enforce strict security models on a version-by-version basis to your access points.
* **Webhooks** – trigger webhooks against events such as quota violations and authentication failures.
* **IP Whitelisting** – Block access to non-trusted IP addresses for more secure interactions.

YAP is written in NodeJS, which makes it fast and easy to set up.

## Yap API management platform
The YAP desktop version can be used with the YAP API Gateway to provide a full lifecycle API management platform. For more details, visit https://youngapp.io and to see the full feature set, explore https://manual.youngapp.co

#### Feaures available on cloud edition
* **API Full-managed** – create your API on cloud editor and hosted by Young App in realtime.
* **Functions** – create on real-time cloud functions.
* **Advanced policies** – use advanced policies for better security.
* **Advanced connectors** – use complex app and connectors directly on the YAP platform.
* **Versioning** – versionning your APIs and process on cloud.
* **Support and integration** – beneficiate support by experts to select the best API and cloud integration.

## Documentation

 - [Usage Guide](docs/guide.md)
 - [Application and Middlewares](docs/middlewares.md)
 - [Connectors](docs/connectors.md)
 - [Policies](docs/policies.md)
 - [Error Handling](docs/error-handling.md)
 - [FAQ](docs/faq.md)

## Installing
It's an official version for JavaScript, available for Node.js backends, Serverless and AWS Lambda.

##### With yarm
```
npx @youngapp/yap my-api
cd my-apy
yarn start
```

##### With npm
```
npx @youngapp/yap my-api
cd my-apy
npm start
```

Find more details on [Usage Guide](docs/guide.md)
 
## Opening Issues
If you encounter a bug with YAP we would like to hear
about it. Search the [existing issues](https://github.com/youngapp/yap/issues)
to make sure your problem didn’t already exist before opening a new
issue. It’s helpful if you include the version of the SDK, Node.js or browser
environment and OS you’re using. Please include a stack trace and reduced repro
case when appropriate, too.

The GitHub issues are intended for bug reports and feature requests. For quick help
and questions on using the YAP SDK for JavaScript, please use the
resources listed within [Getting Help](https://github.com/youngapp/yap#getting-help)
section. The time of our support experts is flying, and they will appreciate your help (to apply for support reasonably) in order to
effectively handle open issues so we can reply to you and other users in a timely manner.

Contribute
==========
YAP is the open source and we love contributions! If you have an idea for a great improvement or spy an issue you’re keen to fix, you can fork us on [github](https://github.com/youngapp/yap).

No contribution is too small – providing feedback, [reporting issues](https://github.com/youngapp/yap/issues).

## License

This SDK is distributed under the GNU General Public License v3.0
see [LICENSE.txt](LICENSE.txt) for more information.
