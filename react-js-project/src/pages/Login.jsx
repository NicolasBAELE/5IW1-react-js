import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { RegisterBox } from "../components/RegisterBox";
import { LoginBox } from "../components/LoginBox";
import { Button } from "../components/Button";

export function Login() {
    const [registerMode, setRegisterMode] = useState(false);
    const { token } = useUser();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                backgroundColor: "#f4f4f4",
                padding: "20px",
            }}
        >
            <h1 style={{ color: "#333", fontSize: "2rem", marginBottom: "20px" }}>
                {registerMode ? "Inscription" : "Connexion"}
            </h1>

            {!token && registerMode && <RegisterBox />}
            {!token && !registerMode && <LoginBox />}

            {!token && (
                <Button
                    onClick={() => setRegisterMode(!registerMode)}
                    type={"primary"}
                    customStyles={{ marginTop: "30px" }}
                >
                    {registerMode ? "Se connecter" : "S'inscrire"}
                </Button>
            )}
        </div>
    );
}
