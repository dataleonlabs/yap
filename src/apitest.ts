//Api testing

import { deepEqual } from 'assert';
import faker from 'faker';
import fs from 'fs';
import yaml from 'js-yaml';
import { set } from 'lodash';
import path from 'path';
import { getTestAwsContext, getTestContext, getTestRequest } from '../test/tools';
import { executeInString } from './policies';

const propertiesExecutor = (object: any, context: any): void => {
    for (const [key, value] of Object.entries(object)) {
        if (value) {
            if (typeof value === 'string') {
                set(object, `${key}`, executeInString(value as string, context));
            }
        }
    }
};

describe("Running API tests...", () => {
    const { apiclass, testcases } = process.env;
    if (!apiclass || !testcases) {
        throw new Error("apiclass && testcases env variables should be set");
    } else {
        const { testApi } = require(apiclass);
        const ymlFiles = fs.readdirSync(path.resolve(__dirname, testcases)).filter((file) => file.endsWith('.yml'));
        for (const file of ymlFiles) {
            const testFile = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, testcases, file), 'utf8'));
            describe(testFile.info.title, () => {
                for (const [scenarioName, value] of Object.entries(testFile.scenarios)) {
                    const scenarioValue = value as any;
                    const testCaller = scenarioValue.only === true ? it.only : it;
                    testCaller(scenarioName, async () => {
                        const apiInstance = new testApi();
                        const variables = scenarioValue.variables;
                        const scenarioRequest = scenarioValue.request;
                        propertiesExecutor(variables, { faker });
                        const testDataContext = { faker, variables };
                        propertiesExecutor(scenarioRequest, testDataContext);
                        const request = { ...getTestRequest(), ...scenarioRequest };
                        const response = await apiInstance.handle(request, getTestAwsContext());
                        propertiesExecutor(response, testDataContext);
                        set(testDataContext, 'response', response);
                        for (const assert of Object.values(scenarioValue.tests)) {
                            deepEqual(
                                executeInString((assert as any[])[0].expect, testDataContext),
                                executeInString((assert as any[])[1].toEqual, testDataContext),
                            );
                        }
                    });
                }
            });
        }
    }
});