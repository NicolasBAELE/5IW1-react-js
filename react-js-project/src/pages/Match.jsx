import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import subscribeToMatch from "../utils/subscribeToMatch";
import { useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { RuleModale } from "../modales/RuleModale";
import { buttonStyle } from "../components/Modale";
import { BackButton } from "../components/BackButton";

const tooltipStyle = {
    position: "absolute",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "black",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "12px",
    whiteSpace: "nowrap",
    transition: "opacity 0.3s ease"
};
const buttonContainerStyle = {
    position: "relative",
    display: "inline-block"
};


export function Match() {
    const { id: matchId } = useParams();
    const { token, getMatch, id, makeMove, username } = useUser();
    const [events, setEvents] = useState([]);
    const [match, setMatch] = useState({});
    const [otherPlayer, setOtherPlayer] = useState({});
    const [idTurn, setIdTurn] = useState(1);
    const [lastMove, setLastMove] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);
    const [openRuleModale, setOpenRulesModale] = useState(false)

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
            setLastMove(match.turns?.at(-1)?.winner ? "" : String(lastMove || match.turns?.at(-1)?.user1 || match.turns?.at(-1)?.user2).replace(/\?+$/, "").replace(/undefined+$/, ""))
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
        return move === "scissors"
            ? <img src="/leg_kick.jpg" style={reversed ? { transform: "scaleX(-1)" } : {}} />
            : move === "paper"
                ? <img src="/multiple_punchs.jpg" style={reversed ? { transform: "scaleX(-1)" } : {}} />
                : <img src="/punch.jpg" style={reversed ? { transform: "scaleX(-1)" } : {}} />;
    }

    function eventMapping(event) {
        if (event.type === "MATCH_ENDED") {
            const winner = match.winner?.username;
            const draw = match.hasOwnProperty("winner") && match.winner === null
            if (winner)
                return <div style={{ width: "100%" }}>{winner} a gagné la partie !</div>
            if (draw)
                return <div style={{ width: "100%" }}>Egalité !</div>
        }
        if (event.type === "PLAYER1_JOIN" || event.type === "PLAYER2_JOIN") {
            if (event.payload.user === otherPlayer.username) {
                return (
                    <>
                        <img src="/idle.jpg" style={{ transform: "scaleX(-1)" }} />
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            {otherPlayer.username} a rejoint la partie !
                        </div>
                    </>
                );
            } else {
                return (
                    <>
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            Vous avez rejoint la partie !
                        </div>
                        <img src="/idle.jpg" />
                    </>
                );
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
                    return <div style={{ width: "100%" }}>On attend plus que toi !</div>
                } else {
                    const turnIndex = event.payload?.turn ? event.payload.turn - 1 : null;
                    const move = turnIndex !== null && match?.turns?.[turnIndex]?.[otherPlayer?.user]
                        ? match.turns[turnIndex][otherPlayer.user]
                        : null;

                    return getMoveImg(move, true);
                }
            } else {
                const turnIndex = event.payload?.turn ? event.payload.turn - 1 : null;
                const opponentKey = otherPlayer?.user === "user1" ? "user2" : "user1";
                const move = turnIndex !== null && match?.turns?.[turnIndex]?.[opponentKey]
                    ? match.turns[turnIndex][opponentKey]
                    : null;

                return getMoveImg(move);
            }
        }
    }

    function handleMove(move) {
        makeMove(move, match._id, idTurn);
        setLastMove(move);
    }

    return (
        <>
            <BackButton />
            <RuleModale isOpen={openRuleModale} onClose={() => setOpenRulesModale(false)} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "Arial, sans-serif",
                    textAlign: "center",
                    padding: "20px",
                    backgroundColor: "#f4f4f4",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    minHeight: "100vh",
                }}
            >
                {otherPlayer.username && (
                    <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                        Match contre {otherPlayer.username}
                        <div
                            style={buttonContainerStyle}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <Button
                                customStyles={buttonStyle}
                                onClick={() => setOpenRulesModale(true)}
                            >
                                ?
                            </Button>
                            {showTooltip && (
                                <div style={tooltipStyle}>
                                    Règles
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {!otherPlayer.username && (
                    <div style={{ marginBottom: "20px" }}>
                        Attente du deuxième joueur...
                    </div>
                )}
                {events.length !== 0 &&
                    <div
                        style={{
                            maxWidth: "500px",
                            width: "100%",
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            backgroundColor: "#f4f4f4",
                            marginBottom: "20px",
                            padding: "10px",
                        }}
                    >
                        {events.map((event, key) => {
                            const isMe = event.payload.user
                                ? event.payload.user === username
                                : event.payload.winner
                                    ? event.payload.winner === username
                                    : event.type.includes("_MOVED")
                                        ? otherPlayer.user !== (event.type === "PLAYER1_MOVED" ? "user1" : "user2")
                                        : false;

                            return (
                                <div
                                    key={`${event.type}-${event.matchId}-${key}`}
                                    style={{
                                        display: "flex",
                                        justifyContent: event.type === "TURN_ENDED" ? "center" : isMe === true ? "flex-end" : "flex-start",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    {eventMapping(event)}
                                </div>
                            );
                        })}
                    </div>
                }

                {!match.hasOwnProperty("winner") && match && match.user2 && (
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                            onClick={() => handleMove("rock")}
                            disabled={lastMove || match?.hasOwnProperty("winner")}
                            type={"primary"}
                        >
                            <img src="/punch.jpg" style={{ pointerEvents: "none" }} />
                        </Button>
                        <Button
                            onClick={() => handleMove("paper")}
                            disabled={lastMove || match?.hasOwnProperty("winner")}
                            type={"secondary"}
                        >
                            <img src="/multiple_punchs.jpg" style={{ pointerEvents: "none" }} />
                        </Button>
                        <Button
                            onClick={() => handleMove("scissors")}
                            disabled={lastMove || match?.hasOwnProperty("winner")}
                            type={"tertiary"}
                        >
                            <img src="/leg_kick.jpg" style={{ pointerEvents: "none" }} />
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
