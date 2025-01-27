import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext"
import subscribeToMatch from "../utils/subscribeToMatch";

export function Match({ matchId }) {
    const { token, getMatch, id, makeMove } = useUser();
    const [events, setEvents] = useState([])
    const [match, setMatch] = useState({})
    const [otherPlayer, setOtherPlayer] = useState({})
    const [idTurn, setIdTurn] = useState(1)

    const fetchMatch = async () => {
        const matchData = await getMatch(matchId);
        setMatch(matchData);
    };

    useEffect(() => {
        fetchMatch();
    }, [matchId])

    useEffect(() => {
        if (match) {
            setOtherPlayer(match?.user1?._id !== id
                ? { username: match?.user1?.username, user: "user1" }
                : { username: match?.user2?.username, user: "user2" }
            )
        }
    }, [match])

    useEffect(() => {
        if (matchId && token) {
            const unsubscribe = subscribeToMatch(matchId, token, setEvents);
            return () => {
                unsubscribe();
            };
        }
    }, [matchId, token]);

    useEffect(() => {
        setEvents([])
        setIdTurn(1)
    }, [matchId]);

    useEffect(() => {
        const latestEvent = events.at(-1);
        if (!latestEvent) return;

        if (latestEvent.type === "NEW_TURN") {
            setIdTurn(latestEvent.payload.turnId);
        } else if (latestEvent.type === "TURN_ENDED") {
            setIdTurn(latestEvent.payload.newTurnId);
        } else if (
            latestEvent.type === "PLAYER1_MOVED" ||
            latestEvent.type === "PLAYER2_MOVED"
        ) {
            setIdTurn(latestEvent.payload.turn);
        }
    }, [events]);

    function eventMapping(event) {
        if (event.type === "PLAYER1_JOIN" || event.type === "PLAYER2_JOIN") {
            return `${event.payload.user} a rejoint la partie`;
        } else if (event.type === "NEW_TURN") {
            return `Tour ${event.payload.turnId}`;
        } else if (event.type === "TURN_ENDED") {
            const winner = event.payload.winner
            if (winner === "draw") {
                return "Egalité !"
            }
            if (winner === otherPlayer.user) {
                return otherPlayer.username + " a gagné la manche"
            }
            return "Vous avez gagné la manche"
        } else if (events.at(-1)?.type.includes("_MOVED") && (event.type === "PLAYER1_MOVED" || event.type === "PLAYER2_MOVED")) {
            if (otherPlayer.user === (event.type === "PLAYER1_MOVED" ? "user1" : "user2")) {
                return "On attend plus que toi !"
            } else {
                return "Tu as déjà joué ton coup"
            }
        } else if (event.type === "MATCH_ENDED") {
            return `${event.payload.winner} a gagné la partie`;
        }
    }

    return <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100%',
        }}
    >
        {match?.winner && <div>Le match est terminé et {match.winner.username} a gagné !</div>}
        {!match?.winner && otherPlayer && <div>Match Contre {otherPlayer.username}</div>}
        {!match?.winner && !otherPlayer && <div>Attente du deuxième joueur</div>}
        {!match?.winner && events.map(event => <div key={`${event.type}-${event.matchId}`}>{eventMapping(event)}</div>)}
        {!match?.winner && match && <button onClick={() => makeMove("rock", match._id, idTurn)}>Pierre</button>}
        {!match?.winner && match && <button onClick={() => makeMove("paper", match._id, idTurn)}>Papier</button>}
        {!match?.winner && match && <button onClick={() => makeMove("scissors", match._id, idTurn)}>Ciseaux</button>}
    </div>
}