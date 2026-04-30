export interface User {
    id: string;
    name: string;
}
export interface UserCredentials {
    id: string;
    name: string;
    minerId?: string;
    password: string;
}