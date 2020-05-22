# Control flow

The `choose` policy applies enclosed policy statements based on the outcome of evaluation of Boolean expressions, similar to an if-then-else or a switch construct in a programming language.

### Policy statement

{% code title="XML" %}
```markup
<choose>
    <when condition="Boolean expression | Boolean constant">
        <!— one or more policy statements to be applied if the above condition is true  -->
    </when>
    <when condition="Boolean expression | Boolean constant">
        <!— one or more policy statements to be applied if the above condition is true  -->
    </when>
    <otherwise>
        <!— one or more policy statements to be applied if none of the above conditions are true  -->
</otherwise>
</choose>
```
{% endcode %}

The control flow policy must contain at least one `<when/>` element. The `<otherwise/>` element is optional. Conditions in `<when/>` elements are evaluated in order of their appearance within the policy. Policy statement\(s\) enclosed within the first `<when/>` element with condition attribute equals `true` will be applied. Policies enclosed within the `<otherwise/>` element, if present, will be applied if all of the `<when/>` element condition attributes are `false`.

### Example 1

The following example demonstrates a [Set variable](set-variable.md) policy and two [Control flow](control-flow.md) policies.

The set variable policy is in the inbound section and creates an `isMobile` Boolean context variable that is set to true if the `User-Agent` request header contains the text `iPad` or `iPhone`.

The first control flow policy is also in the inbound section, and conditionally applies one of two [Set query string parameter](../transformation-policies/set-query-string-parameter.md) policies depending on the value of the `isMobile` context variable.

The second control flow policy is in the outbound section and conditionally applies the [Convert XML to JSON](../transformation-policies/convert-xml-to-json.md) policy when `isMobile` is set to `true`.

{% code title="XML" %}
```markup
<policies>

    <inbound>
        <set-variable name="isMobile" value="@(context.request.headers['User-Agent'].Contains('iPad') || context.request.headers['User-Agent'].contains('iPhone'))" />
        <base />
        <choose>
            <when condition="@(context.variables.isMobile)">
                <set-query-parameter name="mobile" exists-action="override">
                    <value>true</value>
                </set-query-parameter>
            </when>
            <otherwise>
                <set-query-parameter name="mobile" exists-action="override">
                    <value>false</value>
                </set-query-parameter>
            </otherwise>
        </choose>
    </inbound>
    <outbound>
        <base />
        <choose>
            <when condition="@(context.variables.isMobile)">
                <xml-to-json kind="direct" apply="always" consider-accept-header="false"/>
            </when>
        </choose>
    </outbound>
</policies>
```
{% endcode %}

### **Example 2**

This example shows how to perform content filtering by removing data elements from the response received from the backend service when using the `Starter` product. 

{% hint style="info" %}
As the example of configuring and using this policy, see [Cloud Cover Episode 177: More API Management Features with Vlad Vinogradsky](https://azure.microsoft.com/documentation/videos/episode-177-more-api-management-features-with-vlad-vinogradsky/) and fast-forward to 34:30. Start at 31:50 to see an overview of [The Dark Sky Forecast API](https://developer.forecast.io/) used for this demo.
{% endhint %}

{% code title="XML" %}
```markup
<!-- Copy this snippet into the outbound section to remove a number of data elements from the response received -->
<choose>
  <when condition="@(context.response.statusCode === 200)">
    <set-body>@{
        const response = context.response.body;
        for (const key in ["minutely", "hourly", "daily", "flags"]) {
          delete response[key];
        }
        return response;
      }
    </set-body>
  </when>
</choose>
```
{% endcode %}

### Elements

| Element | Description | Required |
| :--- | :--- | :--- |
| `choose` | Root element. | Yes |
| `when` | The condition to use for the `if` or `ifelse` parts of the `choose` policy. If the `choose` policy has multiple `when` sections, they are evaluated sequentially. Once the `condition` of a when element evaluates to `true`, no further `when` conditions are evaluated. | Yes |
| `otherwise` | Contains the policy snippet to be used if none of the `when` conditions evaluate to `true`. | No |

### Attributes

| Attribute | Description | Required |
| :--- | :--- | :--- |
| `condition="Boolean expression | Boolean constant"` | The Boolean expression or constant to evaluated when the containing `when` policy statement is evaluated. | Yes |

### Usage

This policy can be used in the **inbound**, **outbound**, and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

