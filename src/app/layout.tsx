import localFont from "next/font/local";
import "./globals.css";
import siteMetadata from "@/config/metadata";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const workSans = localFont({
  src: "../fonts/WorkSans.woff2",
  variable: "--font-work-sans",
});

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${workSans.variable} antialiased font-display`}>
        {children}
      </body>
    </html>
  );
}
