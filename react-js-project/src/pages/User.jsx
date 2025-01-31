import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useGlobalNavigate } from "../contexts/NavigationProvider";
import { Button } from "../components/Button";

export function User() {
    const [joinMatchError, setJoinMatchError] = useState("");
    const { token, logout, joinMatch, username } = useUser();
    const { navigate } = useGlobalNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
            }}
        >
            <h1 style={{ color: "#333", fontSize: "2rem", marginBottom: "20px" }}>
                Bonjour {username} !
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Button
                    onClick={() => logout()}
                    type={"secondary"}
                >
                    Se déconnecter
                </Button>

                <Button
                    onClick={() => joinMatch(setJoinMatchError)}
                    type={"primary"}
                >
                    Rejoindre un match
                </Button>

                <Button
                    onClick={() => navigate("/matchs")}
                >
                    Mes matchs
                </Button>
            </div>

            {joinMatchError && (
                <p style={{ color: "#e74c3c", marginTop: "10px" }}>{joinMatchError}</p>
            )}
        </div>
    );
}
