import { randomUUID } from 'crypto';
import { Storage } from '../Storage/Storage.ts';

export const createGame = (messageObject: string) => {
  const idGame = randomUUID();
  const { indexRoom } = JSON.parse(JSON.parse(messageObject).data);
  const room = Storage.getInstance.getRoomByIndex(indexRoom);
  const { index: secondUserId } = room.roomUsers[1];

  return {
    type: 'create_game',
    data: JSON.stringify({
      idGame: idGame,
      idPlayer: secondUserId,
    }),
    id: 0,
  };
};
