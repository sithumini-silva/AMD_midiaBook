import { View, Text } from "react-native";
import ProtectedRoute from "../rolebase/ProtectedRoute";

export default function DoctorDash() {
  return (
    <ProtectedRoute role="doctor">
      <View>
        <Text style={{ fontSize: 24 }}>Doctor Dashboard</Text>
        <Text>• View Appointments</Text>
        <Text>• Update Availability</Text>
      </View>
    </ProtectedRoute>
  );
}
