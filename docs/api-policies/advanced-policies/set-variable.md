# Set variable

The `set-variable` policy declares a context variable and assigns it a value specified via an expression or a string literal. if the expression contains a literal it will be converted to a string and the type of the value will be `System.String`.

### Policy statement

{% code title="XML" %}
```markup
<set-variable name="variable name" value="Expression | String literal" />
```
{% endcode %}

### Example

The following example demonstrates a set variable policy in the inbound section. This set variable policy creates an `isMobile` Boolean context variable that is set to true if the `User-Agent` request header contains the text `iPad` or `iPhone`.

{% code title="XML" %}
```markup
<set-variable name="IsMobile" value="@(context.request.headers['User-Agent'].contains('iPad') || context.request.headers['User-Agent'].contains('iPhone'))" />
```
{% endcode %}

### Elements

| Element | Description | Required |
| :--- | :--- | :--- |
| `set-variable` | Root element. | Yes |

### Attributes

| Attribute | Description | Required |
| :--- | :--- | :--- |
| `name` | The name of the variable. | Yes |
| `value` | The value of the variable. This can be an expression or a literal value. | Yes |

### Usage

This policy can be used in the **inbound**, **outbound**, and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

