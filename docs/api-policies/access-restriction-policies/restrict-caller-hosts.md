# Restrict caller hosts

The `host-filter` policy filters \(allows/denies\) calls from specific hosts.

### **Policy statement** <a id="RestrictcallerIPs-Policystatement"></a>

{% code title="XML" %}
```markup
<host-filter action="allow | forbid" failed-check-httpcode="code" failed-check-error-message="message">
    <host>host</host>
</host-filter>
```
{% endcode %}

### **Example** <a id="RestrictcallerIPs-Example"></a>

In the following example, the policy allows only requests coming either from the single host names or from specified host names.

{% code title="XML" %}
```markup
<host-filter action="allow" failed-check-httpcode="401" failed-check-error-message="forbidden">
    <host>example.com</host>
</host-filter>
```
{% endcode %}

### **Elements**

| Name | Description | Required |
| :--- | :--- | :--- |
| `host-filter` | Root element. | Yes |
| `host` | Specifies a single host name on which to filter. | At least one `host` element is required. |

### **Attributes**

| Name | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `host-filter action="allow | forbid"` | Specifies whether calls should be allowed or not for the specified host names and ranges. | Yes | N/A |
| `failed-check-error-message` | Error message to return in the HTTP response body if the request host does not match the policy rules. This message must have any special characters properly escaped. | Yes | N/A |
| `failed-check-httpcode` | HTTP Status code to return if the request host does not match the policy rules. | Yes | N/A |

### Usage

This policy can be used in the **inbound** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

