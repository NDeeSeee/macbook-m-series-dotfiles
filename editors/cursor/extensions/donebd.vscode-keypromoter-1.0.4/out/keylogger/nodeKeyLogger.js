"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeKeyLogger = void 0;
const inversify_1 = require("inversify");
const node_global_key_listener_1 = require("node-global-key-listener");
const logging_1 = require("../helper/logging");
const keyLogger_1 = require("./keyLogger");
const transform_1 = require("./transform");
let NodeKeyLogger = class NodeKeyLogger extends keyLogger_1.KeyLogger {
    keyListener = new node_global_key_listener_1.GlobalKeyboardListener();
    init() {
        this.keyListener.addListener((event) => {
            this.fixKeyEvent(event);
            if (!event.name) {
                return;
            }
            if (event.name === "MOUSE LEFT" || event.name === "MOUSE RIGHT") {
                this.handleMousePress();
                return;
            }
            if (event.state === "DOWN") {
                this.handleKeyDown(event.name);
            }
            else {
                this.handleKeyUp(event.name);
            }
        });
    }
    keyFromKeycode(keycode) {
        return (0, transform_1.keyFromNodeKeyName)(keycode);
    }
    dispose() {
        logging_1.logger.info("deactivating extension...");
        this.keyListener.kill();
        logging_1.logger.info("extension deactivated!");
    }
    fixKeyEvent(event) {
        if (event.rawKey?.name === "KPSLASH") {
            event.name = "FORWARD SLASH";
        }
    }
};
NodeKeyLogger = __decorate([
    (0, inversify_1.injectable)()
], NodeKeyLogger);
exports.NodeKeyLogger = NodeKeyLogger;
//# sourceMappingURL=nodeKeyLogger.js.map