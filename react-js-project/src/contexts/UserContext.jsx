import React, { createContext, useContext, useEffect, useState } from 'react';
import { getJson, postJson } from '../utils/fetch';
import { useGlobalNavigate } from './NavigationProvider';
import { decodeJWT } from '../utils/decodeJWT';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [token, setToken] = useState(null);
    const [matchs, setMatchs] = useState([])
    const [username, setUsername] = useState("")
    const [id, setId] = useState("")
    const { navigate } = useGlobalNavigate();


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
            .then((res) => {
                setToken("Bearer " + res.token)
                const jwt = decodeJWT(res.token)
                setUsername(jwt.username)
                setId(jwt._id)
                navigate("/user")
            })
            .catch(() => setError("L'identifiant ou le mot de passe est incorrecte"))
    };

    function logout() {
        setToken("")
        setMatchs([])
    };

    function register(username, password, setError) {
        setError("")
        postJson('http://localhost:3002/register', { username: username, password: password })
            .then(() => login(username, password, setError))
            .catch((e) => setError(errorMapping(e.data.error)))
    };

    async function getMatches() {
        try {
            const res = await getJson('http://localhost:3002/matches', { "Authorization": token });
            setMatchs(res);
            return res;
        } catch {
            return console.log("Veuilliez vous connecter");
        }
    };

    async function getMatch(matchId) {
        try {
            const res = await getJson(`http://localhost:3002/matches/${matchId}`, { "Authorization": token });
            return res;
        } catch {
            return console.log("Veuilliez vous connecter");
        }
    };

    function joinMatch(setError) {
        setError("");
        postJson('http://localhost:3002/matches', {}, { "Authorization": token })
            .then(() => {
                return getMatches();
            })
            .then((res) => navigate(`/matchs?id=${res.at(-1)?._id}`))
            .catch(() => setError("Vous avez déjà un match en attente"));
    }

    return (
        <UserContext.Provider value={{ token, login, register, logout, matchs, joinMatch, username, id, getMatch }}>
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
