import { cidrSubnet, toLong } from 'ip';
import { get, isEqual } from 'lodash';
import { isIP } from 'net';
import { tryExecuteFieldValue } from '..';
import Policy, { ExecutionContext, PolicyCategory, Scope, YapPolicy } from '../policy';

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
@YapPolicy({
    id: 'ip-filter',
    name: 'IP filter policy',
    category: PolicyCategory.accessrestriction,
    description: "The ip-filter policy filters (allows/denies) calls from specific",
    scopes: [Scope.inbound],
  })
export default class IpFilter extends Policy {

    /**
     * Applies IP filter policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
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
                        && sourceIPLong <= toLong(tryExecuteFieldValue(element.attributes.to, executionContext));
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

    /**
     * Validates IP filter policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const action = get(policyElement, 'attributes.action');
        const errors = [];
        if (!action || ['allow', 'forbid'].indexOf(action) === -1) {
            errors.push(`${this.id}-ERR-001: attribute 'action' is required and should be neither allow or forbid`);
        }
        const elements = get(policyElement, 'elements');
        if (!elements || !elements.length) {
            errors.push(`${this.id}-ERR-002: should be defined at least one sub element of <address>, <address-subnet> or <address-range>`);
        } else {
            for (const element of elements) {
                switch (element.name) {
                    case "address":
                        const ip = get(element, 'elements[0].text');
                        if(!isIP(ip)) {
                            errors.push(`${this.id}-ERR-004: Element name <${element.name}>. Have wrong ip defined: ${ip}. Should be an IP adrreess f.e. <address>13.66.201.169</address>`);
                        }
                        break;
                    case "address-subnet":
                        const subnet = get(element, 'elements[0].text');
                        const parts = subnet.split('/');
                        if(parts.length !== 2 || !isIP(parts[0]) || isNaN(Number.parseInt(parts[1]))) {
                            errors.push(`${this.id}-ERR-005: Element name <${element.name}>. Have wrong subnet defined: ${subnet}. Should be an IP adrreess f.e. <address-subnet>13.66.140.128/24</address-subnet>`);
                        }
                        break;
                    case "address-range":
                        const from = get(element, 'attributes.from');
                        const to = get(element, 'attributes.to');
                        if(!from || !to || !isIP(from) || !isIP(to)) {
                            errors.push(`${this.id}-ERR-006: Element name <${element.name}>. Have wrong attributes defined: from = ${from}, to = ${to}. `+
                            `Element should have correct from and to IP addreses defined, f.e. <address-range from="13.66.140.128" to="13.66.255.143"></address-subnet>`);
                        }
                        break;
                    default:
                        errors.push(`${this.id}-ERR-003: Element name <${element.name}> is not allowed. `
                        +`should be defined at least one sub element of <address>, <address-subnet> or <address-range>`);
                        break;
                }
            }
        }
        return errors;
    }
}