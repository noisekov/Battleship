import { randomUUID } from 'crypto';
import { Storage } from '../Storage/Storage.ts';

export const createUser = (messageObj: string) => {
  const { data: loginAndPass } = JSON.parse(messageObj);
  const { name } = JSON.parse(loginAndPass);
  const index = randomUUID();
  Storage.getInstance.userReg({ index, ...JSON.parse(loginAndPass) });

  return {
    type: 'reg',
    data: JSON.stringify({
      name: name,
      index: index,
      error: false,
      errorText: '',
    }),
    id: 0,
  };
};
