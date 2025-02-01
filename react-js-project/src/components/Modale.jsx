import { Button } from "./Button";

export const buttonStyle = {
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

export function Modale({ isOpen, onClose, children, title }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                minWidth: "300px",
                maxWidth: "80%",
                textAlign: "center",
                position: "relative"
            }}>
                <div style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                }}>
                    {title}
                    <Button
                        onClick={onClose}
                        customStyles={buttonStyle}
                    >
                        ✖
                    </Button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}
