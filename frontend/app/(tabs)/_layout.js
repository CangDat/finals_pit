import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBarStyle, // Apply the custom tab bar style
        tabBarActiveTintColor: 'black', // Active icon color
        tabBarInactiveTintColor: 'gray', // Inactive icon color
        tabBarLabelStyle: styles.tabLabelStyle, // Style for tab labels
      }}
    >
      <Tabs.Screen
        name="homeScreen"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: () => <Ionicons name="home" size={25} color="white" />, // Customize icon color
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          headerShown: false,
          tabBarIcon: () => (
            <Ionicons name="information-circle" size={30} color="white" /> // Customize icon color
          ),
        }}
      />
    </Tabs>
  );
}

// Styles for the tab bar
const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#27ae60', // Set background color for the tab bar
    height: 50, // Customize the height of the tab bar
    paddingBottom: 5, // Add padding to the bottom of the tab bar
  
  },
  tabLabelStyle: {
    fontSize: 12, // Adjust font size for the tab labels
    fontWeight: 'bold', // Set font weight for the labels
    marginBottom: 5, // Space between the icon and the label
    color:"white"
  },
});
