import { Room } from './Room.js';

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  getOrCreateRoom(roomId, router) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Room(roomId, router));
    }
    return this.rooms.get(roomId);
  }

  removeRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      // Clean up all peers in the room
      room.peers.forEach((peer, peerId) => {
        room.removePeer(peerId);
      });
      this.rooms.delete(roomId);
      console.log(`Room ${roomId} removed`);
    }
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }
}

export const roomManager = new RoomManager();
