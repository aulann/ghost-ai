import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";
import { dark } from "@clerk/ui/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghost AI",
  description: "Collaborative system design workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      ui={ui}
      appearance={{
        theme: dark,
        variables: {
          colorBackground: "var(--bg-surface)",
          colorInput: "var(--bg-elevated)",
          colorInputForeground: "var(--text-primary)",
          colorForeground: "var(--text-primary)",
          colorMutedForeground: "var(--text-muted)",
          colorPrimary: "var(--accent-primary)",
          colorDanger: "var(--state-error)",
          colorBorder: "var(--border-default)",
          borderRadius: "0.625rem",
          fontFamily: "inherit",
          spacing: "1.125rem",
          fontSize: "0.9375rem",
        },
        elements: {
          cardBox: { width: "30rem" },
          badge: {
            backgroundColor: "var(--bg-subtle)",
            color: "var(--text-muted)",
            borderRadius: "0.375rem",
            padding: "0.125rem 0.5rem",
            fontSize: "0.6875rem",
            fontWeight: "500",
          },
        },
        userProfile: {
          elements: {
            cardBox: { width: "68rem", maxWidth: "92vw" },
            card: { flexDirection: "row" },
          },
        },
        captcha: { theme: "dark" },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
