import React, { createContext, useContext, useEffect, useState } from 'react';
import { getJson, postJson } from '../utils/fetch';
import { useGlobalNavigate } from './NavigationProvider';
import { decodeJWT } from '../utils/decodeJWT';
import { BASE_URL } from '../utils/theme';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [matchs, setMatchs] = useState([])
    const [username, setUsername] = useState("")
    const [id, setId] = useState("")
    const { navigate } = useGlobalNavigate();


    useEffect(() => {
        if (token) {
            getMatches()
            const jwt = decodeJWT(token)
            setUsername(jwt.username)
            setId(jwt._id)
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
        postJson(BASE_URL + '/login', { username: username, password: password })
            .then((res) => {
                setToken(res.token)
                localStorage.setItem("token", res.token);
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
        postJson(BASE_URL + '/register', { username: username, password: password })
            .then(() => login(username, password, setError))
            .catch((e) => setError(errorMapping(e.data.error)))
    };

    async function getMatches() {
        try {
            const res = await getJson(BASE_URL + '/matches', { "Authorization": "Bearer " + token });
            setMatchs(res);
            return res;
        } catch {
            return console.log("Veuilliez vous connecter");
        }
    };

    async function getMatch(matchId) {
        try {
            const res = await getJson(`${BASE_URL}/matches/${matchId}`, { "Authorization": "Bearer " + token });
            return res;
        } catch {
            return console.log("Veuilliez vous connecter");
        }
    };

    function joinMatch(setError) {
        setError("");
        postJson(BASE_URL + '/matches', {}, { "Authorization": "Bearer " + token })
            .then(() => {
                return getMatches();
            })
            .then((res) => navigate(`/matchs/${res.at(-1)?._id}`))
            .catch(() => setError("Vous avez déjà un match en attente"));
    }

    function makeMove(move, idMatch, idTurn) {
        postJson(`${BASE_URL}/matches/${idMatch}/turns/${idTurn}`, { move: move }, { "Authorization": "Bearer " + token })
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
