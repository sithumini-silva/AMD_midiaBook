import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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

    setIsLoadingLogin(true);
    try {
      const user = await loginUser(email, password);

      if (user.role === "admin")
        router.replace("/(dashboard)/admindash");
      else if (user.role === "doctor")
        router.replace("/(dashboard)/doctordash");
      else
        router.replace("/(dashboard)/patientdash");
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "Invalid credentials");
      throw err
    } finally {
      setIsLoadingLogin(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.subTitle}>
            Sign in to access your medical consultations
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#5fa8d3"
              style={styles.inputIcon}
            />
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.textInput}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#5fa8d3"
              style={styles.inputIcon}
            />
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.textInput}
              />
            </View>

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={20}
                color="#a0aec0"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoadingLogin}
          >
            <LinearGradient
              colors={["#5fa8d3", "#89d4cf"]}
              style={styles.signInButton}
            >
              {isLoadingLogin ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.signInText}>
                  Sign In
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          {/* ================= REGISTER LINK ADDED ================= */}
          {/* When user clicks this, navigate to Register Page */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
            >
              <Text style={styles.registerLink}>
                {" "}Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7fafc" },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  headerSection: {
    alignItems: "center",
    marginTop: -40,
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  logo: { width: 250, height: 250, marginBottom: -40 },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a202c",
  },
  subTitle: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 24,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: "#fbfcfd",
  },
  inputIcon: { marginRight: 12 },
  inputContent: { flex: 1 },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#a0aec0",
    textTransform: "uppercase",
  },
  textInput: {
    fontSize: 16,
    color: "#2d3748",
    marginTop: 2,
  },
  signInButton: {
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
  },
  signInText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#718096",
    fontSize: 14,
  },
  registerLink: {
    color: "#5fa8d3",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default Login;
