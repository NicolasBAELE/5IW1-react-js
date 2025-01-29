import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import subscribeToMatch from "../utils/subscribeToMatch";

export function Match({ matchId }) {
    const { token, getMatch, id, makeMove } = useUser();
    const [events, setEvents] = useState([]);
    const [match, setMatch] = useState({});
    const [otherPlayer, setOtherPlayer] = useState({});
    const [idTurn, setIdTurn] = useState(1);
    const [lastMove, setLastMove] = useState("");
    const [matchInLive, setMatchInLive] = useState(!match.hasOwnProperty("winner"));

    const fetchMatch = async () => {
        const matchData = await getMatch(matchId);
        setMatch(matchData);
    };

    useEffect(() => {
        fetchMatch();
    }, [matchId]);

    useEffect(() => {
        if (match) {
            setOtherPlayer(
                match?.user1?._id !== id
                    ? { username: match?.user1?.username, user: "user1" }
                    : { username: match?.user2?.username, user: "user2" }
            );
            setMatchInLive(!match.hasOwnProperty("winner"));
        }
    }, [match]);

    useEffect(() => {
        if (matchId && token) {
            const unsubscribe = subscribeToMatch(matchId, token, setEvents);
            return () => {
                unsubscribe();
            };
        }
    }, [matchId, token]);

    useEffect(() => {
        setEvents([]);
        setIdTurn(1);
    }, [matchId]);

    useEffect(() => {
        fetchMatch();
        const latestEvent = events.at(-1);
        if (!latestEvent) return;

        if (latestEvent.type === "NEW_TURN") {
            setIdTurn(latestEvent.payload.turnId);
        } else if (latestEvent.type === "TURN_ENDED") {
            setIdTurn(latestEvent.payload.newTurnId);
            setLastMove("");
        } else if (
            latestEvent.type === "PLAYER1_MOVED" ||
            latestEvent.type === "PLAYER2_MOVED"
        ) {
            setIdTurn(latestEvent.payload.turn);
        }
    }, [events]);

    function toFrench(move) {
        return move === "scissors" ? "ciseaux" : move === "paper" ? "papier" : "pierre";
    }

    function eventMapping(event) {
        if (event.type === "PLAYER1_JOIN" || event.type === "PLAYER2_JOIN") {
            return `${event.payload.user} a rejoint la partie`;
        } else if (event.type === "NEW_TURN") {
            return `Tour ${event.payload.turnId}`;
        } else if (event.type === "TURN_ENDED") {
            const winner = event.payload.winner;
            if (winner === "draw") {
                return "Égalité !";
            }
            if (winner === otherPlayer.user) {
                return otherPlayer.username + " a gagné la manche";
            }
            return "Vous avez gagné la manche";
        } else if (
            events.at(-1)?.type.includes("_MOVED") &&
            event.payload.turn === idTurn &&
            (event.type === "PLAYER1_MOVED" || event.type === "PLAYER2_MOVED")
        ) {
            if (otherPlayer.user === (event.type === "PLAYER1_MOVED" ? "user1" : "user2")) {
                return "On attend plus que toi !";
            } else {
                return "Tu as joué " + toFrench(lastMove);
            }
        }
    }

    function handleMove(move) {
        makeMove(move, match._id, idTurn);
        setLastMove(move);
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100%",
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "white",
                fontFamily: "Arial, sans-serif",
                textAlign: "center",
                padding: "20px",
            }}
        >
            {!matchInLive && (
                <div
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        marginBottom: "20px",
                    }}
                >
                    Le match est terminé {match.winner?.username ? `et ${match.winner?.username} a gagné !` : "sur une égalité"}
                </div>
            )}
            {matchInLive && otherPlayer && (
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "20px" }}>
                    Match contre {otherPlayer.username}
                </div>
            )}
            {matchInLive && !otherPlayer && (
                <div style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
                    Attente du deuxième joueur...
                </div>
            )}
            <div
                style={{
                    maxWidth: "500px",
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "10px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    marginBottom: "20px",
                }}
            >
                {matchInLive &&
                    events.map((event, key) => (
                        <div key={`${event.type}-${event.matchId}-${key}`} style={{ margin: "5px 0" }}>
                            {eventMapping(event)}
                        </div>
                    ))}
            </div>
            {matchInLive && match && (
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={() => handleMove("rock")}
                        disabled={lastMove}
                        style={{
                            padding: "10px 20px",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            borderRadius: "5px",
                            border: "none",
                            background: lastMove ? "#bdc3c7" : "#ff5f6d",
                            color: "white",
                            cursor: lastMove ? "not-allowed" : "pointer",
                            transition: "0.3s",
                        }}
                    >
                        Pierre
                    </button>
                    <button
                        onClick={() => handleMove("paper")}
                        disabled={lastMove}
                        style={{
                            padding: "10px 20px",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            borderRadius: "5px",
                            border: "none",
                            background: lastMove ? "#bdc3c7" : "#2ecc71",
                            color: "white",
                            cursor: lastMove ? "not-allowed" : "pointer",
                            transition: "0.3s",
                        }}
                    >
                        Papier
                    </button>
                    <button
                        onClick={() => handleMove("scissors")}
                        disabled={lastMove}
                        style={{
                            padding: "10px 20px",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            borderRadius: "5px",
                            border: "none",
                            background: lastMove ? "#bdc3c7" : "#f39c12",
                            color: "white",
                            cursor: lastMove ? "not-allowed" : "pointer",
                            transition: "0.3s",
                        }}
                    >
                        Ciseaux
                    </button>
                </div>
            )}
        </div>
    );
}
