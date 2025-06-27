"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.Platform = void 0;
var Platform;
(function (Platform) {
    Platform["WINDOWS"] = "windows";
    Platform["LINUX"] = "linux";
    Platform["MACOS"] = "macos";
    Platform["UNSUPPORTED"] = "unsupported";
})(Platform = exports.Platform || (exports.Platform = {}));
function get() {
    switch (process.platform.toLowerCase()) {
        case "win32":
            return Platform.WINDOWS;
        case "aix":
        case "freebsd":
        case "linux":
        case "openbsd":
        case "sunos":
            return Platform.LINUX;
        case "darwin":
            return Platform.MACOS;
    }
    return Platform.UNSUPPORTED;
}
exports.get = get;
//# sourceMappingURL=platform.js.map