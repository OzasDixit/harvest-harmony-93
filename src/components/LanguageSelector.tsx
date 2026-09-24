import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { LANGUAGES } from "../lib/i18n";

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangCode = i18n.language?.slice(0, 2) || "en";
  const currentLang = LANGUAGES.find((l) => l.code === currentLangCode) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-md bg-panel px-3 py-1.5 text-xs text-ink ring-1 ring-line hover:bg-panel2 transition-colors"
        aria-label="Select language"
      >
        <Globe className="size-3.5 text-leaf" />
        <span className="font-medium">{currentLang.nativeName}</span>
        <span className="text-[10px] text-faint">({currentLang.code.toUpperCase()})</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-56 rounded-md bg-panel p-1.5 shadow-xl ring-1 ring-line animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-faint border-b border-line mb-1">
            Select Language / భాష / भाषा
          </div>
          <div className="max-h-72 overflow-y-auto space-y-0.5">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLangCode;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs transition-colors ${
                    isSelected
                      ? "bg-leaf/15 text-leaf font-medium"
                      : "text-ink hover:bg-panel2"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] text-faint">({lang.name})</span>
                  </div>
                  {isSelected && <Check className="size-3.5 text-leaf" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
