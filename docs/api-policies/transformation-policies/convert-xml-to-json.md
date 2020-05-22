# Convert XML to JSON

The `xml-to-json` policy converts a request or response body from XML to JSON. This policy can be used to modernize APIs based on XML-only backend web services.

### Policy statement

{% code title="XML" %}
```markup
<xml-to-json kind="javascript-friendly | direct" apply="always | content-type-xml" consider-accept-header="true | false"/>
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
        <xml-to-json kind="direct" apply="always" consider-accept-header="false" />
    </outbound>
</policies>
```
{% endcode %}

### Elements

| Name | Description | Required |
| :--- | :--- | :--- |
| `xml-to-json` | Root element | Yes |

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
      <td style="text-align:left"><code>kind</code>
      </td>
      <td style="text-align:left">
        <p>The attribute must be set to one of the following values:</p>
        <ul>
          <li><em>javascript-friendly</em> &#x2013; the converted JSON has a form friendly
            to JavaScript developers,</li>
          <li><em>direct</em> &#x2013; the converted JSON reflects the original XML document&apos;s
            structure.</li>
        </ul>
      </td>
      <td style="text-align:left">Yes</td>
      <td style="text-align:left">N/A</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>apply</code>
      </td>
      <td style="text-align:left">
        <p>The attribute must be set to one of the following values:</p>
        <ul>
          <li><em>always </em>&#x2013; convert always.</li>
          <li><em>content-type-xml</em> &#x2013; convert only if response Content-Type
            header indicates presence of XML.</li>
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
          <li><em>true </em>&#x2013; apply conversion if XML is requested in request
            Accept header,</li>
          <li><em>false </em>&#x2013; always apply conversion.</li>
        </ul>
      </td>
      <td style="text-align:left">No</td>
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

