import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptToken, decryptToken } from '../utils/secureData.js';

const useStore = create(
    persist(
        (set) => ({
            token: null,
            repoUrl: null,
            setToken: (token) => set({ token }),
            setRepoUrl: (repoUrl) => set({ repoUrl }),
        }),
        {
            name: 'token-session',
            storage: {
                getItem: (key) => {
                    const encrypted = sessionStorage.getItem(key);

                    if (!encrypted) {
                        return null;
                    }

                    const decrypted = decryptToken(encrypted);

                    return decrypted ? JSON.stringify(decrypted) : null;
                },
                setItem: (key, value) => {
                    const encrypted = encryptToken(value);
                    sessionStorage.setItem(key, encrypted);
                },
                removeItem: (key) => sessionStorage.removeItem(key),
            },
        }
    )
);

export { useStore };
