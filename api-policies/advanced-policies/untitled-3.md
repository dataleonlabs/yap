# Set request method

The `set-method` policy allows you to change the HTTP request method for a request.

### Policy statement

{% code title="XML" %}
```markup
<set-method>METHOD</set-method>
```
{% endcode %}

### Example

This sample policy that uses the `set-method` policy shows an example of sending a message to a Slack chat room if the HTTP response code is greater than or equal to 500. 

{% code title="XML" %}
```markup
<choose>
    <when condition="@(context.response.statusCode >= 500)">
      <send-request mode="new">
        <set-url>https://hooks.slack.com/services/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</set-url>
        <set-method>POST</set-method>
        <set-body>@{
                return new JObject(
                        new JProperty("username","APIM Alert"),
                        new JProperty("icon_emoji", ":ghost:"),
                        new JProperty("text", String.Format("{0} {1}\nHost: {2}\n{3} {4}\n User: {5}",
                                                context.request.method,
                                                context.request.url.path + context.request.url.queryString,
                                                context.request.url.host,
                                                context.response.statusCode,
                                                context.response.statusReason,
                                                context.user.email
                                                ))
                        ).ToString();
            }</set-body>
      </send-request>
    </when>
</choose>
```
{% endcode %}

### Elements

| Element | Description | Required |
| :--- | :--- | :--- |
| `set-method` | Root element. The value of the element specifies the HTTP method. | Yes |

### Usage

This policy can be used in the **inbound** and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

