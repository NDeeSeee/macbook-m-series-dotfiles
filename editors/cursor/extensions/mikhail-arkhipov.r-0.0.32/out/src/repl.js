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
exports.Repl = void 0;
const fs = require("fs");
const vscode_1 = require("vscode");
class Repl {
    constructor(r) {
        this.r = r;
        this.disposables = [];
        this.terminals = [];
        this.disposables.push(vscode_1.window.onDidCloseTerminal((t) => {
            if (t.name !== 'R') {
                return;
            }
            if (this.activeTerminal === t) {
                this.activeTerminal = undefined;
            }
            const i = this.terminals.indexOf(t);
            if (i >= 0) {
                this.terminals.splice(i, 1);
            }
        }));
        this.disposables.push(vscode_1.window.onDidChangeActiveTerminal((t) => {
            this.activeTerminal = t.name === 'R' ? t : undefined;
        }));
    }
    dispose() {
        var _a, _b, _c;
        (_a = this.activeTerminal) === null || _a === void 0 ? void 0 : _a.dispose();
        while (this.terminals.length) {
            (_b = this.terminals.pop()) === null || _b === void 0 ? void 0 : _b.dispose();
        }
        while (this.disposables.length) {
            (_c = this.disposables.pop()) === null || _c === void 0 ? void 0 : _c.dispose();
        }
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            this.activeTerminal = vscode_1.window.createTerminal('R', yield this.getRTerminalPath());
            this.terminals.push(this.activeTerminal);
            return this.show();
        });
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.activeTerminal === undefined) {
                if (this.terminals.length === 0) {
                    yield this.create();
                }
                else {
                    this.activeTerminal = this.terminals[this.terminals.length - 1];
                }
            }
            this.activeTerminal.show(true);
        });
    }
    sendText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.show();
            this.activeTerminal.sendText(text);
        });
    }
    getRTerminalPath() {
        return __awaiter(this, void 0, void 0, function* () {
            let terminalPath = vscode_1.workspace.getConfiguration('r').get('terminalPath');
            if ((terminalPath === null || terminalPath === void 0 ? void 0 : terminalPath.length) === 0) {
                terminalPath = undefined;
            }
            if (terminalPath && fs.existsSync(terminalPath)) {
                return terminalPath;
            }
            return yield this.r.getInterpreterPath();
        });
    }
}
exports.Repl = Repl;
//# sourceMappingURL=repl.js.map