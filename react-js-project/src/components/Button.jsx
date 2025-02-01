import { theme } from "../utils/theme";

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
            ? theme.primary
            : type === "secondary"
                ? theme.secondary
                : type === "tertiary"
                    ? theme.tertiary
                    : theme.default,
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
