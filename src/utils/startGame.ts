import { Storage } from '../Storage/Storage.ts';

export const startGame = () => {
  const storage = Storage.getInstance;
  const [
    { indexPlayer: indexPlayerFirst, ships: shipsFirst },
    { indexPlayer: indexPlayerSecond, ships: shipsSecond },
  ] = storage.getShipPositions();
  const firstUserConnection = storage.getUserDataByIndex(indexPlayerFirst);
  const secondUserConnection = storage.getUserDataByIndex(indexPlayerSecond);

  firstUserConnection.ws.send(
    JSON.stringify({
      type: 'start_game',
      data: JSON.stringify({
        ships: shipsFirst,
        currentPlayerIndex: indexPlayerFirst,
      }),
      id: 0,
    })
  );
  secondUserConnection.ws.send(
    JSON.stringify({
      type: 'start_game',
      data: JSON.stringify({
        ships: shipsSecond,
        currentPlayerIndex: indexPlayerSecond,
      }),
      id: 0,
    })
  );
};
