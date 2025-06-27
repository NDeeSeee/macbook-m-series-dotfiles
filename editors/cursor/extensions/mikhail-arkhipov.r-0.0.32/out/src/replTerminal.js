// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplTerminal = void 0;
const vscode_1 = require("vscode");
class ReplTerminal {
    constructor(interpreterPath, terminalPath) {
        this.interpreterPath = interpreterPath;
        this.terminalPath = terminalPath;
        this.disposables = [];
        this.disposables.push(vscode_1.window.onDidCloseTerminal((closedTerminal) => {
            if (this.terminal === closedTerminal) {
                this.terminal = undefined;
            }
        }));
    }
    dispose() {
        var _a;
        while (this.disposables.length) {
            (_a = this.disposables.pop()) === null || _a === void 0 ? void 0 : _a.dispose();
        }
    }
    show() {
        if (this.terminal === undefined) {
            this.terminal = vscode_1.window.createTerminal('R', this.getRTerminalPath());
        }
        this.terminal.show(true);
    }
    close() {
        if (this.terminal !== undefined) {
            this.terminal.dispose();
            this.terminal = undefined;
        }
    }
    sendText(text) {
        this.show();
        this.terminal.sendText(text);
    }
    getRTerminalPath() {
        var _a;
        return (_a = this.terminalPath) !== null && _a !== void 0 ? _a : this.interpreterPath;
    }
}
exports.ReplTerminal = ReplTerminal;
//# sourceMappingURL=replTerminal.js.map