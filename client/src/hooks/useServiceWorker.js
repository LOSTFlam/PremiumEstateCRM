import { useEffect } from "react";

export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("SW registered:", registration.scope);

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("New content available, please refresh.");
              }
            });
          });
        })
        .catch((error) => {
          console.error("SW registration failed:", error);
        });
    });
  }
};

export const useServiceWorker = () => {
  useEffect(() => {
    registerServiceWorker();
    return () => {};
  }, []);

  const checkForUpdates = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update();
      });
    }
  };

  const clearCache = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.controller?.postMessage({ type: "CLEAR_CACHE" });
    }
  };

  return { checkForUpdates, clearCache };
};

export default useServiceWorker;
