import { BackButton } from "../components/BackButton";
import { useUser } from "../contexts/UserContext";
import { theme } from "../utils/theme";

export function Dashboard() {
    const { matchs, username, getMatches } = useUser();

    useEffect(() => {
        getMatches()
    }, [])

    const winCount = matchs.filter(match => match.winner?.username === username).length;
    const lossCount = matchs.filter(match => match.winner?.username !== username && match.winner).length;
    const drawCount = matchs.filter(match => match.winner === null).length;

    const movesWithUser = matchs.flatMap(match => {
        const myUser = match.user1.username === username ? "user1" : "user2";
        return match.turns.map(turn => turn[myUser]);
    });

    const scissorsCount = movesWithUser.reduce((acc, item) => item === "scissors" ? acc + 1 : acc, 0);
    const paperCount = movesWithUser.reduce((acc, item) => item === "paper" ? acc + 1 : acc, 0);
    const rockCount = movesWithUser.reduce((acc, item) => item === "rock" ? acc + 1 : acc, 0);

    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        backgroundColor: "#f4f4f4",
        padding: "20px",
        textAlign: "center",
        fontSize: "1.5rem",
        fontWeight: "bold",
    };

    const gridStyle = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        width: "500px",
        marginTop: "15px"
    };

    const cardStyle = (bgColor) => ({
        backgroundColor: bgColor,
        color: "white",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        fontWeight: "bold"
    });

    const moveStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
    };

    return (
        <>
            <BackButton />
            <div style={containerStyle}>
                <div>Statistiques de {username}</div>
                <div style={gridStyle}>
                    <div style={cardStyle(theme.primary)}>
                        Victoires: {winCount}
                    </div>
                    <div style={cardStyle(theme.secondary)}>
                        Défaites: {lossCount}
                    </div>
                    <div style={cardStyle(theme.tertiary)}>
                        Égalités: {drawCount}
                    </div>
                </div>
                <div style={{ marginTop: "20px" }}>Nombre d'actions</div>
                <div style={gridStyle}>
                    <div style={moveStyle}>
                        <img src="/leg_kick.jpg" alt="Scissors" />
                        {scissorsCount}
                    </div>
                    <div style={moveStyle}>
                        <img src="/multiple_punchs.jpg" alt="Paper" />
                        {paperCount}
                    </div>
                    <div style={moveStyle}>
                        <img src="/punch.jpg" alt="Rock" />
                        {rockCount}
                    </div>
                </div>
            </div>
        </>
    );
}
