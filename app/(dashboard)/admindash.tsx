import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { db, auth } from "../../services/firebase"; // firebase config
import { collection, getDocs, addDoc } from "firebase/firestore";

type Doctor = {
  id: string;
  email: string;
  name: string;
  role: string;
};

const AdminDash = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Load doctors
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const docsData: Doctor[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.role === "doctor") {
          docsData.push({ id: doc.id, ...data } as Doctor);
        }
      });
      setDoctors(docsData);
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

  // Add new doctor
  const handleAddDoctor = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // Create doctor in Firestore
      await addDoc(collection(db, "users"), {
        name,
        email,
        role: "doctor",
        password, // only for demo; don't store plain passwords in real apps
      });
      Alert.alert("Success", "Doctor added!");
      setName(""); setEmail(""); setPassword("");
      fetchDoctors(); // refresh list
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to add doctor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>Admin Dashboard</Text>

      {/* Add Doctor Form */}
      <View style={{ marginBottom: 30, backgroundColor: "#fff", padding: 15, borderRadius: 10 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Add Doctor</Text>
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 6 }} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 6 }} />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 6 }} secureTextEntry />
        <TouchableOpacity onPress={handleAddDoctor} style={{ backgroundColor: "#f97316", padding: 10, borderRadius: 6, alignItems: "center" }}>
          <Text style={{ color: "#fff" }}>Add Doctor</Text>
        </TouchableOpacity>
      </View>

      {/* Doctor List */}
      <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Doctors List</Text>
      {loading ? <ActivityIndicator size="large" /> :
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 12, marginBottom: 8, backgroundColor: "#fff", borderRadius: 6 }}>
              <Text>Name: {item.name}</Text>
              <Text>Email: {item.email}</Text>
            </View>
          )}
        />
      }
    </ScrollView>
  );
};

export default AdminDash;
