import React, { createContext, useContext, useEffect, useState } from 'react';
import { getJson, postJson } from '../utils/fetch';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [token, setToken] = useState(null);
    const [matches, setMatches] = useState([])


    useEffect(() => {
        if (token) {
            getMatches()
        }
    }, [token]);

    function errorMapping(errorMessage) {
        if (errorMessage === "User already exists") {
            return "L'utilisateur existe déjà."
        }
        return "Une erreur est survenue."
    }

    function login(username, password, setError) {
        setError("")
        postJson('http://localhost:3002/login', { username: username, password: password })
            .then((res) => setToken("Bearer " + res?.token))
            .catch(() => setError("L'identifiant ou le mot de passe est incorrecte"))
    };

    function logout() {
        setToken("")
        setMatches([])
    };

    function register(username, password, setError) {
        setError("")
        postJson('http://localhost:3002/register', { username: username, password: password })
            .then(() => login(username, password, setError))
            .catch((e) => setError(errorMapping(e.data.error)))
    };

    function getMatches() {
        getJson('http://localhost:3002/matches', { "Authorization": token })
            .then((res) => setMatches(res))
            .catch(() => console.log("Veuilliez vous connecter"))
    };

    function joinMatch(setError) {
        setError("")
        postJson('http://localhost:3002/matches', {}, { "Authorization": token })
            .then(() => getMatches())
            .catch(() => setError("Vous avez déjà un match en attente"))
    };

    return (
        <UserContext.Provider value={{ token, login, register, logout, matches, joinMatch }}>
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
