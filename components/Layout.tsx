"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Shield, Heart } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary-100 rounded-xl group-hover:bg-primary-200 transition-colors">
                <Heart className="h-6 w-6 text-primary-600" />
              </div>
              <span className="text-xl font-semibold text-neutral-900">
                {t("common.appName")}
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Shield className="h-4 w-4" />
                <span>{t("common.confidential")}</span>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-neutral-100 border-t border-neutral-200 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">
                {t("layout.importantNotice")}
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {t("layout.importantNoticeText")}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">
                {t("layout.emergencyResources")}
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                {t("layout.emergencyText", { phone: "911" })}
              </p>
              <p className="text-sm text-neutral-700">
                {t("layout.crisisText", { lifeline: "988 Suicide & Crisis Lifeline" })}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">{t("layout.privacy")}</h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {t("layout.privacyText")}
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-neutral-300 text-center text-sm text-neutral-600">
            <p>{t("layout.copyright", { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

