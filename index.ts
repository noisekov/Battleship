import { httpServer } from './src/http_server/index.ts';
import { WebSocketServer } from 'ws';
import { createUser } from './src/utils/createUser.ts';
import { createRoom } from './src/utils/createRoom.ts';
import { updateWinners } from './src/utils/updateWinners.ts';
import { Storage } from './src/Storage/Storage.ts';
import { addUserToRoom } from './src/utils/addUserToRoom.ts';
import { createGame } from './src/utils/createGame.ts';
import { canCreateGame } from './src/utils/canCreateGame.ts';
import { addShips } from './src/utils/addShips.ts';
import { startGame } from './src/utils/startGame.ts';
import { attack, randomAttack } from './src/utils/makeAttack.ts';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const messageObject = message.toString();
    const type = JSON.parse(messageObject).type;

    if (type === 'reg') {
      const userData = createUser(messageObject, ws);
      const roomData = createRoom(type);
      const winnersData = updateWinners();

      ws.send(JSON.stringify(userData));
      ws.send(JSON.stringify(roomData));
      ws.send(JSON.stringify(winnersData));
    }

    if (type === 'create_room') {
      const roomData = createRoom(type);
      ws.send(JSON.stringify(roomData));
    }

    if (type === 'add_user_to_room') {
      const request = addUserToRoom(messageObject);
      ws.send(JSON.stringify(request));

      if (canCreateGame(messageObject)) {
        createGame(messageObject);
      }
    }

    if (type === 'add_ships') {
      const isPositionsExist = Storage.getInstance.checkShipPositions();

      if (isPositionsExist) {
        addShips(messageObject);
        startGame();

        return;
      }

      addShips(messageObject);
    }

    if (type === 'attack') {
      attack(messageObject, wss);
    }

    if (type === 'randomAttack') {
      randomAttack(messageObject, wss);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
