export function register(): void {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((reg: ServiceWorkerRegistration) => 
            console.log('Service Worker registrado:', reg.scope)
          )
          .catch((err: Error) => 
            console.error('Error al registrar el Service Worker:', err)
          )
      })
    }
  }
  
  export function unregister(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((reg: ServiceWorkerRegistration) => reg.unregister())
        .catch((err: Error) => console.error(err))
    }
  }
  