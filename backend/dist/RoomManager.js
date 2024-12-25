"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
const Room_1 = require("./Room");
class RoomManager {
    constructor(rooms) {
        this.rooms = rooms;
        console.log("RoomManager constructor");
    }
    createRoom(id, roomName) {
        this.rooms.push(new Room_1.Room(id, roomName, []));
        console.log("Room created", this.rooms);
    }
    joinRoom(user, roomId) {
        const room = this.rooms.find(room => room.id === roomId);
        if (room) {
            room.users.push(user);
            user.send(JSON.stringify({ type: 'join', roomId: roomId }));
            console.log(`User joined room ${roomId}`);
        }
        else {
            console.log("Room not found");
        }
    }
    leaveRoom(user, roomId) {
        const room = this.rooms.find(room => room.id === roomId);
        if (room) {
            room.users = room.users.filter(u => u !== user);
            console.log("User left room");
        }
    }
    addEventHandler(user) {
        console.log("Adding event handler");
        user.on('message', (event) => {
            try {
                // All WebSocket messages are buffers, so we need to try parsing first
                const messageStr = event.toString();
                console.log("Received message:", messageStr);
                try {
                    // Try to parse as JSON (our room management messages)
                    const eventData = JSON.parse(messageStr);
                    console.log("Parsed as JSON:", eventData);
                    if (eventData.type === 'join') {
                        console.log("Joining room", eventData.roomId);
                        this.joinRoom(user, eventData.roomId);
                    }
                    if (eventData.type === 'leave') {
                        this.leaveRoom(user, eventData.roomId);
                    }
                    if (eventData.type === 'create') {
                        this.createRoom(eventData.roomId, eventData.roomName);
                    }
                }
                catch (jsonError) {
                    // If JSON parsing fails, it's probably a Y.js binary message
                    console.log("Not a JSON message - likely Y.js sync data");
                }
            }
            catch (error) {
                console.error("Error processing message:", error);
            }
        });
    }
}
exports.RoomManager = RoomManager;
