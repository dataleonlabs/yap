# Basic authentication

### Authenticate with Basic

Use the `authentication-basic` policy to authenticate with a backend service using basic authentication. This policy effectively sets the HTTP Authorization header to the value corresponding to the credentials provided in the policy.

### Policy statement

{% code title="XML" %}
```markup
<authentication-basic username="username" password="password" />
```
{% endcode %}

### Example

{% code title="XML" %}
```markup
<authentication-basic username="testuser" password="testpassword" />
```
{% endcode %}

### Elements

| Name | Description | Required |
| :--- | :--- | :--- |
| `authentication-basic` | Root element | Yes |

### Attributes

| Name | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `username` | Specifies the username of the basic credential | Yes | N/A |
| `password` | Specifies the password of the basic credential | Yes | N/A |

### Usage

This policy can be used in the **inbound** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

