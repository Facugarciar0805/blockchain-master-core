import type { WalletType } from "../types/WalletTypes.tsx";

const url = import.meta.env.VITE_API_URL;

export async function getMyWallet(): Promise<WalletType | null> {
    const token = localStorage.getItem("token");

    const response = await fetch(url + "/wallets/me", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Couldn't get wallet: ${response.status}`);
    }

    return response.json();
}

export async function createWallet(): Promise<void> {
    const token = localStorage.getItem("token");

    const response = await fetch(url + "/wallets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Couldn't create wallet: ${response.status}`);
    }
}