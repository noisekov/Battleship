import { httpServer } from './src/http_server/index.ts';
import { WebSocketServer } from 'ws';
import { createUser } from './src/utils/createUser.ts';
import { createRoom } from './src/utils/createRoom.ts';
import { updateWinners } from './src/utils/updateWinners.ts';
import { Storage } from './src/Storage/Storage.ts';
import { addUserToRoom } from './src/utils/addUserToRoom.ts';
import { createGame } from './src/utils/createGame.ts';
import { canCreateGame } from './src/utils/canCreateGame.ts';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const messageObject = message.toString();
    const type = JSON.parse(messageObject).type;

    if (type === 'reg') {
      const userData = createUser(messageObject);
      const roomData = createRoom(userData, type);
      const winnersData = updateWinners();

      ws.send(JSON.stringify(userData));
      ws.send(JSON.stringify(roomData));
      ws.send(JSON.stringify(winnersData));
    }

    if (type === 'create_room') {
      const userData = Storage.getInstance.getUserData();
      const roomData = createRoom(userData, type);
      ws.send(JSON.stringify(roomData));
    }

    if (type === 'add_user_to_room') {
      const request = addUserToRoom(messageObject);
      ws.send(JSON.stringify(request));

      if (canCreateGame(messageObject)) {
        const createGameRequest = createGame(messageObject);

        wss.clients.forEach((client) =>
          client.send(JSON.stringify(createGameRequest))
        );
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
