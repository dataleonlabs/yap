# Yap API Gateway
Yap is a lightweight microservices API gateway that sits at the heart of any microservices or serverless architecture, which aims to be a smaller, more expressive, and more robust foundation for API management and automation workflows with low-code approach and security.

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

#### Feaures available on Cloud Edition
* **API Full-managed** - Create your api on Cloud Editor and hosted by Young App in realtime
* **Functions** - Create on real-time cloud functions
* **Advenced policies** - Use advenced policies for better security
* **Advenced connectors** - Use complex app and connectors directly on platform
* **Versioning** - Versionning your APIs and process on Cloud
* **Support and integration** - Beneficiate support by expert for select best api and integration on Cloud

## Documentation

 - [Usage Guide](docs/guide.md)
 - [Application and Middlewares](docs/middlewares.md)
 - [Connectors](docs/connectors.md)
 - [Policies](docs/policies.md)
 - [Error Handling](docs/error-handling.md)
 - [FAQ](docs/faq.md)

## Installing
It's a official version for JavaScript, available for Node.js backends, Serverless and AWS Lambda

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

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))_

Then open [http://localhost:3000/](http://localhost:3000/) to see your app.<br>
When you’re ready to deploy to production, create a minified bundle with `npm run build` or `yarn build`.

It will create a directory called `my-api` inside the current folder.<br>
Inside that directory, it will generate the initial project structure and install the transitive dependencies:

```
my-app
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── serverless.yml
├── tslint.json
├── tsconfig.json
├── jest.config.js
└── src
    ├── app.ts
    └── app.test.js
```

No configuration or complicated folder structures, only the files you need to build your app.<br>
Once the installation is done, you can open your project folder:

```sh
cd my-app
```

### `npm test` or `yarn test`

Runs the test watcher in an interactive mode.<br>
By default, runs tests related to files changed since the last commit.

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes with TypeScript.<br>

Your api is ready to be deployed.

### `npm run deploy` or `yarn deploy`

Deploy the app for production with serverless with `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

Your api is available on Cloud function provider.
 
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

Contribute
==========
Yap is open source and we love contributions! If you have an idea for a great improvement or spy an issue you’re keen to fix, you can fork us on [github](https://github.com/youngapp/yap).

No contribution is too small – providing feedback, [reporting issues](https://github.com/youngapp/yap/issues).

## License

This SDK is distributed under the GNU General Public License v3.0
see [LICENSE.txt](LICENSE.txt) for more information.
