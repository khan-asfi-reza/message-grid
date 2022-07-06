export const getRecipientUsername = (users, userLoggedIn) =>
  users?.filter((toFilter) => toFilter !== userLoggedIn)[0];

export const getQueryId = (router) =>
  typeof router.query.id === "string" ? router.query.id : router.query.id[0];
