import { useState } from "react";
import { useUser } from "../contexts/UserContext";

export function LoginBox() {
    const { login } = useUser()

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
        login(username, password, setErrorMessage)
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
            <button disabled={!password} onClick={handleSubmit}>
                Se connecter
            </button>
            {errorMessage && <div>{errorMessage}</div>}
        </div>
    );
}
