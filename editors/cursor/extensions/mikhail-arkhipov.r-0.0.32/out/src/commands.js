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
exports.Commands = exports.CommandNames = void 0;
const vscode_1 = require("vscode");
const editor_1 = require("./editor");
const plotView_1 = require("./plotView");
const repl_1 = require("./repl");
// Must match package.json declarations
// tslint:disable-next-line:no-namespace
var CommandNames;
(function (CommandNames) {
    CommandNames.Execute = 'r.execute';
    CommandNames.Interrupt = 'r.interrupt';
    CommandNames.Reset = 'r.reset';
    CommandNames.SourceFile = 'r.source';
    CommandNames.CreateTerminal = 'r.createTerminal';
    CommandNames.OpenTerminal = 'r.openTerminal';
    CommandNames.ExecuteInTerminal = 'r.executeInTerminal';
    CommandNames.SourceFileToTerminal = 'r.sourceToTerminal';
})(CommandNames || (exports.CommandNames = CommandNames = {}));
class Commands {
    constructor(r) {
        this.r = r;
        this.disposables = [];
        this.disposables.push(this.output);
        this.repl = new repl_1.Repl(r);
    }
    activateCommandsProvider() {
        this.disposables.push(vscode_1.commands.registerCommand(CommandNames.Execute, () => this.execute()));
        this.disposables.push(vscode_1.commands.registerCommand(CommandNames.Interrupt, () => this.r.interrupt()));
        this.disposables.push(vscode_1.commands.registerCommand(CommandNames.Reset, () => this.r.reset()));
        this.disposables.push(vscode_1.commands.registerCommand(CommandNames.CreateTerminal, () => this.repl.create()));
        this.disposables.push(vscode_1.commands.registerCommand(CommandNames.OpenTerminal, () => this.repl.show()));
        this.disposables.push(vscode_1.commands.registerCommand(CommandNames.ExecuteInTerminal, () => this.executeInTerminal()));
        this.disposables.push(vscode_1.commands.registerCommand(CommandNames.SourceFileToTerminal, () => this.sourceToTerminal()));
        return this.disposables;
    }
    dispose() {
        this.repl.dispose();
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const code = (0, editor_1.getSelectedText)();
            if (code.length > 0) {
                const result = yield this.r.execute(code);
                plotView_1.PlotView.createOrShow();
                plotView_1.PlotView.currentPanel.append(result);
            }
            yield this.moveCaretDown();
        });
    }
    sourceToTerminal(fileUri) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = (0, editor_1.getFilePath)(fileUri);
            if (filePath.length > 0) {
                let p = filePath.replace(/\\/g, '/');
                if (p.length > 0 && p[0] !== '"') {
                    p = p = `"${p}"`;
                }
                const code = `source(${p})`;
                yield this.repl.sendText(code);
                yield this.r.execute(code);
            }
        });
    }
    executeInTerminal() {
        return __awaiter(this, void 0, void 0, function* () {
            const code = (0, editor_1.getSelectedText)();
            if (code.length > 0) {
                yield this.repl.sendText(code);
                yield this.r.execute(code);
            }
            yield this.moveCaretDown();
        });
    }
    moveCaretDown() {
        return __awaiter(this, void 0, void 0, function* () {
            // Take focus back to the editor
            yield vscode_1.window.showTextDocument(vscode_1.window.activeTextEditor.document, vscode_1.window.activeTextEditor.viewColumn, false);
            const selectionEmpty = vscode_1.window.activeTextEditor.selection.isEmpty;
            if (selectionEmpty) {
                yield vscode_1.commands.executeCommand('cursorMove', {
                    by: 'line',
                    to: 'down',
                });
            }
        });
    }
}
exports.Commands = Commands;
//# sourceMappingURL=commands.js.map