# Policies
This section provides a reference for the following API management policies.

## Policies management
Policies are a powerful capability of the system that allow the publisher to change API behavior through configuration. Policies are a collection of statements that are executed sequentially on the API request or response. Popular statements include format conversion from XML to JSON and call rate limiting to restrict the amount of incoming calls from a developer. Many more policies are available out of the box.

## Why do we need policies?
API policies are solid proficiencies within an API system that allows the issuer to adjust API performance through configuration.
Policies apply restrictions that secure API and maintain their structure, ensuring control over API effectiveness and delivery. 
Keeping API well-structured prevents overexposing API that results in stucking in little things.

## How to use policies?
```
<check-header name="Authorization" failed-check-httpcode="401" failed-check-error-message="Not authorized" ignore-case="false">
    <value>f6dc69a089844cf6b2019bae6d36fac8</value>
</check-header>
```

## Policies available

### Access restriction policies
- *Check HTTP header* – enforces existence or value of a HTTP Header.

### Advanced policies
- *Control flow* – conditionally applies policy statements based on the evaluation of boolean expressions.
- *Limit concurrency* – prevents enclosed policies from executing by more than the specified number of requests at a time.
- *Return response* – aborts pipeline execution and returns the specified response directly to the caller.
- *Send one way request* – sends a request to the specified URL without waiting for a response.
- *Send request* – sends a request to the specified URL.
- *Set HTTP proxy* – allows you to route forwarded requests via an HTTP proxy.
- *Set variable* – persist a value in a named context variable for later access.
- *Set request method* – allows you to change the HTTP method for a request.
- *Set status code* – changes the HTTP status code to the specified value.
- *Wait* – waits for enclosed Send request, Get value from cache, or Control flow policies to complete before proceeding.

### Authentication policies
- *Authenticate with Basic* – authenticates with a backend service using basic authentication.

### Caching policies
- *Get from cache* – perform cache look up and return a valid cached response when available.
- *Store to cache* – caches response according to the specified cache control configuration.
- *Get value from cache* – retrieve a cached item by key.
- *Store value in cache* – store an item in the cache by key.
- *Remove value from cache* – remove an item in the cache by key.

### Cross domain policies
- *Allow cross-domain calls* – makes the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients.
- *CORS* – adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients.

### Transformation policies
- *Convert JSON to XML* – converts request or response body from JSON to XML.
- *Convert XML to JSON* – converts request or response body from XML to JSON.
- *Find and replace string in body* – finds a request or response substring and replaces it with a different substring.
- *Mask URLs in content* – re-writes (masks) links in the response body so that they point to the equivalent link via the gateway.
- *Set body* – sets the message body for incoming and outgoing requests.
- *Set HTTP header* – assigns a value to an existing response/request header or adds a new response/request header.
- *Set query string parameter* – adds, replaces value of, or deletes request query string parameter.
- *Rewrite URL* – converts a request URL from its public form to the form expected by the web service.
- *Transform XML using an XSLT* – applies an XSL transformation to XML in the request or response body.
