import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export default function RootLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark">
        <Outlet />
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}
