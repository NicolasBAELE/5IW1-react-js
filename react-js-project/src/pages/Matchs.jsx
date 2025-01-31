import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useGlobalNavigate } from "../contexts/NavigationProvider";
import { Button } from "../components/Button";

export function Matchs() {
    const { matchs, id, username, getMatches } = useUser();
    const { navigate } = useGlobalNavigate();

    useEffect(() => {
        getMatches()
    }, [])

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#333",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
                padding: "20px",
            }}
        >
            <h1 style={{ marginBottom: "20px", fontSize: "2rem" }}>Liste des matchs</h1>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    maxWidth: "500px",
                }}
            >
                {[...matchs].reverse().map((match) => {
                    const otherPlayer =
                        match?.user1?._id !== id ? match?.user1?.username : match?.user2?.username;
                    const winner = match.winner?.username;
                    const draw = match.hasOwnProperty("winner") && match.winner === null

                    return (
                        <Button
                            key={match._id}
                            onClick={() => navigate(`/matchs/${match._id}`)}
                            type={winner === username
                                ? "primary"
                                : winner
                                    ? "secondary"
                                    : draw
                                        ? "tertiary"
                                        : "default"
                            }
                        >
                            {winner
                                ? `${winner} a gagné la partie !`
                                : draw
                                    ? `Égalité avec ${otherPlayer}`
                                    : otherPlayer || "Pas encore trouvé"}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
