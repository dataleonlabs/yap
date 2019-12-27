# Set HTTP header

The `set-header` policy assigns a value to an existing response and/or request header or adds a new response and/or request header.

Inserts a list of HTTP headers into an HTTP message. When placed in an inbound pipeline, this policy sets the HTTP headers for the request being passed to the target service. When placed in an outbound pipeline, this policy sets the HTTP headers for the response being sent to the gateway’s client.

### Policy statement

{% code title="XML" %}
```markup
<set-header name="header name" exists-action="override | skip | append | delete">
    <value>value</value> <!--for multiple headers with the same name add additional value elements-->
</set-header>
```
{% endcode %}

### Example 1

{% code title="XML" %}
```markup
<set-header name="some header name" exists-action="override">
    <value>20</value>
</set-header>
```
{% endcode %}

{% hint style="info" %}
Multiple values of a header are concatenated to a CSV string, for example:`headerName: value1,value2,value3`

Exceptions include standardized headers, which values:

* may contain commas \(`User-Agent`,`WWW-Authenticate`,`Proxy-Authenticate`\),
* may contain date \(`Cookie`,`Set-Cookie`,`Warning`\),
* contain date \(`Date`,`Expires`,`If-Modified-Since`,`If-Unmodified-Since`,`Last-Modified`,`Retry-After`\).

In case of those exceptions, multiple header values will not be concatenated into one string and will be passed as separate headers, for example:`User-Agent: value1User-Agent: value2User-Agent: value3`
{% endhint %}

### Elements

| Name | Description | Required |
| :--- | :--- | :--- |
| `set-header` | Root element | Yes |
| `value` | Specifies the value of the header to be set. For multiple headers with the same name add additional `value` elements. | Yes |

### Properties

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
      <td style="text-align:left"><code>exists-action</code>
      </td>
      <td style="text-align:left">
        <p>Specifies what action to take when the header is already specified. This
          attribute must have one of the following values:</p>
        <ul>
          <li><b>override </b>&#x2013; replaces the value of the existing header,</li>
          <li><b>skip </b>&#x2013; does not replace the existing header value,</li>
          <li><b>append </b>&#x2013; appends the value to the existing header value,</li>
          <li><b>delete </b>&#x2013; removes the header from the request.
            <br />
            <br />When set to <code>override</code> enlisting multiple entries with the same
            name results in the header being set according to all entries (which will
            be listed multiple times); only listed values will be set in the result.</li>
        </ul>
      </td>
      <td style="text-align:left">No</td>
      <td style="text-align:left">override</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>name</code>
      </td>
      <td style="text-align:left">Specifies name of the header to be set.</td>
      <td style="text-align:left">Yes</td>
      <td style="text-align:left">N/A</td>
    </tr>
  </tbody>
</table>### Usage

This policy can be used in the **inbound**, **outbound**, and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

