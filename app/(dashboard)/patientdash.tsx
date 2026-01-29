import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput, Platform } from "react-native";
import { db } from "../../services/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";

type Doctor = { id: string; fullName: string; speciality: string };

const PatientDashboard = ({ patientName }: { patientName: string }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const docs: Doctor[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.role === "doctor") {
            docs.push({ id: doc.id, fullName: data.fullName, speciality: data.speciality });
          }
        });
        setDoctors(docs);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to load doctors.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async () => {
    if (!selectedDoctor || !date || !time) {
      Alert.alert("Missing Fields", "Please select doctor, date, and time.");
      return;
    }

    setSubmitting(true);
    try {
      const doctor = doctors.find((d) => d.id === selectedDoctor);
      await addDoc(collection(db, "appointments"), {
        patientName,
        doctorId: doctor?.id,
        doctorName: doctor?.fullName,
        date: date.toISOString().split("T")[0],
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "pending",
      });
      Alert.alert("Success", "Appointment created!");
      setSelectedDoctor("");
      setDate(null);
      setTime(null);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to create appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>Patient Dashboard</Text>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Doctors List</Text>
      {loading ? <ActivityIndicator /> :
        doctors.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            onPress={() => setSelectedDoctor(doc.id)}
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor: selectedDoctor === doc.id ? "#f97316" : "#ccc",
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Text>{doc.fullName} ({doc.speciality})</Text>
          </TouchableOpacity>
        ))
      }

      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>Book Appointment</Text>

      {/* Date Picker */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={{ padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 10 }}
      >
        <Text>{date ? date.toDateString() : "Select Date"}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={new Date()}
          onChange={(event, selected) => {
            setShowDatePicker(false);
            if (selected) setDate(selected);
          }}
        />
      )}

      {/* Time Picker */}
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        style={{ padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 20 }}
      >
        <Text>{time ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Select Time"}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time || new Date()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selected) => {
            setShowTimePicker(false);
            if (selected) setTime(selected);
          }}
        />
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        style={{ backgroundColor: "#f97316", padding: 15, borderRadius: 8, alignItems: "center" }}
      >
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "bold" }}>Book Appointment</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PatientDashboard;
