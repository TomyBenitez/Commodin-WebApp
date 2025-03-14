const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
      window.location.hostname === "[::1]" ||
      window.location.hostname.match(/^127(?:\.\d+){3}$/)
  );
  
  export function register(): void {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        const swUrl = `${import.meta.env.VITE_BASE_URL_TESTING}/service-worker.js`;
  
        if (isLocalhost) {
          checkValidServiceWorker(swUrl);
        } else {
          registerValidSW(swUrl);
        }
      });
    }
  }
  
  function registerValidSW(swUrl: string): void {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log("Service Worker registrado con éxito:", registration);
  
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  console.log("Nueva versión disponible. Recarga la página.");
                } else {
                  console.log("El contenido se ha almacenado para uso offline.");
                }
              }
            };
          }
        };
      })
      .catch((error) => {
        console.error("Error al registrar el Service Worker:", error);
      });
  }
  
  function checkValidServiceWorker(swUrl: string): void {
    fetch(swUrl, { headers: { "Service-Worker": "script" } })
      .then((response) => {
        if (
          response.status === 404 ||
          response.headers.get("content-type")?.indexOf("javascript") === -1
        ) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          registerValidSW(swUrl);
        }
      })
      .catch(() => {
        console.log(
          "No se pudo encontrar conexión a Internet. La aplicación está en modo offline."
        );
      });
  }
  
  export function unregister(): void {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.unregister();
      });
    }
  }