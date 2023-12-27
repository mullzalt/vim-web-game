import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Divider } from "../ui/divider";
import { useStore } from "@/stores";
import { LoginInput, loginSchema } from "@/schema/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getGoogleUrl } from "@/utils/get-google-url";
import { error } from "console";

export function SignInAction() {
  const { pathname: from } = useLocation();
  const store = useStore();

  async function loginUser(data: LoginInput) {
    store.setLoading(true);
    const VITE_SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;
    await fetch(`${VITE_SERVER_ENDPOINT}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) throw await res.json();
        store.setLoading(false);
      })
      .catch((err) => {
        store.setLoading(false);
        console.log(err);
      });
  }

  const {
    reset,
    handleSubmit,
    register,
    formState: { isSubmitSuccessful, errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    loginUser(values);
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Sign In</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-center my-8 text-2xl">Sign In</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="grid gap-4 py-4">
            <div>
              <Link to={getGoogleUrl(from)} role="button">
                <Button role="button" className="w-full" variant={"outline"}>
                  Continue with doogle
                </Button>
              </Link>
            </div>

            <div>
              <a
                className="px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center mb-3"
                style={{ backgroundColor: "#3b5998" }}
                href={getGoogleUrl(from)}
                role="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
              >
                doogle
              </a>
            </div>

            <Divider>OR</Divider>

            <div>
              <Input
                type="email"
                placeholder="Email"
                className="col-span-3"
                {...register("email")}
              />
              {errors.email && <span>error</span>}
            </div>
            <div>
              <Input
                placeholder="password"
                type="password"
                className="col-span-3"
                {...register("password")}
              />
              {errors.password && <span>error</span>}
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
