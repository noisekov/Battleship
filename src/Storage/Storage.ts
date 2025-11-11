export class Storage {
  private data: any[] = [];

  constructor() {
    this.data = [];
  }

  public reg(message: any) {
    const { data } = message;
    this.data.push({ reg: 'firstUser', ...JSON.parse(data) });
  }
}
