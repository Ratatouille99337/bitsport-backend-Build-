"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
require("./database");
const fs_1 = __importDefault(require("fs"));
// import { setupWebSocket } from "./controllers/airdrop.controller";
/**
 * Starting our application
 */
const folderName = "./uploads";
try {
    if (!fs_1.default.existsSync(folderName)) {
        fs_1.default.mkdirSync(folderName);
    }
}
catch (err) {
    console.error(err);
}
const server = http_1.default.createServer(app_1.default);
// setupWebSocket(server);
server.listen(app_1.default.get("port"), () => console.log(`>> Server is running on ${app_1.default.get("port")}`));
