import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { db } from "../../services/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";

// Types
type Doctor = { id: string; fullName: string; speciality: string; };
type Appointment = { id: string; doctorName: string; speciality: string; date: string; time: string; status: string; };

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "02:00 PM",
  "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"
];

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
        Alert.alert("Error", "Unable to load doctors");
      } finally {
        setLoadingDoctors(false);
      }
    };
    loadDoctors();
  }, []);

  useEffect(() => {
    const loadAppointments = async () => {
      if (!patientName) return;
      setLoadingAppointments(true);
      try {
        const snap = await getDocs(query(collection(db, "appointments"), where("patientName", "==", patientName)));
        const list: Appointment[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          list.push({ id: doc.id, ...data } as Appointment);
        });
        setAppointments(list);
      } catch (err) {
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
    if (!selectedDoctor || !date || !time) return Alert.alert("Missing Fields", "Please select doctor, date, and time.");

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

      const newApp = {
        patientName,
        doctorId: doctor.id,
        doctorName: doctor.fullName,
        speciality: doctor.speciality,
        date: formatDate(date),
        time,
        status: "pending",
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "appointments"), newApp);
      Alert.alert("Success", "Appointment booked successfully!");
      setSelectedDoctor(""); setTime(null); setDate(new Date());
      setAppointments((prev) => [...prev, { id: docRef.id, ...newApp }]);
    } catch (err) {
      Alert.alert("Error", "Failed to book appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}>Welcome Back,</Text>
            <Text style={styles.headerTitle}>{patientName || "Patient"}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Booking Card */}
        <View style={styles.bookingCard}>
          <Text style={styles.sectionTitle}>Book an Appointment</Text>

          {/* Doctor Selection */}
          <Text style={styles.label}>Select Specialist</Text>
          <TouchableOpacity 
            onPress={() => setShowDoctors(!showDoctors)} 
            style={styles.dropdownTrigger}
          >
            <View style={styles.dropdownInner}>
              <Ionicons name="medical-outline" size={20} color="#5fa8d3" />
              <Text style={styles.dropdownText}>
                {selectedDoctor ? doctors.find(d => d.id === selectedDoctor)?.fullName : "Choose a Doctor"}
              </Text>
            </View>
            <Ionicons name={showDoctors ? "chevron-up" : "chevron-down"} size={20} color="#94a3b8" />
          </TouchableOpacity>

          {showDoctors && (
            <View style={styles.dropdownList}>
              {loadingDoctors ? <ActivityIndicator color="#5fa8d3" /> : doctors.map(d => (
                <TouchableOpacity 
                  key={d.id} 
                  onPress={() => { setSelectedDoctor(d.id); setShowDoctors(false); }}
                  style={[styles.listItem, selectedDoctor === d.id && styles.listItemSelected]}
                >
                  <Text style={[styles.listItemText, selectedDoctor === d.id && styles.listItemTextSelected]}>{d.fullName}</Text>
                  <Text style={styles.listItemSubText}>{d.speciality}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Date Picker Section - Functionality Unchanged */}
          <Text style={styles.label}>Appointment Date</Text>
          {Platform.OS === "web" ? (
            <input
              type="date"
              value={formatDate(date)}
              onChange={e => setDate(new Date(e.target.value))}
              style={styles.webDateInput}
            />
          ) : (
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dropdownTrigger}>
              <View style={styles.dropdownInner}>
                <Ionicons name="calendar-outline" size={20} color="#5fa8d3" />
                <Text style={styles.dropdownText}>{date.toDateString()}</Text>
              </View>
            </TouchableOpacity>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              minimumDate={new Date()}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
            />
          )}

          {/* Time Selection */}
          <Text style={styles.label}>Select Time Slot</Text>
          <TouchableOpacity onPress={() => setShowTimeSlots(!showTimeSlots)} style={styles.dropdownTrigger}>
            <View style={styles.dropdownInner}>
              <Ionicons name="time-outline" size={20} color="#5fa8d3" />
              <Text style={styles.dropdownText}>{time ?? "Pick a Time"}</Text>
            </View>
            <Ionicons name={showTimeSlots ? "chevron-up" : "chevron-down"} size={20} color="#94a3b8" />
          </TouchableOpacity>

          {showTimeSlots && (
            <View style={styles.timeGrid}>
              {TIME_SLOTS.map(slot => (
                <TouchableOpacity 
                  key={slot} 
                  onPress={() => { setTime(slot); setShowTimeSlots(false); }}
                  style={[styles.timeSlot, time === slot && styles.timeSlotActive]}
                >
                  <Text style={[styles.timeSlotText, time === slot && styles.timeSlotTextActive]}>{slot}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity onPress={handleSubmit} disabled={submitting}>
            <LinearGradient colors={['#5fa8d3', '#89d4cf']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.bookBtn}>
              {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.bookBtnText}>Confirm Booking</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Appointments List */}
        <Text style={styles.mainSectionTitle}>My Appointments</Text>
        {loadingAppointments ? <ActivityIndicator color="#5fa8d3" /> : (
          appointments.map((a) => (
            <View key={a.id} style={styles.appointmentCard}>
              <View style={styles.appDateIcon}>
                 <Text style={styles.appDay}>{a.date.split('-')[2]}</Text>
                 <Text style={styles.appMonth}>{new Date(a.date).toLocaleString('default', { month: 'short' })}</Text>
              </View>
              <View style={styles.appInfo}>
                <Text style={styles.appDoctor}>Dr. {a.doctorName}</Text>
                <Text style={styles.appSpec}>{a.speciality} • {a.time}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: a.status === 'pending' ? '#fef3c7' : '#dcfce7' }]}>
                <Text style={[styles.statusText, { color: a.status === 'pending' ? '#d97706' : '#16a34a' }]}>{a.status}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#1e293b" },
  headerSubtitle: { fontSize: 14, color: "#64748b" },
  logoutBtn: { backgroundColor: "#fee2e2", padding: 10, borderRadius: 12 },
  bookingCard: { backgroundColor: "#fff", borderRadius: 24, padding: 20, elevation: 4, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 15, marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#334155", marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "600", color: "#94a3b8", marginBottom: 8, marginTop: 15, marginLeft: 2 },
  dropdownTrigger: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f1f5f9", padding: 14, borderRadius: 15 },
  dropdownInner: { flexDirection: "row", alignItems: "center" },
  dropdownText: { marginLeft: 10, fontSize: 15, color: "#334155", fontWeight: "500" },
  dropdownList: { backgroundColor: "#f8fafc", borderRadius: 15, marginTop: 5, padding: 5, maxHeight: 200, borderWidth: 1, borderColor: "#e2e8f0" },
  listItem: { padding: 12, borderRadius: 10, marginBottom: 2 },
  listItemSelected: { backgroundColor: "#5fa8d3" },
  listItemText: { fontSize: 15, fontWeight: "600", color: "#1e293b" },
  listItemTextSelected: { color: "#fff" },
  listItemSubText: { fontSize: 12, color: "#64748b" },
  webDateInput: { marginTop: 5, padding: 12, borderWidth: 0, borderRadius: 15, backgroundColor: "#f1f5f9", width: "100%", fontSize: 15, color: "#334155" },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10, backgroundColor: "#f8fafc", padding: 10, borderRadius: 15 },
  timeSlot: { backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, width: '31%', alignItems: 'center', borderWidth: 1, borderColor: "#e2e8f0" },
  timeSlotActive: { backgroundColor: "#5fa8d3", borderColor: "#5fa8d3" },
  timeSlotText: { fontSize: 11, fontWeight: "600", color: "#64748b" },
  timeSlotTextActive: { color: "#fff" },
  bookBtn: { paddingVertical: 16, borderRadius: 15, alignItems: "center", marginTop: 25 },
  bookBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  mainSectionTitle: { fontSize: 20, fontWeight: "800", color: "#1e293b", marginBottom: 15 },
  appointmentCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 15, borderRadius: 20, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.03 },
  appDateIcon: { backgroundColor: "#e0f2fe", padding: 10, borderRadius: 15, alignItems: "center", minWidth: 55 },
  appDay: { fontSize: 18, fontWeight: "800", color: "#0369a1" },
  appMonth: { fontSize: 10, fontWeight: "700", color: "#0369a1", textTransform: 'uppercase' },
  appInfo: { flex: 1, marginLeft: 15 },
  appDoctor: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
  appSpec: { fontSize: 13, color: "#64748b", marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "700", textTransform: 'capitalize' },
});

export default PatientDashboard;