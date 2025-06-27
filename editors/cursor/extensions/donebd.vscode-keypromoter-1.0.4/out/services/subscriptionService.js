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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const inversify_1 = require("inversify");
const path_1 = __importDefault(require("path"));
const vscode = __importStar(require("vscode"));
const identifiers_1 = require("../di/identifiers");
const logging_1 = require("../helper/logging");
const commandGroup_1 = require("../models/commandGroup");
let SubscriptionService = class SubscriptionService {
    commandCounter;
    fileHelper;
    commandIdToOverloadHandlerMap = new Map();
    ignoreCommandToListenList = [
        "notification.expand",
        "notification.clear",
        "notification.collapse",
        "type",
        "compositionEnd",
        "compositionStart",
        "compositionType",
        "replacePreviousChar",
        "cursorLeft",
        "cursorRight",
        "cursorUp",
        "cursorDown",
        "debug.editBreakpoint",
        "workbench.debug.viewlet.action.removeBreakpoint",
        "debug.removeWatchExpression",
        "search.action",
        "quickInput.next",
        "quickInput.previous",
        "workbench.action.output.toggleOutput"
    ];
    constructor(commandCounter, fileHelper) {
        this.commandCounter = commandCounter;
        this.fileHelper = fileHelper;
    }
    async listenForPossibleShortcutActions() {
        const commandIds = (await vscode.commands.getCommands(true)).filter(id => !this.ignoreCommandToListenList.find(it => id.startsWith(it)));
        this.runtimeExecuteErrorsHandling(this.commandIdToOverloadHandlerMap);
        this.listenVscodeCommands(commandIds);
        return this.listenPublicVscodeApi();
    }
    listenVscodeCommands(commandIds) {
        const commandHandler = (commandId, ...args) => {
            this.commandIdToOverloadHandlerMap.get(commandId).dispose();
            return this.proxyCallback(commandHandler, commandId, ...args);
        };
        commandIds.forEach(commandId => {
            try {
                const overloadedHandler = vscode.commands.registerCommand(commandId, (...args) => { return commandHandler(commandId, ...args); });
                this.commandIdToOverloadHandlerMap.set(commandId, overloadedHandler);
            }
            catch (e) {
                logging_1.logger.debug(`command ${commandId} can't be overloaded`);
            }
        });
    }
    async proxyCallback(proxyCommandHandler, commandId, ...any) {
        const pipeArgs = any;
        logging_1.logger.debug(`command ${commandId} was executed!`);
        let result = null;
        this.commandCounter.handleCommand(commandId);
        if (pipeArgs && pipeArgs.length !== 0) {
            result = vscode.commands.executeCommand(commandId, ...pipeArgs);
        }
        else {
            result = vscode.commands.executeCommand(commandId);
        }
        this.commandIdToOverloadHandlerMap.set(commandId, vscode.commands.registerCommand(commandId, (...args) => { return proxyCommandHandler(commandId, ...args); }));
        return result;
    }
    runtimeExecuteErrorsHandling(commandIdToOverloadHandlerMap) {
        const originalExecuteCommand = vscode.commands.executeCommand;
        const errHandler = (errName, commandId) => {
            if (errName === 'TypeError') {
                logging_1.logger.debug(`Command ${commandId} seems to depend on thisArg.`);
                commandIdToOverloadHandlerMap.get(commandId).dispose();
            }
        };
        vscode.commands.executeCommand = new Proxy(originalExecuteCommand, {
            apply(target, thisArg, args) {
                const [commandId] = args;
                try {
                    const result = Reflect.apply(target, thisArg, args);
                    if (result instanceof Promise) {
                        return result.catch(err => {
                            errHandler(err.name, commandId);
                            throw err;
                        });
                    }
                    return result;
                }
                catch (err) {
                    if (err instanceof Error) {
                        errHandler(err.name, commandId);
                    }
                    throw err;
                }
            }
        });
    }
    listenPublicVscodeApi() {
        let activeTextEditor;
        let previousStateTabs = [];
        const equalsCheck = (a, b) => {
            return JSON.stringify(a) === JSON.stringify(b);
        };
        // Here complex logic cause vscode handle this in many ways
        // Handled on text editor closed/opened
        // And not only text editor is text editor (LOL)
        // Output view defined as text editor too
        const onDidChangeEditorHandler = vscode.window.onDidChangeActiveTextEditor((textEditor) => {
            const openEditors = vscode.window.tabGroups.activeTabGroup.tabs;
            const actualStateTabs = openEditors.map(tab => tab.label);
            if (!textEditor) {
                if (openEditors.length === 0 && previousStateTabs.length !== 1) {
                    const times = previousStateTabs.length - actualStateTabs.length;
                    this.commandCounter.handleCommand("workbench.action.closeAllEditors", times);
                    previousStateTabs = actualStateTabs;
                }
                activeTextEditor = textEditor;
                return;
            }
            if (textEditor.document.uri.scheme === "output") {
                this.commandCounter.handleCommand("workbench.action.output.toggleOutput");
                return;
            }
            if (!activeTextEditor) {
                const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab;
                const workspaceFolder = this.fileHelper.getCurrentWorkspacePath();
                const isDocumentInWorkspace = textEditor.document.fileName.includes(workspaceFolder);
                if (!textEditor.document.fileName.includes(path_1.default.sep) ||
                    textEditor.document.isClosed ||
                    activeTab?.label.includes(`↔`) ||
                    !isDocumentInWorkspace) {
                    // It's some of not text editor view or text editor not in workspace
                    return;
                }
                if (previousStateTabs.length > actualStateTabs.length) {
                    const times = previousStateTabs.length - actualStateTabs.length;
                    this.commandCounter.handleCommand("workbench.action.closeActiveEditor", times);
                    activeTextEditor = textEditor.document.fileName;
                    previousStateTabs = actualStateTabs;
                    return;
                }
                if (openEditors.length === 1 || !equalsCheck(previousStateTabs, actualStateTabs)) {
                    this.commandCounter.handleCommand("workbench.action.quickOpen");
                    activeTextEditor = textEditor.document.fileName;
                    previousStateTabs = actualStateTabs;
                    return;
                }
                // Here navigate between tabs
                this.commandCounter.handleCommandGroup(commandGroup_1.CommandGroup.NavigateBetweenTabsGroup);
            }
            previousStateTabs = vscode.window.tabGroups.activeTabGroup.tabs.map(tab => tab.label);
            activeTextEditor = textEditor.document.fileName;
        });
        // This handler explicity ignore, cause it doesn't suit our purposes
        const onDidCloseTextDocumentHandler = vscode.workspace.onDidCloseTextDocument(() => { });
        const onDidOpenTerminalHandler = vscode.window.onDidOpenTerminal(() => {
            this.commandCounter.handleCommand("workbench.action.terminal.new");
        });
        const onDidCloseTerminalHandler = vscode.window.onDidCloseTerminal(() => {
            this.commandCounter.handleCommand("workbench.action.terminal.kill");
        });
        return [onDidChangeEditorHandler, onDidCloseTextDocumentHandler, onDidCloseTerminalHandler, onDidOpenTerminalHandler];
    }
};
SubscriptionService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(identifiers_1.TYPES.CommandCounterService)),
    __param(1, (0, inversify_1.inject)(identifiers_1.TYPES.FileHelper))
], SubscriptionService);
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=subscriptionService.js.map