import { useAuth } from "@/providers/auth-provider";
import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";

export function RequiredUser() {
  const { user, isFetching } = useAuth();

  if (!isFetching && !user) {
    return <Navigate to="/" replace />;
  }
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
}

export function RequiredAdmin() {
  const { user, isFetching } = useAuth();

  if (!isFetching && !user) {
    return <Navigate to="/" replace />;
  }
  if (user && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
}
