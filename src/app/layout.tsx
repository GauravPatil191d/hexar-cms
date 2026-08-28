import type { Metadata } from "next";
import "./globals.css";
import { CMSProvider } from "@/context/CMSContext";
import { CMSShell } from "@/components/cms-shell";
import { LoginProvider } from "@/context/LoginContext";
import { RibbonProvider } from "@/context/RibbonContext";
import { AboutProvider } from "@/context/AboutContext";
import { MissionVisionProvider } from "@/context/MissionVisionContext";
import { BannerProvider } from "@/context/BannerContext";

export const metadata: Metadata = {
  title: "Hexar CMS",
  description: "Hexar Content Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-gray-100">
        <CMSProvider>
          <LoginProvider>
            <BannerProvider>
              <RibbonProvider>
                <AboutProvider>
                  <MissionVisionProvider>
                    <CMSShell>{children}</CMSShell>
                  </MissionVisionProvider>
                </AboutProvider>
              </RibbonProvider>
            </BannerProvider>
          </LoginProvider>
        </CMSProvider>
      </body>
    </html>
  );
}
