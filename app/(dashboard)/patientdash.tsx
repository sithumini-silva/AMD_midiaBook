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
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useAuth } from "../../context/AuthContext";

type Doctor = {
  id: string;
  fullName: string;
  speciality: string;
};

const TIME_SLOTS = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM","02:00 PM",
  "02:30 PM","03:00 PM","03:30 PM","04:00 PM"
];

const PatientDashboard = () => {
  const { user } = useAuth();
  const patientName = user?.fullName; // ✅ must exist

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [showDoctors, setShowDoctors] = useState(false);

  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [time, setTime] = useState<string | null>(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(false);
    if (event.type === "set" && selected) {
      setDate(selected);
    }
  };

  const handleSubmit = async () => {
    if (!patientName) {
      Alert.alert("Error", "Patient name missing! Check registration.");
      return;
    }

    if (!selectedDoctor || !date || !time) {
      Alert.alert("Missing", "Please select doctor, date, and time.");
      return;
    }

    const doctor = doctors.find(d => d.id === selectedDoctor);
    if (!doctor) {
      Alert.alert("Error", "Selected doctor not found.");
      return;
    }

    setSubmitting(true);

    try {
      // Check slot availability
      const appointmentQuery = query(
        collection(db, "appointments"),
        where("doctorId", "==", selectedDoctor),
        where("date", "==", date.toISOString().split("T")[0]),
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
        date: date.toISOString().split("T")[0],
        time,
        status: "pending",
        createdAt: new Date(),
      };

      console.log("Adding appointment:", newAppointment);

      await addDoc(collection(db, "appointments"), newAppointment);
      Alert.alert("Success", "Appointment booked successfully!");

      setSelectedDoctor("");
      setTime(null);
      setDate(new Date());
    } catch (err) {
      console.error("Error adding appointment:", err);
      Alert.alert("Error", "Failed to book appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>Patient Dashboard</Text>

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
              {doctors.map(doc => (
                <TouchableOpacity
                  key={doc.id}
                  onPress={() => { setSelectedDoctor(doc.id); setShowDoctors(false); }}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderColor: "#eee",
                    backgroundColor: selectedDoctor === doc.id ? "#f97316" : "#fff"
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: selectedDoctor === doc.id ? "#fff" : "#000" }}>
                    {doc.fullName}
                  </Text>
                  <Text style={{ color: selectedDoctor === doc.id ? "#fff" : "#555" }}>
                    {doc.speciality}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Date selection */}
      <Text style={{ marginTop: 25, fontWeight: "bold" }}>Select Date</Text>
      {Platform.OS === "web" ? (
        <input
          type="date"
          value={date.toISOString().split("T")[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
          style={{ marginTop: 10, padding: 12, borderWidth: 1, borderRadius: 8, borderColor: "#ccc", width: "100%" }}
        />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ marginTop: 10, padding: 12, borderWidth: 1, borderRadius: 8, backgroundColor: "#fff" }}>
            <Text>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && <DateTimePicker value={date} mode="date" minimumDate={new Date()} display={Platform.OS === "ios" ? "spinner" : "default"} onChange={onDateChange} />}
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
                style={{ paddingVertical: 10, paddingHorizontal: 12, backgroundColor: time === slot ? "#f97316" : "#fff" }}
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
        style={{ backgroundColor: "#f97316", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 30 }}
      >
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "bold" }}>Book Appointment</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PatientDashboard;
