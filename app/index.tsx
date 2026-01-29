import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext"; // <--- corrected path
import Loader from "../components/Loader";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) router.replace("/(auth)/login");
    else if (user.role === "admin") router.replace("/(dashboard)/admindash");
    else if (user.role === "doctor") router.replace("/(dashboard)/doctordash");
    else router.replace("/(dashboard)/patientdash");
  }, [user, loading]);

  if (loading) return <Loader />;
  return null;
}
