import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LandingPage() {
  return (
    <div>
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
    </div>
  );
}
