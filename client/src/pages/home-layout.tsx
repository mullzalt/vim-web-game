import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";

export function HomeLayout() {
  const [mobileOpen, setMobileOpen] = useState(true);
  const handleToggleMobileOpen = useCallback(
    () => setMobileOpen((prev) => !prev),
    [],
  );
  return (
    <main className="min-h-screen flex flex-col relative bg-background">
      <Navbar
        action={
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={handleToggleMobileOpen}
            className="mr-2 font-normal"
          >
            {mobileOpen ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
          </Button>
        }
      />
      <div className="flex relative w-full ">
        <Sidebar
          mobileOpen={mobileOpen}
          className="top-16 border-r border-border"
        />
        <section
          className={cn(
            "flex flex-col relative w-full h-full",
            mobileOpen && "ml-16",
          )}
        >
          <Outlet />
        </section>
      </div>
      <Footer />
    </main>
  );
}
