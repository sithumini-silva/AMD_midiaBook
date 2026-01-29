import { Redirect } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: JSX.Element;
  role: "admin" | "doctor" | "patient";
}) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/login" />;
  if (user.role !== role) return <Redirect href="/" />;

  return children;
}
