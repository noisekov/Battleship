import { Storage } from '../Storage/Storage.ts';

export const addShips = (messageObj: string) => {
  const data = JSON.parse(JSON.parse(messageObj).data);

  Storage.getInstance.addPositions(data);
};
