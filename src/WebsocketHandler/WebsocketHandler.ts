import { Storage } from '../Storage/Storage.ts';

type ActionMap = {
  [key: string]: (data: messageType) => void;
};

type messageType = {
  type: string;
  data: string;
  id: number;
};

const storage = new Storage();

const actions: ActionMap = {
  reg: (message) => {
    storage.reg(message);
  },
};

export class WebsocketHandler {
  static handler(message: messageType) {
    const action = actions[message.type];

    if (action) {
      action(message);
    }
  }
}
