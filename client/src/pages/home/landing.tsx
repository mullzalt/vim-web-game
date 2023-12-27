import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

export default function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="h-[150vh]">
      <Button
        onClick={() =>
          toast("Test", {
            description: "action has been made",
            action: {
              label: "oke",
              onClick: () => console.log("oke"),
            },
            cancel: {
              label: "cancel",
              onClick: () => console.log("cancel"),
            },
          })
        }
      >
        Test toast
      </Button>
      {user && user.name}
    </div>
  );
}
