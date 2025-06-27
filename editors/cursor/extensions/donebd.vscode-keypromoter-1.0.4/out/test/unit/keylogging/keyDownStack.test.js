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
const keyDownStack_1 = require("../../../keylogger/keyDownStack");
describe("Key Down Stack Test", () => {
    it("single key down", () => {
        let stack = new keyDownStack_1.KeyDownStack();
        stack.keyDown("A");
        assert.equal(stack.hasKeystroke(["A"]), true);
    });
    it("many keys down", () => {
        let stack = new keyDownStack_1.KeyDownStack();
        assert.equal(stack.hasKeystroke([]), true);
        stack.keyDown("A");
        assert.equal(stack.hasKeystroke([]), false);
        stack.keyDown("B");
        stack.keyDown("C");
        assert.equal(stack.hasKeystroke(["A"]), false);
        assert.equal(stack.hasKeystroke(["B"]), false);
        assert.equal(stack.hasKeystroke(["C"]), false);
        assert.equal(stack.hasKeystroke(["A", "B"]), false);
        assert.equal(stack.hasKeystroke(["B", "C"]), false);
        assert.equal(stack.hasKeystroke(["A", "C"]), false);
        assert.equal(stack.hasKeystroke(["A", "B", "C"]), true);
        assert.equal(stack.hasKeystroke(["B", "A", "C"]), true);
    });
    it("single key up", () => {
        let stack = new keyDownStack_1.KeyDownStack();
        stack.keyDown("A");
        stack.keyUp("B");
        assert.equal(stack.hasKeystroke(["A"]), true);
        stack.keyUp("A");
        assert.equal(stack.hasKeystroke(["A"]), false);
        assert.equal(stack.hasKeystroke([]), true);
    });
    it("many keys up", () => {
        let stack = new keyDownStack_1.KeyDownStack();
        stack.keyDown("A");
        stack.keyDown("B");
        stack.keyDown("C");
        assert.equal(stack.hasKeystroke(["A", "B", "C"]), true);
        stack.keyUp("B");
        assert.equal(stack.hasKeystroke(["A", "B", "C"]), false);
        assert.equal(stack.hasKeystroke(["A", "C"]), true);
        stack.keyUp("A");
        assert.equal(stack.hasKeystroke(["A", "C"]), false);
        assert.equal(stack.hasKeystroke(["C"]), true);
        stack.keyUp("C");
        assert.equal(stack.hasKeystroke(["C"]), false);
        assert.equal(stack.hasKeystroke([]), true);
    });
    it("reset", () => {
        let stack = new keyDownStack_1.KeyDownStack();
        stack.keyDown("A");
        stack.keyDown("B");
        stack.keyDown("C");
        assert.equal(stack.hasKeystroke(["A", "B", "C"]), true);
        stack.reset();
        assert.equal(stack.hasKeystroke(["A", "B", "C"]), false);
        assert.equal(stack.hasKeystroke(["A", "B"]), false);
        assert.equal(stack.hasKeystroke(["A"]), false);
        assert.equal(stack.hasKeystroke([]), true);
    });
});
//# sourceMappingURL=keyDownStack.test.js.map