import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useUpload } from "@/utils/useUpload";
import { useRouter } from "expo-router";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";

export default function SellScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [upload, { loading: uploading }] = useUpload();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Electronics",
    "Fashion",
    "Home",
    "Sports",
    "Books",
    "Other",
  ];
  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setImageUri(asset.uri);

      // Upload image
      const uploadResult = await upload({
        reactNativeAsset: {
          uri: asset.uri,
          name: asset.fileName || "product.jpg",
          mimeType: asset.mimeType || "image/jpeg",
        },
      });

      if (uploadResult.error) {
        Alert.alert("Error", "Failed to upload image");
      } else {
        setImageUrl(uploadResult.url);
      }
    }
  };

  const handleSubmit = async () => {
    if (!title || !price) {
      Alert.alert("Error", "Please fill in title and price");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          image_url: imageUrl,
          category,
          condition,
        }),
      });

      if (!response.ok) throw new Error("Failed to create product");

      Alert.alert("Success", "Product listed successfully!", [
        {
          text: "OK",
          onPress: () => {
            setTitle("");
            setDescription("");
            setPrice("");
            setCategory("");
            setCondition("");
            setImageUri(null);
            setImageUrl(null);
            router.push("/(tabs)/browse");
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating product:", error);
      Alert.alert("Error", "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
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
            List an Item
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Picker */}
          <TouchableOpacity
            onPress={pickImage}
            disabled={uploading}
            style={{
              height: 200,
              backgroundColor: "#F3F4F6",
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
              borderWidth: 2,
              borderColor: "#E5E7EB",
              borderStyle: "dashed",
            }}
          >
            {uploading ? (
              <ActivityIndicator size="large" color="#3B82F6" />
            ) : imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ alignItems: "center" }}>
                <Camera size={40} color="#9CA3AF" />
                <Text style={{ color: "#6B7280", marginTop: 8 }}>
                  Add Photo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Title */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Title *
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What are you selling?"
              placeholderTextColor="#9CA3AF"
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: "#111827",
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            />
          </View>

          {/* Price */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Price *
            </Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: "#111827",
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            />
          </View>

          {/* Category */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Category
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0 }}
            >
              <View style={{ flexDirection: "row", gap: 8 }}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: category === cat ? "#3B82F6" : "#F3F4F6",
                      borderWidth: 1,
                      borderColor: category === cat ? "#3B82F6" : "#E5E7EB",
                    }}
                  >
                    <Text
                      style={{
                        color: category === cat ? "#fff" : "#6B7280",
                        fontWeight: "500",
                      }}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Condition */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Condition
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0 }}
            >
              <View style={{ flexDirection: "row", gap: 8 }}>
                {conditions.map((cond) => (
                  <TouchableOpacity
                    key={cond}
                    onPress={() => setCondition(cond)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor:
                        condition === cond ? "#3B82F6" : "#F3F4F6",
                      borderWidth: 1,
                      borderColor: condition === cond ? "#3B82F6" : "#E5E7EB",
                    }}
                  >
                    <Text
                      style={{
                        color: condition === cond ? "#fff" : "#6B7280",
                        fontWeight: "500",
                      }}
                    >
                      {cond}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Description */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your item..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: "#111827",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                minHeight: 100,
              }}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting || !title || !price}
            style={{
              backgroundColor:
                !title || !price || submitting ? "#9CA3AF" : "#3B82F6",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                List Item
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
