import { Storage } from '../Storage/Storage.ts';

export const attack = (messageObject: string) => {
  const data = JSON.parse(JSON.parse(messageObject).data);
  const users = Storage.getInstance.getUsers();
  const { ws } = users.find((user) => user.index === data.indexPlayer);
  const response = attackFeedback(data);
  ws.send(JSON.stringify(response));

  turn(data.indexPlayer);
};

export const randomAttack = (messageObject: string) => {
  const data = JSON.parse(JSON.parse(messageObject).data);
  // const users = Storage.getInstance.getUsers();
  // const { ws, index } = users.find((user) => user.index !== data.indexPlayer);
  console.log(data);
  // const response = attackFeedback(data);
  // ws.send(JSON.stringify(response));

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

function attackFeedback(data: any) {
  const { x, y, indexPlayer } = data;
  const status = Storage.getInstance.checkPosition(x, y, indexPlayer);

  return {
    type: 'attack',
    data: JSON.stringify({
      position: {
        x: x,
        y: y,
      },
      currentPlayer: indexPlayer,
      status: status,
    }),
    id: 0,
  };
}
