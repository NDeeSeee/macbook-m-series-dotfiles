// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsLinux = exports.IsMac = exports.IsWindows = void 0;
function IsWindows() {
    return process.platform === "win32";
}
exports.IsWindows = IsWindows;
function IsMac() {
    return process.platform === "darwin";
}
exports.IsMac = IsMac;
function IsLinux() {
    return process.platform === "linux";
}
exports.IsLinux = IsLinux;
//# sourceMappingURL=os.js.map