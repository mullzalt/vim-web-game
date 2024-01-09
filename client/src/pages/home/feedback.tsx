import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function FeedbackPage() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[85vh]">
      <div className="font-bold text-4xl tracking-tight">
        Please consider leaving a feedback.
      </div>
      <Link
        to={import.meta.env.VITE_FEEDBACK_URL}
        target="_blank"
        className={cn(buttonVariants({ variant: "link" }), "text-lg")}
      >
        Leave a feedback <ArrowRightIcon />
      </Link>
    </div>
  );
}
