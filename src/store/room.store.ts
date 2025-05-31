// TODO: Determine if this is needed - it's likely duplicating room state unnecessarily

import { ClientEvent, Preset, Room, Visibility } from 'matrix-js-sdk';
import { create } from 'zustand';
import { useAppStore } from './app.store';

export enum RoomState {
  NEW, // new local room; only known to the client
  CREATING, // real room is being created
  CREATED, // real room has been created via API; events applied
  ERROR, // error during room creation
}

interface RoomStoreState {
  rooms: Map<string, Room>;
  roomStates: Map<string, RoomState>;
  createRoom: (opts: {
    name?: string;
    preset?: Preset;
    visibility?: Visibility;
  }) => Promise<string | null>;
  waitForRoom: (roomId: string) => Promise<Room>;
  getRoom: (roomId: string) => Room | undefined;
  getRoomState: (roomId: string) => RoomState | undefined;
}

export const useRoomStore = create<RoomStoreState>((set, get) => ({
  rooms: new Map(),
  roomStates: new Map(),

  createRoom: async (opts) => {
    const client = useAppStore.getState().matrixClient;
    if (!client) throw new Error('Matrix client not initialized');

    const tempRoomId = `temp_${Date.now()}`;

    try {
      // Set initial state
      set((state) => ({
        roomStates: new Map(state.roomStates).set(
          tempRoomId,
          RoomState.CREATING,
        ),
      }));

      // Create the room
      const response = await client.createRoom({
        name: opts.name,
        preset: opts.preset,
        visibility: opts.visibility,
      });

      const roomId = response.room_id;

      // Wait for the room to be available
      const room = await get().waitForRoom(roomId);

      // Update state
      set((state) => ({
        rooms: new Map(state.rooms).set(roomId, room),
        roomStates: new Map(state.roomStates).set(roomId, RoomState.CREATED),
      }));

      return roomId;
    } catch (error) {
      console.error('Failed to create room:', error);
      set((state) => ({
        roomStates: new Map(state.roomStates).set(tempRoomId, RoomState.ERROR),
      }));
      return null;
    }
  },

  waitForRoom: (roomId: string) => {
    return new Promise<Room>((resolve) => {
      const client = useAppStore.getState().matrixClient;
      if (!client) throw new Error('Matrix client not initialized');

      // Check if room already exists
      const existingRoom = client.getRoom(roomId);
      if (existingRoom) {
        resolve(existingRoom);
        return;
      }

      // Wait for room to arrive via sync
      const onRoom = (room: Room) => {
        if (room.roomId === roomId) {
          client.off(ClientEvent.Room, onRoom);
          resolve(room);
        }
      };

      client.on(ClientEvent.Room, onRoom);

      // Set a timeout to prevent infinite waiting
      setTimeout(() => {
        client.off(ClientEvent.Room, onRoom);
        throw new Error(`Timeout waiting for room ${roomId}`);
      }, 30000); // 30 second timeout
    });
  },

  getRoom: (roomId: string) => {
    return get().rooms.get(roomId);
  },

  getRoomState: (roomId: string) => {
    return get().roomStates.get(roomId);
  },
}));
