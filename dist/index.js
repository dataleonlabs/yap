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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("./router"));
class Yap {
    constructor() {
        this.router = new router_1.default();
    }
    get Router() {
        return this.router;
    }
    handler(awsEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.execute(awsEvent);
        });
    }
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = {
                request,
                response: {}
            };
            this.router.Context = context;
            return yield this.router.getResponse();
        });
    }
    get(path, action) {
        this.router.register('GET', path, action);
    }
    post(path, action) {
        this.router.register('POST', path, action);
    }
    put(path, action) {
        this.router.register('PUT', path, action);
    }
    delete(path, action) {
        this.router.register('DELETE', path, action);
    }
    all(path, action) {
        this.router.register(null, path, action);
    }
}
exports.default = Yap;
