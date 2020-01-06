import { captureException, init } from "@sentry/node";
import { get } from 'lodash';
import policyManager, { tryExecuteFieldValue } from '..';
import Policy, { ExecutionContext, PolicyCategory, Scope, YapPolicy } from '../policy';

/**
 * The sentry policy prevent crashes across your entire stack.
 * Sentry is designed to be very simple to get off the ground, yet powerful to grow into.
 * @example
 * <sentry dsn="@(context.connections.sentry.DSN)">
 *      <value>@(context.LastError)</value>
 * </sentry>
 */
@YapPolicy({
    id: 'sentry',
    name: 'Sentry policy',
    category: PolicyCategory.advanced,
    description: "The sentry policy prevent crashes across your entire stack.",
    scopes: [Scope.inbound, Scope.outbound, Scope.onerror],
})
export default class Sentry extends Policy {

    /**
     * Flag whether client was activated
     */
    private isClientActivated = false;

    /**
     * Applies control flow policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context } = executionContext;
        if (!this.isClientActivated) {
            init({dsn: tryExecuteFieldValue(get(policyElement, 'attributes.dsn'), executionContext)});
        }
        for (const value of policyElement.elements) {
            const data = captureException(tryExecuteFieldValue(get(value, 'elements[0].text'), executionContext));
        }
        return executionContext;
    }

    /**
     * Validates control flow policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const elements = get(policyElement, 'elements');
        const errors: string[] = [];
        if (!get(policyElement, 'attributes.dsn')) {
            errors.push(`${this.id}-ERR-001: policy should contain attribute dsn. ` +
                `Example dsn="@(context.connections.sentry.DSN)"`);
        }
        if (!elements || !elements.length) {
            errors.push(`${this.id}-ERR-002: policy should contain elements, for error handling `);
        } else {
            for (const element of elements) {
                if (!get(element, 'elements[0].text')) {
                    errors.push(`${this.id}-ERR-003: Found element without value. Each element should contain value.`);
                }
            }
        }
        return errors;
    }
}