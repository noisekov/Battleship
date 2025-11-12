import { randomUUID } from 'crypto';
import { Storage } from '../Storage/Storage.ts';

type IuserData = {
  type?: string;
  data: string;
  id?: number;
};

export const createRoom = (userData: IuserData, typeEntry: string) => {
  const { name, index } = JSON.parse(userData.data);
  const roomId = randomUUID();
  let resultArr: any = [];

  if (typeEntry === 'reg') {
    resultArr = [];
  }

  if (typeEntry === 'create_room') {
    resultArr = [
      {
        roomId: roomId,
        roomUsers: [
          {
            name: name,
            index: index,
          },
        ],
      },
    ];

    Storage.getInstance.updateUserData(index, 'roomdId', roomId);
  }

  return {
    type: 'update_room',
    data: JSON.stringify(resultArr),
    id: 0,
  };
};
