import { useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import { Input } from "./Input.jsx";
import { Button } from "./Button.jsx";

export function RegisterBox() {
    const { register } = useUser();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    function handleUsernameChange(value) {
        setUsername(value);
    }

    function handlePasswordChange(value) {
        setPassword(value);
    }

    function handleConfirmPasswordChange(value) {
        setConfirmPassword(value);
    }

    function handleSubmit() {
        if (password === confirmPassword) {
            register(username, password, setErrorMessage)
        } else {
            setErrorMessage("Les deux mots de passe ne sont pas identiques")
        }
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
            <Input
                type="password"
                placeholder="Confirmation du mot de passe"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            />
            <Button onClick={handleSubmit}>
                Créer son compte
            </Button>
            {errorMessage && <div>{errorMessage}</div>}
        </div>
    );
}
