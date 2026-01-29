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
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoadingLogin, setIsLoadingLogin] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    if (isLoadingLogin) return;
    setIsLoadingLogin(true);

    await loginUser(email, password)
      .then((res) => {
        console.log(res);
        router.push("/");
      })
      .catch((err) => {
        console.error(err);
        Alert.alert(
          "Login Failed",
          "Please check your credentials and try again",
        );
      })
      .finally(() => {
        setIsLoadingLogin(false);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#F3F4F6" }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          {/* Header Section */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <View
                style={{
                  backgroundColor: "#F97316",
                  padding: 15,
                  borderRadius: 50,
                  marginBottom: 10,
                }}
              >
                <Ionicons name="paw" size={40} color="white" />
              </View>
              <Text
                style={{ fontSize: 28, fontWeight: "bold", color: "#111827" }}
              >
                PetoCloud
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280" }}>
                Your pet's health companion
              </Text>
            </View>
          </View>

          {/* Login Form Card */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 5 }}>
              Welcome Back!
            </Text>
            <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
              Sign in to manage your pet's care
            </Text>

            {/* Email Input */}
            <View style={{ marginBottom: 15 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "600", marginBottom: 5 }}
              >
                Email
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                }}
              >
                <TextInput
                  placeholder="Enter your email"
                  style={{ flex: 1, height: 40, color: "#111827" }}
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Ionicons name="mail-outline" size={24} color="#9CA3AF" />
              </View>
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 15 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "600", marginBottom: 5 }}
              >
                Password
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                }}
              >
                <TextInput
                  placeholder="Enter your password"
                  style={{ flex: 1, height: 40, color: "#111827" }}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={{
                backgroundColor: isLoadingLogin ? "#F9731699" : "#F97316",
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 10,
              }}
              onPress={handleLogin}
              disabled={isLoadingLogin}
            >
              {isLoadingLogin ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={{ color: "#fff", marginLeft: 10 }}>
                    Signing in...
                  </Text>
                </>
              ) : (
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <Pressable style={{ alignSelf: "flex-end", marginBottom: 15 }}>
              <Text style={{ color: "#F97316" }}>Forgot Password?</Text>
            </Pressable>

            {/* Divider */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <View
                style={{ flex: 1, height: 1, backgroundColor: "#D1D5DB" }}
              />
              <Text style={{ marginHorizontal: 10, color: "#6B7280" }}>or</Text>
              <View
                style={{ flex: 1, height: 1, backgroundColor: "#D1D5DB" }}
              />
            </View>

            {/* Register Link */}
            <Pressable
              onPress={() => router.push("/register")}
              style={{
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: "#E5E7EB",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "600", color: "#111827" }}>
                Create New Account
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/")}
              style={{
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: "#E5E7EB",
              }}
            >
              <Text style={{ fontWeight: "600", color: "#111827" }}>
                Back to Home
              </Text>
            </Pressable>

            {/* Features */}
            <View style={{ marginTop: 20 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "600", marginBottom: 10 }}
              >
                Manage your pet's:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {[
                  { icon: "medical-outline", text: "Health" },
                  { icon: "calendar-outline", text: "Schedule" },
                  { icon: "nutrition-outline", text: "Nutrition" },
                  { icon: "location-outline", text: "Vets" },
                ].map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color="#F97316"
                    />
                    <Text style={{ marginLeft: 5 }}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
