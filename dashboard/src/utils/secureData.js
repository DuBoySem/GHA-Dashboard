import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const encryptToken = (data) => {
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);

    return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
};

export const decryptToken = (cipher) => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        return JSON.parse(decrypted || '{}');
    } catch {
        return null;
    }
};
