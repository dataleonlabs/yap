# Yap API gateway
Yap is the lightweight microservices API gateway that shines at the heart of any microservices or serverless architecture, which aims to be a smaller, more expressive, and more robust foundation for API management and automation workflows with low-code approach and security.

By leveraging async functions, Yap allows you to exclude callbacks and greatly improve error handling and policies at the same time providing an elegant suite of Webhook- and HTTP-based methods, which make writing servers fast and enjoyable.

Please distinguish **Yap** (the core project of Young App) and **YAP** (the platform of Young App).

## Motivation
The Young App Platform (YAP) helps to automate business workflows across cloud and on-premise apps providing employees with prompt communication and building in teams sophisticated collaboration. As an illustration, YAP automates quotes processing for cash business, which may involve multiple apps.

Without automated integration, organizations cannot leverage the full power of data in multiple applications, for example, to re-enter data in applications or constantly switch context across applications to accomplish tasks.

YAP combines the enterprise-grade workflow automation platform and ease of use expected from client apps supporting both cloud-based and on-premise systems.


## Key features of YAP

Yap offers powerful, yet lightweight features that allow fine-grained control over your API ecosystem.

* **RESTful API** – full programmatic access to the internals makes it easy to manage your API users, keys and API configuration from within your systems.
* **Multiple access protocols** – out of the box, YAP supports token-based, HMAC-signed, basic auth, and keyless access methods.
* **Rate limiting** – easily rate limit of your API users; rate limiting is granular and can be applied on a per-key basis.
* **Quotas** – enforce usage quotas on users to manage capacity or charge for tiered access.
* **Granular access control** – grant API access on a version-by-version basis, grant keys access to multiple APIs or just a single version.
* **API versioning** – API versions can be easily set and deprecated at a specific time and date.
* **Blacklist / Whitelist / Ignored endpoint access** – enforce strict security models on a version-by-version basis to your access points.
* **Webhooks** – trigger webhooks against events such as quota violations and authentication failures.
* **IP whitelisting** – block access to non-trusted IP addresses for more secure interactions.

YAP is written in NodeJS, which makes it fast and easy to set up.

## Yap API management platform
The YAP desktop version can be used with the YAP API Gateway to provide a full lifecycle API management platform. For more details, visit https://youngapp.io and to see the full feature set, explore https://manual.youngapp.co

#### Feaures available for cloud edition
* **Fully managed API** – create your API on cloud editor and hosted by Young App in realtime.
* **Functions** – create online your cloud functions.
* **Advanced policies** – use advanced policies for better security.
* **Advanced connectors** – use complex app and connectors directly on the YAP platform.
* **Versioning** – use versionning for APIs and cloud processes.
* **Support and integration** – beneficiate support by experts to select the best API and cloud integration.

## Documentation

 - [Usage guide](docs/guide.md)
 - [Application and middlewares](docs/middlewares.md)
 - [Connectors](docs/connectors.md)
 - [Policies](docs/policies.md)
 - [Error handling](docs/error-handling.md)
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

```javascript
app.post('/posts', new Sequence([
    async ({ params }) => mysql.findOne({ table: 'posts', values: { name: params.id } }),
    async ({ results }) => await csv.save({ data: results }),
    async ({ results }) => await dropbox.put({ file: results.csv }),
]))
```

Find more details on [Usage guide](docs/guide.md)
 
## Opening issues
If you encounter a bug with YAP, we would appreciate if you inform us about it. 
Before opening a new issue, please go through [existing issues](https://github.com/youngapp/yap/issues)
to find the solution right away if your problem was solved before. 

Attach the following details if appropriate: 
- SDK, Node.js, or browser version
- Environment and OS
- Stack trace
- Reduced repro case

The GitHub issues are intended for bug reports and feature requests. 
For quick help and questions on using the Yap SDK for JavaScript, please use the resources listed within [Getting Help](https://github.com/youngapp/yap#getting-help) section. The time of our support experts is rushingly flying but even so, they would like to help you in time, and therefore, will appreciate your help in applying for support reasonably by providing full details and excluding duplicated issues.

Contribute
==========
Yap is the open source and we love contributions! If you have an idea for a great improvement or spy an issue you’re keen to fix, you can fork us on [GitHub](https://github.com/youngapp/yap).

No contribution is too small – we encourage you to provide feedback and [report issues](https://github.com/youngapp/yap/issues).

## License

This SDK is distributed under the GNU General Public License v3.0. 
See [LICENSE.txt](LICENSE.txt) for more information.
