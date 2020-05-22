# Set query string parameter

The `set-query-parameter` policy adds, replaces value of, or deletes request query string parameter. Can be used to pass query parameters expected by the backend service which are optional or never present in the request.

### Policy statement

{% code title="XML" %}
```markup
<set-query-parameter name="param name" exists-action="override | skip | append | delete">
    <value>value</value> <!--for multiple parameters with the same name add additional value elements-->
</set-query-parameter>
```
{% endcode %}

### Example 1

{% code title="XML" %}
```markup
<set-query-parameter>
  <parameter name="api-key" exists-action="skip">
    <value>12345678901</value>
  </parameter>
  <!-- for multiple parameters with the same name add additional value elements -->
</set-query-parameter>
```
{% endcode %}

#### **Forward context information to the backend service**

This example shows how to apply policy at the API level to supply context information to the backend service. 

{% hint style="success" %}
For a demonstration of configuring and using this policy, see [Cloud Cover Episode 177: More API Management Features with Vlad Vinogradsky](https://azure.microsoft.com/documentation/videos/episode-177-more-api-management-features-with-vlad-vinogradsky/) and fast-forward to 10:30. At 12:10 there is a demo of calling an operation in the developer portal where you can see the policy at work.
{% endhint %}

{% code title="XML" %}
```markup
<!-- Copy this snippet into the inbound element to forward a piece of context, product name in this example, to the backend service for logging or evaluation -->
<set-query-parameter name="x-product-name" exists-action="override">
  <value>@(context.env.name)</value>
</set-query-parameter>
```
{% endcode %}

### Elements

| Name | Description | Required |
| :--- | :--- | :--- |
| `set-query-parameter` | Root element. | Yes |
| `value` | Specifies the value of the query parameter to be set. For multiple query parameters with the same name add additional `value` elements. | Yes |

### Properties

| Name | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `exists-action` | Specifies what action to take when the query parameter is already specified. This attribute must have one of the following values.  - override - replaces the value of the existing parameter. - skip - does not replace the existing query parameter value. - append - appends the value to the existing query parameter value. - delete - removes the query parameter from the request.  When set to `override` enlisting multiple entries with the same name results in the query parameter being set according to all entries \(which will be listed multiple times\); only listed values will be set in the result. | No | override |
| `name` | Specifies name of the query parameter to be set. | Yes | N/A |

### Usage

This policy can be used in the **inbound**, **outbound**, and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

