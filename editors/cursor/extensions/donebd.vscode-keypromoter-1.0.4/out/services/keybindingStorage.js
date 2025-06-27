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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeybindingStorage = void 0;
const fs = __importStar(require("fs"));
const fs_1 = require("fs");
const inversify_1 = require("inversify");
const json = __importStar(require("json5"));
const path = __importStar(require("path"));
const logging_1 = require("../helper/logging");
const platform_1 = require("../helper/platform");
class Keybinding {
    key;
    command;
}
let KeybindingStorage = class KeybindingStorage {
    platform;
    keybindings;
    userKeybindingsPath;
    constructor(platform, defaultOnly = false) {
        this.platform = platform;
        this.keybindings = new Map();
        this.userKeybindingsPath = this.getUserKeybindingsPath();
        if (defaultOnly) {
            this.loadDefaultMap();
        }
        else {
            this.loadFullMap();
        }
    }
    getKeybindingsFor(command) {
        return this.keybindings.get(command) ?? [];
    }
    allKeybindings() {
        return new Map(this.keybindings);
    }
    patch(JsonPatch) {
        let patch = json.parse(JsonPatch);
        for (let i in patch) {
            let key = patch[i].key;
            let command = patch[i].command;
            let keystrokes;
            if (command.startsWith("-")) {
                command = command.slice(1);
                keystrokes = this.keybindings.get(command) ?? new Array();
                keystrokes = keystrokes.filter(other => other !== key);
            }
            else {
                keystrokes = this.keybindings.get(command) ?? new Array();
                keystrokes.push(key);
            }
            this.keybindings.set(command, keystrokes);
        }
    }
    updateKeybindings() {
        this.loadFullMap();
    }
    getUserKeybindingsPath() {
        let pathToUser = "";
        switch (this.platform) {
            case platform_1.Platform.LINUX:
                pathToUser = process.env.HOME + "/.config/Code";
                break;
            case platform_1.Platform.WINDOWS:
                pathToUser = process.env.APPDATA + "/Code";
                break;
            case platform_1.Platform.MACOS:
                pathToUser = process.env.HOME + "/Library/Application Support/Code";
                break;
        }
        pathToUser = ((process.env.VSCODE_PORTABLE ? process.env.VSCODE_PORTABLE + "/user-data/User/" : pathToUser) + "/User/keybindings.json")
            .replace(/\//g, this.platform === platform_1.Platform.WINDOWS ? "\\" : "/");
        return pathToUser;
    }
    loadFullMap() {
        this.keybindings.clear();
        this.loadDefaultMap();
        try {
            if (!fs.existsSync(this.userKeybindingsPath)) {
                logging_1.logger.warn("user keybindings not found");
                return;
            }
            const userKeybindingsJson = (0, fs_1.readFileSync)(this.userKeybindingsPath).toString();
            this.patch(userKeybindingsJson);
        }
        catch (e) {
            if (e instanceof Error) {
                logging_1.logger.error(`error when loading user keybindings: ${e.message}`);
            }
        }
        if (this.platform === platform_1.Platform.MACOS) {
            this.fixMacOsKeybindings();
        }
    }
    loadDefaultMap() {
        try {
            let p = path.resolve(__dirname, '..', '..', 'default-keybindings', `${this.platform}.keybindings.json`);
            let file = (0, fs_1.readFileSync)(p);
            let document = json.parse(file.toString());
            for (let i in document) {
                let keystrokes = this.keybindings.get(document[i].command) ?? new Array();
                keystrokes.push(document[i].key);
                this.keybindings.set(document[i].command, keystrokes);
            }
        }
        catch (e) {
            if (e instanceof Error) {
                logging_1.logger.error(`error when loading default keybindings: ${e.message}`);
            }
        }
    }
    fixMacOsKeybindings() {
        for (const [command, keybindings] of this.keybindings) {
            if (keybindings.some(it => it.includes("cmd"))) {
                const newKeybindings = keybindings.map(keybinding => keybinding.replaceAll("cmd", "meta"));
                this.keybindings.set(command, newKeybindings);
            }
        }
    }
};
KeybindingStorage = __decorate([
    (0, inversify_1.injectable)()
], KeybindingStorage);
exports.KeybindingStorage = KeybindingStorage;
//# sourceMappingURL=keybindingStorage.js.map