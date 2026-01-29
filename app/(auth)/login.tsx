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
import { loginUser } from "../../services/authService";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter your email and password");
      return;
    }

    if (isLoadingLogin) return;
    setIsLoadingLogin(true);

    await loginUser(email, password)
      .then((res) => {
        console.log(res);
        router.push("/"); // Redirect handled by index.tsx
      })
      .catch(() => {
        Alert.alert("Login Failed", "Invalid credentials.");
      })
      .finally(() => setIsLoadingLogin(false));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#F3F4F6" }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
            MediBook Login
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
            <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20 }}>
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

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoadingLogin}
              style={{ backgroundColor: "#f97316", padding: 15, borderRadius: 8, alignItems: "center" }}
            >
              {isLoadingLogin ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff" }}>Login</Text>}
            </TouchableOpacity>

            <Pressable onPress={() => router.push("/(auth)/register")} style={{ marginTop: 15, alignItems: "center" }}>
              <Text style={{ color: "#f97316" }}>Create Account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
