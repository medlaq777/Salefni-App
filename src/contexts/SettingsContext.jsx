import { createContext, useContext, useEffect, useState } from "react";
import { get } from "../api/client";

const SettingsCtx = createContext({ settings: { currency: "MAD" } });

export default function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({ currency: "MAD" });
  useEffect(() => {
    get("/settings")
      .then(setSettings)
      .catch(() => {});
  }, []);
  return (
    <SettingsCtx.Provider value={{ settings }}>{children}</SettingsCtx.Provider>
  );
}

export const useSettings = () => useContext(SettingsCtx);
