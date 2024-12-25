import WebSocket from "ws";
import * as Y from 'yjs'

export class Room {
    public id: string;
    public roomName: string;
    public users: WebSocket[];

    constructor(id: string, roomName: string, users: WebSocket[]) {
        this.id = id;
        this.roomName = roomName;
        this.users = users;
    }
}