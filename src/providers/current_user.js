import React from "react";

import PropTypes from "prop-types";

export const CurrentUserContext = React.createContext({
  currentEmployee: {},
});

export function CurrentUserProvider({ children }) {
  // since async storage is a promise... you cannot load the current employee
  // directly from this component, because you do not know when it gets back.
  const [currentUser, setCurrentUser] = React.useState({});
  const updateCurrentUser = React.useCallback(
    (data) => {
      setCurrentUser((user) => ({ ...user, ...data }));
    },
    [setCurrentUser]
  );

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        updateCurrentUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}

CurrentUserProvider.propTypes = {
  children: PropTypes.any.isRequired,
};
