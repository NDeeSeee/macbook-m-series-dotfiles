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
exports.setSuggestKeybindingCreation = exports.getSuggestKeybindingCreation = exports.addIgnoreCommand = exports.getIgnoreCommands = exports.getLoyaltyLevel = exports.didAffectLogLevel = exports.getLogLevel = void 0;
const vscode = __importStar(require("vscode"));
const logging_1 = require("./helper/logging");
const section = "Key Promoter";
const logLevelScope = "logger.loggingLevel";
const loyaltyLevelScope = "loyaltyLevel";
const ignoredCommandsScope = "ignoredCommands";
const suggestKeybindingCreationScope = "suggestKeybindingCreation";
function getLogLevel() {
    return vscode.workspace.getConfiguration(section).get(logLevelScope, 'Info');
}
exports.getLogLevel = getLogLevel;
function didAffectLogLevel(e) {
    return e.affectsConfiguration(section);
}
exports.didAffectLogLevel = didAffectLogLevel;
function getLoyaltyLevel() {
    return vscode.workspace.getConfiguration(section).get(loyaltyLevelScope, 5);
}
exports.getLoyaltyLevel = getLoyaltyLevel;
function getIgnoreCommands() {
    return vscode.workspace.getConfiguration(section).get(ignoredCommandsScope, []);
}
exports.getIgnoreCommands = getIgnoreCommands;
function addIgnoreCommand(command) {
    let ignored = getIgnoreCommands().filter(it => it !== command);
    ignored.push(command);
    try {
        vscode.workspace.getConfiguration(section).update(ignoredCommandsScope, ignored, vscode.ConfigurationTarget.Global);
        logging_1.logger.info(`added command ${command} to ignore list (with total length of ${ignored.length})`);
    }
    catch (e) {
        if (e instanceof Error) {
            logging_1.logger.error(`error when adding command ${command} to ignore list: ${e.message}`);
        }
    }
}
exports.addIgnoreCommand = addIgnoreCommand;
function getSuggestKeybindingCreation() {
    return vscode.workspace.getConfiguration(section).get(suggestKeybindingCreationScope, true);
}
exports.getSuggestKeybindingCreation = getSuggestKeybindingCreation;
function setSuggestKeybindingCreation(value) {
    try {
        vscode.workspace.getConfiguration(section).update(suggestKeybindingCreationScope, value, vscode.ConfigurationTarget.Global);
        logging_1.logger.info(`updated 'suggest keybinding creation' setting to '${value}'`);
    }
    catch (e) {
        if (e instanceof Error) {
            logging_1.logger.error(`error when updating 'suggest keybinding creation' setting: ${e.message}`);
        }
    }
}
exports.setSuggestKeybindingCreation = setSuggestKeybindingCreation;
//# sourceMappingURL=configuration.js.map