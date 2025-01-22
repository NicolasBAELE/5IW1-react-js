import React, { createContext, useContext, useState } from 'react';
import { postJson } from '../utils/fetch';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    

    function errorMapping(errorMessage) {
        if (errorMessage === "User already exists") {
            return "L'utilisateur existe déjà."
        }
        return "Une erreur est survenue."
    }

    function login(username, password, setError) {
        setError("")
        postJson('http://localhost:3002/login', { username: username, password: password })
            .then((res) => setUser(res))
            .catch(() => setError("L'identifiant ou le mot de passe est incorrecte"))
    };

    function register(username, password, setError) {
        setError("")
        postJson('http://localhost:3002/register', { username: username, password: password })
            .then(() => console.log("compte bien créé"))
            .catch((e) => setError(errorMapping(e.data.error)))
    };

    return (
        <UserContext.Provider value={{ user, login, register }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
