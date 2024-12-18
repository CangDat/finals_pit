import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Button,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import styles from "../../components/homeStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from 'axios';
import * as FileSystem from "expo-file-system";
import { Buffer } from 'buffer';



const HomeScreen = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [profileDetails, setProfileDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date()); // For birthday
  const [showDatePicker, setShowDatePicker] = useState(false);

  const genders = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];


  const fetchUserDetails = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) {
        console.log("No user ID found. Please log in.");
        return;
      }
      const response = await fetch(
        `http://192.168.1.13:3000/api/user/${userId}`
      );
      const data = await response.json();
      console.log("Fetched User Data:", data);
  
      setProfileDetails({
        name: `${data.first_name || ""} ${data.last_name || ""}`,
        username: data.username || "N/A",
        email: data.email || "N/A",
        phone: data.phone_number || "N/A",
        address: data.address || "N/A",
        birthday: data.birthdate || "N/A",
        gender: data.gender || "N/A",
        relationship: data.relationship_status || "N/A",
        facebook: data.facebook_account || "N/A",
        instagram: data.instagram_account || "N/A",
        github: data.github_account || "N/A",
        twitter: data.twitter_account || "N/A",
        profileImage: data.profile_picture || null,
      });
  
      if (data.birthdate) {
        setSelectedDate(new Date(data.birthdate));
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };
  

  
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      const mediaPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (!permissionResult.granted || !mediaPermissionResult.granted) {
        Alert.alert("Permission Denied", "Access to camera and media library is required.");
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }
  
      const imageUri = result.assets[0].uri;
      const fileType = result.assets[0].uri.split('.').pop();  // Extract file extension (e.g., jpg, png)
  
      // Upload image to Cloudinary
      const uploadedImageUrl = await uploadImageToCloudinary(imageUri);
  
      // Set the image URL in the profile details
      setProfileDetails((prev) => ({
        ...prev,
        profileImage: uploadedImageUrl, // Use the Cloudinary URL
      }));
    } catch (error) {
      console.error("Error in handleImagePick:", error);
      Alert.alert("Error", "An error occurred while selecting an image.");
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg", // Make sure to match the image MIME type
        name: "profile.jpg", // or any relevant name
      });
      formData.append("upload_preset", "image_upload"); // Replace with your Cloudinary preset
  
      const response = await fetch("https://api.cloudinary.com/v1_1/daaxc0gup/image/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;  // Return the Cloudinary image URL
      } else {
        Alert.alert("Error", "Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "An error occurred while uploading the image.");
    }
  };
  

  const handleEditProfile = () => {
    setShowModal(true);
  };

  const handleSave = async () => {
    if (loading) {
      Alert.alert("Please wait", "Loading user data, please wait a moment.");
      return;
    }
  
    if (!profileDetails.name || !profileDetails.email) {
      Alert.alert("Validation Error", "Name and email are required fields.");
      return;
    }
  
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) {
        Alert.alert("Error", "User ID not found. Please log in again.");
        return;
      }
  
      const updatedData = {
        first_name: profileDetails.name.split(" ")[0] || "",
        last_name: profileDetails.name.split(" ")[1] || "",
        email: profileDetails.email,
        phone: profileDetails.phone,
        address: profileDetails.address,
        birthday: selectedDate.toISOString(),
        gender: profileDetails.gender,
        relationship: profileDetails.relationship,
        facebook: profileDetails.facebook,
        instagram: profileDetails.instagram,
        github: profileDetails.github,
        twitter: profileDetails.twitter,
        profileImage: profileDetails.profileImage,  // Send the image URL
      };
  
      const response = await fetch(`http://192.168.1.13:3000/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        Alert.alert("Success", "Profile details updated successfully.");
        await fetchUserDetails();
        setShowModal(false);
      } else {
        Alert.alert("Error", result.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "An error occurred while updating the profile.");
    }
  };
  
  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
      setProfileDetails((prev) => ({
        ...prev,
        birthday: date.toLocaleDateString(),
      }));
    }
    setShowDatePicker(false);
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const formatDate = (date) => {
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return "Select Birthday";
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleBirthdayInputPress = () => {
    setShowDatePicker(true);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome!</Text>
        <TouchableOpacity
          style={styles.menuIcon}
          onPress={() => setShowDropdown((prev) => !prev)}
        >
          <Ionicons name="menu" size={width > 768 ? 40 : 35} color="white" />
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={handleEditProfile}
            >
              <Text style={styles.dropdownText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => Alert.alert("Logout", "You have been logged out!")}
            >
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Profile Section */}
      <View
        style={[styles.profileContainer, { marginHorizontal: width > 768 ? "20%" : 0 }]}
      >
        {profileDetails.profileImage ? (
            <Image
              source={{ uri: profileDetails.profileImage }}
              style={[styles.profileImage, { width: width > 768 ? 160 : 120, height: width > 768 ? 160 : 120, borderRadius: 0 }]}
            />
          
          ) : (
          <Ionicons
            name="person-circle"
            size={width > 768 ? 160 : 120}
            color="black"
            style={{
              width: width > 768 ? 160 : 120,
              height: width > 768 ? 160 : 120,
              borderRadius: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1,
            }}
          />
        )}
        <Text style={styles.name}>{profileDetails.name}</Text>
        <Text style={styles.username}>@{profileDetails.username}</Text>
      </View>
      {/* Contact Section */}
      <View style={styles.contactContainer}>
        {[{ iconFamily: "Ionicons", icon: "mail", text: profileDetails.email }, { iconFamily: "Ionicons", icon: "call", text: profileDetails.phone }, { iconFamily: "Ionicons", icon: "location", text: profileDetails.address }, { iconFamily: "MaterialCommunityIcons", icon: "cake-variant", text: profileDetails.birthday }, { iconFamily: "Ionicons", icon: "male-female", text: profileDetails.gender }, { iconFamily: "Ionicons", icon: "heart", text: profileDetails.relationship, color: "red" }].map((item, index) => (
          <View style={styles.contactRow} key={index}>
            {item.iconFamily === "Ionicons" ? (
              <Ionicons name={item.icon} size={18} color={item.color || "black"} />
            ) : (
              <MaterialCommunityIcons
                name={item.icon}
                size={18}
                color={item.color || "black"}
              />
            )}
            <Text style={styles.contactText}>{item.text}</Text>
          </View>
        ))}
      </View>

      {/* Separator */}
      <View style={styles.separatorLine} />

      {/* Social Media Section */}
      <View style={styles.socialContainer}>
        <Text style={styles.socialHeader}>Social Media</Text>
        <View style={styles.socialIcons}>
          {[{ icon: "facebook", color: "#1877F2", text: profileDetails.facebook }, { icon: "instagram", color: "#E1306C", text: profileDetails.instagram }, { icon: "github", color: "black", text: profileDetails.github }, { icon: "twitter", color: "black", text: profileDetails.twitter }].map((social, idx) => (
            <View style={styles.iconContainer} key={idx}>
              <FontAwesome name={social.icon} size={32} color={social.color} />
              <Text style={styles.socialText}>{social.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            {/* Profile Picture Edit */}
            <View style={styles.profileImageContainer}>
              {profileDetails.profileImage ? (
                <Image
                  source={{ uri: profileDetails.profileImage }}
                  style={styles.modalProfileImage}
                />
              ) : (
                <Ionicons name="person-circle" size={120} color="black" />
              )}

              <TouchableOpacity
                style={styles.centeredCameraIcon}
                onPress={handleImagePick}
              >
                <FontAwesome name="camera" size={30} color="white" />
              </TouchableOpacity>
            </View>

            {/* Input Fields */}
            {["name", "email", "phone", "address"].map((field) => (
              <View key={field}>
                <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                <TextInput
                  style={styles.input}
                  value={profileDetails[field]}
                  onChangeText={(text) =>
                    setProfileDetails((prev) => ({ ...prev, [field]: text }))
                  }
                  placeholder={field}
                />
              </View>
            ))}

            {/* Birthday Input */}
            <View key="birthday">
              <Text style={styles.label}>Birthday</Text>
              <TouchableOpacity onPress={handleBirthdayInputPress}>
                <TextInput
                  style={styles.input}
                  value={selectedDate.toLocaleDateString()}
                  placeholder="Select Birthday"
                  editable={false}
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  style={{ width: "100%" }}
                />
              )}
            </View>

            {/* Gender Picker */}
            <View key="gender" style={[styles.pickerContainer, { borderWidth: 1, borderColor: "#ccc" }]}>
              <Text style={styles.label}>Gender</Text>
              <Picker
                selectedValue={profileDetails.gender}
                onValueChange={(itemValue) =>
                  setProfileDetails((prev) => ({ ...prev, gender: itemValue }))
                }
                style={styles.picker}
              >
                <Picker.Item label="Select Gender" value="" />
                {genders.map((gender) => (
                  <Picker.Item key={gender.value} label={gender.label} value={gender.value} />
                ))}
              </Picker>
            </View>

            {/* Remaining Social Media Fields */}
            {["relationship", "facebook", "instagram", "github", "twitter"].map((field) => (
              <View key={field}>
                <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                <TextInput
                  style={styles.input}
                  value={profileDetails[field]}
                  onChangeText={(text) =>
                    setProfileDetails((prev) => ({ ...prev, [field]: text }))
                  }
                  placeholder={field}
                />
              </View>
            ))}

            {/* Save Button */}
            <Button title="Save Changes" onPress={handleSave} />
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default HomeScreen;
