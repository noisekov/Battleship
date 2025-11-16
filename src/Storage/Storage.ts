type IRoom = {
  roomId: string;
  roomUsers: {
    name: string;
    index: string;
  }[];
};

type IShip = {
  position: { x: number; y: number };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
  isKilled: boolean;
  shipName: string;
};

export class Storage {
  private data: any[] = [];
  private roomData: any[] = [];
  private shipPositions: any[] = [];
  private killedShips: IShip[] = [];
  private static _instance: Storage;

  private constructor() {
    this.data = [];
    this.roomData = [];
    this.shipPositions = [];
    this.killedShips = [];
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

  getUserDataByIndex(index: string) {
    const user = this.data.find((user) => user.index === index);

    return user;
  }

  addPositions(data: any) {
    const { ships } = data;
    const newDataShips: any = [];

    ships.forEach((ship: any, indexShip: number) => {
      const allShipsData = Array.from({ length: ship.length }, (_, i) => {
        if (ship.direction) {
          return {
            position: { x: ship.position.x, y: ship.position.y + i },
            isKilled: false,
            shipName: `ship${indexShip}`,
          };
        } else {
          return {
            position: { x: ship.position.x + i, y: ship.position.y },
            isKilled: false,
            shipName: `ship${indexShip}`,
          };
        }
      });

      newDataShips.push(...allShipsData);
    });

    this.shipPositions.push({ ...data, ships: newDataShips });
  }

  checkShipPositions() {
    return this.shipPositions.length === 1;
  }

  getShipPositions() {
    return this.shipPositions;
  }

  getUsers() {
    return this.data;
  }

  checkPosition(x: number, y: number, indexPlayer: string) {
    const { ships } = this.shipPositions.find(
      (shipData) => shipData.indexPlayer !== indexPlayer
    );

    if (
      ships.some(
        ({ position, isKilled }: IShip) =>
          position.x === x && position.y === y && !isKilled
      )
    ) {
      const ship = ships.find(
        ({ position, isKilled }: IShip) =>
          position.x === x && position.y === y && !isKilled
      );
      ship.isKilled = true;
      return this.checkKilledOrShot(ships, ship);
    }

    if (
      ships.every(({ position }: IShip) => position.x !== x || position.y !== y)
    ) {
      return 'miss';
    }
  }

  checkKilledOrShot(ships: any, ship: any) {
    const {
      position: { x, y },
    } = ship;

    const shipdata = ships.find((ship: IShip) => {
      return ship.position.x === x && ship.position.y === y;
    });

    const shipsWithSameName = ships.filter(
      (ship: IShip) => ship.shipName === shipdata.shipName
    );
    const isKilled = shipsWithSameName.every((ship: IShip) => {
      return ship.shipName === shipdata.shipName && ship.isKilled;
    });

    if (isKilled) {
      this.killedShips.push(...shipsWithSameName);
    }

    return 'shot';
  }

  getKilledShips() {
    return this.killedShips;
  }

  clearKilledShips() {
    this.killedShips = [];
  }

  isWin(indexPlayer: string) {
    const findDataPositionsAnotherPlayer = this.shipPositions.find(
      (shipData) => shipData.indexPlayer !== indexPlayer
    );

    return findDataPositionsAnotherPlayer.ships.every(
      ({ isKilled }: IShip) => isKilled
    );
  }
}
