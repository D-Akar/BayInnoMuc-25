import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

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
    <html suppressHydrationWarning className={roboto.variable}>
      <body>{children}</body>
    </html>
  );
}

