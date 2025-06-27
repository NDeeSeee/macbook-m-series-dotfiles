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
const keyLogBuffer_1 = require("../../../keylogger/keyLogBuffer");
describe("Key Log Buffer Test", () => {
    it("buffer size 1", () => {
        var buf = new keyLogBuffer_1.KeyLogBuffer(1);
        assert.equal(buf.hasKeystroke(["A"]), false);
        buf.keyPressed("A");
        assert.equal(buf.hasKeystroke(["A"]), true);
        assert.equal(buf.hasKeystroke(["B"]), false);
        buf.keyPressed("B");
        assert.equal(buf.hasKeystroke(["A"]), false);
        assert.equal(buf.hasKeystroke(["B"]), true);
    });
    it("buffer size 2", () => {
        var buf = new keyLogBuffer_1.KeyLogBuffer(2);
        assert.equal(buf.hasKeystroke(["A"]), false);
        assert.equal(buf.hasKeystroke(["B"]), false);
        buf.keyPressed("A");
        assert.equal(buf.hasKeystroke(["A"]), true);
        assert.equal(buf.hasKeystroke(["B"]), false);
        buf.keyPressed("B");
        assert.equal(buf.hasKeystroke(["A"]), true);
        assert.equal(buf.hasKeystroke(["B"]), true);
        buf.keyPressed("C");
        assert.equal(buf.hasKeystroke(["A"]), false);
        assert.equal(buf.hasKeystroke(["B"]), true);
        assert.equal(buf.hasKeystroke(["C"]), true);
    });
    it("keystrokes", () => {
        var buf = new keyLogBuffer_1.KeyLogBuffer(3);
        buf.keyPressed("A");
        buf.keyPressed("B");
        buf.keyPressed("C");
        assert.equal(buf.hasKeystroke(["A", "C"]), false);
        assert.equal(buf.hasKeystroke(["A", "B"]), true);
        assert.equal(buf.hasKeystroke(["B", "C"]), true);
        assert.equal(buf.hasKeystroke(["A", "B", "C"]), true);
    });
    it("looping keystrokes", () => {
        var buf = new keyLogBuffer_1.KeyLogBuffer(3);
        buf.keyPressed("A");
        buf.keyPressed("B");
        buf.keyPressed("C");
        buf.keyPressed("D");
        assert.equal(buf.hasKeystroke(["A", "B"]), false);
        assert.equal(buf.hasKeystroke(["B", "C"]), true);
        assert.equal(buf.hasKeystroke(["C", "D"]), true);
        assert.equal(buf.hasKeystroke(["D", "A"]), false);
        assert.equal(buf.hasKeystroke(["A", "B", "C"]), false);
        assert.equal(buf.hasKeystroke(["B", "C", "D"]), true);
    });
});
//# sourceMappingURL=keyLogBuffer.test.js.map