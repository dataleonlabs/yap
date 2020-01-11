import * as SentryNode from "@sentry/node";
import assert from 'assert';
import * as axios from 'axios';
import { cloneDeep, get, set, unset } from 'lodash';
import * as sinon from 'sinon';
import { xml2js } from 'xml-js';
import policyManager from "../../../src/policies";
import SendRequest from '../../../src/policies/advanced/SendRequest';
import Sentry from '../../../src/policies/advanced/Sentry';
import Policy, { Scope } from '../../../src/policies/policy';
import { getTestContext } from '../../tools';

describe("<sentry/>", () => {
    it("Should init sentry with dsn", async () => {
        const sentry = new Sentry();
        const policy =
            `<sentry dsn="@(context.connections.sentry.DSN)">
        <value>@(context.LastError)</value>
      </sentry>`;
        const policyElement = xml2js(policy).elements[0];
        const context = getTestContext();
        const sentryDSN = "someSentryDSN";
        const error = new Error("Some message");
        const sentryStub = sinon.stub(SentryNode, "init");
        set(context, 'connections.sentry.DSN', sentryDSN);
        set(context, 'LastError', error);
        const response = await sentry.apply({ policyElement, context, scope: Scope.onerror });
        sentryStub.restore();
        assert.deepEqual(sentryStub.getCall(0).args[0], {dsn: sentryDSN});
    });

    it("Should send value to sentry", async () => {
        const sentry = new Sentry();
        const policy =
            `<sentry dsn="@(context.connections.sentry.DSN)">
        <value>@(context.LastError)</value>
      </sentry>`;
        const policyElement = xml2js(policy).elements[0];
        const context = getTestContext();
        const sentryDSN = "someSentryDSN";
        const error = new Error("Some message");
        const sentryInitStub = sinon.stub(SentryNode, "init");
        const sentryStub = sinon.stub(SentryNode, "captureException");
        set(context, 'connections.sentry.DSN', sentryDSN);
        set(context, 'LastError', error);
        const response = await sentry.apply({ policyElement, context, scope: Scope.onerror });
        sentryStub.restore();
        sentryInitStub.restore();
        assert.deepEqual(sentryStub.getCall(0).args[0], error);
    });

    it("Should validate", () => {
        const sentry = new Sentry();
        const policy =
            `<sentry dsn="@(context.connections.sentry.DSN)">
            <value>@(context.LastError)</value>
        </sentry>`;
        const policyElement = xml2js(policy).elements[0];
        const errors = sentry.validate(policyElement);
        assert.equal(errors.length, 0);
    });

    it("Should validate with errors", () => {
        const sentry = new Sentry();
        const strippedPolicy =
            `<sentry></sentry>`;
        const strippedPolicyElement = xml2js(strippedPolicy).elements[0];
        const strippedErrors = sentry.validate(strippedPolicyElement);
        assert.deepEqual(strippedErrors, [
            "sentry-ERR-001: policy should contain attribute dsn. Example dsn=\"@(context.connections.sentry.DSN)\"",
            "sentry-ERR-002: policy should contain elements, for error handling "]);
        const emptyValuePolicy =
            `<sentry dsn="@(context.connections.sentry.DSN)">
                <emptyValue></emptyValue>
            </sentry>`;
        const emptyValueElement = xml2js(emptyValuePolicy).elements[0];
        const emptyValueErrors = sentry.validate(emptyValueElement);
        assert.deepEqual(emptyValueErrors, ["sentry-ERR-003: Found element without value. Each element should contain value."]);
    });
});