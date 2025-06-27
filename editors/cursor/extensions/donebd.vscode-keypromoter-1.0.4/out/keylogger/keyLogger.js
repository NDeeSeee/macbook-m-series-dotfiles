"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyLogger = void 0;
const inversify_1 = require("inversify");
const logging_1 = require("../helper/logging");
const keyDownStack_1 = require("./keyDownStack");
const keyLogBuffer_1 = require("./keyLogBuffer");
let KeyLogger = class KeyLogger {
    keyBuf = new keyLogBuffer_1.KeyLogBuffer(5);
    keyStack = new keyDownStack_1.KeyDownStack();
    hasAnyKeybinding(keybindings) {
        for (let keybinding of keybindings) {
            if (keybinding.includes(" ")) {
                let chords = keybinding.split(" ");
                if (this.keyBuf.hasKeystroke(this.splitKeys(chords[0])) && this.splitKeys(chords[1])) {
                    this.keyBuf.reset();
                    this.keyStack.reset();
                    return true;
                }
            }
            else {
                if (this.keyStack.hasKeystroke(this.splitKeys(keybinding))) {
                    return true;
                }
            }
        }
        return false;
    }
    handleKeyDown(keyId) {
        let key = this.keyFromKeycode(keyId);
        logging_1.logger.debug(`key down: ${key}`);
        this.keyBuf.keyPressed(key);
        this.keyStack.keyDown(key);
    }
    handleKeyUp(keyId) {
        let key = this.keyFromKeycode(keyId);
        logging_1.logger.debug(`key up: ${key}`);
        this.keyStack.keyUp(key);
    }
    handleMousePress() {
        logging_1.logger.debug(`pressed mouse`);
        this.keyBuf.reset();
    }
    splitKeys(keybinding) {
        return keybinding.split(/\+/);
    }
};
KeyLogger = __decorate([
    (0, inversify_1.injectable)()
], KeyLogger);
exports.KeyLogger = KeyLogger;
//# sourceMappingURL=keyLogger.js.map