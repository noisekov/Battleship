type IRoom = {
  roomId: string;
  roomUsers: {
    name: string;
    index: string;
  }[];
};

export class Storage {
  private data: any[] = [];
  private roomData: any[] = [];
  private static _instance: Storage;

  private constructor() {
    this.data = [];
    this.roomData = [];
  }

  public static get getInstance() {
    if (!Storage._instance) {
      Storage._instance = new Storage();
    }
    return Storage._instance;
  }

  public userReg(message: any) {
    if (!this.data.length) {
      this.data.push({
        reg: 'firstUser',
        ...message,
      });

      return;
    }

    this.data.push({
      reg: 'secondUser',
      ...message,
    });
  }

  addRoom(data: IRoom, name: string) {
    const userInTheRoom = this.roomData.some(
      (room) =>
        room.roomUsers[0]?.name === name || room.roomUsers[1]?.name === name
    );

    if (userInTheRoom) {
      return;
    }

    const roomExist = this.roomData.some((room) => room.roomId === data.roomId);

    if (roomExist) {
      const index = this.roomData.findIndex(
        (room) => room.roomId === data.roomId
      );
      this.roomData[index].roomUsers.push(data.roomUsers[0]);

      return;
    }

    this.roomData.push(data);
  }

  getRoom() {
    return this.roomData;
  }

  getRoomByIndex(roomId: string) {
    const index = this.roomData.findIndex((room) => room.roomId === roomId);
    return this.roomData[index];
  }

  getUserData() {
    const lastUser = this.data[this.data.length - 1];

    return { data: JSON.stringify(lastUser) };
  }
}
