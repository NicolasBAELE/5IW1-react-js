import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext"
import { Match } from "../components/Match";

export function Matchs() {
    const { matchs, id } = useUser();
    const [match, setMatch] = useState(null)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const matchId = params.get("id");

        if (matchId) {
            const foundMatch = matchs.find(item => item._id === matchId);
            if (foundMatch) {
                setMatch(foundMatch);
            }
        }
    }, [matchs]);

    return <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
            {matchs.map(match => {
                const otherPlayer = match?.user1?._id !== id ? match?.user1?.username : match?.user2?.username
                const winner = match.winner?.username
                return <button onClick={() => setMatch(match)}>
                    {winner ? winner + " a gagné la partie !" : (otherPlayer || "Pas encore trouvé") + " tour: " + (match.turns.length + 1)}

                </button>
            }
            )}</div>
        {match && <Match matchId={match._id} />}
    </div>
}