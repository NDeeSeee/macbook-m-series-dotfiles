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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const configuration = __importStar(require("./configuration"));
const identifiers_1 = require("./di/identifiers");
const inversify_config_1 = require("./di/inversify.config");
const logging = __importStar(require("./helper/logging"));
const logging_1 = require("./helper/logging");
const platform = __importStar(require("./helper/platform"));
const pluginContext_1 = require("./pluginContext");
function activate(context) {
    initLogging(context);
    logging_1.logger.info("activating extension...");
    const _platform = platform.get();
    (0, inversify_config_1.setupExtensionDependencies)(_platform);
    const keyLogger = inversify_config_1.diContainer.get(identifiers_1.TYPES.KeyLogger);
    keyLogger.init();
    const keybindingStorage = inversify_config_1.diContainer.get(identifiers_1.TYPES.KeybindingStorage);
    const subscriptionService = inversify_config_1.diContainer.get(identifiers_1.TYPES.SubscriptionService);
    const disposables = subscriptionService.listenForPossibleShortcutActions();
    disposables.then((disposables) => {
        context.subscriptions.push(...disposables);
    });
    listenNewKeybindings(context, keybindingStorage);
    pluginContext_1.PluginContext.init(keyLogger);
    logging_1.logger.info("extension activated!");
}
exports.activate = activate;
function deactivate() {
    pluginContext_1.PluginContext.dispose();
}
exports.deactivate = deactivate;
function listenNewKeybindings(context, keybindingStorage) {
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((event) => {
        if (event.fileName === keybindingStorage.userKeybindingsPath) {
            logging_1.logger.info("User keybinding change detected");
            keybindingStorage.updateKeybindings();
        }
    }));
}
function initLogging(context) {
    function setLogLevel() {
        let logLevel = configuration.getLogLevel();
        logging.setLevel(logLevel);
    }
    logging.init(vscode.window.createOutputChannel("Key Promoter", "log"));
    setLogLevel();
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
        if (configuration.didAffectLogLevel(e)) {
            setLogLevel();
        }
    }));
}
//# sourceMappingURL=extension.js.map