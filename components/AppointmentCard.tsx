import { View, Text } from "react-native";

export default function AppointmentCard({ appointment }: any) {
  return (
    <View style={{ padding: 12, backgroundColor: "#fff", borderRadius: 8 }}>
      <Text>Doctor: {appointment.doctor}</Text>
      <Text>Date: {appointment.date}</Text>
      <Text>Status: {appointment.status}</Text>
    </View>
  );
}
