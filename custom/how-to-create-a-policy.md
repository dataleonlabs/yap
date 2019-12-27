# How to create a policy ?

### Introduction

Welcome to the Young App Platform \(YAP\)!

In this tutorial, we’ll walk you through the building and testing a policy example within the Young App platform.

YAP provides certain built-in policies, which can be referred to address general situations to filter unwanted traffic coming to your API or transform output data on your response. Also, YAP allows creating custom policies, which are designed primarily to address complex scenarios like SQL injection.

Policies are applied inside the gateway located between the consumer API and the YAP's API. The gateway receives all requests and usually forwards them unchanged to the underlying API. However, a policy can apply changes to both: the inbound request and outbound response.

### Policy configuration

The policy definition is a simple XML document that describes a sequence of inbound and outbound statements. The XML can be edited by the customer's developer directly in the definition window. A list of statements is provided by YAP. The statements applicable to the current scope are enabled and highlighted.

The configuration is divided into `inbound`, `outbound`, and `on-error`.

The series of specified policy statements are executed in a request-response order.

```markup
<policies>
  <inbound>
    <!-- statements to be applied to the request go here -->
  </inbound>
  <outbound>
    <!-- statements to be applied to the response go here -->
  </outbound>
  <on-error>
    <!-- statements to be applied if there is an error condition go here -->
  </on-error>
</policies>
```

If there is an error during processing of a request, any remaining steps in the inbound, or outbound sections are skipped and execution jumps to the statements in the on-error section.

By placing policy statements in the on-error section, you can review the error by using the `context.LastError` property, inspect and customize the error response using the `set-body` policy, and configure what happens if an error occurs.

To see error codes for built-in steps and for errors that may occur during the processing of policy statements, visit [Error handling](https://manual.youngapp.co/developer-guide/api-management/error-handling) in [API management](https://manual.youngapp.co/developer-guide/api-management/introduction).

#### Example

Apply policies specified at different scopes.

YAP allows determining the order of combined policy statements.

```markup
<policies>
    <inbound>
        <find-and-replace from="xyz" to="abc" />
    </inbound>
</policies>
```

### Custom policy

Follow the instructions to create a custom policy with [create-yap-policy](https://github.com/youngapp/create-yap/blob/master/docs/policy.md)

