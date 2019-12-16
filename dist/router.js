"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_to_regexp_1 = require("path-to-regexp");
/**
 * Router
 */
class Router {
    constructor() {
        /**
         * Middlewares
         * @param {Object} middlewares Middlewares available for request
         */
        this.middlewares = [];
        /**
         * Fields
         * @param {Object} fields fields from ui interface
         */
        this.context = { request: {}, response: {}, fields: {}, connection: {} };
        /**
         * triggerMiddleWare
         * Manage next and throw function
         */
        this.triggerMiddleWare = (middleware) => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                // functio next
                this.context.next = () => resolve();
                this.context.throw = (statusCode, body) => {
                    this.context.response.statusCode = statusCode;
                    this.context.response.body = body;
                    reject(body);
                };
                try {
                    yield middleware.action(this.context);
                }
                catch (error) {
                    this.context.response.statusCode = 500;
                    this.context.response.body = error.message;
                    reject(error);
                }
            }));
        };
    }
    /**
     * Loads context to router
     * @param {Context} context Context of request
     */
    set Context(context) {
        this.context = context;
    }
    /**
     * Returns context from router
     */
    get Context() {
        return this.context;
    }
    /**
     * Get MiddlewaresMatched
     */
    getMiddlewaresMatched() {
        // Get middleware matched
        const middlewaresMatchedWithMethod = [];
        for (const middleware of this.middlewares) {
            if (this.context.request.path) {
                const keys = [];
                const regexp = path_to_regexp_1.pathToRegexp(middleware.path, keys);
                const match = regexp.exec(this.context.request.path);
                // Dont match
                if (match === null) {
                    continue;
                }
                const params = {};
                for (let index = 1; index < match.length; index++) {
                    params[keys[index - 1].name] = match[index];
                    this.context.request.params = params;
                }
            }
            if (middleware.method === null) {
                middlewaresMatchedWithMethod.push(middleware);
            }
            else if (middleware.method === this.context.request.httpMethod.toLocaleUpperCase()) {
                middlewaresMatchedWithMethod.push(middleware);
            }
        }
        return middlewaresMatchedWithMethod;
    }
    /**
     * Get response
     */
    getResponse() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get middlewares matched
            const middlewares = this.getMiddlewaresMatched();
            try {
                if (middlewares.length) {
                    // Loop
                    for (const middleware of middlewares) {
                        yield this.triggerMiddleWare(middleware);
                    }
                }
                else {
                    this.context.response.statusCode = 404;
                    this.context.response.body = 'Not found middleware';
                }
            }
            catch (error) {
                // Inject error
                this.context.response.statusCode = this.context.response.statusCode || 500;
                this.context.response.body = this.context.response.body || error;
            }
            finally {
                return this.context.response;
            }
        });
    }
    /**
     * Get response
     */
    register(method, path, action) {
        this.middlewares.push({ method, path, action });
    }
}
exports.default = Router;
