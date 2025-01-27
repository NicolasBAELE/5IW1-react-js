import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { RegisterBox } from "../components/RegisterBox"
import { LoginBox } from "../components/LoginBox"

export function Login() {
    const [registerMode, setRegisterMode] = useState(true)
    const { token } = useUser();


    return (
        <>
            {!token && registerMode && <RegisterBox />}
            {!token && !registerMode && <LoginBox />}
            {!token && <button onClick={() => setRegisterMode(!registerMode)}>{registerMode ? "Se connecter" : "S'inscrire"}</button>}
        </>
    )
}