export const getRecipientUsername = (users, userLoggedIn) =>
  users?.filter((toFilter) => toFilter !== userLoggedIn)[0];

export const getQueryId = (router) =>
  typeof router.query.id === "string" ? router.query.id : router.query.id[0];

export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
