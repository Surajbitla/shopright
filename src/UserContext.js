import React, { createContext, useState } from 'react';

const UserContext = createContext({
  user: null,
  setUser: () => {},
  setIsLoggedIn: () => {}
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
