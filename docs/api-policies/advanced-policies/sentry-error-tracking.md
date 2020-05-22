# Sentry error tracking

The `sentry` policy prevent crashes across your entire stack. Sentry is designed to be very simple to get off the ground, yet powerful to grow into.

### Policy statement

{% code title="XML" %}
```markup
<sentry dsn="Expression | String literal">
  <value>Value1</value>
</sentry>
```
{% endcode %}

### Example

The following example demonstrates a set error policy in the on-error section.

{% code title="XML" %}
```markup
<sentry dsn="@(context.connections.sentry.DSN)">
  <value>@(context.LastError)</value>
</sentry>
```
{% endcode %}

### Elements

| Element | Description | Required |
| :--- | :--- | :--- |
| `sentry` | Root element. | Yes |
| `value` | Value Error | Yes |

### Attributes

| Attribute | Description | Required |
| :--- | :--- | :--- |
| `dsn` | Your DSN | Yes |

### Usage

This policy can be used in **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

