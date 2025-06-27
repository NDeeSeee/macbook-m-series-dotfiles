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
const platform_1 = require("../../../helper/platform");
const keybindingStorage_1 = require("../../../services/keybindingStorage");
describe("Default Keybindings Test", () => {
    it("get linux default keybindings", () => {
        const linuxStorage = new keybindingStorage_1.KeybindingStorage(platform_1.Platform.LINUX, true);
        assert.deepEqual(linuxStorage.getKeybindingsFor("editor.action.insertCursorAbove"), ["ctrl+shift+up", "shift+alt+up"]);
        assert.equal(countBindings(linuxStorage.allKeybindings()), 991);
    });
    it("get macos default keybindings", () => {
        const macStorage = new keybindingStorage_1.KeybindingStorage(platform_1.Platform.MACOS, true);
        assert.deepEqual(macStorage.getKeybindingsFor("editor.action.insertCursorAbove"), ["alt+cmd+up"]);
        assert.equal(countBindings(macStorage.allKeybindings()), 1085);
    });
    it("get windows default keybindings", () => {
        const windowsStorage = new keybindingStorage_1.KeybindingStorage(platform_1.Platform.WINDOWS, true);
        assert.deepEqual(windowsStorage.getKeybindingsFor("editor.action.insertCursorAbove"), ["ctrl+alt+up"]);
        assert.equal(countBindings(windowsStorage.allKeybindings()), 1000);
    });
    it("get unsupported OS default keybindings", () => {
        const unsupportedStorage = new keybindingStorage_1.KeybindingStorage(platform_1.Platform.UNSUPPORTED, true);
        assert.equal(unsupportedStorage.allKeybindings().size, 0);
    });
});
function countBindings(bindings) {
    let count = 0;
    bindings.forEach((keystrokes, _) => {
        count += keystrokes.length;
    });
    return count;
}
describe("Patched Keybindings Test", () => {
    it("patch default keybindings", () => {
        const JsonPatch = `
        [
            {
                "key": "numpad_add",
                "command": "editor.action.insertCursorAbove",
                "when": "editorTextFocus"
            },
            {
                "key": "shift+alt+up",
                "command": "-editor.action.insertCursorAbove",
                "when": "editorTextFocus"
            }
        ]
        `;
        const linuxStorage = new keybindingStorage_1.KeybindingStorage(platform_1.Platform.LINUX, true);
        assert.deepEqual(linuxStorage.getKeybindingsFor("editor.action.insertCursorAbove"), ["ctrl+shift+up", "shift+alt+up"]);
        linuxStorage.patch(JsonPatch);
        assert.deepEqual(linuxStorage.getKeybindingsFor("editor.action.insertCursorAbove"), ["ctrl+shift+up", "numpad_add"]);
    });
});
//# sourceMappingURL=keybindingStorage.test.js.map