# Find and replace string in body

The `find-and-replace` policy copies values from one property to another.   
The `from` and `to` attributes to be specified in the dot notation format.

### Policy statement

{% code title="XML" %}
```markup
<find-and-replace from="field.subfield1" to="field.subfield2" />
```
{% endcode %}

### Example

{% code title="XML" %}
```markup
<find-and-replace from="field.subfield1" to="field.subfield2" />
```
{% endcode %}

### Elements

| Name | Description | Required |
| :--- | :--- | :--- |
| `find-and-replace` | Root element | Yes |

### Attributes

| Name | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `from` | The path  we copy the value from.  The path to be specified in the dot notation format. | Yes | N/A |
| `to` | The path we copy the value to.  The path to be specified in the dot notation format. | Yes | N/A |

### Usage

This policy can be used in the **inbound**, **outbound**, and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

