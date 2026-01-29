import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) router.replace("/login");
    else if (user.role === "admin") router.replace("/admindash");
    else if (user.role === "doctor") router.replace("/doctordash");
    else router.replace("/patientdash");
  }, [loading, user]);

  if (loading) return <Loader />;

  return null;
}
