import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodRescueIL - חסכו אוכל, חסכו כסף",
  description:
    "גלו מזון עודף ממסעדות וחנויות במחירים מוזלים. הצילו אוכל, חסכו כסף, ועזרו לסביבה.",
  keywords: ["food rescue", "surplus food", "discount food", "Israel", "Tel Aviv"],
  authors: [{ name: "FoodRescueIL" }],
  openGraph: {
    title: "FoodRescueIL - חסכו אוכל, חסכו כסף",
    description: "גלו מזון עודף ממסעדות וחנויות במחירים מוזלים",
    type: "website",
    locale: "he_IL",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#009de0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="he" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
