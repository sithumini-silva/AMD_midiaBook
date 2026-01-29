import { View, Text, FlatList } from "react-native";
import ProtectedRoute from "../rolebase/ProtectedRoute";
import DoctorCard from "../../components/DoctorCard";
import useFetchDoctors from "../../hooks/useFetchDoctors";

export default function PatientDash() {
  const { doctors } = useFetchDoctors();

  return (
    <ProtectedRoute role="patient">
      <View>
        <Text style={{ fontSize: 24 }}>Find Doctors</Text>
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DoctorCard doctor={item} />}
        />
      </View>
    </ProtectedRoute>
  );
}
