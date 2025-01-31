import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import subscribeToMatch from "../utils/subscribeToMatch";
import { useParams } from "react-router-dom";
import { Button } from "./Button";

export function Match() {
    const { id: matchId } = useParams();
    const { token, getMatch, id, makeMove } = useUser();
    const [events, setEvents] = useState([]);
    const [match, setMatch] = useState({});
    const [otherPlayer, setOtherPlayer] = useState({});
    const [idTurn, setIdTurn] = useState(1);
    const [lastMove, setLastMove] = useState("");
    const [matchInLive, setMatchInLive] = useState(!match?.hasOwnProperty("winner"));

    const fetchMatch = async () => {
        if (matchId) {
            const matchData = await getMatch(matchId);
            setMatch(matchData);
        }
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
            setMatchInLive(!match?.hasOwnProperty("winner"));
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
        setLastMove("")
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

    function getMoveImg(move = lastMove, reversed = false) {
        console.log({ move });

        return move === "scissors"
            ? <img src="/leg_kick.jpg" style={reversed ? { transform: "scaleX(-1)" } : {}} />
            : move === "paper"
                ? <img src="/multiple_punchs.jpg" style={reversed ? { transform: "scaleX(-1)" } : {}} />
                : <img src="/punch.jpg" style={reversed ? { transform: "scaleX(-1)" } : {}} />;
    }
    console.log(lastMove);


    function eventMapping(event) {
        if (event.type === "PLAYER1_JOIN" || event.type === "PLAYER2_JOIN") {
            if (event.payload.user === otherPlayer.username) {
                return (<><img src="/idle.jpg" style={{ transform: "scaleX(-1)" }} alt="Idle" /> {otherPlayer.username}</>);
            } else {
                return (<>Vous <img src="/idle.jpg" alt="Idle" /></>);
            }

        } else if (event.type === "TURN_ENDED") {
            const winner = event.payload.winner;
            if (winner === "draw") {
                return "Égalité !";
            }
            if (winner === otherPlayer.user) {
                return otherPlayer.username + " a gagné la manche";
            }
            return "Vous avez gagné la manche";
        } else if (event.type === "PLAYER1_MOVED" || event.type === "PLAYER2_MOVED") {
            if (otherPlayer.user === (event.type === "PLAYER1_MOVED" ? "user1" : "user2")) {
                if (events.at(-1)?.type.includes("_MOVED") && event.payload.turn === idTurn) {
                    return "On attend plus que toi !";
                } else {
                    return getMoveImg(match?.turns[event.payload?.turn - 1]?.[otherPlayer?.user], true)
                }
            } else {
                return getMoveImg(match?.turns[event.payload?.turn - 1]?.[otherPlayer?.user === "user1" ? "user2" : "user1"])
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
                width: "100%",
                color: "#333",
                fontFamily: "Arial, sans-serif",
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#f4f4f4",
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
            {matchInLive && otherPlayer.username && (
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "20px" }}>
                    Match contre {otherPlayer.username}
                </div>
            )}
            {matchInLive && !otherPlayer.username && (
                <div style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
                    Attente du deuxième joueur...
                </div>
            )}
            {matchInLive && events.length !== 0 &&
                <div
                    style={{
                        maxWidth: "500px",
                        width: "100%",
                        padding: "10px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        backgroundColor: "#f4f4f4",
                        marginBottom: "20px",
                    }}
                >
                    {events.map((event, key) => (
                        <div key={`${event.type}-${event.matchId}-${key}`} style={{ margin: "5px 0" }}>
                            {eventMapping(event)}
                        </div>
                    ))}
                </div>
            }
            {matchInLive && match && match.user2 && (
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        onClick={() => handleMove("rock")}
                        disabled={lastMove}
                        type={"primary"}
                    >
                        <img src="/punch.jpg" style={{ pointerEvents: "none" }} />
                    </Button>
                    <Button
                        onClick={() => handleMove("paper")}
                        disabled={lastMove}
                        type={"secondary"}
                    >
                        <img src="/multiple_punchs.jpg" style={{ pointerEvents: "none" }} />
                    </Button>
                    <Button
                        onClick={() => handleMove("scissors")}
                        disabled={lastMove}
                        type={"tertiary"}
                    >
                        <img src="/leg_kick.jpg" style={{ pointerEvents: "none" }} />
                    </Button>
                </div>
            )}
        </div>
    );
}
