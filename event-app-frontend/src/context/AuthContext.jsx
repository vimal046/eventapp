import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    return token ? { token, user: { name, role } } : { token: null, user: null };
  });

  const login = ({ token, name, role }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    localStorage.setItem('role', role);
    setAuth({ token, user: { name, role } });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, user: null });
  };

  const value = useMemo(() => ({ ...auth, login, logout }), [auth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
