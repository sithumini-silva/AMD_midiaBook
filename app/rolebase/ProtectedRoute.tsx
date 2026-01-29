import { JSX } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Redirect } from "expo-router";
import Loader from "../../components/Loader";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: JSX.Element;
  role: "admin" | "doctor" | "patient";
}) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Redirect href="/login" />;
  if (user.role !== role) return <Redirect href="/" />;

  return children;
}
