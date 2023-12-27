import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { Divider } from "../ui/divider";

export function SignInAction() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Sign In</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-center my-8 text-2xl">Sign In</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Link to={"/"}>
              <Button className="w-full" variant={"outline"}>
                Continue with doogle
              </Button>
            </Link>
          </div>

          <Divider>OR</Divider>

          <div>
            <Input
              id="email"
              name="email"
              type="text"
              placeholder="email"
              className="col-span-3"
            />
          </div>
          <div>
            <Input
              id="password"
              name="password"
              placeholder="password"
              type="password"
              className="col-span-3"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
