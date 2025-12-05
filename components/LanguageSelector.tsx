"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

const languageNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  uk: "Українська",
};

export default function LanguageSelector() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    setIsOpen(false);

    if (typeof window === 'undefined') return;

    // Get the actual browser pathname
    const currentPath = window.location.pathname;

    // Remove any existing locale prefix
    let cleanPath = currentPath;
    for (const loc of routing.locales) {
      const localePattern = new RegExp(`^/${loc}(/|$)`);
      if (localePattern.test(cleanPath)) {
        cleanPath = cleanPath.replace(`/${loc}`, '') || '/';
        break;
      }
    }

    // Ensure cleanPath starts with /
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }

    // If cleanPath is just '/', use empty string, otherwise keep it
    const pathWithoutLocale = cleanPath === '/' ? '' : cleanPath;

    // Construct new path with new locale
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    // Use window.location for a hard navigation to ensure clean URL replacement
    window.location.href = newPath;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4" />
        <span>{languageNames[locale]}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLanguageChange(loc as Locale)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 transition-colors flex items-center justify-between ${locale === loc ? "bg-primary-50 text-primary-700" : "text-neutral-700"
                }`}
            >
              <span>{languageNames[loc as Locale]}</span>
              {locale === loc && <Check className="h-4 w-4 text-primary-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

