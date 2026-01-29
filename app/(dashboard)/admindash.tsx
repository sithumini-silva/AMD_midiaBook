import { View, Text } from "react-native";
import ProtectedRoute from "../rolebase/ProtectedRoute";

export default function AdminDash() {
  return (
    <ProtectedRoute role="admin">
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Admin Dashboard</Text>
        <Text>• Manage Doctors</Text>
        <Text>• View Appointments</Text>
      </View>
    </ProtectedRoute>
  );
}
