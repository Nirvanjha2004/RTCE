import { Room } from "./Room";
import WebSocket from "ws";
import * as Y from 'yjs'
import { WebsocketProvider } from "y-websocket";

export class RoomManager {
    private rooms: Room[];

    constructor(rooms: Room[]) {
        this.rooms = rooms;
        console.log("RoomManager constructor");
    }

    public createRoom(id: string, roomName: string) {
        this.rooms.push(new Room(id, roomName, []));
        console.log("Room created", this.rooms);
    }

    public joinRoom(user: WebSocket, roomId: string) {
        const room = this.rooms.find(room => room.id === roomId);
        if (room) {
            room.users.push(user);
            user.send(JSON.stringify({ type: 'join', roomId: roomId }));
            console.log(`User joined room ${roomId}`);
        } else {
            console.log("Room not found");
        }
    }

    public leaveRoom(user: WebSocket, roomId: string) {
        const room = this.rooms.find(room => room.id === roomId);
        if (room) {
            room.users = room.users.filter(u => u !== user);
            console.log("User left room");
        }
    }

    public addEventHandler(user: WebSocket) {
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
                } catch (jsonError) {
                    // If JSON parsing fails, it's probably a Y.js binary message
                    console.log("Not a JSON message - likely Y.js sync data");
                }
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });
    }
}

