import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export default function useFetchAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "appointments"));
      setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetch();
  }, []);

  return { appointments };
}
