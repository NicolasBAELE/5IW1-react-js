import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useGlobalNavigate } from "../contexts/NavigationProvider";
import { Button } from "../components/Button";
import { theme } from "../utils/theme";

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
            <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
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
                    type={"tertiary"}
                >
                    Mes matchs
                </Button>
                <Button
                    onClick={() => navigate("/dashboard")}
                >
                    Dashboard
                </Button>
            </div>

            {joinMatchError && (
                <p style={{ color: theme.secondary, marginTop: "10px" }}>{joinMatchError}</p>
            )}
        </div>
    );
}
