

/**
 * @returns true if user is logged in and false otherwise
 */
export const isUserLoggedIn = () => {
  return localStorage.getItem('accessToken') === null
    ? false
    : true;
};
