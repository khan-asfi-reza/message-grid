export const getRecipientUsername = (users, userLoggedIn) =>
  users?.filter((toFilter) => toFilter !== userLoggedIn)[0];
