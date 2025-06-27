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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLevel = exports.init = exports.logger = void 0;
const stream_1 = require("stream");
const winston = __importStar(require("winston"));
const level = 'debug';
const defaultTransport = new winston.transports.Console();
exports.logger = winston.createLogger({
    level: level,
    format: winston.format.combine(winston.format.timestamp({
        format: "HH:mm:ss",
    }), winston.format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`)),
    transports: [
        defaultTransport
    ],
});
function init(outputChannel) {
    exports.logger.clear();
    const outputStream = new stream_1.Writable({
        write(chunk, encoding, callback) {
            outputChannel.append(chunk.toString());
            callback();
        }
    });
    exports.logger.add(new winston.transports.Stream({ stream: outputStream }));
}
exports.init = init;
function setLevel(level) {
    exports.logger.level = level.toLowerCase();
}
exports.setLevel = setLevel;
//# sourceMappingURL=logging.js.map