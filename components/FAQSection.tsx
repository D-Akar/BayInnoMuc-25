"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { getFAQsByLocale, getCategoriesByLocale, searchFAQsByLocale, type FAQItem } from "@/lib/backend/faqServiceMultilingual";

export default function FAQSection() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'uk';
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState<FAQItem[]>(getFAQsByLocale(locale));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = getCategoriesByLocale(locale);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchFAQsByLocale(searchQuery, locale);
      setFilteredFAQs(filtered);
    } else if (selectedCategory) {
      const filtered = getFAQsByLocale(locale).filter((faq) => faq.category === selectedCategory);
      setFilteredFAQs(filtered);
    } else {
      setFilteredFAQs(getFAQsByLocale(locale));
    }
  }, [searchQuery, selectedCategory, locale]);

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
      setSearchQuery("");
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            {t("faq.title")}
          </h2>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <Input
            type="text"
            placeholder={t("faq.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              aria-label={t("faq.clearSearch")}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        {filteredFAQs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left">
                  <div>
                    <div className="font-semibold text-neutral-900 mb-1">
                      {faq.question}
                    </div>
                    <div className="text-xs text-primary-600 font-medium">
                      {faq.category}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-600 text-lg">
              {t("faq.noResults")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

