import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { Button } from "./Button";
import { Input } from "./Input";
import { theme } from "../utils/theme";

export function LoginBox() {
    const { login } = useUser();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function handleUsernameChange(value) {
        setUsername(value);
    }

    function handlePasswordChange(value) {
        setPassword(value);
    }

    function handleSubmit() {
        login(username, password, setErrorMessage);
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            width: "100%",
            margin: "0 auto",
        }}>
            <Input
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
            />
            <Button
                customStyles={{ opacity: password ? 1 : 0.5 }}
                disabled={!password}
                onClick={handleSubmit}
            >
                Se connecter
            </Button>
            {errorMessage && <div style={{ color: theme.secondary, marginTop: "10px", fontSize: "0.9rem" }}>{errorMessage}</div>}
        </div>
    );
}
