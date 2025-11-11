import { httpServer } from './src/http_server/index.ts';
import { WebSocketServer } from 'ws';
import { WebsocketHandler } from './src/WebsocketHandler/WebsocketHandler.ts';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
  // console.log(ws)
  ws.on('message', (message) => {
    const messageObject = message.toString();
    ws.send(messageObject);
    WebsocketHandler.handler(JSON.parse(messageObject));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
