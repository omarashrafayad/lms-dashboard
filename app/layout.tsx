
import "./globals.css";
import Providers from "./providers";
import AuthInitializer from "@/features/auth/components/AuthInitializer";
import { getProfile } from "@/features/auth/api/auth";
import { Toaster } from "@/components/ui/sonner";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: "LMS",
  description: "lms",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, token } = await getProfile();

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased bg-background text-foreground">
        <Providers>
          <AuthInitializer user={user} token={token} />
          <Toaster />
        <main className="min-h-screen">
            {children}
        </main>
        </Providers>
      </body>
    </html>
  );
}