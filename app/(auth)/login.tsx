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
  Image,
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

    setIsLoadingLogin(true);

    try {
      const user = await loginUser(email, password);

      // Redirect based on role
      if (user.role === "admin") router.replace("/(dashboard)/admindash");
      else if (user.role === "doctor") router.replace("/(dashboard)/doctordash");
      else router.replace("/(dashboard)/patientdash"); // fallback

    } catch (err: any) {
      console.log(err);
      Alert.alert("Login Failed", err.message || "Invalid credentials");
    } finally {
      setIsLoadingLogin(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
    >
      <ScrollView 
        contentContainerStyle={{ 
          flexGrow: 1, 
          paddingVertical: 40 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section with BookMyDoctor Logo */}
        <View style={{ alignItems: "center", marginTop: 40, marginBottom: 20 }}>
          {/* Logo Container */}
          <View style={{
            width: 140,
            height: 140,
            backgroundColor: "#5fa8d3",
            borderRadius: 70,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            shadowColor: "#5fa8d3",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
            borderWidth: 5,
            borderColor: "#FFFFFF",
            overflow: "hidden"
          }}>
            {/* Medical Cross Symbol inside Logo */}
            <View style={{
              width: 100,
              height: 100,
              backgroundColor: "#FFFFFF",
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              position: "relative"
            }}>
              {/* Medical Cross */}
              <View style={{
                position: "absolute",
                width: 60,
                height: 60,
                justifyContent: "center",
                alignItems: "center"
              }}>
                {/* Vertical line */}
                <View style={{
                  width: 12,
                  height: 60,
                  backgroundColor: "#5fa8d3",
                  borderRadius: 6,
                  position: "absolute"
                }} />
                {/* Horizontal line */}
                <View style={{
                  width: 60,
                  height: 12,
                  backgroundColor: "#5fa8d3",
                  borderRadius: 6,
                  position: "absolute"
                }} />
              </View>
              
              {/* Alternatively, you can use an icon */}
              {/* <Ionicons name="medical" size={50} color="#5fa8d3" /> */}
            </View>
          </View>
          
          {/* Brand Name with Styling */}
          <View style={{ alignItems: "center" }}>
            <Text style={{ 
              fontSize: 36, 
              fontWeight: "900", 
              color: "#5fa8d3",
              letterSpacing: 1,
              marginBottom: 4,
              textShadowColor: "rgba(95, 168, 211, 0.2)",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3
            }}>
              BookMyDoctor
            </Text>
            
            {/* Tagline */}
            <Text style={{ 
              fontSize: 14, 
              color: "#718096",
              fontWeight: "500",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8
            }}>
              Healthcare Simplified
            </Text>
            
            {/* Divider */}
            <View style={{
              width: 80,
              height: 3,
              backgroundColor: "#5fa8d3",
              borderRadius: 2,
              marginVertical: 12
            }} />
          </View>
          
          {/* Welcome Text */}
          <Text style={{ 
            fontSize: 26, 
            fontWeight: "700", 
            color: "#2d3748",
            marginTop: 20,
            textAlign: "center"
          }}>
            Welcome Back!
          </Text>
          
          <Text style={{ 
            fontSize: 15, 
            color: "#718096",
            marginTop: 8,
            textAlign: "center",
            paddingHorizontal: 40,
            lineHeight: 22
          }}>
            Sign in to access your medical consultations and appointments
          </Text>
        </View>

        {/* Form Container */}
        <View style={{ paddingHorizontal: 24, marginTop: 10 }}>
          <View style={{ 
            backgroundColor: "#FFFFFF", 
            borderRadius: 20, 
            padding: 24,
            borderWidth: 1,
            borderColor: "#e2e8f0",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 3
          }}>
            {/* Email Input */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Ionicons name="person-circle-outline" size={18} color="#5fa8d3" />
                <Text style={{ 
                  color: "#4a5568", 
                  fontWeight: "600", 
                  fontSize: 14,
                  marginLeft: 6
                }}>
                  Email Address
                </Text>
              </View>
              <View style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                borderWidth: 1, 
                borderColor: "#cbd5e0", 
                borderRadius: 12, 
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: "#f8fafc"
              }}>
                <Ionicons name="mail-outline" size={22} color="#718096" />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#a0aec0"
                  value={email}
                  onChangeText={setEmail}
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  style={{ 
                    flex: 1, 
                    marginLeft: 12,
                    fontSize: 16,
                    color: "#2d3748"
                  }}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Ionicons name="key-outline" size={18} color="#5fa8d3" />
                <Text style={{ 
                  color: "#4a5568", 
                  fontWeight: "600", 
                  fontSize: 14,
                  marginLeft: 6
                }}>
                  Password
                </Text>
              </View>
              <View style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                borderWidth: 1, 
                borderColor: "#cbd5e0", 
                borderRadius: 12, 
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: "#f8fafc"
              }}>
                <Ionicons name="lock-closed-outline" size={22} color="#718096" />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#a0aec0"
                  value={password}
                  onChangeText={setPassword}
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  secureTextEntry={!showPassword}
                  style={{ 
                    flex: 1, 
                    marginLeft: 12,
                    fontSize: 16,
                    color: "#2d3748"
                  }}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ padding: 4 }}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={24} 
                    color="#718096" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 30 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="keypad-outline" size={16} color="#5fa8d3" />
                <Text style={{ 
                  color: "#5fa8d3", 
                  fontWeight: "600",
                  fontSize: 14,
                  marginLeft: 4
                }}>
                  Forgot Password?
                </Text>
              </View>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoadingLogin}
              style={{ 
                backgroundColor: "#5fa8d3", 
                borderRadius: 12, 
                paddingVertical: 16,
                alignItems: "center",
                shadowColor: "#5fa8d3",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Ionicons name="log-in-outline" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
              {isLoadingLogin ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={{ 
                  color: "#FFFFFF", 
                  fontSize: 18, 
                  fontWeight: "bold"
                }}>
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={{ alignItems: "center", marginTop: 24 }}>
            <Text style={{ 
              color: "#718096",
              fontSize: 15
            }}>
              New to BookMyDoctor?{" "}
              <Pressable 
                onPress={() => router.push("/(auth)/register")}
                style={{ marginLeft: 4 }}
              >
                <Text style={{ 
                  color: "#5fa8d3", 
                  fontWeight: "bold",
                  fontSize: 15
                }}>
                  Create Account
                </Text>
              </Pressable>
            </Text>
          </View>

          {/* Divider */}
          <View style={{ 
            flexDirection: "row", 
            alignItems: "center", 
            marginVertical: 32 
          }}>
            <View style={{ 
              flex: 1, 
              height: 1, 
              backgroundColor: "#e2e8f0" 
            }} />
            <Text style={{ 
              marginHorizontal: 16, 
              color: "#a0aec0",
              fontSize: 14,
              fontWeight: "500"
            }}>
              Quick Access
            </Text>
            <View style={{ 
              flex: 1, 
              height: 1, 
              backgroundColor: "#e2e8f0" 
            }} />
          </View>

          {/* Social Login Buttons */}
          <View style={{ 
            flexDirection: "row", 
            justifyContent: "center", 
            gap: 16 
          }}>
            <TouchableOpacity style={{ 
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1, 
              borderColor: "#e2e8f0", 
              borderRadius: 12, 
              paddingHorizontal: 20,
              paddingVertical: 12,
              flex: 1,
              justifyContent: "center",
              backgroundColor: "#f8fafc"
            }}>
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={{ 
                marginLeft: 8,
                color: "#4a5568",
                fontWeight: "500"
              }}>
                Google
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={{ 
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1, 
              borderColor: "#e2e8f0", 
              borderRadius: 12, 
              paddingHorizontal: 20,
              paddingVertical: 12,
              flex: 1,
              justifyContent: "center",
              backgroundColor: "#f8fafc"
            }}>
              <Ionicons name="logo-apple" size={20} color="#000000" />
              <Text style={{ 
                marginLeft: 8,
                color: "#4a5568",
                fontWeight: "500"
              }}>
                Apple
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Note */}
        <View style={{ 
          alignItems: "center", 
          marginTop: 48,
          marginBottom: 32,
          paddingHorizontal: 24
        }}>
          <View style={{ 
            flexDirection: "row", 
            alignItems: "center",
            marginBottom: 12
          }}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#5fa8d3" />
            <Text style={{ 
              color: "#a0aec0",
              fontSize: 13,
              marginLeft: 6
            }}>
              Your data is securely encrypted
            </Text>
          </View>
          
          <Text style={{ 
            color: "#a0aec0",
            fontSize: 13,
            textAlign: "center",
            lineHeight: 18
          }}>
            By signing in, you agree to our{" "}
            <Text style={{ color: "#5fa8d3", fontWeight: "500" }}>
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text style={{ color: "#5fa8d3", fontWeight: "500" }}>
              Privacy Policy
            </Text>
          </Text>
          
          {/* Copyright */}
          <Text style={{ 
            color: "#cbd5e0",
            fontSize: 12,
            marginTop: 16,
            fontWeight: "500"
          }}>
            © 2024 BookMyDoctor. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;