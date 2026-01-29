import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { registerPatient } from "../../services/authService";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoadingReg, setIsLoadingReg] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    setIsLoadingReg(true);
    try {
      await registerPatient(email, password);
      Alert.alert("Success", "Account created!", [{ text: "OK", onPress: () => router.back() }]);
    } catch (err) {
      console.error(err);
      Alert.alert("Registration Failed", "Please try again.");
    } finally {
      setIsLoadingReg(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
            Create Account
          </Text>

          <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 12 }}>
            <Text>Email</Text>
            <TextInput
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 15 }}
            />

            <Text>Password</Text>
            <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15 }}>
              <TextInput
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{ flex: 1 }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} />
              </TouchableOpacity>
            </View>

            <Text>Confirm Password</Text>
            <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20 }}>
              <TextInput
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={{ flex: 1 }}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!s
