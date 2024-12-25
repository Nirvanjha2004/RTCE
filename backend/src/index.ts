import WebSocket, { WebSocketServer } from 'ws';
import { RoomManager } from "./RoomManager";

const wss = new WebSocketServer({ port: 8080 });
const roomManager = new RoomManager([]);

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);
  roomManager.addEventHandler(ws);
  ws.send("Connected to server");
});
