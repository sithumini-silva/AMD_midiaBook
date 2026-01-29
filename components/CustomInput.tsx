import React from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomInputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  showTogglePassword?: boolean;
  onTogglePassword?: () => void;
  error?: string;
}

const CustomInput = ({
  label,
  icon,
  value,
  onChangeText,
  secureTextEntry,
  showTogglePassword = false,
  onTogglePassword,
  error,
  ...props
}: CustomInputProps) => {
  return (
    <View style={{ marginBottom: 16 }}>
      {/* Label */}
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 6,
            color: "#374151",
          }}
        >
          {label}
        </Text>
      )}

      {/* Input box */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: error ? "#ef4444" : "#D1D5DB",
          borderRadius: 10,
          paddingHorizontal: 12,
          backgroundColor: "#fff",
        }}
      >
        {/* Left icon */}
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? "#ef4444" : "#9CA3AF"}
            style={{ marginRight: 8 }}
          />
        )}

        <TextInput
          style={{
            flex: 1,
            height: 44,
            fontSize: 16,
            color: "#111827",
          }}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#9CA3AF"
          {...props}
        />

        {/* Password toggle */}
        {showTogglePassword && (
          <TouchableOpacity onPress={onTogglePassword}>
            <Ionicons
              name={secureTextEntry ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error message */}
      {error && (
        <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default CustomInput;
