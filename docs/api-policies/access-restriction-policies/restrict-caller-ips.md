# Restrict caller IPs

The `ip-filter` policy filters \(allows/denies\) calls from specific IP addresses or address ranges.

### **Policy statement** <a id="RestrictcallerIPs-Policystatement"></a>

{% code title="XML" %}
```markup
<ip-filter action="allow | forbid">
    <address>address</address>
    <address-range from="address" to="address" />
</ip-filter>
```
{% endcode %}

### **Example** <a id="RestrictcallerIPs-Example"></a>

In the following example, the policy only allows requests coming either from the single IP address or range of IP addresses specified.

{% code title="XML" %}
```markup
<ip-filter action="allow">
    <address>13.66.201.169</address>
    <address-range from="13.66.140.128" to="13.66.140.143" />
</ip-filter>
```
{% endcode %}

### **Elements**

| Name | Description | Required |
| :--- | :--- | :--- |
| `ip-filter` | Root element. | Yes |
| `address` | Specifies a single IP address on which to filter. | At least one `address` or `address-range` element is required. |
| `address-range from="address" to="address"` | Specifies a range of IP address on which to filter. | At least one `address` or `address-range` element is required. |

### **Attributes**

| Name | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `address-range from="address" to="address"` | A range of IP addresses to allow or deny access for. | Required when the `address-range` element is used. | N/A |
| `ip-filter action="allow | forbid"` | Specifies whether calls should be allowed or not for the specified IP addresses and ranges. | Yes | N/A |

### Usage

This policy can be used in the **inbound** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

