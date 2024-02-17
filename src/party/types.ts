// export const parseUpdateMessage = (message: string) => {
//   return JSON.parse(message);
// };

export const parseActionMessage = (message: string) => {
  return JSON.parse(message);
};

export const createUpdateMessage = (answer: string, players: Player[]) => {
  return JSON.stringify({
    type: "update",
    answer,
    players,
  });
};
