// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectedText = exports.getFilePath = void 0;
const os_1 = require("os");
const vscode_1 = require("vscode");
const constants_1 = require("./constants");
function getFilePath(fileUri) {
    let filePath = '';
    if (fileUri === undefined || fileUri === null || typeof fileUri.fsPath !== 'string') {
        const activeEditor = vscode_1.window.activeTextEditor;
        if (activeEditor !== undefined && activeEditor !== null) {
            if (!activeEditor.document.isUntitled) {
                if (activeEditor.document.languageId === constants_1.RLanguage.language) {
                    filePath = activeEditor.document.fileName;
                }
                else {
                    vscode_1.window.showErrorMessage('The active file is not a R source file.');
                }
            }
            else {
                vscode_1.window.showErrorMessage('The active file needs to be saved before it can be sourced.');
            }
        }
        else {
            vscode_1.window.showErrorMessage('No open R file to source.');
        }
    }
    else {
        filePath = fileUri.fsPath;
    }
    if (filePath.indexOf(' ') > 0) {
        filePath = `"${filePath}"`;
    }
    return filePath;
}
exports.getFilePath = getFilePath;
function getSelectedText() {
    const activeEditor = vscode_1.window.activeTextEditor;
    if (!activeEditor) {
        return '';
    }
    const selection = activeEditor.selection;
    let code;
    if (selection.isEmpty) {
        code = activeEditor.document.lineAt(selection.start.line).text;
    }
    else {
        const textRange = new vscode_1.Range(selection.start, selection.end);
        code = activeEditor.document.getText(textRange);
    }
    return removeBlankLines(code);
}
exports.getSelectedText = getSelectedText;
function removeBlankLines(code) {
    const codeLines = code.split(/\r?\n/g);
    const codeLinesWithoutEmptyLines = codeLines.filter((line) => line.trim().length > 0);
    const lastLineIsEmpty = codeLines.length > 0 && codeLines[codeLines.length - 1].trim().length === 0;
    if (lastLineIsEmpty) {
        codeLinesWithoutEmptyLines.unshift('');
    }
    return codeLinesWithoutEmptyLines.join(os_1.EOL);
}
//# sourceMappingURL=editor.js.map