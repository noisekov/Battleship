import { Storage } from '../Storage/Storage.ts';

export const updateWinners = (name?: string) => {
  return {
    type: 'update_winners',
    data: JSON.stringify(
      name
        ? [
            {
              name: name,
              wins: 1,
            },
          ]
        : []
    ),
    id: 0,
  };
};

export const checkIsWin = (playerId: string) => {
  return Storage.getInstance.isWin(playerId);
};

export const sendFinish = (indexPlayer: string) => {
  return {
    type: 'finish',
    data: JSON.stringify({
      winPlayer: indexPlayer,
    }),
    id: 0,
  };
};
