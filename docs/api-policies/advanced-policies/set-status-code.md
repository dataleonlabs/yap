# Set status code

The `set-status` policy sets the HTTP status code to the specified value.

### Policy statement

{% code title="XML" %}
```markup
<set-status code="" reason=""/>
```
{% endcode %}

### Example

This example shows how to return a 401 response if the authorization token is invalid. 

{% code title="XML" %}
```markup
<choose>
  <when condition="@(context.variables.tokenstate.body.active == false)">
    <return-response response-variable-name="existing response variable">
      <set-status code="401" reason="Unauthorized" />
      <set-header name="WWW-Authenticate" exists-action="override">
        <value>Bearer error="invalid_token"</value>
      </set-header>
    </return-response>
  </when>
</choose>
```
{% endcode %}

### Elements

| Element | Description | Required |
| :--- | :--- | :--- |
| `set-status` | Root element | Yes |

### Attributes

| Attribute | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `code="integer"` | The HTTP status code to return. | Yes | N/A |
| `reason="string"` | A description of the reason for returning the status code. | Yes | N/A |

### Usage

This policy can be used in the **inbound**, **outbound**, and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

