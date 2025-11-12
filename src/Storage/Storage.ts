export class Storage {
  private data: any[] = [];
  private static _instance: Storage;

  private constructor() {
    this.data = [];
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

  public updateUserData(
    indexUser: number,
    key: string,
    value: string | number
  ) {
    this.data.forEach((user) => {
      if (user.index === indexUser) {
        user[key] = value;
      }
    });
  }

  getUserData() {
    const lastUser = this.data[this.data.length - 1];

    return { data: JSON.stringify(lastUser) };
  }
}
