import { randomUUID } from 'crypto';
import { Storage } from '../Storage/Storage.ts';

type IuserData = {
  type?: string;
  data: string;
  id?: number;
};

export const createRoom = (typeEntry: string) => {
  const roomId = randomUUID();
  const roomData = Storage.getInstance.getRoom();
  let resultArr: any = [];

  if (typeEntry === 'reg') {
    resultArr = roomData;
  }

  if (typeEntry === 'create_room') {
    const roomData = {
      roomId: roomId,
      roomUsers: [] as any[],
    };
    resultArr = [roomData];
  }

  return {
    type: 'update_room',
    data: JSON.stringify(resultArr),
    id: 0,
  };
};
