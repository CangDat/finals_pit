import { Text, View, StyleSheet } from 'react-native';
import React, {useState, useEffect, useSyncExternalStore} from 'react';

export default function AboutScreen() {
  const [backendData, setBackendData] = useState([{}])

  useEffect(() =>{
    fetch("/api").then(
      response => response.json()
    ).then(
      data =>{
        setBackendData(data)
      }
    )
  }, [])
 
 
 
 
 
  return (
    <View style={styles.container}>
      {(typeof backendData.users === 'undefined') ? (
        <p>Loading ...</p>
      ):(
        backendData.users.map((user, i)=>(
          <p key={i}>{user}</p>
        ))
      )}

      <Text style={styles.text}>About Us</Text>
      <Text style={styles.description}>
        This is a simple application to demonstrate tab navigation.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
});
