# Check HTTP header

Use the `check-header` policy to enforce that a request has a specified HTTP header. You can optionally check to see if the header has a specific value or check for a range of allowed values. If the check fails, the policy terminates request processing and returns the HTTP status code and error message specified by the policy.

### **Policy statement**

{% code title="XML" %}
```markup
<check-header name="header name" failed-check-httpcode="code" failed-check-error-message="message" ignore-case="true">
    <value>Value1</value>
    <value>Value2</value>
</check-header>
```
{% endcode %}

### **Example**

{% code title="XML" %}
```markup
<check-header name="Authorization" failed-check-httpcode="401" failed-check-error-message="Not authorized" ignore-case="false">
    <value>f6dc69a089844cf6b2019bae6d36fac8</value>
</check-header>
```
{% endcode %}

### **Elements**

| Name | Description | Required |
| :--- | :--- | :--- |
| `check-header` | Root element. | Yes |
| `value` | Allowed HTTP header value. When multiple value elements are specified, the check is considered a success if any one of the values is a match. | No |

### **Attributes**

| Name | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `failed-check-error-message` | Error message to return in the HTTP response body if the header doesn't exist or has an invalid value. This message must have any special characters properly escaped. | Yes | N/A |
| `failed-check-httpcode` | HTTP Status code to return if the header doesn't exist or has an invalid value. | Yes | N/A |
| `header-name` | The name of the HTTP Header to check. | Yes | N/A |
| `ignore-case` | Can be set to True or False. If set to True case is ignored when the header value is compared against the set of acceptable values. | Yes | N/A |

### **Usage**

This policy can be used in the following policy sections and scopes.

* **Policy sections:** inbound, outbound
* **Policy scopes:** all scopes

### **Example**

{% code title="XML" %}
```markup
<policies>
    <inbound>
        <check-header name="Authorization" failed-check-httpcode="401" failed-check-error-message="Not authorized" ignore-case="false">
            <value>f6dc69a089844cf6b2019bae6d36fac8</value>
        </check-header>
    </inbound>
</policies>
```
{% endcode %}

### Usage

This policy can be used in the **inbound** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

