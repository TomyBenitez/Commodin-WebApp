export const getToken = (name: string): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([name], (result) => {
            if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);  // Maneja errores
            } else {
            return resolve(result[name] || null);  // Resuelve con el valor o null si no existe
            }
        });
    });
};

export const setToken = (name: string, value: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [name]: value }, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError); // Maneja errores
            } else {
                resolve(); // Resuelve la promesa cuando se complete
            }
        });
    });
};

export const removeToken = (name: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove([name], () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError); // Maneja errores
            } else {
                resolve(); // Resuelve la promesa cuando se complete
            }
        });
    });
};

export default {
    getToken,
    setToken,
    removeToken
};