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
import { LinearGradient } from 'expo-linear-gradient';
import { registerPatient } from "../../services/authService";

const Register = () => {
  const router = useRouter();

  // States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoadingReg, setIsLoadingReg] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
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
      // Backend function call
      await registerPatient(email.trim(), password, fullName.trim());
      
      Alert.alert("Success", "Account created successfully!", [
        { text: "Go to Login", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (err: any) {
      Alert.alert("Registration Failed", err.message || "Please try again.");
    } finally {
      setIsLoadingReg(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subTitle}>Join MediBook today and manage your health efficiently.</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          
          {/* Full Name Input */}
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#5fa8d3" style={styles.inputIcon} />
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#a0aec0"
                value={fullName}
                onChangeText={setFullName}
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#5fa8d3" style={styles.inputIcon} />
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#a0aec0"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#5fa8d3" style={styles.inputIcon} />
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                placeholder="Create password"
                placeholderTextColor="#a0aec0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.textInput}
              />
            </View>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#a0aec0" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputWrapper}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#5fa8d3" style={styles.inputIcon} />
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                placeholder="Repeat password"
                placeholderTextColor="#a0aec0"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={styles.textInput}
              />
            </View>
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#a0aec0" />
            </TouchableOpacity>
          </View>

          {/* Register Button */}
          <TouchableOpacity onPress={handleRegister} disabled={isLoadingReg} style={{ marginTop: 10 }}>
            <LinearGradient
              colors={['#5fa8d3', '#89d4cf']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              {isLoadingReg ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Styles - ඇතුළත logo එකට අදාළ style එකත් ඇතුළත් කර ඇත.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7fafc" },
  scrollContent: { flexGrow: 1, paddingBottom: 40, paddingHorizontal: 24 },
  headerSection: { alignItems: "center", marginTop: -30, marginBottom: 20 },
  logo: { width: 250, height: 250, marginBottom: -40 },
  title: { fontSize: 26, fontWeight: "800", color: "#1a202c" },
  subTitle: { fontSize: 14, color: "#718096", textAlign: "center", marginTop: 8, paddingHorizontal: 20, lineHeight: 20 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: "#fbfcfd",
  },
  inputIcon: { marginRight: 12 },
  inputContent: { flex: 1 },
  inputLabel: { fontSize: 10, fontWeight: "700", color: "#a0aec0", textTransform: "uppercase" },
  textInput: { fontSize: 15, color: "#2d3748", marginTop: 2 },
  buttonGradient: {
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#5fa8d3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
  footerText: { color: "#718096", fontSize: 15 },
  loginLink: { color: "#5fa8d3", fontWeight: "700", fontSize: 15 },
});

export default Register;