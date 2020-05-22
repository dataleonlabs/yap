# Rewrite URL

The `rewrite-uri` policy converts a request URL from its public form to the form expected by the web service, as shown in the following example.

* Public URL: `http://api.example.com/storenumber/ordernumber`
* Request URL: `http://api.example.com/v2/US/hardware/storenumber&ordernumber?City&State`

This policy can be used when a human or browser-friendly URL should be transformed into the URL format expected by the web service. This policy only needs to be applied when exposing an alternative URL format, such as clean URLs, RESTful URLs, user-friendly URLs or SEO-friendly URLs that are purely structural URLs that do not contain a query string and instead contain only the path of the resource \(after the scheme and the authority\). This is often done for aesthetic, usability, or search engine optimization \(SEO\) purposes.

{% hint style="info" %}
You can only add query string parameters using the policy. You cannot add extra template path parameters in the rewrite URL.
{% endhint %}

### Policy statement

{% code title="XML" %}
```markup
<rewrite-uri template="uri template" copy-unmatched-params="true | false" />
```
{% endcode %}

### Example

{% code title="XML" %}
```markup
<policies>
    <inbound>
        <base />
        <rewrite-uri template="/v2/US/hardware/{storenumber}&{ordernumber}?City=city&State=state" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```
{% endcode %}

{% code title="XML" %}
```markup
<!-- Assuming incoming request is /get?a=b&c=d and operation template is set to /get?a={b} -->
<policies>
    <inbound>
        <base />
        <rewrite-uri template="/put" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
<!-- Resulting URL will be /put?c=d -->
```
{% endcode %}

{% code title="XML" %}
```markup
<!-- Assuming incoming request is /get?a=b&c=d and operation template is set to /get?a={b} -->
<policies>
    <inbound>
        <base />
        <rewrite-uri template="/put" copy-unmatched-params="false" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
<!-- Resulting URL will be /put -->
```
{% endcode %}

### Elements

| Name | Description | Required |
| :--- | :--- | :--- |
| `rewrite-uri` | Root element. | Yes |

### Attributes

| Attribute | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `template` | The actual web service URL with any query string parameters. When using expressions, the whole value must be an expression. | Yes | N/A |
| `copy-unmatched-params` | Specifies whether query parameters in the incoming request not present in the original URL template are added to the URL defined by the re-write template | No | true |

### Usage

This policy can be used in the **inbound**, **outbound**, and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

