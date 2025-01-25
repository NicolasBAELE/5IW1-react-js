import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useGlobalNavigate } from "../contexts/NavigationProvider";

export function User() {
    const [joinMatchError, setJoinMatchError] = useState("")
    const { token, logout, joinMatch } = useUser();
    const { navigate } = useGlobalNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/")
        }
    }, [token])

    return <>
        <button onClick={() => logout()}>Se déconnecter</button>
        <button onClick={() => joinMatch(setJoinMatchError)}>Rejoindre un match</button>
        <button onClick={() => navigate('/matchs')}>Mes matchs</button>
        {joinMatchError}
    </>
}