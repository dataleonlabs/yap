# Set body

Use the `set-body` policy to set the message body for incoming and outgoing requests. To access the message body you can use the `context.request.body` property or the `context.response.body`, depending on whether the policy is in the inbound or outbound section.

{% hint style="warning" %}
Note that by default when you access the message body using `context.request.Body` or `context.response.Body`, the original message body is lost and must be set by returning the body back in the expression. To preserve the body content, set the `preserveContent` parameter to true when accessing the message. If `preserveContent` is set to true and a different body is returned by the expression, the returned body is used.

Please note the following considerations when using the set-body policy.

If you are using the set-body policy to return a new or updated body you don't need to set `preserveContent` to true because you are explicitly supplying the new body contents. Preserving the content of a response in the inbound pipeline doesn't make sense because there is no response yet. Preserving the content of a request in the outbound pipeline doesn't make sense because the request has already been sent to the backend at this point. If this policy is used when there is no message body, for example in an inbound GET, an exception is thrown.
{% endhint %}

### Policy statement

{% code title="XML" %}
```markup
<set-body>new body value as text</set-body>
```
{% endcode %}

### Example 1: l**iteral text**

{% code title="XML" %}
```markup
<set-body>Hello world!</set-body>
```
{% endcode %}

### Example 2: accessing the body as a string

Note that we are preserving the original request body so that we can access it later in the pipeline.

{% code title="XML" %}
```markup
<set-body>
@{ 
    const inBody = context.request.body; 
    if (inBody[0] === 'c') { 
        inBody[0] = 'm'; 
    } 
    return inBody; 
}
</set-body>
```
{% endcode %}

### Usage

This policy can be used in the **inbound**, **outbound**, and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

