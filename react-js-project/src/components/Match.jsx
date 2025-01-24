import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext"
import subscribeToMatch from "../utils/subscribeToMatch";

export function Match({ matchId }) {
    const { token } = useUser();
    const [events, setEvents] = useState([])


    useEffect(() => {
        if (matchId && token) {
            const unsubscribe = subscribeToMatch(matchId, token, setEvents);
            return () => {
                unsubscribe(); 
            };
        }
    }, [matchId, token]);

    function eventMapping(event) {
        if (event.type === "PLAYER1_JOIN" | event.type === "PLAYER2_JOIN") {
            return `${event.payload.user} a rejoint la partie`
        } else if (event.type === "NEW_TURN") {
            return `Tour ${event.payload.turnId}`
        } else if (event.type === "TURN_ENDED") {
            return `${event.payload.winner} a gagné la manche`
        } else if (event.type === "PLAYER1_MOVED" | event.type === "PLAYER2_MOVED") {
            return `Un joueur a joué son coup pour le tour`
        } else if (event.type === "MATCH_ENDED") {
            return `${event.payload.winner} a gagné la partie`
        }
    }


    return <div>{events.map(event => <div>{eventMapping(event)}</div>)}</div>
}