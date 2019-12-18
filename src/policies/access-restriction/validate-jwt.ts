import { Context } from "../../router";

/**
 * validate-jwt policy enforces the existence and validity of a JWT 
 * extracted from either a specified HTTP Header or a specified query parameter.
 * @example
 * <!-- Active directory token validation -->
 * <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
 *   <openid-config url="https://login.microsoftonline.com/contoso.onmicrosoft.com/.well-known/openid-configuration" />
 *   <audiences>
 *       <audience>25eef6e4-c905-4a07-8eb4-0d08d5df8b3f</audience>
 *   </audiences>
 *   <required-claims>
 *       <claim name="id" match="all">
 *           <value>insert claim here</value>
 *       </claim>
 *   </required-claims>
 * </validate-jwt>
 * 
 * <!-- Active Directory B2C token validation -->
 * <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
 *   <openid-config url="https://login.microsoftonline.com/tfp/contoso.onmicrosoft.com/b2c_1_signin/v2.0/.well-known/openid-configuration" />
 *   <audiences>
 *        <audience>d313c4e4-de5f-4197-9470-e509a2f0b806</audience>
 *   </audiences>
 *   <required-claims>
 *        <claim name="id" match="all">
 *            <value>insert claim here</value>
 *        </claim>
 *    </required-claims>
 * </validate-jwt>
 * 
 * <!-- Authorize access to operations based on token claims -->
 * <validate-jwt header-name="Authorization" require-scheme="Bearer" output-token-variable-name="jwt">
 *    <issuer-signing-keys>
 *        <key>{{jwt-signing-key}}</key> <!-- signing key is stored in a named value -->
 *    </issuer-signing-keys>
 *    <audiences>
 *       <audience>@(context.request.originalUrl.Host)</audience>
 *    </audiences>
 *    <issuers>
 *        <issuer>contoso.com</issuer>
 *    </issuers>
 *    <required-claims>
 *         <claim name="group" match="any">
 *              <value>finance</value>
 *              <value>logistics</value>
 *         </claim>
 *    </required-claims>
 * </validate-jwt>
 * <choose>
 *     <when condition="@(context.request.method == "POST" && !((Jwt)context.Variables["jwt"]).Claims["group"].Contains("finance"))">
 *         <return-response>
 *             <set-status code="403" reason="Forbidden" />
 *         </return-response>
 *     </when>
 * </choose>
 * 
 * <!-- Mobile services token validation -->
 * <validate-jwt header-name="x-zumo-auth" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Supplied access token is invalid.">
 *     <issuers>
 *         <issuer>urn:microsoft:windows-:zumo</issuer>
 *     </issuers>
 *     <audiences>
 *         <audience>Facebook</audience>
 *     </audiences>
 *     <issuer-signing-keys>
 *         <zumo-master-key id="0">insert key here</zumo-master-key>
 *     </issuer-signing-keys>
 * </validate-jwt>
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    return { policyElement, context, scope };
};