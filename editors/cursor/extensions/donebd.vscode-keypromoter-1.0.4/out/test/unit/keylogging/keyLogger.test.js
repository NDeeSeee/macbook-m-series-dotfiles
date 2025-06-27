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
const uiohook_napi_1 = require("uiohook-napi");
const uiHookKeyLogger_1 = require("../../../keylogger/uiHookKeyLogger");
describe("Key Logger Test", () => {
    it("single key", () => {
        let keyLogger = new uiHookKeyLogger_1.UiHookKeyLogger();
        assert.equal(keyLogger.hasAnyKeybinding(["w"]), false);
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.W);
        assert.equal(keyLogger.hasAnyKeybinding(["w"]), true);
        keyLogger.handleKeyUp(uiohook_napi_1.UiohookKey.W);
        assert.equal(keyLogger.hasAnyKeybinding(["w"]), false);
    });
    it("two keys", () => {
        let keyLogger = new uiHookKeyLogger_1.UiHookKeyLogger();
        assert.equal(keyLogger.hasAnyKeybinding(["w"]), false);
        assert.equal(keyLogger.hasAnyKeybinding(["ctrl+w"]), false);
        assert.equal(keyLogger.hasAnyKeybinding(["w+ctrl"]), false);
        assert.equal(keyLogger.hasAnyKeybinding(["ctrl"]), false);
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.Ctrl);
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.W);
        assert.equal(keyLogger.hasAnyKeybinding(["w"]), false);
        assert.equal(keyLogger.hasAnyKeybinding(["ctrl+w"]), true);
        assert.equal(keyLogger.hasAnyKeybinding(["w+ctrl"]), true);
        assert.equal(keyLogger.hasAnyKeybinding(["ctrl"]), false);
        keyLogger.handleKeyUp(uiohook_napi_1.UiohookKey.Ctrl);
        assert.equal(keyLogger.hasAnyKeybinding(["w"]), true);
        assert.equal(keyLogger.hasAnyKeybinding(["ctrl+w"]), false);
        assert.equal(keyLogger.hasAnyKeybinding(["w+ctrl"]), false);
        assert.equal(keyLogger.hasAnyKeybinding(["ctrl"]), false);
    });
    it("many keys", () => {
        let keyLogger = new uiHookKeyLogger_1.UiHookKeyLogger();
        assert.equal(keyLogger.hasAnyKeybinding(["ctrl+shift+w"]), false);
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.Ctrl);
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.Shift);
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.W);
        assert.equal(keyLogger.hasAnyKeybinding(["ctrl+shift+w"]), true);
        assert.equal(keyLogger.hasAnyKeybinding(["ctrl+w+shift", "w+shift+ctrl", "shift+w+ctrl"]), true);
    });
    it("key reuse", () => {
        let keyLogger = new uiHookKeyLogger_1.UiHookKeyLogger();
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.Alt);
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.ArrowDown);
        assert.equal(keyLogger.hasAnyKeybinding(["alt+down"]), true);
        keyLogger.handleKeyUp(uiohook_napi_1.UiohookKey.ArrowDown);
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.ArrowUp);
        assert.equal(keyLogger.hasAnyKeybinding(["alt+down"]), false);
        assert.equal(keyLogger.hasAnyKeybinding(["alt+up"]), true);
    });
    it("chords", () => {
        let keyLogger = new uiHookKeyLogger_1.UiHookKeyLogger();
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.A);
        keyLogger.handleKeyUp(uiohook_napi_1.UiohookKey.A);
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.B);
        assert.equal(keyLogger.hasAnyKeybinding(["a+b"]), false);
        assert.equal(keyLogger.hasAnyKeybinding(["a b"]), true);
    });
    it("repeated chords", () => {
        let keyLogger = new uiHookKeyLogger_1.UiHookKeyLogger();
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.A);
        keyLogger.handleKeyUp(uiohook_napi_1.UiohookKey.A);
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.B);
        assert.equal(keyLogger.hasAnyKeybinding(["a b"]), true);
        keyLogger.handleKeyUp(uiohook_napi_1.UiohookKey.B);
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.B);
        assert.equal(keyLogger.hasAnyKeybinding(["a b"]), false);
    });
    it("mouse press", () => {
        let keyLogger = new uiHookKeyLogger_1.UiHookKeyLogger();
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.A);
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.B);
        assert.equal(keyLogger.hasAnyKeybinding(["a+b"]), true);
        assert.equal(keyLogger.hasAnyKeybinding(["a b"]), true);
        assert.equal(keyLogger.hasAnyKeybinding(["a+b"]), false);
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.A);
        keyLogger.handleKeyDown(uiohook_napi_1.UiohookKey.B);
        keyLogger.handleMousePress();
        assert.equal(keyLogger.hasAnyKeybinding(["a+b"]), true);
        assert.equal(keyLogger.hasAnyKeybinding(["a b"]), false);
    });
});
//# sourceMappingURL=keyLogger.test.js.map