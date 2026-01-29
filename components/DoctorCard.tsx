import { View, Text } from "react-native";
import CustomButton from "./CustomButton";

export default function DoctorCard({ doctor }: any) {
  return (
    <View
      style={{
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 8,
      }}
    >
      <Text style={{ fontSize: 18 }}>{doctor.name}</Text>
      <Text>{doctor.specialty}</Text>
      <CustomButton title="Book Appointment" onPress={() => {}} />
    </View>
  );
}
