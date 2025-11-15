import { WebSocketServer } from 'ws';
import { Storage } from '../Storage/Storage.ts';
import { checkIsWin, sendFinish, updateWinners } from './updateWinners.ts';

export const attack = (messageObject: string, wss: WebSocketServer) => {
  const data = JSON.parse(JSON.parse(messageObject).data);
  const users = Storage.getInstance.getUsers();
  const { name } = users.find((user) => user.index === data.indexPlayer);
  const response = attackFeedback(data);
  wss.clients.forEach((client) => client.send(JSON.stringify(response)));
  const isWin = checkIsWin(data.indexPlayer);

  if (isWin) {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(updateWinners(name)));
      client.send(JSON.stringify(sendFinish(data.indexPlayer)));
    });
    return;
  }
  turn(data.indexPlayer);

  return response;
};

export const randomAttack = (messageObject: string, wss: WebSocketServer) => {
  const data = JSON.parse(JSON.parse(messageObject).data);
  const users = Storage.getInstance.getUsers();
  const { name } = users.find((user) => user.index === data.indexPlayer);
  const { x, y } = generateRandomAttack();
  const response = attackFeedback({ x, y, ...data });
  wss.clients.forEach((client) => client.send(JSON.stringify(response)));
  const isWin = checkIsWin(data.indexPlayer);

  if (isWin) {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(updateWinners(name)));
      client.send(JSON.stringify(sendFinish(data.indexPlayer)));
    });
    return;
  }
  turn(data.indexPlayer);

  return response;
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

function generateRandomAttack() {
  const FILED_SIZE = 10;
  const x = Math.floor(Math.random() * FILED_SIZE);
  const y = Math.floor(Math.random() * FILED_SIZE);

  return { x, y };
}
