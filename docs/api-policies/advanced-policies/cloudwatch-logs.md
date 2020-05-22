# Cloudwatch logs

The `cloudwatch-logs` policy sends logs to Amazon CloudWatch. Uploads log events to the specified log stream. If a call to `cloudwatch-logs` returns "UnrecognizedClientException" the most likely cause is an invalid AWS access key ID or secret key.

### Policy statement

{% code title="XML" %}
```markup
<cloudwatch-logs credentials="Expression | Object literal" log-stream-name="Expression | Object literal" log-group-name="Expression | Object literal" sequence-token="Expression | Object literal">
    <message>Expression | String literal</message>
</cloudwatch-logs>
```
{% endcode %}

### Example

The following example demonstrates a set log events to the specified log stream policy in the inbound section.

{% code title="XML" %}
```markup
<policies>
    <inbound>
        <cloudwatch-logs credentials="@(context.connections.aws)" log-stream-name="my-api" log-group-name="my-api-group" sequence-token="xx-x">
            <message>@(context.response.body)</message>
        </cloudwatch-logs>
    </inbound>
</policies>
```
{% endcode %}

### Elements

| Element | Description | Required |
| :--- | :--- | :--- |
| `cloudwatch` | Root element. | Yes |
| `message` | The raw event message. | Yes |

### Attributes

| Attribute | Description | Required |
| :--- | :--- | :--- |
| `credentials` | AWS Credentials `{ CLIENT_KEY, CLIENT_SECRET, REGION }` | Yes |
| `log-stream-name` | The name of the log stream | Yes |
| `log-group-name` | The name of the log group. | Yes |
| `sequence-token` | The sequence token obtained from the response of the previous `cloudwatch-logs` call. An upload in a newly created log stream does not require a sequence token. If you call `cloudwatch-logs` twice within a narrow time period using the same value for `sequence-token`, both calls may be successful, or one may be rejected. | No |

### Usage

This policy can be used in **inbound**, **outbound**, **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

