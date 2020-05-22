# Response

The `response` object represents the HTTP response that an Yap app sends when it gets an HTTP request.

```typescript
interface Response {
    /** body */
    body?: any;
    /** statusCode */
    statusCode?: number;
    /** headers */
    headers?: { [key: string]: any };
}
```

{% hint style="info" %}
Yap use Amazon API Gateway API Request and Response Data Mapping Reference
{% endhint %}

