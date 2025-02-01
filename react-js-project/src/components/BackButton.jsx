import { useGlobalNavigate } from "../contexts/NavigationProvider";
import { Button } from "./Button";

export function BackButton() {
    const { navigate } = useGlobalNavigate();

    return (
        <Button
            onClick={() => navigate(-1)}
            customStyles={{
                position: "fixed",
                top: "20px",
                left: "20px",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                fontSize: "bold",
            }}
        >
            ←
        </Button>
    );
}
