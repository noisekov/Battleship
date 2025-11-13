import { Storage } from '../Storage/Storage.ts';

export const createGame = (messageObject: string) => {
  const { indexRoom } = JSON.parse(JSON.parse(messageObject).data);
  const room = Storage.getInstance.getRoomByIndex(indexRoom);
  const { index: secondUserId } = room.roomUsers[1];

  return {
    type: 'create_game',
    data: JSON.stringify({
      idGame: indexRoom,
      idPlayer: secondUserId,
    }),
    id: 0,
  };
};
