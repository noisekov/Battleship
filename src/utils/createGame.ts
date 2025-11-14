import { Storage } from '../Storage/Storage.ts';

export const createGame = (messageObject: string) => {
  const { indexRoom } = JSON.parse(JSON.parse(messageObject).data);
  const room = Storage.getInstance.getRoomByIndex(indexRoom);
  const [{ index: firstUserId }, { index: secondUserId }] = room.roomUsers;
  const { ws: clientFirstUser } =
    Storage.getInstance.getUserDataByIndex(firstUserId);
  const { ws: clientSecondUser } =
    Storage.getInstance.getUserDataByIndex(secondUserId);

  clientFirstUser.send(
    JSON.stringify({
      type: 'create_game',
      data: JSON.stringify({
        idGame: indexRoom,
        idPlayer: firstUserId,
      }),
      id: 0,
    })
  );

  clientSecondUser.send(
    JSON.stringify({
      type: 'create_game',
      data: JSON.stringify({
        idGame: indexRoom,
        idPlayer: secondUserId,
      }),
      id: 0,
    })
  );
};
