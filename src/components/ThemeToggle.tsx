import { Sun, Moon } from "lucide-react";
import { useTheme } from "../lib/theme";
import { useTranslation } from "react-i18next";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark and light mode"
      title={theme === "dark" ? t("header.lightMode", "Switch to Light Mode") : t("header.darkMode", "Switch to Dark Mode")}
      className="flex items-center gap-1.5 rounded-md bg-panel px-2.5 py-1.5 text-xs text-ink ring-1 ring-line hover:bg-panel2 transition-colors shrink-0"
    >
      {theme === "dark" ? (
        <>
          <Sun className="size-3.5 text-gold animate-spin-once" />
          <span className="hidden md:inline font-medium text-[11px]">{t("header.lightMode", "Light")}</span>
        </>
      ) : (
        <>
          <Moon className="size-3.5 text-aqua animate-spin-once" />
          <span className="hidden md:inline font-medium text-[11px]">{t("header.darkMode", "Dark")}</span>
        </>
      )}
    </button>
  );
}
