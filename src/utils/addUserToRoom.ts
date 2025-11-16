import { Storage } from '../Storage/Storage.ts';

export const addUserToRoom = (messageObj: string) => {
  const storage = Storage.getInstance;
  const { indexRoom } = JSON.parse(JSON.parse(messageObj).data);
  const { name, index } = JSON.parse(storage.getUserData().data);
  const roomData = {
    roomId: indexRoom,
    roomUsers: [
      {
        name: name,
        index: index,
      },
    ],
  };
  storage.addRoom(roomData, name);
  const roomStorageData = storage.getRoomByIndex(indexRoom);

  return {
    type: 'update_room',
    data: JSON.stringify([roomStorageData]),
    id: 0,
  };
};
