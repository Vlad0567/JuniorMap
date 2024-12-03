import React, {createContext, useState, useEffect, useContext} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setUserToken] = useState(localStorage.getItem('token'));
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
        } else {
            localStorage.setItem('isAuthenticated', 'false');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        }
    }, [token, username]);

    const login = (username, token) => {
        setUserToken(token);
        setUsername(username);
        setIsAuthenticated('true');
    };

    const logout = () => {
        setUserToken(null);
        setUsername(null);
        setIsAuthenticated('false')
    };
    return (
        <AuthContext.Provider value={{ token, username, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
