import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 760px)";

/**
 * Retourne true si le viewport correspond à un écran de téléphone
 * (largeur <= 760px), et se met à jour automatiquement si la fenêtre
 * est redimensionnée ou l'orientation change.
 */
export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_QUERY).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const handleChange = (e) => setIsMobile(e.matches);

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
