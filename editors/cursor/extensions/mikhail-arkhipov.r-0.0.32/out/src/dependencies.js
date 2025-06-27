// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureHostExecutable = void 0;
const fs = require("fs");
const path = require("path");
const vscode_1 = require("vscode");
const os_1 = require("./os");
function ensureHostExecutable(context) {
    if ((0, os_1.IsWindows)()) {
        return;
    }
    const hostDirs = [];
    if ((0, os_1.IsMac)()) {
        hostDirs.push(path.join('Mac', 'arm64'));
        hostDirs.push(path.join('Mac', 'x64'));
    }
    else {
        hostDirs.push('Linux');
    }
    while (hostDirs.length) {
        const hostBinPath = path.join(context.extensionPath, 'ls', 'Host', hostDirs.pop(), 'Microsoft.R.Host');
        fs.chmodSync(hostBinPath, '764');
    }
}
exports.ensureHostExecutable = ensureHostExecutable;
let outputChannel;
function getOutput() {
    if (!outputChannel) {
        outputChannel = vscode_1.window.createOutputChannel('R Tools Startup Log');
    }
    return outputChannel;
}
//# sourceMappingURL=dependencies.js.map