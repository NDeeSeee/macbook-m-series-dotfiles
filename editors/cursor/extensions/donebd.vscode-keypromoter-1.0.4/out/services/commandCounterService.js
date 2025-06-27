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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandCounterService = void 0;
const inversify_1 = require("inversify");
const vscode = __importStar(require("vscode"));
const configuration = __importStar(require("../configuration"));
const identifiers_1 = require("../di/identifiers");
const logging_1 = require("../helper/logging");
const commandGroup_1 = require("../models/commandGroup");
const descriptionHandler_1 = require("./descriptionHandler");
let CommandCounterService = class CommandCounterService {
    keybindingStorage;
    keyLogger;
    internalCommandToCounter = new Map();
    internalCommandGroupToCounter = new Map();
    publicCommandToCounter = new Map();
    publicCommandGroupToCounter = new Map();
    descriptionHandler = new descriptionHandler_1.DescriptionService();
    constructor(keybindingStorage, keyLogger) {
        this.keybindingStorage = keybindingStorage;
        this.keyLogger = keyLogger;
    }
    handleCommand(commandId, times = 1) {
        if (configuration.getIgnoreCommands().includes(commandId)) {
            logging_1.logger.info(`ignoring command ${commandId} from ignore list`);
            return;
        }
        const keybindings = this.keybindingStorage.getKeybindingsFor(commandId);
        if (keybindings.length === 0) {
            this.handleCommandWithoutExistingShortcut(commandId, times);
            return;
        }
        this.handleCommandWithExistingShortcut(commandId, keybindings, times);
    }
    handleCommandGroup(commandGroup) {
        if (configuration.getIgnoreCommands().includes(commandGroup.groupId)) {
            logging_1.logger.info(`ignoring command group ${commandGroup.groupId} from ignore list`);
            return;
        }
        const groupId = commandGroup.groupId;
        const commandIds = commandGroup.commandIds;
        const groupKeybindings = [];
        commandIds.forEach(commandId => {
            const commandKeybindings = this.keybindingStorage.getKeybindingsFor(commandId);
            if (commandKeybindings) {
                groupKeybindings.push(...commandKeybindings);
            }
        });
        if (groupKeybindings.length !== 0) {
            let currCounter = this.internalCommandGroupToCounter.get(groupId) ?? 0;
            let publicCounter = this.publicCommandGroupToCounter.get(groupId) ?? 0;
            if (!this.keyLogger.hasAnyKeybinding(groupKeybindings)) {
                currCounter++;
                publicCounter++;
                logging_1.logger.debug(`user did not use keybindings for group ${groupId}, counter = ${currCounter}`);
            }
            else {
                currCounter -= 1;
                currCounter = (currCounter < 0) ? 0 : currCounter;
                logging_1.logger.debug(`user did use keybinding for group ${groupId}, counter = ${currCounter}`);
            }
            if (currCounter > configuration.getLoyaltyLevel()) {
                logging_1.logger.info(`show info message for group ${groupId}`);
                this.suggestToUseGroupShortcut(groupId);
                currCounter = 0;
            }
            this.internalCommandGroupToCounter.set(groupId, currCounter);
            this.publicCommandGroupToCounter.set(groupId, publicCounter);
        }
    }
    handleCommandWithExistingShortcut(commandId, keybindings, times) {
        let publicCounter = this.publicCommandToCounter.get(commandId) ?? 0;
        let internalCounter = this.internalCommandToCounter.get(commandId) ?? 0;
        if (!this.keyLogger.hasAnyKeybinding(keybindings)) {
            internalCounter += times;
            publicCounter += times;
            logging_1.logger.debug(`user did not use keybinding for command ${commandId}, counter = ${internalCounter}`);
        }
        else {
            internalCounter -= times;
            internalCounter = (internalCounter < 0) ? 0 : internalCounter;
            logging_1.logger.debug(`user did use keybinding for command ${commandId}, counter = ${internalCounter}`);
        }
        if (internalCounter <= configuration.getLoyaltyLevel()) {
            this.internalCommandToCounter.set(commandId, internalCounter);
            this.publicCommandToCounter.set(commandId, publicCounter);
            return;
        }
        logging_1.logger.info(`show info message for command ${commandId}`);
        const ignoreBtn = "Add to Ignore List";
        vscode.window.showInformationMessage(this.buildStyledMessage(keybindings, commandId), ignoreBtn).then(button => {
            if (button === ignoreBtn) {
                configuration.addIgnoreCommand(commandId);
            }
        });
        this.internalCommandToCounter.set(commandId, 0);
        this.publicCommandToCounter.set(commandId, publicCounter);
    }
    handleCommandWithoutExistingShortcut(commandId, times) {
        let publicCounter = this.publicCommandToCounter.get(commandId) ?? 0;
        let internalCounter = this.internalCommandToCounter.get(commandId) ?? 0;
        if (!configuration.getSuggestKeybindingCreation()) {
            logging_1.logger.info(`suggestions for commands without keybindings are disabled, including ${commandId}`);
            return;
        }
        internalCounter += times;
        publicCounter += times;
        logging_1.logger.debug(`command ${commandId} doesn't have a keybinding, counter = ${internalCounter}`);
        if (internalCounter <= configuration.getLoyaltyLevel()) {
            this.internalCommandToCounter.set(commandId, internalCounter);
            this.publicCommandToCounter.set(commandId, publicCounter);
            return;
        }
        const suggestToAddShortcut = "Add Keybinding";
        const disableSuggestions = "Disable Suggestions";
        const description = this.descriptionHandler.getDescriptionForCommand(commandId) ?? commandId;
        vscode.window.showInformationMessage(`You used command '${description}' more than ${publicCounter} times - you can add a shortcut for quicker access.`, suggestToAddShortcut, disableSuggestions).then(button => {
            if (button === suggestToAddShortcut) {
                logging_1.logger.info("opening keybindings menu for suggested command");
                vscode.commands.executeCommand("workbench.action.openGlobalKeybindings", commandId);
            }
            if (button === disableSuggestions) {
                configuration.setSuggestKeybindingCreation(false);
            }
        });
        this.internalCommandToCounter.set(commandId, 0);
        this.publicCommandToCounter.set(commandId, publicCounter);
    }
    suggestToUseGroupShortcut(groupId) {
        if (groupId === commandGroup_1.CommandGroup.NavigateBetweenTabsGroup.groupId) {
            const goNextEditorCommand = commandGroup_1.CommandGroup.NavigateBetweenTabsGroup.commandIds[0];
            const goPreviousEditorCommand = commandGroup_1.CommandGroup.NavigateBetweenTabsGroup.commandIds[1];
            const goToFirstEditorCommand = commandGroup_1.CommandGroup.NavigateBetweenTabsGroup.commandIds[2];
            const goToSecondEditorCommand = commandGroup_1.CommandGroup.NavigateBetweenTabsGroup.commandIds[3];
            const goNextShortcut = this.keybindingStorage.getKeybindingsFor(goNextEditorCommand) ?? [""];
            const goPreviousShortcut = this.keybindingStorage.getKeybindingsFor(goPreviousEditorCommand) ?? [""];
            const goToFirstShortcut = this.keybindingStorage.getKeybindingsFor(goToFirstEditorCommand) ?? [""];
            const goToSecondShortcut = this.keybindingStorage.getKeybindingsFor(goToSecondEditorCommand) ?? [""];
            const checkAllShortcutsButton = "View All Shortcuts";
            const ignoreBtn = "Add to Ignore List";
            const publicCounter = this.publicCommandGroupToCounter.get(groupId);
            vscode.window.showInformationMessage(`Tip: you can use '${goNextShortcut}'/'${goPreviousShortcut}' or '${goToFirstShortcut}', '${goToSecondShortcut}'... to navigate between editors. You missed ${publicCounter} times! You can also check keybindings for all commands.`, checkAllShortcutsButton, ignoreBtn).then(button => {
                if (button === checkAllShortcutsButton) {
                    vscode.commands.executeCommand("workbench.action.openGlobalKeybindings", groupId);
                }
                if (button === ignoreBtn) {
                    configuration.addIgnoreCommand(groupId);
                }
            });
        }
    }
    buildStyledMessage(keybindings, commandId) {
        const publicCounter = this.publicCommandToCounter.get(commandId);
        const description = this.descriptionHandler.getDescriptionForCommand(commandId) ?? commandId;
        return `Tip: you can use <${keybindings.join("> or <")}> to perform command '${description}'. You missed ${publicCounter} times!`;
    }
};
CommandCounterService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(identifiers_1.TYPES.KeybindingStorage)),
    __param(1, (0, inversify_1.inject)(identifiers_1.TYPES.KeyLogger))
], CommandCounterService);
exports.CommandCounterService = CommandCounterService;
//# sourceMappingURL=commandCounterService.js.map