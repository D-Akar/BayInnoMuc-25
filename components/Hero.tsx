import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
            We're here to support you
          </h1>
          <p className="text-xl md:text-2xl text-neutral-700 mb-8 leading-relaxed max-w-2xl mx-auto">
            Confidential, judgment-free assistance for HIV testing, treatment,
            prevention, and living well with HIV. You're not alone in this
            journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#faq">
              <Button size="lg" variant="default">
                Browse FAQs
              </Button>
            </Link>
            <Link href="#chat-options">
              <Button size="lg" variant="outline">
                Get Support
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <a
            href="#faq"
            className="flex flex-col items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            aria-label="Scroll to FAQs"
          >
            <span className="text-sm">Learn more</span>
            <ArrowDown className="h-6 w-6 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}

