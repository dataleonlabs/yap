# Policies

This section provides a reference for the following API management policies.

### Policies management

Policies are a powerful capability of the system that allow the publisher to change API behavior through configuration. Policies are the collection of statements that are executed sequentially on the API request or response. Popular statements include format conversion from XML to JSON and call rate limiting to restrict the amount of incoming calls from a developer. Many more policies are available out of the box.

### Why do we need policies?

API policies are solid proficiencies within an API system that allows the issuer to adjust API performance through configuration. Policies apply restrictions that secure API and maintain their structure, ensuring control over API effectiveness and delivery. Keeping API well-structured prevents overexposing API that results in stucking in little things.

### How to use policies?

The configuration is divided into `inbound`, `outbound`, and `on-error`. The series of specified policy statements are executed in a request-response order.

```markup
<policies>
  <inbound>
    <!-- statements to be applied to the request go here -->
  </inbound>
  <outbound>
    <!-- statements to be applied to the response go here -->
  </outbound>
  <on-error>
    <!-- statements to be applied if there is an error condition go here -->
  </on-error>
</policies>
```

If there is an error during processing of a request, any remaining steps in the inbound, or outbound sections are skipped and execution jumps to the statements in the on-error section.

#### Example

```markup
<policies>
  <inbound>
    <check-header name="Authorization" failed-check-httpcode="401" failed-check-error-message="Not authorized" ignore-case="false">
        <value>f6dc69a089844cf6b2019bae6d36fac8</value>
    </check-header>
  </inbound>
  <on-error>
    <sentry-log />
  </on-error>
</policies>
```

### Policies available

#### Access restriction policies

* [Check HTTP header](api-policies/access-restriction-policies/check-http-header.md) – enforces the existence or value of an HTTP header.
* [Restrict caller IPs](api-policies/access-restriction-policies/restrict-caller-ips.md) – filters \(allows/denies\) calls from specific IP addresses and/or address ranges. 
* [Restrict caller hosts](api-policies/access-restriction-policies/restrict-caller-hosts.md) – filters \(allows/denies\) calls from specific IP addresses and/or address ranges.

#### Advanced policies

* [Control flow](api-policies/advanced-policies/control-flow.md) – conditionally applies policy statements based on the results of the evaluation of Boolean expressions.
* [Mock response](api-policies/advanced-policies/mock-response.md) – aborts pipeline execution and returns a mocked response directly to the caller.
* [Return response](api-policies/advanced-policies/return-response.md) – aborts pipeline execution and returns the specified response directly to the caller.
* [Send request](api-policies/advanced-policies/send-request.md) – sends a request to the specified URL.
* [Set request method](api-policies/advanced-policies/set-request-method.md) – allows you to change the HTTP method for a request.
* [Set status code](api-policies/advanced-policies/set-status-code.md) – changes the HTTP status code to the specified value.
* [Set variable](api-policies/advanced-policies/set-variable.md) – persists a value in a named context variable for later access.
* [Sentry error tracking](api-policies/advanced-policies/sentry-error-tracking.md) – prevent crashes across your entire stack.
* [Cloudwatch logs](api-policies/advanced-policies/cloudwatch-logs.md) – sends logs to Amazon Cloudwatch.

#### Authentication policies

* [Basic authentication](api-policies/authentication-policies/basic-authentication.md) – authenticates with a backend service using basic authentication.

#### Cross domain policies

* [CORS](api-policies/cross-domain-policies/cors.md) – adds cross-origin resource sharing \(CORS\) support to an operation or an API to allow cross-domain calls from browser-based clients.

#### Transformation policies

* [Convert JSON to XML](api-policies/transformation-policies/convert-json-to-xml.md) – converts request or response body from JSON to XML.
* [Convert XML to JSON](api-policies/transformation-policies/convert-xml-to-json.md) – converts request or response body from XML to JSON.
* [Find and replace string in body](api-policies/transformation-policies/find-and-replace-string-in-body.md) – finds a request or response substring and replaces it with a different substring.
* [Set body](api-policies/transformation-policies/set-body.md) – sets the message body for incoming and outgoing requests.
* [Set HTTP header](api-policies/transformation-policies/set-http-header.md) – assigns a value to an existing response/request header or adds a new response/request header.
* [Set query string parameter](api-policies/transformation-policies/set-query-string-parameter.md) – adds, replaces value of, or deletes request query string parameter.
* [Rewrite URL](api-policies/transformation-policies/rewrite-url.md) – converts a request URL from its public form to the form expected by the web service.



