import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
//import { MenuButton, Logo } from "../components/header/header";

export default class Settings extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello! Welcome to my Seting page</Text>
        <Text>Add Crash reporting</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
