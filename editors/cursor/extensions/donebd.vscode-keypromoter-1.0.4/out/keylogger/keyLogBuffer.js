"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyLogBuffer = void 0;
class KeyLogBuffer {
    size;
    buffer;
    nextIndex = 0;
    constructor(size) {
        this.size = size;
        this.buffer = new Array(size);
    }
    keyPressed(key) {
        this.buffer[this.nextIndex] = key;
        this.nextIndex = (this.nextIndex + 1) % this.size;
    }
    hasKeystroke(keystroke) {
        let doubleBuffer = this.buffer.concat(this.buffer);
        let firstKeyIndex = this.nextIndex;
        let lastKeyIndex = firstKeyIndex + this.size;
        let len = keystroke.length;
        for (let i = firstKeyIndex; i <= lastKeyIndex - len; i++) {
            let window = doubleBuffer.slice(i, i + len);
            if (window.toString() === keystroke.toString()) {
                return true;
            }
        }
        return false;
    }
    reset() {
        this.buffer.fill("");
    }
}
exports.KeyLogBuffer = KeyLogBuffer;
//# sourceMappingURL=keyLogBuffer.js.map