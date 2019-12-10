# Policies
This section provides a reference for the following API Management policies.

## Policies Management
Policies are a powerful capability of the system that allow the publisher to change the behavior of the API through configuration. Policies are a collection of Statements that are executed sequentially on the request or response of an API. Popular Statements include format conversion from XML to JSON and call rate limiting to restrict the amount of incoming calls from a developer. Many more policies are available out of the box.

## Why using policies ?
It’s important to realize that exposing your API services makes easier to manage them. Why? When you keep your API policies separate, you ensure control over their performance and delivery. Independence is the key to your API policies’ success and future deployment.

Further, it’s important to modernize your API strategy. Keeping API well-structured prevents overexposing API that results in stucking in little things. Unifying API policies simplifies API management.

## How using policies ?
```
<check-header name="Authorization" failed-check-httpcode="401" failed-check-error-message="Not authorized" ignore-case="false">
    <value>f6dc69a089844cf6b2019bae6d36fac8</value>
</check-header>
```

## Policies available
### Access restriction policies
- Check HTTP header - Enforces existence and/or value of a HTTP Header.
### Advanced policies
- Control flow - Conditionally applies policy statements based on the evaluation of Boolean expressions.
- Limit concurrency - Prevents enclosed policies from executing by more than the specified number of requests at a time.
- Return response - Aborts pipeline execution and returns the specified response directly to the caller.
- Send one way request - Sends a request to the specified URL without waiting for a response.
- Send request - Sends a request to the specified URL.
- Set HTTP proxy - Allows you to route forwarded requests via an HTTP proxy.
- Set variable - Persist a value in a named context variable for later access.
- Set request method - Allows you to change the HTTP method for a request.
- Set status code - Changes the HTTP status code to the specified value.
- Wait - Waits for enclosed Send request, Get value from cache, or Control flow policies to complete before proceeding.
### Authentication policies
- Authenticate with Basic - Authenticate with a backend service using Basic authentication.

### Caching policies
- Get from cache - Perform cache look up and return a valid cached response when available.
- Store to cache - Caches response according to the specified cache control configuration.
- Get value from cache - Retrieve a cached item by key.
- Store value in cache - Store an item in the cache by key.
- Remove value from cache - Remove an item in the cache by key.

### Cross domain policies
- Allow cross-domain calls - Makes the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients.
- CORS - Adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients.
### Transformation policies
- Convert JSON to XML - Converts request or response body from JSON to XML.
- Convert XML to JSON - Converts request or response body from XML to JSON.
- Find and replace string in body - Finds a request or response substring and replaces it with a different substring.
- Mask URLs in content - Re-writes (masks) links in the response body so that they point to the equivalent link via the gateway.
- Set body - Sets the message body for incoming and outgoing requests.
- Set HTTP header - Assigns a value to an existing response and/or request header or adds a new response and/or request header.
- Set query string parameter - Adds, replaces value of, or deletes request query string parameter.
- Rewrite URL - Converts a request URL from its public form to the form expected by the web service.
- Transform XML using an XSLT - Applies an XSL transformation to XML in the request or response body.
