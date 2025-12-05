"use client";

import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { faqData, type FAQItem, faqCategories } from "@/lib/backend/faqService";

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState<FAQItem[]>(faqData);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      // Simple client-side search
      const query = searchQuery.toLowerCase();
      const filtered = faqData.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query) ||
          faq.tags.some((tag) => tag.toLowerCase().includes(query))
      );
      setFilteredFAQs(filtered);
    } else if (selectedCategory) {
      setFilteredFAQs(faqData.filter((faq) => faq.category === selectedCategory));
    } else {
      setFilteredFAQs(faqData);
    }
  }, [searchQuery, selectedCategory]);

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
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
            Find answers to common questions about HIV testing, treatment,
            prevention, and living with HIV.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {faqCategories.map((category) => (
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
              No FAQs found matching your search. Try different keywords or
              browse by category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

