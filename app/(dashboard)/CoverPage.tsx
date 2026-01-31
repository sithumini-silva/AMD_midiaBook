import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window"); 

const CoverPage = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/(auth)/login"); 
  };

  return (
    <ImageBackground
      source={require("../../assets/images/cover.png")}
      style={[styles.container, { width, height }]}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to MediBook</Text>
        <Text style={styles.subtitle}>Manage Appointments with Ease</Text>

        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default CoverPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)", // semi-transparent overlay
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fdc500",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#ffdac6",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#5fa8d3",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 28,
  },
  buttonText: {
    color: "#130101",
    fontSize: 18,
    fontWeight: "bold",
  },
});
