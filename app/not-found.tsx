import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Layout from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-neutral-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-neutral-600 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. We're
            here to help you find what you need.
          </p>
          <Link href="/">
            <Button size="lg">
              <Home className="h-5 w-5 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

