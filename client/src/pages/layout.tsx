import { SignInAction } from "@/components/auth/sign-in";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { useStore } from "@/stores";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  const { user } = useStore();
  return (
    <ThemeProvider defaultTheme="dark">
      <nav className="w-full h-14 flex items-center px-4 justify-between">
        <div className="grow">vi-word.</div>
        <div className="flex gap-2 items-center">
          {!user && <SignInAction />}
          <span>avatar</span>
        </div>
      </nav>
      <main className="min-h-screen flex flex-col relative bg-background">
        <Outlet />
      </main>
      <Toaster />
    </ThemeProvider>
  );
}
