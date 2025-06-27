"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DescriptionService = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const logging_1 = require("../helper/logging");
class DescriptionService {
    jsonCommands;
    pathToDescriptions = path_1.default.resolve(__dirname, `../.././default-keybindings/descriptions/command_descriptions.json`);
    constructor() {
        this.jsonCommands = this.readJsonFile(this.pathToDescriptions);
    }
    readJsonFile(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (e) {
            if (e instanceof Error) {
                logging_1.logger.error(`error reading command descriptions: ${e.message}`);
            }
        }
        return [];
    }
    getDescriptionForCommand(targetCommand) {
        const commandInfo = this.jsonCommands.find((item) => item.command === targetCommand);
        return commandInfo ? commandInfo.description : undefined;
    }
}
exports.DescriptionService = DescriptionService;
//# sourceMappingURL=descriptionHandler.js.map