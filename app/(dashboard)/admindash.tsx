import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { db, auth } from "../../services/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";

type Doctor = {
  id: string;
  fullName: string;
  speciality: string;
  age: number;
  email: string;
  role: string;
};

const AdminDash = () => {
  const { logout } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adding, setAdding] = useState(false);

  // Fetch doctors from Firestore
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const docs: Doctor[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.role === "doctor") {
          docs.push({ id: doc.id, ...data } as Doctor);
        }
      });
      setDoctors(docs);
    } catch (err) {
      Alert.alert("Error", "Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Add doctor to Firebase Auth and Firestore
  const handleAddDoctor = async () => {
    if (!fullName || !speciality || !age || !email || !password) {
      Alert.alert("Missing Fields", "Please fill all doctor details.");
      return;
    }

    setAdding(true);
    try {
      // Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Add doctor to Firestore
      await addDoc(collection(db, "users"), {
        fullName,
        speciality,
        age: Number(age),
        email,
        role: "doctor",
        uid: userCred.user.uid,
      });

      Alert.alert("Success", "Doctor added successfully!");
      // Reset form
      setFullName(""); setSpeciality(""); setAge(""); setEmail(""); setPassword("");
      fetchDoctors();
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        Alert.alert("Error", "This email is already registered.");
      } else {
        Alert.alert("Error", err.message || "Failed to add doctor.");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}>Welcome,</Text>
            <Text style={styles.headerTitle}>Administrator</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Add Doctor Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add New Doctor</Text>
          
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={20} color="#5fa8d3" style={styles.inputIcon} />
            <TextInput value={fullName} onChangeText={setFullName} placeholder="Full Name" style={styles.input} />
          </View>

          <View style={styles.inputBox}>
            <Ionicons name="medical-outline" size={20} color="#5fa8d3" style={styles.inputIcon} />
            <TextInput value={speciality} onChangeText={setSpeciality} placeholder="Speciality (e.g. Surgeon)" style={styles.input} />
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={[styles.inputBox, { flex: 1 }]}>
              <Ionicons name="calendar-outline" size={20} color="#5fa8d3" style={styles.inputIcon} />
              <TextInput value={age} onChangeText={setAge} placeholder="Age" keyboardType="numeric" style={styles.input} />
            </View>
            <View style={[styles.inputBox, { flex: 2 }]}>
              <Ionicons name="mail-outline" size={20} color="#5fa8d3" style={styles.inputIcon} />
              <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" style={styles.input} />
            </View>
          </View>

          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color="#5fa8d3" style={styles.inputIcon} />
            <TextInput value={password} onChangeText={setPassword} placeholder="Initial Password" secureTextEntry style={styles.input} />
          </View>

          <TouchableOpacity onPress={handleAddDoctor} disabled={adding}>
            <LinearGradient colors={['#5fa8d3', '#89d4cf']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addBtn}>
              {adding ? <ActivityIndicator color="#fff" /> : <Text style={styles.addBtnText}>Register Doctor</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Doctors List */}
        <View style={styles.listHeader}>
          <Text style={styles.cardTitle}>Registered Doctors</Text>
          <Text style={styles.countBadge}>{doctors.length}</Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#5fa8d3" size="large" style={{ marginTop: 20 }} />
        ) : (
          doctors.map((item) => (
            <View key={item.id} style={styles.doctorCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.fullName.charAt(0)}</Text>
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docName}>Dr. {item.fullName}</Text>
                <Text style={styles.docSpec}>{item.speciality} • {item.age} yrs</Text>
                <Text style={styles.docEmail}>{item.email}</Text>
              </View>
              <TouchableOpacity style={styles.editBtn}>
                <Ionicons name="chevron-forward" size={20} color="#cbd5e0" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// **STYLES** - Make sure this is declared in same file
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { padding: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30, marginTop: 10 },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#1e293b" },
  headerSubtitle: { fontSize: 16, color: "#64748b" },
  logoutBtn: { backgroundColor: "#fee2e2", padding: 10, borderRadius: 12 },
  card: { backgroundColor: "#fff", borderRadius: 24, padding: 20, elevation: 4, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 15, marginBottom: 30 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#334155", marginBottom: 20 },
  inputBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 12 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#334155" },
  addBtn: { paddingVertical: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  listHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 },
  countBadge: { backgroundColor: '#5fa8d3', color: '#fff', paddingHorizontal: 10, borderRadius: 10, fontSize: 12, fontWeight: '700' },
  doctorCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 15, borderRadius: 18, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.03 },
  avatar: { width: 50, height: 50, borderRadius: 15, backgroundColor: "#e0f2fe", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#0369a1", fontWeight: "700", fontSize: 18 },
  docInfo: { flex: 1, marginLeft: 15 },
  docName: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
  docSpec: { fontSize: 13, color: "#5fa8d3", fontWeight: "600", marginTop: 2 },
  docEmail: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  editBtn: { padding: 5 },
});

export default AdminDash;
