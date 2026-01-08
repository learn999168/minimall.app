import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");

        const data = await response.json();
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F9FAFB",
        }}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!product) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F9FAFB",
        }}
      >
        <Text style={{ fontSize: 16, color: "#6B7280" }}>
          Product not found
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#111827",
            marginLeft: 12,
          }}
        >
          Product Details
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={{ width: "100%", height: 300, backgroundColor: "#F3F4F6" }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: 300,
              backgroundColor: "#F3F4F6",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#9CA3AF" }}>No image available</Text>
          </View>
        )}

        {/* Product Info */}
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            {product.title}
          </Text>

          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#3B82F6",
              marginBottom: 16,
            }}
          >
            ${parseFloat(product.price).toFixed(2)}
          </Text>

          {/* Tags */}
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
            {product.category && (
              <View
                style={{
                  backgroundColor: "#EFF6FF",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                <Text
                  style={{ color: "#3B82F6", fontSize: 14, fontWeight: "500" }}
                >
                  {product.category}
                </Text>
              </View>
            )}
            {product.condition && (
              <View
                style={{
                  backgroundColor: "#F0FDF4",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                <Text
                  style={{ color: "#16A34A", fontSize: 14, fontWeight: "500" }}
                >
                  {product.condition}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          {product.description && (
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: 8,
                }}
              >
                Description
              </Text>
              <Text style={{ fontSize: 16, color: "#6B7280", lineHeight: 24 }}>
                {product.description}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
