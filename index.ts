import { httpServer } from './src/http_server/index.ts'

const HTTP_PORT = 8181

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

const socket = new WebSocket('ws://localhost:3000')

socket.onopen = function (e) {
  console.log(e)
}

socket.onmessage = function (event) {
  console.log(event)
}

socket.onclose = function (event) {
  console.log(event)
}

socket.onerror = function (error) {
  console.log(error)
}
