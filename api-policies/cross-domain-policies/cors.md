# CORS

The `cors` policy adds cross-origin resource sharing \(CORS\) support to an operation or an API to allow cross-domain calls from browser-based clients.

CORS allows a browser and a server to interact and determine whether or not to allow specific cross-origin requests \(i.e. XMLHttpRequests calls made from JavaScript on a web page to other domains\). This allows for more flexibility than only allowing same-origin requests, but is more secure than allowing all cross-origin requests.

### Policy statement

{% code title="XML" %}
```markup
<cors allow-credentials="false|true">
    <allowed-origins>
        <origin>origin uri</origin>
    </allowed-origins>
    <allowed-methods preflight-result-max-age="number of seconds">
        <method>http verb</method>
    </allowed-methods>
    <allowed-headers>
        <header>header name</header>
    </allowed-headers>
    <expose-headers>
        <header>header name</header>
    </expose-headers>
</cors>
```
{% endcode %}

### Example

This example demonstrates how to support pre-flight requests, such as those with custom headers or methods other than GET and POST. To support custom headers and additional HTTP verbs, use the `allowed-methods` and `allowed-headers` sections as shown in the following example.

{% code title="XML" %}
```markup
<cors allow-credentials="true">
    <allowed-origins>
        <!-- Localhost useful for development -->
        <origin>http://localhost:8080/</origin>
        <origin>http://example.com/</origin>
    </allowed-origins>
    <allowed-methods preflight-result-max-age="300">
        <method>GET</method>
        <method>POST</method>
        <method>PATCH</method>
        <method>DELETE</method>
    </allowed-methods>
    <allowed-headers>
        <!-- Examples below show Azure Mobile Services headers -->
        <header>x-zumo-installation-id</header>
        <header>x-zumo-application</header>
        <header>x-zumo-version</header>
        <header>x-zumo-auth</header>
        <header>content-type</header>
        <header>accept</header>
    </allowed-headers>
    <expose-headers>
        <!-- Examples below show Azure Mobile Services headers -->
        <header>x-zumo-installation-id</header>
        <header>x-zumo-application</header>
    </expose-headers>
</cors>
```
{% endcode %}

### Elements

| Name | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `cors` | Root element. | Yes | N/A |
| `allowed-origins` | Contains `origin` elements that describe the allowed origins for cross-domain requests. `allowed-origins` can contain either a single `origin` element that specifies `*` to allow any origin, or one or more `origin` elements that contain a URI. | Yes | N/A |
| `origin` | The value can be either `*` to allow all origins, or a URI that specifies a single origin. The URI must include a scheme, host, and port. | Yes | If the port is omitted in a URI, port 80 is used for HTTP and port 443 is used for HTTPS. |
| `allowed-methods` | This element is required if methods other than GET or POST are allowed. Contains `method` elements that specify the supported HTTP verbs. | No | If this section is not present, GET and POST are supported. |
| `method` | Specifies an HTTP verb. | At least one `method` element is required if the `allowed-methods` section is present. | N/A |
| `allowed-headers` | This element contains `header` elements specifying names of the headers that can be included in the request. | No | N/A |
| `expose-headers` | This element contains `header` elements specifying names of the headers that will be accessible by the client. | No | N/A |
| `header` | Specifies a header name. | At least one `header` element is required in `allowed-headers` or `expose-headers` if the section is present. | N/A |

### Attributes

| Name | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `allow-credentials` | The `Access-Control-Allow-Credentials` header in the preflight response will be set to the value of this attribute and affect the client’s ability to submit credentials in cross-domain requests. | No | false |
| `preflight-result-max-age` | The `Access-Control-Max-Age` header in the preflight response will be set to the value of this attribute and affect the user agent’s ability to cache pre-flight response. | No | 0 |

### Usage

This policy can be used in the **inbound**, **outbound**, and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

