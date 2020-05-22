import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

function Home(props) {
  const { navigation } = props
  return (
    <View style={styles.container}>
      <Text style={styles.text}>easyTravel!</Text>
      <Text style={styles.text}>Collect Moments</Text>
      <Text style={styles.buttonText}>not thinks.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ebebeb'
  },
  text: {
    color: '#101010',
    fontSize: 24,
    fontWeight: 'bold'
  }
})

export default Home;
