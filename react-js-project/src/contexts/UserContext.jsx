import React, { createContext, useContext, useEffect, useState } from 'react';
import { getJson, postJson } from '../utils/fetch';
import { useGlobalNavigate } from './NavigationProvider';
import { decodeJWT } from '../utils/decodeJWT';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [matchs, setMatchs] = useState([])
    const [username, setUsername] = useState(localStorage.getItem("username"))
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
                setToken(res.token)
                localStorage.setItem("token", res.token);
                const jwt = decodeJWT(res.token)
                setUsername(jwt.username)
                localStorage.setItem("username", jwt.username);
                setId(jwt._id)
                navigate("/user")
            })
            .catch(() => setError("L'identifiant ou le mot de passe est incorrecte"))
    };

    function logout() {
        setToken(null)
        setUsername(null);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
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
            const res = await getJson('http://localhost:3002/matches', { "Authorization": "Bearer " + token });
            setMatchs(res);
            return res;
        } catch {
            return console.log("Veuilliez vous connecter");
        }
    };

    async function getMatch(matchId) {
        try {
            const res = await getJson(`http://localhost:3002/matches/${matchId}`, { "Authorization": "Bearer " + token });
            return res;
        } catch {
            return console.log("Veuilliez vous connecter");
        }
    };

    function joinMatch(setError) {
        setError("");
        postJson('http://localhost:3002/matches', {}, { "Authorization": "Bearer " + token })
            .then(() => {
                return getMatches();
            })
            .then((res) => navigate(`/matchs/${res.at(-1)?._id}`))
            .catch(() => setError("Vous avez déjà un match en attente"));
    }

    function makeMove(move, idMatch, idTurn) {
        postJson(`http://localhost:3002/matches/${idMatch}/turns/${idTurn}`, { move: move }, { "Authorization": "Bearer " + token })
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    }

    return (
        <UserContext.Provider value={{ token, login, register, logout, matchs, joinMatch, username, id, getMatch, makeMove, getMatches }}>
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
