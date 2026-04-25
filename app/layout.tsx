import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UPLIFT — Get Seen. Get Paid.",
  description:
    "Rwanda's platform where creators get real views and earners get paid to watch. Powered by real people.",
  openGraph: {
    title: "UPLIFT",
    description: "Get your videos seen. Get paid to watch.",
    siteName: "UPLIFT",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
