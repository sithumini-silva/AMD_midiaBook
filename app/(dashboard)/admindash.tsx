import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native"
import { db, auth } from "../../services/firebase"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useAuth } from "../../context/AuthContext"


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
      console.error(err);
      Alert.alert("Error", "Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Add a new doctor
  const handleAddDoctor = async () => {
    if (!fullName || !speciality || !age || !email || !password) {
      Alert.alert("Missing Fields", "Please fill all doctor details.");
      return;
    }

    setAdding(true);
    try {
      // Optional: create Firebase Auth user
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await addDoc(collection(db, "users"), {
        fullName,
        speciality,
        age: Number(age),
        email,
        role: "doctor",
        uid: userCred.user.uid,
      });

      Alert.alert("Success", "Doctor added successfully!");
      setFullName("");
      setSpeciality("");
      setAge("");
      setEmail("");
      setPassword("");
      fetchDoctors();
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to add doctor.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
       {/* Header with Logout */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Admin Dashboard</Text>
        <TouchableOpacity
          onPress={logout}
          style={{ backgroundColor: "#f97316", padding: 10, borderRadius: 8 }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Add Doctor</Text>

      <Text>Full Name</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Enter full name"
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      <Text>Speciality</Text>
      <TextInput
        value={speciality}
        onChangeText={setSpeciality}
        placeholder="Enter speciality"
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      <Text>Age</Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        placeholder="Enter age"
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        keyboardType="email-address"
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 20, borderRadius: 8 }}
      />

      <TouchableOpacity
        onPress={handleAddDoctor}
        disabled={adding}
        style={{ backgroundColor: "#f97316", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 30 }}
      >
        {adding ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "bold" }}>Add Doctor</Text>}
      </TouchableOpacity>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>All Doctors</Text>
      {loading ? <ActivityIndicator /> :
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>
              <Text>{item.fullName} ({item.speciality})</Text>
              <Text>Email: {item.email}</Text>
              <Text>Age: {item.age}</Text>
            </View>
          )}
        />}
    </ScrollView>
  );
};

export default AdminDash;
