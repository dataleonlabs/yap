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
    string inBody = context.request.body.as<string>(preserveContent: true); 
    if (inBody[0] =='c') { 
        inBody[0] = 'm'; 
    } 
    return inBody; 
}
</set-body>
```
{% endcode %}

Example accessing the body as a `JObject`. Note that since we are not reserving the original request body, accessing it later in the pipeline will result in an exception.

{% code title="XML" %}
```markup
<set-body> 
@{ 
    JObject inBody = context.request.body.as<JObject>(); 
    if (inBody.attribute == <tag>) { 
        inBody[0] = 'm'; 
    } 
    return inBody.toString(); 
} 
</set-body>
```
{% endcode %}

### **Example 3: filter response based on product**

This example shows how to perform content filtering by removing data elements from the response received from the backend service when using the `Starter` product. 

{% hint style="success" %}
As an example of configuring and using this policy, see [Cloud Cover Episode 177: More API Management Features with Vlad Vinogradsky](https://azure.microsoft.com/documentation/videos/episode-177-more-api-management-features-with-vlad-vinogradsky/) and fast-forward to 34:30. Start at 31:50 to see an overview of [The Dark Sky Forecast API](https://developer.forecast.io/) used for this demo.
{% endhint %}

```text
<!-- Copy this snippet into the outbound section to remove a number of data elements from the response received from the backend service based on the name of the api product -->
<choose>
  <when condition="@(context.response.statusCode == 200 && context.Product.Name.Equals("Starter"))">
    <set-body>@{
        var response = context.response.body.as<JObject>();
        foreach (var key in new [] {"minutely", "hourly", "daily", "flags"}) {
          response.property (key).remove ();
        }
        return response.toString();
      }
    </set-body>
  </when>
</choose>
```

### Usage

This policy can be used in the **inbound**, **outbound**, and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

