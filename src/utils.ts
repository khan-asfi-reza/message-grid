import { DocumentData, QuerySnapshot } from "@firebase/firestore";
import { NextRouter } from "next/router";

/**
 * Returns the partner username
 * @param users List of users in the array
 * @param userLoggedIn User logged into the client
 */
export const getRecipientUsername = (
  users: Array<string>,
  userLoggedIn: string
): string => users?.filter((toFilter) => toFilter !== userLoggedIn)[0];

/**
 *
 * @param { NextRouter } router NextJS Router Context
 * @example
 * const router = useRouter();
 * // Your Code
 * query = getQueryId(router);
 */
export const getQueryId = (router: NextRouter) =>
  typeof router.query.id === "string" ? router.query.id : router.query.id[0];

/**
 * Checks if an HTML Element is in viewport
 * @param { HTMLElement } element HTML Element
 * @return { boolean } If element is in viewport
 */
export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Gets data from snapshot
 * Selects the first element from the list
 * If element is not available in the object or in the list
 * Then return null
 * @param {QuerySnapshot<DocumentData>} snapshot Firebase snapshot
 * @param {string} key Object Key String / Object Key String
 * @example
 * getSnapshotData(messageSnapshot, "message")
 */
export const getSnapshotData = (snapshot: QuerySnapshot, key: string) =>
  snapshot?.docs[0]?.data()[key];
