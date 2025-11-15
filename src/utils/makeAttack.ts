import { Storage } from '../Storage/Storage.ts';

export const attack = (messageObject: string) => {
  const data = JSON.parse(JSON.parse(messageObject).data);
  console.log(data);

  turn(data.indexPlayer);
};

export const randomAttack = (messageObject: string) => {
  const data = JSON.parse(JSON.parse(messageObject).data);
  console.log(data);

  turn(data.indexPlayer);
};

function turn(playerId: string) {
  const users = Storage.getInstance.getUsers();
  const { ws, index } = users.find((user) => user.index !== playerId);

  ws.send(
    JSON.stringify({
      type: 'turn',
      data: JSON.stringify({
        currentPlayer: index,
      }),
      id: 0,
    })
  );
}
