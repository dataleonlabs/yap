import { cidrSubnet, isEqual, toLong } from 'ip';
import { get } from 'lodash';
import { Context } from "../../router";
import policyManager, { ExecutionContext, IPolicy, tryExecuteFieldValue } from '../index';

export default class IpFilter implements IPolicy {

    public get id() {
        return 'ip-filter';
    }

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
public async apply(executionContext:ExecutionContext) {
        const { policyElement, context, scope } = executionContext;

        const doAllow = policyElement.attributes.action === "allow";
        const sourceIP = get(context, 'request.requestContext.identity.sourceIp');

        for (const element of policyElement.elements) {

            if (sourceIP) {
                // Check request IP is equal to allowed
                if (element.name === "address"
                && (doAllow === isEqual(sourceIP, tryExecuteFieldValue(element.elements[0].text, executionContext)))) {
                    return executionContext;
                }

                // Check request IP is belongs to allowed CIDR
                if (element.name === "address-subnet"
                && (doAllow === cidrSubnet(tryExecuteFieldValue(element.elements[0].text, executionContext)).contains(sourceIP))) {
                    return executionContext;
                }

                // Check request IP is equal to allowed
                if (element.name === "address-range") {
                    const sourceIPLong = toLong(sourceIP);
                    const fallsInRange = toLong(tryExecuteFieldValue(element.attributes.from, executionContext)) <= sourceIPLong
                    && sourceIPLong <= toLong(tryExecuteFieldValue(element.attributes.to));
                    if (doAllow === fallsInRange) {
                        return executionContext;
                    }
                }
            }

            // Throw error if IP is not passing any case or there is no IP
            throw new Error("IP out of range");
        }

        //If no elements in policy element
        return { policyElement: null, context, scope };
    }

    public validate(policyElement: any) {
        return true;
    }
}