import { TouchableOpacity, Text } from "react-native";

export default function CustomButton({ title, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ backgroundColor: "#f97316", padding: 12, borderRadius: 8, alignItems: "center" }}
    >
      <Text style={{ color: "#fff", fontWeight: "600" }}>{title}</Text>
    </TouchableOpacity>
  );
}
