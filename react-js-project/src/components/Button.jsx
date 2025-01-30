export function Button({
    type = "default",
    children,
    onClick,
    customStyles,
    disabled,
}) {

    const styles = {
        padding: "10px 20px",
        fontSize: "1rem",
        fontWeight: "bold",
        borderRadius: "5px",
        border: "none",
        background: type === "primary"
            ? "#2ecc71"
            : type === "secondary"
                ? "#cf2500"
                : type === "tertiary"
                    ? "#f39c12"
                    : "#3498db",
        color: "white",
        cursor: "pointer",
        transition: "0.3s",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
        ...customStyles,
    }

    return <button
        disabled={disabled}
        style={styles}
        onClick={onClick}
        onMouseOver={(e) => (e.target.style.opacity = "0.8")}
        onMouseOut={(e) => (e.target.style.opacity = "1")}
    >
        {children}
    </button>
}