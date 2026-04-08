import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "BatchChef — Ton Coach Batch Cooking",
  description:
    "20 recettes validées par un chef chaque semaine. Moins de 3€ par repas. Ton planning organisé par l'IA. Un coach qui te guide étape par étape.",
  openGraph: {
    title: "BatchChef — Ton Coach Batch Cooking",
    description:
      "Cuisiner une fois le weekend, manger bien toute la semaine. 9€/mois.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ed7a0e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
