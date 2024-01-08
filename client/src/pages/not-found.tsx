import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound({
  message = "The page you requested does not exist",
}: {
  message?: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex items-center flex-col justify-center">
      <div className="text-8xl font-black font-mono text-accent">404</div>
      <div className="text-muted italic text-xl">{message}</div>
      <Button className="gap-2" variant={"link"} onClick={() => navigate(-1)}>
        <ArrowLeftIcon /> Go back
      </Button>
    </div>
  );
}
