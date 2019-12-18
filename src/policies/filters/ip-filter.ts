import { Context } from "../../Router";
import { get } from 'lodash';
import { isEqual, cidrSubnet, toLong } from 'ip';
/**
 * ip-filter policy
 * The ip-filter policy filters (allows/denies) calls from specific
 * IP addresses and/or address ranges.
 * @example
 * <ip-filter action="allow">
 *     <address>13.66.201.169</address>
 *     <address-subnet>13.66.140.128/24</address-subnet>
 *     <address-range from="13.66.140.128" to="13.66.255.143"></address-subnet>
 * </ip-filter>
 */

export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    
    const doAllow = policyElement.attributes.action === "allow";
    const sourceIP = get(context, 'request.requestContext.identity.sourceIp');

    for (const element of policyElement.elements) {

        if (sourceIP) {
            // Check request IP is equal to allowed
            if (element.name === "address" && (doAllow === isEqual(sourceIP, element.elements[0].text))) {
                return { policyElement, context, scope };
            }

            // Check request IP is belongs to allowed CIDR
            if (element.name === "address-subnet" && (doAllow === cidrSubnet(element.elements[0].text).contains(sourceIP))) {
                return { policyElement, context, scope };
            }

            // Check request IP is equal to allowed
            if (element.name === "address-range") {
                const sourceIPLong = toLong(sourceIP);
                const fallsInRange = toLong(element.attributes.from) <= sourceIPLong && sourceIPLong <= toLong(element.attributes.to);
                if (doAllow === fallsInRange) {
                    return { policyElement, context, scope };
                }
            }
        }

        // Throw error if IP is not passing any case or there is no IP
        throw new Error("IP out of range")
    };

    //If no elements in policy element
    return { policyElement: null, context, scope };
};