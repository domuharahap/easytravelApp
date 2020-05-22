import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import Environment from '../config/Environment';
import AsyncStorage from '@react-native-community/async-storage';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      username:"",
      password:"",
      name: "",
      authenticated: false,
    }
  }

  componentDidMount() {
    this.login();
  }

  login = async () => {
    const name = await AsyncStorage.getItem("name");
    const username = await AsyncStorage.getItem("username");
    const password = await AsyncStorage.getItem("password");
    if(username && password){
      this.setState({name: name});
      this.setState({username: username});
      this.setState({password: password});
      this.setState({authenticated: true});
    }
  }

  onLogout = async () => {
    //console.log("logout");
    try{
       await AsyncStorage.clear();
       this.setState({username: ""});
       this.setState({password: ""});
       this.setState({authenticated: false});
    }catch (err) {
      console.log(err);
    }
  }

  render(){
    const { navigation } = this.props;
    const { isLoading } = this.state;

    return(
      <View style={styles.container}>
        {this.state.authenticated ?
          (
            <View style={styles.authenticate}>
              <Text style={styles.logo}>Hi {this.state.name}</Text>
              <TouchableOpacity style={styles.loginBtn} onPress={this.onLogout}>
                <Text style={{color:"#fff"}}>Singout</Text>
              </TouchableOpacity>
            </View>
          ):(
            <View  style={styles.authenticate}>
              <Text style={styles.logo}>Your are not Login </Text>
              <TouchableOpacity style={styles.loginBtn} onPress={() => {navigation.navigate('Signin')}}>
                <Text style={{color:"#fff"}}>LOGIN</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {navigation.navigate('Signup')}}>
                <Text style={styles.loginText}>Signup</Text>
              </TouchableOpacity>
          </View>
        )
      }
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:30,
    color:"black",
    marginBottom:40
  },
  authenticate:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn:{
    width:"90%",
    backgroundColor:"#FFD700",
    borderRadius:5,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10,
    padding:20
  }
});
