import { useApi, useApiCallback } from "@/hooks/use-api";
import { UserData } from "@/stores/user-types";
import React, { useContext } from "react";
import { toast } from "sonner";

interface AuthProviderProps {
  children?: React.ReactNode;
}
interface AuthProviderState {
  user: UserData | null;
  isFetching: boolean;
  signOut: () => void;
}

const initialState: AuthProviderState = {
  user: null,
  isFetching: false,
  signOut: () => null,
};

const AuthProviderContext = React.createContext(initialState);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<UserData | null>(null);
  const { data, isLoading } = useApi<UserData>("/users/me", {
    withCredentials: true,
  });

  const [signOut, { isLoading: isFetching }] = useApiCallback(
    "/auth/logout",
    { withCredentials: true },
    () => {
      setUser(null);
      toast("You've been signed out");
    },
  );

  React.useEffect(() => {
    if (!data) return;

    setUser(data);
    toast(`Successfully signed in as ${data.email}`);
  }, [data]);

  const value: AuthProviderState = React.useMemo(
    () => ({
      user,
      isFetching: isLoading || isFetching,
      signOut,
    }),
    [user, isLoading, isFetching, signOut],
  );

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");

  return context;
};
