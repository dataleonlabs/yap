# Send request

The `send-request` policy sends the provided request to the specified URL, waiting no longer than the set timeout value.

### Policy statement

{% code title="XML" %}
```markup
<send-request mode="new|copy" response-variable-name="" timeout="60 sec" ignore-error="false|true">
  <set-url>...</set-url>
  <set-method>...</set-method>
  <set-header name="" exists-action="override|skip|append|delete">...</set-header>
  <set-body>...</set-body>
  <authentication-certificate thumbprint="thumbprint" />
</send-request>
```
{% endcode %}

### Example

This example shows one way to verify a reference token with an authorization server. 

{% code title="XML" %}
```markup
<inbound>
  <!-- Extract Token from Authorization header parameter -->
  <set-variable name="token" value="@(context.request.headers['Authorization'].split(' ').last())" />

  <!-- Send request to Token Server to validate token (see RFC 7662) -->
  <send-request mode="new" response-variable-name="tokenstate" timeout="20" ignore-error="true">
    <set-url>https://api-appec990ad4c76641c.yap.youngapp.co</set-url>
    <set-method>POST</set-method>
    <set-header name="Authorization" exists-action="override">
      <value>basic dXNlcm5hbWU6cGFzc3dvcmQ=</value>
    </set-header>
    <set-header name="Content-Type" exists-action="override">
      <value>application/x-www-form-urlencoded</value>
    </set-header>
    <set-body>@(context.variables.token)</set-body>
  </send-request>

  <choose>
        <!-- Check active property in response -->
        <when condition="@(context.variables.tokenstate.body.active == false)">
            <!-- Return 401 Unauthorized with http-problem payload -->
            <return-response>
                <set-status code="401" reason="Unauthorized" />
                <set-header name="WWW-Authenticate" exists-action="override">
                    <value>Bearer error="invalid_token"</value>
                </set-header>
            </return-response>
        </when>
    </choose>
  <base />
</inbound>
```
{% endcode %}

### Elements

| Element | Description | Required |
| :--- | :--- | :--- |
| `send-request` | Root element. | Yes |
| `url` | The URL of the request. | No if mode=copy; otherwise yes. |
| `method` | The HTTP method for the request. | No if mode=copy; otherwise yes. |
| `header` | Request header. Use multiple header elements for multiple request headers. | No |
| `body` | The request body. | No |

### Attributes

<table>
  <thead>
    <tr>
      <th style="text-align:left">Attribute</th>
      <th style="text-align:left">Description</th>
      <th style="text-align:left">Required</th>
      <th style="text-align:left">Default</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left"><code>mode=&quot;string&quot;</code>
      </td>
      <td style="text-align:left">Determines whether this is a new request or a copy of the current request.
        In outbound mode, mode=copy does not initialize the request body.</td>
      <td
      style="text-align:left">No</td>
        <td style="text-align:left">New</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>response-variable-name=&quot;string&quot;</code>
      </td>
      <td style="text-align:left">The name of context variable that will receive a response object. If the
        variable doesn&apos;t exist, it will be created upon successful execution
        of the policy and will become accessible via <code>context.Variable</code> collection.</td>
      <td
      style="text-align:left">Yes</td>
        <td style="text-align:left">N/A</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>timeout=&quot;integer&quot;</code>
      </td>
      <td style="text-align:left">The timeout interval in seconds before the call to the URL fails.</td>
      <td
      style="text-align:left">No</td>
        <td style="text-align:left">60</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>ignore-error</code>
      </td>
      <td style="text-align:left">
        <p>If true and the request results in an error:</p>
        <ul>
          <li>If response-variable-name was specified it will contain a null value.</li>
          <li>If response-variable-name was not specified, context.Request will not
            be updated.</li>
        </ul>
      </td>
      <td style="text-align:left">No</td>
      <td style="text-align:left">false</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>name</code>
      </td>
      <td style="text-align:left">Specifies the name of the header to be set.</td>
      <td style="text-align:left">Yes</td>
      <td style="text-align:left">N/A</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>exists-action</code>
      </td>
      <td style="text-align:left">
        <p>Specifies what action to take when the header is already specified. This
          attribute must have one of the following values:</p>
        <ul>
          <li>override &#x2013; replaces the value of the existing header,</li>
          <li>skip &#x2013; does not replace the existing header value,</li>
          <li>append &#x2013; appends the value to the existing header value,</li>
          <li>delete &#x2013; removes the header from the request.</li>
        </ul>
        <p>When set to <code>override</code> enlisting multiple entries with the same
          name results in the header being set according to all entries (which will
          be listed multiple times); only listed values will be set in the result.</p>
      </td>
      <td style="text-align:left">No</td>
      <td style="text-align:left">override</td>
    </tr>
  </tbody>
</table>### Usage

This policy can be used in the **inbound**, **outbound**, and **on-error** policy scopes.

{% hint style="info" %}
**Questions?**   
We're always happy to help with any issues you might have!   
Send us an email to support@youngapp.co or [request the demo](https://youngapp.co/request-demo/) with our sales team!
{% endhint %}

