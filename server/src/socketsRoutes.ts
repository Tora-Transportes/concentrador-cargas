import { Socket } from "socket.io";

const loggedSockets: Array<Socket> = [];
function registerLogin(socket: Socket) {
  loggedSockets.push(socket);
}

export default function (socket: Socket) {
  registerLogin(socket);
}

interface IEventSocket {
  name: string;
  details: any;
}

function notifyAll(event: IEventSocket) {
  for (const i of loggedSockets) {
    i.emit(event.name, event.details);
  }
}

export { notifyAll };
