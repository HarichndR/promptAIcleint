import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { OnboardingModal } from "@/components/auth/OnboardingModal";
import { ConditionalLayoutWrapper } from "@/components/ConditionalLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prompt AI - Discover & Share the Best AI Prompts",
  description: "A community-driven platform for finding, sharing, and copying high-quality AI prompts for ChatGPT, Midjourney, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ConditionalLayoutWrapper>
            <OnboardingModal />
            {children}
          </ConditionalLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
