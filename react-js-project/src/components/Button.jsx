export function Button({
    type = "default",
    children,
    onClick,
    customStyles,
    disabled,
}) {
    const baseStyles = {
        padding: "10px",
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
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "0.3s",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
        ...customStyles,
    };

    return (
        <button
            disabled={disabled}
            style={baseStyles}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
