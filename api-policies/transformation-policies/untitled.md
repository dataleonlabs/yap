# Convert JSON to XML

The `json-to-xml` policy converts a request or response body from JSON to XML.

### Policy statement

{% code title="XML" %}
```markup
<json-to-xml apply="always | content-type-json" consider-accept-header="true | false" parse-date="true | false"/>
```
{% endcode %}

### Example

{% code title="XML" %}
```markup
<policies>
    <inbound>
        <base />
    </inbound>
    <outbound>
        <base />
        <json-to-xml apply="always" consider-accept-header="false" parse-date="false"/>
    </outbound>
</policies>
```
{% endcode %}

### Elements

| Name | Description | Required |
| :--- | :--- | :--- |
| `json-to-xml` | Root element. | Yes |

### Attributes

<table>
  <thead>
    <tr>
      <th style="text-align:left">Name</th>
      <th style="text-align:left">Description</th>
      <th style="text-align:left">Required</th>
      <th style="text-align:left">Default</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left"><code>apply</code>
      </td>
      <td style="text-align:left">
        <p>The attribute must be set to one of the following values:</p>
        <ul>
          <li>always &#x2013; always apply conversion.</li>
          <li>content-type-json &#x2013; convert only if response Content-Type header
            indicates presence of JSON.</li>
        </ul>
      </td>
      <td style="text-align:left">Yes</td>
      <td style="text-align:left">N/A</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>consider-accept-header</code>
      </td>
      <td style="text-align:left">
        <p>The attribute must be set to one of the following values:</p>
        <ul>
          <li>true &#x2013; apply conversion if JSON is requested in request Accept
            header,</li>
          <li>false &#x2013; always apply conversion.</li>
        </ul>
      </td>
      <td style="text-align:left">No</td>
      <td style="text-align:left">true</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>parse-date</code>
      </td>
      <td style="text-align:left">When set to <code>false</code> date values are simply copied during transformation</td>
      <td
      style="text-align:left">No</td>
        <td style="text-align:left">true</td>
    </tr>
  </tbody>
</table>### Usage

This policy can be used in the **inbound**, **outbound**, and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

