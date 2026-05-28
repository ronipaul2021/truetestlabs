import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrueTestLabs Portal",
  description: "Diagnostic Center Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
