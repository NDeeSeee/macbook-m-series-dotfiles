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
exports.REngine = void 0;
class REngine {
    constructor(client) {
        this.client = client;
    }
    getInterpreterPath() {
        return this.client.sendRequest('r/getInterpreterPath');
    }
    execute(code) {
        return this.client.sendRequest('r/execute', { code });
    }
    interrupt() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.sendRequest('r/interrupt');
        });
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.sendRequest('r/reset');
        });
    }
    source(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.sendRequest('r/source', filePath);
        });
    }
}
exports.REngine = REngine;
//# sourceMappingURL=rengine.js.map