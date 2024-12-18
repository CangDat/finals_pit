// app/(tabs)/AboutUs.js
import React from 'react';
import { View, Text, ImageBackground} from 'react-native';
import styles from '../../components/homeStyle';

const backgroundImage = { uri: 'https://images.unsplash.com/photo-1530569673472-307dc017a82d?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' };

const AboutUs = () => {
  return (
   
    <View style={styles.container}>
      <View style={styles.profileContainer}>

      <Text style={styles.name}>About Us</Text>
      <Text style={styles.name}>This is the About Us page!</Text>
      </View>
    </View>

  );
};

export default AboutUs;
