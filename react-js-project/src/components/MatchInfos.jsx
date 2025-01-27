import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext"
import subscribeToMatch from "../utils/subscribeToMatch";

export function Match({ matchId }) {
    const { token, getMatch, id } = useUser();
    const [events, setEvents] = useState([])
    const [match, setMatch] = useState({})
    const [otherPlayer, setOtherPlayer] = useState("")
    console.log(match);
    
    const fetchMatch = async () => {
        const matchData = await getMatch(matchId);  
        setMatch(matchData);  
    };

    useEffect(() => {
        fetchMatch();
    }, [matchId])

    useEffect(() => {
        if (match) {
            console.log(match?.user1?._id, id , match?.user2?._id);
            
            setOtherPlayer(match?.user1?._id !== id ? match?.user1?.username : match?.user2?.username)
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
    }, [matchId]);

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
        {otherPlayer && <div>Match Contre {otherPlayer}</div>}
        {!otherPlayer && <div>Attente du deuxième joueur</div>}
        {events.map(event => <div key={`${event.type}-${event.matchId}`}>{eventMapping(event)}</div>)}
    </div>
}