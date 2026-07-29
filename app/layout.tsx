import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const title = "Workin — Four-week pull-up training block";
const description =
  "A calm, phone-first workout companion with daily training, progress tracking, notes, and a circular rest timer.";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL("https://moehussein.github.io/"),
  title,
  description,
  icons: {
    icon: [{ url: `${basePath}/favicon.svg`, type: "image/svg+xml", sizes: "any" }],
    shortcut: `${basePath}/favicon.svg`,
  },
  openGraph: {
    title,
    description,
    type: "website",
    images: [
      {
        url: `${basePath}/og.png`,
        width: 1734,
        height: 907,
        alt: "Workin pull-up training block",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${basePath}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.variable}>{children}</body>
    </html>
  );
}
