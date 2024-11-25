import React, {createContext, useState, useEffect, useContext} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setUserToken] = useState(sessionStorage.getItem('token'));
    const [username, setUsername] = useState(sessionStorage.getItem('username'));
    const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('isAuthenticated'));

    useEffect(() => {
        if (token) {
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('username', username);
        } else {
            sessionStorage.setItem('isAuthenticated', 'false');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('username');
        }
    }, [token, username]);

    const login = (username, token) => {
        console.log("logged in", token, username);
        setUserToken(token);
        setUsername(username);
        setIsAuthenticated('true');
    };

    const logout = () => {
        console.log("logged out");
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
