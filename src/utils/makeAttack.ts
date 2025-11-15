import { WebSocketServer } from 'ws';
import { Storage } from '../Storage/Storage.ts';
import { checkIsWin, sendFinish, updateWinners } from './updateWinners.ts';

export const attack = (
  messageObject: string,
  wss: WebSocketServer,
  type: 'randomAttack' | 'attack'
) => {
  const data = JSON.parse(JSON.parse(messageObject).data);
  const users = Storage.getInstance.getUsers();
  const { name } = users.find((user) => user.index === data.indexPlayer);
  let response;

  if (type === 'randomAttack') {
    const { x, y } = generateRandomAttack();
    response = attackFeedback({ x, y, ...data });
  } else {
    response = attackFeedback(data);
  }

  const status = JSON.parse(response.data).status;
  wss.clients.forEach((client) => client.send(JSON.stringify(response)));
  const isWin = checkIsWin(data.indexPlayer);

  if (isWin) {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(updateWinners(name)));
      client.send(JSON.stringify(sendFinish(data.indexPlayer)));
      client.send(
        JSON.stringify({
          type: 'update_room',
          data: JSON.stringify([]),
          id: 0,
        })
      );
    });
    return;
  }

  turn(data.indexPlayer, status);

  return response;
};

function turn(playerId: string, status: string) {
  const users = Storage.getInstance.getUsers();
  const { ws, index: anotherPlayer } = users.find(
    (user) => user.index !== playerId
  );
  const { ws: wsAnotherPlayer } = users.find((user) => user.index === playerId);

  if (status === 'miss') {
    ws.send(
      JSON.stringify({
        type: 'turn',
        data: JSON.stringify({
          currentPlayer: anotherPlayer,
        }),
        id: 0,
      })
    );
  } else {
    wsAnotherPlayer.send(
      JSON.stringify({
        type: 'turn',
        data: JSON.stringify({
          currentPlayer: playerId,
        }),
        id: 0,
      })
    );
  }
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

function generateRandomAttack() {
  const FILED_SIZE = 10;
  const x = Math.floor(Math.random() * FILED_SIZE);
  const y = Math.floor(Math.random() * FILED_SIZE);

  return { x, y };
}
