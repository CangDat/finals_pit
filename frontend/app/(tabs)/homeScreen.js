import React, { useState } from "react";
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
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  AntDesign,
  Entypo,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // Import for image picker
import styles from "../../components/homeStyle";

const HomeScreen = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { width } = useWindowDimensions();

  const [profileDetails, setProfileDetails] = useState({
    profileImage: "https://i.imgur.com/6VBx3io.png", // Default profile picture
    name: "Nicole Raiv Hernandez",
    username: "@raivenne",
    email: "nicoleraivh@gmail.com",
    phone: "09123456789",
    address: "Silver Creek Phase 1, Cagayan de Oro City, Misamis Oriental",
    birthday: "11/19/2003",
    gender: "Female",
    relationship: "In a Relationship with Loyloy",
    facebook: "/raivenne.fb",
    instagram: "@raiv.ig",
    github: "/raivenne-git",
    twitter: "@raiv_X",
  });

  const handleSave = () => {
    setShowModal(false);
    Alert.alert("Profile Updated", "Your profile details have been updated.");
  };

  const handleEditProfile = () => {
    setShowModal(true);
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Denied", "Access to media library is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileDetails((prev) => ({ ...prev, profileImage: result.uri }));
    }
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
        <Image
          source={{ uri: profileDetails.profileImage }} // Fix here, use profileDetails.profileImage
          style={[
            styles.profileImage,
            { width: width > 768 ? 160 : 120, height: width > 768 ? 160 : 120 }, // Larger profile image for wider screens
          ]}
        />
        
        <Text style={styles.name}>{profileDetails.name}</Text>
        <Text style={styles.username}>{profileDetails.username}</Text>
      </View>

      {/* Contact Section */}
      <View style={styles.contactContainer}>
        <View style={styles.contactRow}>
          <Ionicons name="mail" size={18} color="black" />
          <Text style={styles.contactText}>{profileDetails.email}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="call" size={18} color="black" />
          <Text style={styles.contactText}>{profileDetails.phone}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="location" size={18} color="black" />
          <Text style={styles.contactText}>{profileDetails.address}</Text>
        </View>
        <View style={styles.contactRow}>
          <MaterialCommunityIcons name="cake-variant" size={18} color="black" />
          <Text style={styles.contactText}>{profileDetails.birthday}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="male-female" size={18} color="black" />
          <Text style={styles.contactText}>{profileDetails.gender}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="heart" size={18} color="red" />
          <Text style={styles.contactText}>{profileDetails.relationship}</Text>
        </View>
      </View>

      {/* Separator Line */}
      <View style={styles.separatorLine} />

      {/* Social Media Section */}
      <View style={styles.socialContainer}>
        <Text style={styles.socialHeader}>Social Media</Text>
        <View style={styles.socialIcons}>
          <View style={styles.socialRow}>
            <View style={styles.iconContainer}>
              <FontAwesome name="facebook" size={32} color="#1877F2" />
              <Text style={styles.socialText}>{profileDetails.facebook}</Text>
            </View>
            <View style={styles.iconContainer}>
              <Entypo name="instagram" size={32} color="#E1306C" />
              <Text style={styles.socialText}>{profileDetails.instagram}</Text>
            </View>
          </View>
          <View style={styles.socialRow}>
            <View style={styles.iconContainer}>
              <AntDesign name="github" size={32} color="black" />
              <Text style={styles.socialText}>{profileDetails.github}</Text>
            </View>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="twitter" size={32} color="black" />
              <Text style={styles.socialText}>{profileDetails.twitter}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Edit Profile Modal */}
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
      
      {/* Current Profile Image Placeholder with Overlay Icon */}
      <View style={styles.profileImageContainer}>
        <View style={styles.imagePlaceholderContainer}>
          <Image
            source={{ uri: profileDetails.profileImage }}
            style={styles.modalProfileImage}
          />
          <TouchableOpacity onPress={handleImagePick} style={styles.imageOverlay}>
            <Ionicons name="camera" size={32} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Name Input */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={profileDetails.name}
        onChangeText={(text) =>
          setProfileDetails((prev) => ({ ...prev, name: text }))}
        placeholder="Name"
      />

      {/* Email Input */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={profileDetails.email}
        onChangeText={(text) =>
          setProfileDetails((prev) => ({ ...prev, email: text }))}
        placeholder="Email"
      />

      {/* Phone Input */}
      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={profileDetails.phone}
        onChangeText={(text) =>
          setProfileDetails((prev) => ({ ...prev, phone: text }))}
        placeholder="Phone"
      />

      {/* Address Input */}
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={profileDetails.address}
        onChangeText={(text) =>
          setProfileDetails((prev) => ({ ...prev, address: text }))}
        placeholder="Address"
      />

      {/* Birthday Input */}
      <Text style={styles.label}>Birthday</Text>
      <TextInput
        style={styles.input}
        value={profileDetails.birthday}
        onChangeText={(text) =>
          setProfileDetails((prev) => ({ ...prev, birthday: text }))}
        placeholder="Birthday"
      />

      {/* Gender Input */}
      <Text style={styles.label}>Gender</Text>
      <TextInput
        style={styles.input}
        value={profileDetails.gender}
        onChangeText={(text) =>
          setProfileDetails((prev) => ({ ...prev, gender: text }))}
        placeholder="Gender"
      />

      {/* Relationship Status Input */}
      <Text style={styles.label}>Relationship Status</Text>
      <TextInput
        style={styles.input}
        value={profileDetails.relationship}
        onChangeText={(text) =>
          setProfileDetails((prev) => ({ ...prev, relationship: text }))}
        placeholder="Relationship Status"
      />

      {/* Facebook Input */}
      <Text style={styles.label}>Facebook</Text>
      <TextInput
        style={styles.input}
        value={profileDetails.facebook}
        onChangeText={(text) =>
          setProfileDetails((prev) => ({ ...prev, facebook: text }))}
        placeholder="Facebook"
      />

      {/* Instagram Input */}
      <Text style={styles.label}>Instagram</Text>
      <TextInput
        style={styles.input}
        value={profileDetails.instagram}
        onChangeText={(text) =>
          setProfileDetails((prev) => ({ ...prev, instagram: text }))}
        placeholder="Instagram"
      />

      {/* GitHub Input */}
      <Text style={styles.label}>GitHub</Text>
      <TextInput
        style={styles.input}
        value={profileDetails.github}
        onChangeText={(text) =>
          setProfileDetails((prev) => ({ ...prev, github: text }))}
        placeholder="GitHub"
      />

      {/* Twitter Input */}
      <Text style={styles.label}>Twitter</Text>
      <TextInput
        style={styles.input}
        value={profileDetails.twitter}
        onChangeText={(text) =>
          setProfileDetails((prev) => ({ ...prev, twitter: text }))}
        placeholder="Twitter"
      />

      {/* Save and Cancel Buttons */}
      <Button title="Save" onPress={handleSave} />
      <Button
        title="Cancel"
        color="red"
        onPress={() => setShowModal(false)}
      />
    </ScrollView>
  </View>
</Modal>



    </ScrollView>
  );
};

export default HomeScreen;
