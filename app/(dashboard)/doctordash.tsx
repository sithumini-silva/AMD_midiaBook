import { View, Text } from "react-native";
import ProtectedRoute from "../rolebase/ProtectedRoute";

export default function DoctorDash() {
  return (
    <ProtectedRoute role="doctor">
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Doctor Dashboard</Text>
        <Text>• View Appointments</Text>
        <Text>• Update Availability</Text>
      </View>
    </ProtectedRoute>
  );
}
