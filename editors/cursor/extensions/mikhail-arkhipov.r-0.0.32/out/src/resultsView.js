// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
class ResultsView {
    constructor(panel, extensionPath) {
        this.panel = panel;
        this.extensionPath = extensionPath;
        this.buffer = '';
        this.disposables = [];
        // Set the webview's initial html content
        this.clear();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
        // Update the content based on view changes
        // this.panel.onDidChangeViewState(
        //     (e) => {
        //         if (this.panel.visible) {
        //             this.update();
        //         }
        //     },
        //     null,
        //     this.disposables
        // );
        // Handle messages from the webview
        this.panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case 'alert':
                    vscode_1.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this.disposables);
    }
    static createOrShow(extensionPath) {
        // If we already have a panel, show it.
        if (ResultsView.currentPanel) {
            ResultsView.currentPanel.panel.reveal(vscode_1.ViewColumn.Two);
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode_1.window.createWebviewPanel(ResultsView.viewType, 'Results', vscode_1.ViewColumn.Two, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [vscode_1.Uri.file(path.join(extensionPath, 'media'))],
        });
        ResultsView.currentPanel = new ResultsView(panel, extensionPath);
    }
    static revive(panel, extensionPath) {
        ResultsView.currentPanel = new ResultsView(panel, extensionPath);
    }
    dispose() {
        ResultsView.currentPanel = undefined;
        // Clean up our resources
        this.panel.dispose();
        while (this.disposables.length) {
            const x = this.disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    clear() {
        ResultsView.currentPanel.panel.webview.html = this.generateResultsView('');
    }
    append(result) {
        if (result.startsWith('$$IMAGE ')) {
            const base64 = result.substring(8, result.length);
            // tslint:disable-next-line:max-line-length
            const output = `<img src='data:image/gif;base64, ${base64}' style='display:block; margin: 8,0,8,0; text-align: center; width: 90%' />`;
            ResultsView.currentPanel.panel.webview.html = this.generateResultsView(output);
        }
    }
    generateResultsView(content) {
        const htmlContent = `
                <!DOCTYPE html>
                <head>
                    <style type="text/css">
                        html, body { height:100%; width:100%; }
                    </style>
                </head>
                <body>${content}</body>
            </html>`;
        return htmlContent;
    }
}
exports.ResultsView = ResultsView;
ResultsView.viewType = 'results';
//# sourceMappingURL=resultsView.js.map