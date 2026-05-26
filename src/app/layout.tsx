import "./globals.css";
import siteMetadata from "@/config/metadata";
import { Toaster } from "react-hot-toast";
import { Work_Sans } from "next/font/google";
import PWARegister from "@/components/PWARegister";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-work-sans",
});

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`light ${workSans.variable}`}>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`antialiased font-display ${workSans.className}`}>
        <PWARegister />
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
