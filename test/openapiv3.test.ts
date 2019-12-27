import assert from 'assert';
import { OpenApiContext } from 'express-openapi-validator/dist/framework/openapi.context';
import { OpenApiSpecLoader } from 'express-openapi-validator/dist/framework/openapi.spec.loader';
import * as middlewares from 'express-openapi-validator/dist/middlewares';
import * as fs from 'fs';
import * as jsYaml from 'js-yaml';
import 'mocha';

// initialize and validate
// https://github.com/cdimascio/express-openapi-validator/blob/master/src/framework/index.ts

describe('OpenAPI v3', () => {
    it('U-TEST-1 - Constructor creates router', async () => {

        const docWithRefs = jsYaml.safeLoad(
            fs.readFileSync(__dirname + '/resources/openapi.yaml', 'utf8'),
            { json: true },
        );
        const p = new OpenApiSpecLoader({
            apiDoc: docWithRefs,
        });

        const spec = await p.load();
        const context = new OpenApiContext(spec, new RegExp(''));

        const requestValidator = new middlewares.RequestValidator(context.apiDoc, {
            nullable: true,
            removeAdditional: false,
            useDefaults: true,
            allowUnknownQueryParameters: false,
        });

        const req = {
            openapi: {
                schema: 'POST',
                expressRoute: { path: '/products/inlined' },
                pathParams: {},
            },
            query: {},
            params: {},
            method: 'POST',
            originalUrl: '/products/inlined',
            headers: {
                'content-type': "application/json",
            },
            path: '/products/inlined',
        };
        requestValidator.validate(req, {}, (err: any) => console.log(err, 'Yes!'));

        /*
        const requestValidationHandler: OpenApiRequestHandler = (req, res, next) =>
            requestValidator.validate(req, res, next);
        */
        assert(1);
    });
});