// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activateLanguageServer = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
const path = require("path");
const commands_1 = require("./commands");
const constants_1 = require("./constants");
const dependencies_1 = require("./dependencies");
const plotView_1 = require("./plotView");
const rengine_1 = require("./rengine");
let client;
let rEngine;
let commands;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // Associate RMD with markdown editor
        const files = vscode_1.workspace.getConfiguration('files');
        const associations = files.get('associations');
        associations['*.rmd'] = 'markdown';
        yield files.update('associations', associations, vscode_1.ConfigurationTarget.Global);
        (0, dependencies_1.ensureHostExecutable)(context);
        yield activateLanguageServer(context);
    });
}
exports.activate = activate;
function activateLanguageServer(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // The server is implemented in C#
        const serverModule = path.join(context.extensionPath, 'ls', 'Microsoft.R.LanguageServer.dll');
        // If the extension is launched in debug mode then the debug server options are used
        // Otherwise the run options are used
        const serverOptions = {
            transport: node_1.TransportKind.pipe,
            debug: { command: 'dotnet', args: [serverModule, '--debug'] },
            run: { command: 'dotnet', args: [serverModule] },
        };
        // Options to control the language client
        const clientOptions = {
            // Register the server for R documents
            documentSelector: [{ language: constants_1.RLanguage.language, scheme: 'file' }],
            synchronize: {
                configurationSection: constants_1.RLanguage.language,
            },
        };
        // Pass actual CPU architecture to the language server.
        // This allows LS on .NET 5.0+ that runs as Intel on Apple M1
        // to launch native R Host with proper ARM architecture.
        process.env.LS_HOST_PROCESS_ARCHITECTURE = process.arch;
        // Create the language client and start the client.
        client = new node_1.LanguageClient(constants_1.RLanguage.language, constants_1.OutputChannelName, serverOptions, clientOptions);
        context.subscriptions.push(client);
        yield client.start();
        rEngine = new rengine_1.REngine(client);
        vscode_1.window.registerWebviewPanelSerializer(plotView_1.PlotView.viewType, {
            deserializeWebviewPanel(webviewPanel, state) {
                return __awaiter(this, void 0, void 0, function* () {
                    plotView_1.PlotView.revive(webviewPanel);
                });
            },
        });
        commands = new commands_1.Commands(rEngine);
        context.subscriptions.push(...commands.activateCommandsProvider());
    });
}
exports.activateLanguageServer = activateLanguageServer;
// this method is called when your extension is deactivated
function deactivate() {
    return __awaiter(this, void 0, void 0, function* () {
        commands.dispose();
        if (client !== undefined || client !== null) {
            yield client.stop();
        }
    });
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map