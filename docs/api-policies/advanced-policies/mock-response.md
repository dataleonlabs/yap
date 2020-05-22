# Mock response

The `mock-response`, as the name implies, is used to mock APIs and operations. It aborts normal pipeline execution and returns a mocked response to the caller. The policy always tries to return responses of highest fidelity. It prefers response content examples, whenever available. It generates sample responses from schemas, when schemas are provided and examples are not. If neither examples or schemas are found, responses with no content are returned.

### Policy statement

{% code title="XML" %}
```markup
<mock-response status-code="code" content-type="media type"/>
```
{% endcode %}

### Examples

{% code title="XML" %}
```markup
<!-- Returns 200 OK status code. Content is based on an example or schema, if provided for this
status code. First found content type is used. If no example or schema is found, the content is empty. -->
<mock-response/>

<!-- Returns 200 OK status code. Content is based on an example or schema, if provided for this
status code and media type. If no example or schema found, the content is empty. -->
<mock-response status-code='200' content-type='application/json'/>
```
{% endcode %}

### Elements

| Element | Description | Required |
| :--- | :--- | :--- |
| `mock-response` | Root element | Yes |

### Attributes

| Attribute | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `body` | Sets response body | No | Empty |
| `status-code` | Specifies response status code and is used to select corresponding example or schema. | No | 200 |
| `content-type` | Specifies `Content-Type` response header value and is used to select corresponding example or schema. | No | None |

### Usage

This policy can be used in the **inbound**, **outbound**, and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

