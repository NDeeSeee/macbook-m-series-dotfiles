"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyDownStack = void 0;
class KeyDownStack {
    stack;
    constructor() {
        this.stack = new Array();
    }
    keyDown(key) {
        if (this.stack.find(it => it === key)) {
            return;
        }
        this.stack.push(key);
    }
    keyUp(key) {
        this.stack = this.stack.filter(other => other !== key);
    }
    hasKeystroke(keystroke) {
        return this.stack.sort().toString() === keystroke.sort().toString();
    }
    reset() {
        this.stack = new Array();
    }
}
exports.KeyDownStack = KeyDownStack;
//# sourceMappingURL=keyDownStack.js.map