export function decodeJWT(token) {
    if (!token) {
        console.error("Token invalide ou manquant");
        return null;
    }

    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) {
            throw new Error("Token mal formé");
        }

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Erreur lors du décodage du JWT :", error);
        return null;
    }
}