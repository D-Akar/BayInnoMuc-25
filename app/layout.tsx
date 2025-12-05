import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HIV Care Assistance - Confidential Support",
  description:
    "Compassionate, accessible HIV care assistance. Confidential, judgment-free support for testing, treatment, and living with HIV.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

