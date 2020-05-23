import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

function Home(props) {
  const { navigation } = props
  return (
    <View style={styles.container}>
      <Text style={{color: '#101010', fontSize: 17, fontWeight: 'bold'}}>easyTravel!</Text>
      <Text style={{color: '#101010', fontSize: 40, fontWeight: 'bold'}}>Collect Moments</Text>
      <Text style={{color: '#101010', fontSize: 30, fontWeight: 'bold'}}>not things.</Text>
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
})

export default Home;
