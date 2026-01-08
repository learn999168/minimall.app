import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Info } from "lucide-react-native";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F9FAFB", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#fff",
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#111827" }}>
          About
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#3B82F6",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Info size={40} color="#fff" />
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#111827",
            marginBottom: 12,
          }}
        >
          Shopping Mall
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#6B7280",
            textAlign: "center",
            marginBottom: 24,
            paddingHorizontal: 20,
          }}
        >
          Browse and list items for sale. No account needed!
        </Text>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
            width: "100%",
            maxWidth: 300,
          }}
        >
          <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 22 }}>
            • Browse all available items{"\n"}• List items for sale instantly
            {"\n"}• View detailed product information{"\n"}• Search and filter
            by category
          </Text>
        </View>
      </View>
    </View>
  );
}
