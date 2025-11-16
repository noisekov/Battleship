import { WebSocketServer } from 'ws';
import { Storage } from '../Storage/Storage.ts';
import { checkIsWin, sendFinish, updateWinners } from './updateWinners.ts';

type AttackFeedback = {
  gameId: string;
  x: number;
  y: number;
  indexPlayer: string;
};

export const attack = (
  messageObject: string,
  wss: WebSocketServer,
  type: 'randomAttack' | 'attack'
) => {
  const data = JSON.parse(JSON.parse(messageObject).data);
  const users = Storage.getInstance.getUsers();
  const { name } = users.find((user) => user.index === data.indexPlayer);
  let response: any;

  if (type === 'randomAttack') {
    const { x, y } = generateRandomAttack();
    response = attackFeedback({ x, y, ...data });
  } else {
    response = attackFeedback(data);
  }

  const status =
    response.length > 1
      ? 'killed'
      : JSON.parse(JSON.parse(response[0]).data).status;
  wss.clients.forEach((client) => {
    response.forEach((res: any) => {
      client.send(res);
    });
  });
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

function attackFeedback(data: AttackFeedback) {
  const storage = Storage.getInstance;
  const { x, y, indexPlayer } = data;
  const status = storage.checkPosition(x, y, indexPlayer);
  const checkKilledShips = storage.getKilledShips();

  if (checkKilledShips.length) {
    const response = checkKilledShips.map((ship) => {
      return JSON.stringify({
        type: 'attack',
        data: JSON.stringify({
          position: {
            x: ship.position.x,
            y: ship.position.y,
          },
          currentPlayer: indexPlayer,
          status: 'killed',
        }),
        id: 0,
      });
    });
    addMissesAroundShips(response, checkKilledShips, indexPlayer);
    storage.clearKilledShips();

    return response;
  }

  return [
    JSON.stringify({
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
    }),
  ];
}

function generateRandomAttack() {
  const FILED_SIZE = 10;
  const x = Math.floor(Math.random() * FILED_SIZE);
  const y = Math.floor(Math.random() * FILED_SIZE);

  return { x, y };
}

function addMissesAroundShips(
  response: any,
  checkKilledShips: any,
  indexPlayer: string
) {
  const attackedCoords = new Set();
  const MAX_CELL = 9;
  const MIN_CELL = 0;
  response.forEach((attack: any) => {
    const attackData = JSON.parse(attack);
    const data = JSON.parse(attackData.data);
    attackedCoords.add(`${data.position.x},${data.position.y}`);
  });

  checkKilledShips.forEach((ship: any) => {
    const { x, y } = ship.position;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;

        const newX = x + dx;
        const newY = y + dy;
        const coordKey = `${newX},${newY}`;

        if (
          newX >= MIN_CELL &&
          newX <= MAX_CELL &&
          newY >= MIN_CELL &&
          newY <= MAX_CELL &&
          !attackedCoords.has(coordKey)
        ) {
          response.push(
            JSON.stringify({
              type: 'attack',
              data: JSON.stringify({
                position: {
                  x: newX,
                  y: newY,
                },
                currentPlayer: indexPlayer,
                status: 'miss',
              }),
              id: 0,
            })
          );

          attackedCoords.add(coordKey);
        }
      }
    }
  });
}
