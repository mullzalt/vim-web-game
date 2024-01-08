import { Spinner } from "@/components/loading";
import { useApiCallback } from "@/hooks/use-api";
import { UserData } from "@/stores/user-types";
import React, { useContext } from "react";
import { toast } from "sonner";
import { AxiosRequestConfig } from "axios";

interface AuthProviderProps {
  children?: React.ReactNode;
}
interface AuthProviderState {
  user: UserData | null;
  isFetching: boolean;
  signedIn: boolean;
  signOut: () => void;
  refetch: (args?: AxiosRequestConfig) => void;
}

const initialState: AuthProviderState = {
  user: null,
  isFetching: false,
  signedIn: false,
  signOut: () => null,
  refetch: () => null,
};

const AuthProviderContext = React.createContext(initialState);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<UserData | null>(null);
  const [isFetching, setIsFetching] = React.useState(true);
  const [signedIn, setSignedIn] = React.useState(false);
  const [getUser, api] = useApiCallback<UserData>("me", {
    withCredentials: true,
  });
  const { data } = api;

  const [signOut] = useApiCallback(
    "/auth/signout",
    { withCredentials: true },
    () => {
      setUser(null);
      toast("You've been signed out");
    },
  );

  React.useEffect(() => {
    getUser();
  }, []);

  React.useEffect(() => {
    if (!data) {
      setIsFetching(false);
      setSignedIn(false);
      return;
    }

    setIsFetching(false);
    setSignedIn(true);
    setUser(data);
  }, [data]);

  const value: AuthProviderState = React.useMemo(
    () => ({
      user,
      isFetching,
      signOut,
      signedIn,
      refetch: getUser,
    }),
    [user, isFetching, signOut, getUser],
  );

  return (
    <AuthProviderContext.Provider value={value}>
      {isFetching ? (
        <Spinner className="min-h-screen bg-background " />
      ) : (
        children
      )}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");

  return context;
};
