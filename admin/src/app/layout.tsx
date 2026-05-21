import type { Metadata } from "next";
import { Inter, Roboto, Lato } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ 
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto"
});
const lato = Lato({ 
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato"
});

export const metadata: Metadata = {
  title: "TrueTestLabs Admin",
  description: "Healthcare Diagnostic Aggregator Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${roboto.variable} ${lato.variable} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
