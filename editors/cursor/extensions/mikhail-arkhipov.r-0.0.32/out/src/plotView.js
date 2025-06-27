// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlotView = void 0;
const vscode_1 = require("vscode");
class PlotView {
    static createOrShow() {
        const viewColumn = PlotView.getViewColumn();
        // If we already have a panel, show it.
        if (PlotView.currentPanel) {
            PlotView.currentPanel.panel.reveal(viewColumn, true);
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode_1.window.createWebviewPanel(PlotView.viewType, 'Plot', {
            viewColumn,
            preserveFocus: true,
        });
        PlotView.currentPanel = new PlotView(panel);
    }
    static revive(panel) {
        PlotView.currentPanel = new PlotView(panel);
    }
    constructor(panel) {
        this.panel = panel;
        this.disposables = [];
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    }
    dispose() {
        PlotView.currentPanel = undefined;
        // Clean up our resources
        this.panel.dispose();
        while (this.disposables.length) {
            const x = this.disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    append(result) {
        if (result.startsWith('$$IMAGE ')) {
            const base64 = result.substring(8, result.length);
            // tslint:disable-next-line:max-line-length
            const output = `<img src='data:image/gif;base64, ${base64}' style='display:block; margin: 8,0,8,0; text-align: center; width: 90%' />`;
            PlotView.currentPanel.panel.webview.html = this.generateResultsView(output);
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
    static getViewColumn() {
        const column = vscode_1.window.activeTextEditor ? vscode_1.window.activeTextEditor.viewColumn : vscode_1.ViewColumn.One;
        switch (column) {
            case vscode_1.ViewColumn.One:
                return vscode_1.ViewColumn.Two;
            case vscode_1.ViewColumn.Two:
                return vscode_1.ViewColumn.Three;
            case vscode_1.ViewColumn.Three:
                return vscode_1.ViewColumn.Four;
            case vscode_1.ViewColumn.Four:
                return vscode_1.ViewColumn.Five;
        }
        return vscode_1.ViewColumn.One;
    }
}
exports.PlotView = PlotView;
PlotView.viewType = 'plot';
//# sourceMappingURL=plotView.js.map