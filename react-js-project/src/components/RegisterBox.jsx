import { useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";

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
        <div>
            <input
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirmation du mot de passe"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            />
            <button onClick={handleSubmit}>
                Créer son compte
            </button>
            {errorMessage && <div>{errorMessage}</div>}
        </div>
    );
}
