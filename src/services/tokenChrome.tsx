export const setCookie = (name: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 10);
        const cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
        
        // Solo agregar 'Secure' si estamos en un entorno HTTPS
        if (window.location.protocol === 'https:') {
            document.cookie = `${cookieString}; Secure`;
        } else {
            document.cookie = cookieString;
        }
        
        resolve();
    });
};


export const getCookie = async (name: string): Promise<string | null> => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find(row => row.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

export const removeCookie = (name: string): Promise<void> => {
    return new Promise((resolve) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        resolve();
    });
};

export default {
    setCookie,
    getCookie,
    removeCookie
};