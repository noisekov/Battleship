import { Storage } from '../Storage/Storage.ts';

export const canCreateGame = (messageObject: string) => {
  const { indexRoom } = JSON.parse(JSON.parse(messageObject).data);

  return Storage.getInstance.getRoomByIndex(indexRoom).roomUsers.length === 2;
};
