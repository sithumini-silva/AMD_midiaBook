import { View, Text } from "react-native";
import ProtectedRoute from "../rolebase/ProtectedRoute";

export default function AdminDash() {
  return (
    <ProtectedRoute role="admin">
      <View>
        <Text style={{ fontSize: 24 }}>Admin Dashboard</Text>
        <Text>• Manage Doctors</Text>
        <Text>• View Appointments</Text>
      </View>
    </ProtectedRoute>
  );
}
