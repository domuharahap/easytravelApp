import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import Environment from '../config/Environment';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/Ionicons";

//TODO: import Dynatrace
//import { Dynatrace, Platform } from '@dynatrace/react-native-plugin';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      username:"",
      password:"",
      isLoading: false,
      message:"",
      authenticated: false,
      lock: true
    }
  }

  componentDidMount() {
    this.login();
  }

  login = async () => {
    const username = await AsyncStorage.getItem("username");
    const password = await AsyncStorage.getItem("password");
    const name = await AsyncStorage.getItem("name");
    console.log(username);
    if(username){
      this.setState({username: username});
      this.setState({password: password});
      this.setState({name: name});
      this.setState({authenticated: true});
      this.setState({lock: false});
    }
  }

  onLogout = async () => {
    //console.log("logout");
    try{
       await AsyncStorage.clear();
       this.setState({username: ""});
       this.setState({password: ""});
       this.setState({name: ""});
       this.setState({authenticated: false});
       this.setState({lock: true});
    }catch (err) {
      console.log(err);
    }
  }

  authenticate = async (username, password) => {
    this.setState({isLoading:true,message:""})

    fetch(Environment.backend_endpoint+'easytravel/rest/login', {
        method: 'POST', // or 'PUT'
        headers: Environment.headers,
        credentials: 'same-origin',
        body: JSON.stringify({
          username: username,
          password: password
        }),
      })
      .then((response) => response.json())
      .then(async (json) => {
        const user = json.user;
        if(user) {

          //onLogin Success Identify a user
          //Dynatrace.identifyUser(username);

          await AsyncStorage.setItem('name', user.firstName+" "+user.lastName);
          await AsyncStorage.setItem("username", username);
          await AsyncStorage.setItem("email", user.email);
          await AsyncStorage.setItem("password", password);
          this.setState({authenticated: true});
          this.setState({username: username});
          this.setState({password: password});
          this.setState({name: user.firstName+" "+user.lastName});
          this.props.navigation.navigate("Home");
        }else{
          console.log("invalid login");
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }
  unLock = async () => {
    if(this.state.lock){
      this.setState({username: "barnabassas"});
      this.setState({password: "barnabassas"});
      this.setState({lock: false});
    }else {
      console.log("username password is set");
    }
  }

  render(){
    const { navigation } = this.props;
    const { isLoading } = this.state;

    return(
      <View style={styles.container}>
        {this.state.authenticated ? <Text style={styles.logo}>Hi {this.state.name} </Text> : <Text style={styles.logo}>Signin</Text> }
        { isLoading ? <ActivityIndicator/> : (
          <>
            <View style={styles.inputView} >
              <TextInput
                editable={this.state.authenticated ? false : true}
                value={this.state.username}
                style={styles.inputText}
                placeholder="Username..."
                placeholderTextColor="#003f5c"
                onChangeText={text => this.setState({username:text})}/>
            </View>
            <View style={styles.inputView} >
              <TextInput
                editable={this.state.authenticated ? false : true}
                value={this.state.password}
                secureTextEntry
                style={styles.inputText}
                placeholder="Password..."
                placeholderTextColor="#003f5c"
                onChangeText={text => this.setState({password:text})}/>
            </View>
            {this.state.authenticated ? (
              <TouchableOpacity style={styles.loginBtn} onPress={this.onLogout}>
                <Text style={{color:"#fff"}}>LOGOUT</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.loginBtn} onPress={()=>this.authenticate(this.state.username, this.state.password)}>
                  <Text style={{color:"#fff"}}>LOGIN</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity onPress={this.unLock}>
              { this.state.lock
                ? <Icon name="ios-lock" size={30} style = {{color: 'black',paddingLeft: 10}}/>
                : <Icon name="ios-unlock" size={30} style = {{color: 'black',paddingLeft: 10}}/>
              }
            </TouchableOpacity>
          </>
      )}

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
  inputView:{
    width:"90%",
    backgroundColor:"#F5F5F5",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"black"
  },
  forgot:{
    color:"black",
    fontSize:11
  },
  loginBtn:{
    width:"90%",
    backgroundColor:"#FFD700",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"black"
  },
  logoutButton: {
    paddingLeft: 10,
    fontSize: 16,
    color: '#0066cc',
    backgroundColor: '#FFFFFF',
  },
});
