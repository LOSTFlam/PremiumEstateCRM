import { useEffect, useState } from "react";
import { getFavoriteIds } from "views/public/catalog/catalogStorage";

export default function useFavoriteCount() {
  const [count, setCount] = useState(() => getFavoriteIds().length);

  useEffect(() => {
    const sync = () => setCount(getFavoriteIds().length);
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("cabinet-preferences-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cabinet-preferences-changed", sync);
    };
  }, []);

  return count;
}
