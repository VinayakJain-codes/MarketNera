import "./globals.css";
import siteMetadata from "@/config/metadata";

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
        <style>{`
          :root {
            --font-work-sans: 'Work Sans', sans-serif;
          }
        `}</style>
      </head>
      <body className="antialiased font-display">
        {children}
      </body>
    </html>
  );
}
