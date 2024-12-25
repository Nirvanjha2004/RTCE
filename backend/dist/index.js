"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const RoomManager_1 = require("./RoomManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const roomManager = new RoomManager_1.RoomManager([]);
wss.on("connection", function connection(ws) {
    ws.on("error", console.error);
    roomManager.addEventHandler(ws);
    ws.send("Connected to server");
});
