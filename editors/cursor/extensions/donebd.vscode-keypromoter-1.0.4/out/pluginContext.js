"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginContext = void 0;
class PluginContext {
    static keyLogger;
    static init(keyLogger) {
        this.keyLogger = keyLogger;
    }
    static dispose() {
        this.keyLogger?.dispose();
    }
}
exports.PluginContext = PluginContext;
//# sourceMappingURL=pluginContext.js.map