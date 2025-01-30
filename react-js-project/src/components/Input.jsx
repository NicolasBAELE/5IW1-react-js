export function Input({
    customStyles,
    placeholder,
    value,
    onChange,
    type,
}) {
    return <input
        style={{
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ddd",
            fontSize: "1rem",
            width: "100%",
            boxSizing: "border-box",
            transition: "border 0.3s",
            ...customStyles,
        }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={type}
    />
}