"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mic, Shield } from "lucide-react";

export default function ChatOptions() {
  const t = useTranslations();

  return (
    <section className="py-16 bg-gradient-to-b from-neutral-50 to-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            {t("chatOptions.title")}
          </h2>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto mb-6">
            {t("chatOptions.subtitle")}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
            <Shield className="h-4 w-4" />
            <span>{t("common.confidentialText")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Chat Option */}
          <Link href="/chat/text" className="block">
            <div className="bg-white rounded-2xl p-8 border-2 border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all h-full flex flex-col">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-6">
                <MessageSquare className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                {t("chatOptions.textChat.title")}
              </h3>
              <p className="text-neutral-700 leading-relaxed mb-6 flex-grow">
                {t("chatOptions.textChat.description")}
              </p>
              <Button size="lg" className="w-full">
                {t("chatOptions.textChat.button")}
              </Button>
            </div>
          </Link>

          {/* Voice Chat Option */}
          <Link href="/chat/voice" className="block">
            <div className="bg-white rounded-2xl p-8 border-2 border-neutral-200 hover:border-secondary-300 hover:shadow-lg transition-all h-full flex flex-col">
              <div className="flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-xl mb-6">
                <Mic className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                {t("chatOptions.voiceChat.title")}
              </h3>
              <p className="text-neutral-700 leading-relaxed mb-6 flex-grow">
                {t("chatOptions.voiceChat.description")}
              </p>
              <Button size="lg" variant="secondary" className="w-full">
                {t("chatOptions.voiceChat.button")}
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

