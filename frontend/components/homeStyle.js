import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: Platform.OS === "web" ? "10%" : 0,
  },
  header: {
    backgroundColor: "#27ae60",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: "relative",
  },
  headerTitle: {
    color: "#fff",
    fontSize: width > 768 ? 36 : 26, // Larger font size for wider screens
    fontWeight: "bold",
    marginTop: -25,
  },
  menuIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  dropdownMenu: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -50,
  },
  profileImage: {
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: width > 768 ? 26 : 22, // Adjust font size
    fontWeight: "bold",
    marginTop: 10,
  },
  username: {
    fontSize: 16,
    color: "gray",
  },
  contactContainer: {
    paddingHorizontal: width > 768 ? 40 : 20, // Add padding for wider screens
    marginVertical: 10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  contactText: {
    marginLeft: 10,
    fontSize: width > 768 ? 18 : 16, // Larger font for wider screens
  },
  separatorLine: {
    height: 1,
    backgroundColor: "#d3d3d3",
    marginHorizontal: 20,
    marginTop: 10,
  },
  socialContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  socialHeader: {
    fontSize: width > 768 ? 20 : 18,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  socialIcons: {
    flexDirection:"row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginVertical:10,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  iconContainer: {
    alignItems: "center",
    width: "50%",
    marginVertical:10,
  },
  socialText: {
    marginTop: 5,
    fontSize: width > 768 ? 14 : 12,
    color: "gray",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(74, 71, 71, 0.61)", // Semi-transparent background
    padding:10,
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding:20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 5,
    marginTop: 5,
    flex: 1,

  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    width: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: "25%", // Adjust position to center the icon
    left: "10%", // Adjust position to center the icon
    backgroundColor: "rgba(255, 255, 255, 0)", // Semi-transparent background
    borderRadius: 50, // To keep the icon round
    padding: 8,
  },
  
  profileImageContainer: {
    alignItems: "center",
    justifyContent:"center",
    position:"relative,",
    marginBottom: 15,
  },
  
  modalProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ccc",
    resizeMode: "cover",
  },

centeredCameraIcon: {
  position: "absolute",
  top: "45%",
  left: "45%",
  transform: [{ translateX: -15 }, { translateY: -15 }], // Centers the icon
  backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent black background
  borderRadius: 30,
  padding: 10,
  alignItems: "center",
  justifyContent: "center",
},

  imagePlaceholderText: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
  },
  imagePlaceholderContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  
  imagePlaceholderText: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    backgroundColor: "rgba(255, 255, 255, 0)", // Semi-transparent overlay
    padding: 20,
    borderRadius: 50, // Optional, matches the profile image shape
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    overflow: "hidden",
  },
  
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#f8f8f8",
    color: "#333",
  },
  
  pickerItem: {
    height: 10,
    fontSize: 16,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
  },
  saveButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
    width: '100%',
    marginBottom: 20
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 20, // Adjust to place it at the top-right corner
    right:55, // Adjust to align it with the right edge
    padding: 10,
    zIndex: 100, // Ensure it's above all other components
  },
  closeButtonText: {
    color: "blaxk",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  
});


export default styles;
