import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Heart } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
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
                HIV Care Assistance
              </span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Shield className="h-4 w-4" />
              <span>Confidential & Private</span>
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
                Important Notice
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                This is an informational tool, not a replacement for medical
                advice. Always consult with qualified healthcare professionals
                for medical decisions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">
                Emergency Resources
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                In an emergency, call{" "}
                <a
                  href="tel:911"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  911
                </a>{" "}
                or go to the nearest hospital.
              </p>
              <p className="text-sm text-neutral-700">
                For crisis support, call the{" "}
                <a
                  href="tel:988"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  988 Suicide & Crisis Lifeline
                </a>
                .
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Privacy</h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Your conversations are private and confidential. We are
                committed to protecting your privacy and personal information.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-neutral-300 text-center text-sm text-neutral-600">
            <p>© {new Date().getFullYear()} HIV Care Assistance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

