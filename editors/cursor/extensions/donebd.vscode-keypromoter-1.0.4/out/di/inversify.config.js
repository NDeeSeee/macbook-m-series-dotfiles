"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupExtensionDependencies = exports.diContainer = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
// !!!WARNING!!! "reflect-metadata" dependency must be imported before all other
const fileHelper_1 = require("../helper/fileHelper");
const platform_1 = require("../helper/platform");
const nodeKeyLogger_1 = require("../keylogger/nodeKeyLogger");
const uiHookKeyLogger_1 = require("../keylogger/uiHookKeyLogger");
const commandCounterService_1 = require("../services/commandCounterService");
const keybindingStorage_1 = require("../services/keybindingStorage");
const subscriptionService_1 = require("../services/subscriptionService");
const identifiers_1 = require("./identifiers");
exports.diContainer = new inversify_1.Container();
function setupExtensionDependencies(platform) {
    if (platform === platform_1.Platform.MACOS || platform === platform_1.Platform.WINDOWS) {
        exports.diContainer.bind(identifiers_1.TYPES.KeyLogger).to(nodeKeyLogger_1.NodeKeyLogger).inSingletonScope();
    }
    else {
        // linux only x11
        exports.diContainer.bind(identifiers_1.TYPES.KeyLogger).to(uiHookKeyLogger_1.UiHookKeyLogger).inSingletonScope();
    }
    exports.diContainer.bind(identifiers_1.TYPES.KeybindingStorage).toConstantValue(new keybindingStorage_1.KeybindingStorage(platform));
    exports.diContainer.bind(identifiers_1.TYPES.CommandCounterService).to(commandCounterService_1.CommandCounterService).inSingletonScope();
    exports.diContainer.bind(identifiers_1.TYPES.FileHelper).to(fileHelper_1.FileHelper).inSingletonScope();
    exports.diContainer.bind(identifiers_1.TYPES.SubscriptionService).to(subscriptionService_1.SubscriptionService).inSingletonScope();
}
exports.setupExtensionDependencies = setupExtensionDependencies;
//# sourceMappingURL=inversify.config.js.map