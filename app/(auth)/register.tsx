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
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { registerPatient } from "../../services/authService";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoadingReg, setIsLoadingReg] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleRegister = async () => {
    if (isLoadingReg) return;

    if (!email || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters");
      return;
    }

    setIsLoadingReg(true);
    await registerPatient(email, password)
      .then((res) => {
        console.log(res);
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      })
      .catch((err) => {
        console.error(err);
        Alert.alert(
          "Registration Failed",
          "Something went wrong. Please try again.",
        );
      })
      .finally(() => {
        setIsLoadingReg(false);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#f97316" />

      {/* Orange Background */}
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#f97316",
        }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 32,
          }}
        >
          {/* Header Section */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View
              style={{
                width: 80,
                height: 80,
                backgroundColor: "#fff",
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <Ionicons name="person-add" size={32} color="#ea580c" />
            </View>

            <Text
              style={{
                fontSize: 36,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Create Account
            </Text>

            <Text
              style={{
                color: "#fed7aa",
                fontSize: 18,
                textAlign: "center",
                lineHeight: 24,
              }}
            >
              Join us today and start your journey
            </Text>
          </View>

          {/* Form Container */}
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: 30,
              padding: 24,
              marginHorizontal: 8,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 15,
              elevation: 15,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            {/* Email Input */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{ color: "#374151", fontWeight: "600", marginBottom: 6 }}
              >
                Email Address
              </Text>

              <View style={{ position: "relative" }}>
                <TextInput
                  placeholder="Enter your email"
                  style={{
                    backgroundColor: "#f9fafb",
                    borderWidth: 2,
                    borderColor: "#fed7aa",
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    fontSize: 18,
                    fontWeight: "500",
                    color: "#111827",
                  }}
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <View
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: [{ translateY: -12 }],
                  }}
                >
                  <Ionicons name="mail-outline" size={20} color="#f97316" />
                </View>
              </View>
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{ color: "#374151", fontWeight: "600", marginBottom: 6 }}
              >
                Password
              </Text>

              <View style={{ position: "relative" }}>
                <TextInput
                  placeholder="Create a password"
                  style={{
                    backgroundColor: "#f9fafb",
                    borderWidth: 2,
                    borderColor: "#fed7aa",
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    paddingRight: 48,
                    fontSize: 18,
                    fontWeight: "500",
                    color: "#111827",
                  }}
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoComplete="new-password"
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: [{ translateY: -12 }],
                  }}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#f97316"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{ color: "#374151", fontWeight: "600", marginBottom: 6 }}
              >
                Confirm Password
              </Text>

              <View style={{ position: "relative" }}>
                <TextInput
                  placeholder="Confirm your password"
                  style={{
                    backgroundColor: "#f9fafb",
                    borderWidth: 2,
                    borderColor: "#fed7aa",
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    paddingRight: 48,
                    fontSize: 18,
                    fontWeight: "500",
                    color: "#111827",
                  }}
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoComplete="new-password"
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: [{ translateY: -12 }],
                  }}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#f97316"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#f97316",
                borderRadius: 20,
                paddingVertical: 16,
                marginBottom: 16,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 10,
                opacity: isLoadingReg ? 0.75 : 1,
                alignItems: "center",
              }}
              onPress={handleRegister}
              disabled={isLoadingReg}
            >
              {isLoadingReg ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text
                    style={{
                      color: "#fff",
                      marginLeft: 10,
                      fontSize: 18,
                      fontWeight: "700",
                    }}
                  >
                    Creating Account...
                  </Text>
                </View>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: "700",
                      marginRight: 8,
                    }}
                  >
                    Create Account
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            {/* Terms and Conditions */}
            <Text
              style={{
                color: "#6b7280",
                fontSize: 14,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              By creating an account, you agree to our{" "}
              <Text style={{ color: "#f97316", fontWeight: "600" }}>
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text style={{ color: "#f97316", fontWeight: "600" }}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/* Login Link */}
          <View style={{ marginTop: 32, alignItems: "center" }}>
            <Pressable
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 20,
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="log-in-outline"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}
                >
                  Already have an account? Sign In
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Social Login Section (Optional) */}
          <View style={{ marginTop: 32, alignItems: "center" }}>
            <Text
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 16,
                marginBottom: 16,
              }}
            >
              Or continue with
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  padding: 14,
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                  elevation: 10,
                }}
              >
                <Ionicons name="logo-google" size={24} color="#ea4335" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  padding: 14,
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                  elevation: 10,
                }}
              >
                <Ionicons name="logo-apple" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  padding: 14,
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                  elevation: 10,
                }}
              >
                <Ionicons name="logo-facebook" size={24} color="#1877f2" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
