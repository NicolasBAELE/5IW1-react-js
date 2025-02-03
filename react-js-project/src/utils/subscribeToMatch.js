import { EventSourcePolyfill } from "event-source-polyfill";
import { BASE_URL } from "./theme";

function subscribeToMatch(matchId, token, setEvents) {
    const url = `${BASE_URL}/matches/${matchId}/subscribe`;

    let eventSource;

    const connect = () => {
        eventSource = new EventSourcePolyfill(url, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });

        eventSource.onmessage = (event) => {
            try {
                const dataParsed = JSON.parse(event.data);
                const data = Array.isArray(dataParsed) ? dataParsed : [dataParsed];
                setEvents((prevEvents) => [...prevEvents, ...data]);
            } catch (error) {
                console.error("Erreur lors du traitement de l'événement :", error);
            }
        };

        eventSource.onerror = (error) => {
            setEvents([])
            console.error("Erreur de connexion SSE, tentative de reconnexion...", error);
            eventSource.close();
            connect();
        };
    };

    connect();

    return () => {
        eventSource.close();
        console.log("Déconnecté du flux SSE.");
    };
}

export default subscribeToMatch;
