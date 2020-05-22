# Return response

The `return-response` policy aborts pipeline execution and returns either a default or custom response to the caller. Default response is `200 OK` with no body. Custom response can be specified via a context variable or policy statements. When both are provided, the response contained within the context variable is modified by the policy statements before being returned to the caller.

### Policy statement

{% code title="XML" %}
```markup
<return-response response-variable-name="existing context variable">
  <set-header/>
  <set-body/>
  <set-status/>
</return-response>
```
{% endcode %}

### Example

{% code title="XML" %}
```markup
<return-response>
   <set-status code="401" reason="Unauthorized"/>
   <set-header name="WWW-Authenticate" exists-action="override">
      <value>Bearer error="invalid_token"</value>
   </set-header>
</return-response>
```
{% endcode %}

### Elements

| Element | Description | Required |
| :--- | :--- | :--- |
| `return-response` | Root element. | Yes |
| `set-header` | A [Set HTTP header](../transformation-policies/set-http-header.md) policy statement. | No |
| `set-body` | A [Set body](../transformation-policies/set-body.md) policy statement. | No |
| `set-status` | A [Set status code](set-status-code.md) policy statement. | No |

### Attributes

| Attribute | Description | Required |
| :--- | :--- | :--- |
| `response-variable-name` | The name of the context variable referenced from, for example, an upstream [Send request](send-request.md) policy and containing a `Response` object | Optional. |

### Usage

This policy can be used in the **inbound**, **outbound**, and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

