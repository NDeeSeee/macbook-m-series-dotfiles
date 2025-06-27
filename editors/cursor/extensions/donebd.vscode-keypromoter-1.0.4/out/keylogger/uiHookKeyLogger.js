"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiHookKeyLogger = void 0;
const inversify_1 = require("inversify");
const uiohook_napi_1 = require("uiohook-napi");
const logging_1 = require("../helper/logging");
const keyLogger_1 = require("./keyLogger");
const transform_1 = require("./transform");
let UiHookKeyLogger = class UiHookKeyLogger extends keyLogger_1.KeyLogger {
    init() {
        uiohook_napi_1.uIOhook.on('keydown', (e) => {
            this.handleKeyDown(e.keycode);
        });
        uiohook_napi_1.uIOhook.on('keyup', (e) => {
            this.handleKeyUp(e.keycode);
        });
        uiohook_napi_1.uIOhook.on('mousedown', (_) => {
            this.handleMousePress();
        });
        uiohook_napi_1.uIOhook.start();
    }
    keyFromKeycode(keycode) {
        return (0, transform_1.keyFromUioHookKeycode)(keycode);
    }
    dispose() {
        logging_1.logger.info("deactivating extension...");
        uiohook_napi_1.uIOhook.stop();
        logging_1.logger.info("extension deactivated!");
    }
};
UiHookKeyLogger = __decorate([
    (0, inversify_1.injectable)()
], UiHookKeyLogger);
exports.UiHookKeyLogger = UiHookKeyLogger;
//# sourceMappingURL=uiHookKeyLogger.js.map