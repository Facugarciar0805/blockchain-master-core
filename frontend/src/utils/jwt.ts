export function getJwtPayload(): { sub: string; username: string; email: string } | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            sub: payload.sub?.toString() ?? '',
            username: payload.username ?? '',
            email: payload.email ?? '',
        };
    } catch {
        return null;
    }
}
