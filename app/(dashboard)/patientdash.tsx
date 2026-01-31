import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router"; // Expo Router for navigation

type Doctor = {
  id: string;
  fullName: string;
  speciality: string;
};

type Appointment = {
  id: string;
  doctorName: string;
  speciality: string;
  date: string;
  time: string;
  status: string;
};

const TIME_SLOTS = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM","02:00 PM",
  "02:30 PM","03:00 PM","03:30 PM","04:00 PM"
];

// Helper to format date for Firestore YYYY-MM-DD
const formatDate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const PatientDashboard = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const patientName = user?.fullName;

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [showDoctors, setShowDoctors] = useState(false);

  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [time, setTime] = useState<string | null>(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load doctors from Firestore
  useEffect(() => {
    const loadDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const snap = await getDocs(collection(db, "users"));
        const list: Doctor[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          if (data.role === "doctor") {
            list.push({ id: doc.id, fullName: data.fullName, speciality: data.speciality });
          }
        });
        setDoctors(list);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Unable to load doctors");
      } finally {
        setLoadingDoctors(false);
      }
    };
    loadDoctors();
  }, []);

  // Load patient's appointments
  useEffect(() => {
    const loadAppointments = async () => {
      if (!patientName) return;
      setLoadingAppointments(true);
      try {
        const snap = await getDocs(
          query(
            collection(db, "appointments"),
            where("patientName", "==", patientName)
          )
        );
        const list: Appointment[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id, // use Firestore doc.id
            doctorName: data.doctorName,
            speciality: data.speciality,
            date: data.date,
            time: data.time,
            status: data.status
          });
        });
        setAppointments(list);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Unable to load appointments");
      } finally {
        setLoadingAppointments(false);
      }
    };
    loadAppointments();
  }, [patientName]);

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(false);
    if (event.type === "set" && selected) {
      setDate(selected);
    }
  };

  const handleSubmit = async () => {
    if (!patientName) return Alert.alert("Error", "Patient name missing!");
    if (!selectedDoctor || !date || !time) return Alert.alert("Missing", "Select doctor, date, and time");

    const doctor = doctors.find(d => d.id === selectedDoctor);
    if (!doctor) return Alert.alert("Error", "Doctor not found");

    setSubmitting(true);

    try {
      const appointmentQuery = query(
        collection(db, "appointments"),
        where("doctorId", "==", selectedDoctor),
        where("date", "==", formatDate(date)),
        where("time", "==", time)
      );
      const snap = await getDocs(appointmentQuery);
      if (!snap.empty) {
        Alert.alert("Unavailable", "This time slot is already booked.");
        setSubmitting(false);
        return;
      }

      const newAppointment = {
        patientName,
        doctorId: doctor.id,
        doctorName: doctor.fullName,
        speciality: doctor.speciality,
        date: formatDate(date),
        time,
        status: "pending",
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "appointments"), newAppointment);
      Alert.alert("Success", "Appointment booked successfully!");
      setSelectedDoctor("");
      setTime(null);
      setDate(new Date());

      // Refresh appointments list using actual doc.id
      setAppointments((prev) => [...prev, { id: docRef.id, ...newAppointment }]);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to book appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login"); // redirect to login page
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold" }}>Patient Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={{ padding: 10, backgroundColor: "#f97316", borderRadius: 8 }}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Doctor selection */}
      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Select Doctor</Text>
      <TouchableOpacity
        onPress={() => setShowDoctors(!showDoctors)}
        style={{
          marginTop: 10,
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Text>{selectedDoctor ? doctors.find(d => d.id === selectedDoctor)?.fullName : "Select Doctor"}</Text>
        <Text>{showDoctors ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {showDoctors && (
        <View style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, backgroundColor: "#fff", marginTop: 5, maxHeight: 200 }}>
          {loadingDoctors ? <ActivityIndicator style={{ margin: 10 }} /> : (
            <ScrollView>
              {doctors.map(d => (
                <TouchableOpacity
                  key={d.id}
                  onPress={() => { setSelectedDoctor(d.id); setShowDoctors(false); }}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderColor: "#eee",
                    backgroundColor: selectedDoctor === d.id ? "#f97316" : "#fff",
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: selectedDoctor === d.id ? "#fff" : "#000" }}>{d.fullName}</Text>
                  <Text style={{ color: selectedDoctor === d.id ? "#fff" : "#555" }}>{d.speciality}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Date selection */}
      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Select Date</Text>
      {Platform.OS === "web" ? (
        <input
          type="date"
          value={formatDate(date)}
          onChange={e => setDate(new Date(e.target.value))}
          style={{ marginTop: 10, padding: 12, borderWidth: 1, borderRadius: 8, borderColor: "#ccc", width: "100%" }}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{ marginTop: 10, padding: 12, borderWidth: 1, borderRadius: 8, backgroundColor: "#fff" }}
          >
            <Text>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              minimumDate={new Date()}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
            />
          )}
        </>
      )}

      {/* Time selection */}
      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Select Time</Text>
      <TouchableOpacity
        onPress={() => setShowTimeSlots(!showTimeSlots)}
        style={{ marginTop: 10, padding: 12, borderWidth: 1, borderRadius: 8, backgroundColor: "#fff" }}
      >
        <Text>{time ?? "Select Time"}</Text>
      </TouchableOpacity>
      {showTimeSlots && (
        <View style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, backgroundColor: "#fff", marginTop: 5, maxHeight: 150 }}>
          <ScrollView>
            {TIME_SLOTS.map(slot => (
              <TouchableOpacity
                key={slot}
                onPress={() => { setTime(slot); setShowTimeSlots(false); }}
                style={{ padding: 10, backgroundColor: time === slot ? "#f97316" : "#fff" }}
              >
                <Text style={{ color: time === slot ? "#fff" : "#000", fontWeight: "600" }}>{slot}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        style={{ backgroundColor: "#f97316", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 }}
      >
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "bold" }}>Book Appointment</Text>}
      </TouchableOpacity>

      {/* Appointments List */}
      <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 30 }}>Your Appointments</Text>
      {loadingAppointments ? <ActivityIndicator style={{ marginTop: 10 }} /> : (
        appointments.map((a) => (
          <View key={a.id} style={{ padding: 15, marginTop: 10, borderWidth: 1, borderRadius: 10, borderColor: "#ccc", backgroundColor: "#fff" }}>
            <Text style={{ fontWeight: "bold" }}>{a.doctorName} ({a.speciality})</Text>
            <Text>Date: {a.date}</Text>
            <Text>Time: {a.time}</Text>
            <Text>Status: {a.status}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default PatientDashboard;
