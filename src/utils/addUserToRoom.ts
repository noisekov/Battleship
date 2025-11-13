import { Storage } from '../Storage/Storage.ts';

export const addUserToRoom = (messageObj: string) => {
  const { indexRoom } = JSON.parse(JSON.parse(messageObj).data);
  const { name, index } = JSON.parse(Storage.getInstance.getUserData().data);
  const roomData = {
    roomId: indexRoom,
    roomUsers: [
      {
        name: name,
        index: index,
      },
    ],
  };
  Storage.getInstance.addRoom(roomData, name);
  const roomStorageData = Storage.getInstance.getRoomByIndex(indexRoom);

  return {
    type: 'update_room',
    data: JSON.stringify([roomStorageData]),
    id: 0,
  };
};
