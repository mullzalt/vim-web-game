import { useEffect, useState } from "react";
import { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import * as alls from "@uiw/codemirror-themes-all";

export function useCMTheme(name: ReactCodeMirrorProps["theme"] = "light") {
  const dark = document.documentElement.getAttribute("data-color-mode");
  const [theme, setTheme] = useState<ReactCodeMirrorProps["theme"]>(
    dark === "dark" ? "dark" : name,
  );
  useEffect(() => {
    setTheme(
      document.documentElement.getAttribute("data-color-mode") === "dark"
        ? "dark"
        : "light",
    );
    document.addEventListener("colorschemechange", (e) => {
      setTheme(e.detail.colorScheme as ReactCodeMirrorProps["theme"]);
    });
  }, []);
  return { theme, setTheme };
}

export const cmThemeOptions = ["dark", "light"]
  .concat(Object.keys(alls))
  .filter((item) => typeof alls[item as keyof typeof alls] !== "function")
  .filter((item) => !/^(defaultSettings)/.test(item as keyof typeof alls));
