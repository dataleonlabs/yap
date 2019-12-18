import { Context } from "../../router";

/**
 * <send-one-way-request> policy sends the provided request to the specified URL without waiting for a response
 * @example
 *  <send-one-way-request mode="new | copy">
 *      <url>...</url>
 *      <method>...</method>
 *      <header name="" exists-action="override | skip | append | delete">...</header>
 *      <body>...</body>
 *  <authentication-certificate thumbprint="thumbprint" />
 *  </send-one-way-request>
 *
 *  <send-one-way-request mode="new">
 *       <set-url>https://hooks.slack.com/services/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</set-url>
 *       <set-method>POST</set-method>
 *       <set-body>@{
 *               return new JObject(
 *                  new JProperty("username","APIM Alert"),
 *                  new JProperty("icon_emoji", ":ghost:"),
 *                  new JProperty("text", String.Format("{0} {1}\nHost: {2}\n{3} {4}\n User: {5}",
 *                                          context.request.method,
 *                                          context.request.url.Path + context.request.url.queryString,
 *                                          context.request.url.Host,
 *                                          context.response.statusCode,
 *                                          context.response.statusReason,
 *                                          context.user.email
 *                                          ))
 *                  ).ToString();
 *           }</set-body>
 *  </send-one-way-request>
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    return { policyElement, context, scope };
};