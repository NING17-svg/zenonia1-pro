import type { Metadata } from "next";
import { site } from "@/data/site";
import { Analytics } from "@/lib/analytics";
import { getPrimaryLocaleConfig } from "@/lib/localization";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: {
    canonical: site.baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={getPrimaryLocaleConfig().htmlLang}>
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-4194035852162505"
        />
        {site.bingSiteAuthCode ? (
          <meta name="msvalidate.01" content={site.bingSiteAuthCode} />
        ) : null}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4194035852162505"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
