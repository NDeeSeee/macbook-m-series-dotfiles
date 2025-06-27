"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const assert = __importStar(require("assert"));
const iohook = __importStar(require("uiohook-napi"));
const transform = __importStar(require("../../../keylogger/transform"));
describe("Key Transform Test", () => {
    it("some keys from keycode", () => {
        assert.equal(transform.keyFromUioHookKeycode(iohook.UiohookKey.F10), "f10");
        assert.equal(transform.keyFromUioHookKeycode(iohook.UiohookKey.W), "w");
        assert.equal(transform.keyFromUioHookKeycode(iohook.UiohookKey.Alt), "alt");
        assert.equal(transform.keyFromUioHookKeycode(iohook.UiohookKey.Escape), "escape");
        assert.equal(transform.keyFromUioHookKeycode(0), transform.UNSUPPORTED_KEY);
    });
});
//# sourceMappingURL=transform.test.js.map