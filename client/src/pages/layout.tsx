import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark">
        <main className="min-h-screen flex flex-col relative bg-background">
          <Navbar />
          <Outlet />
        </main>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}
