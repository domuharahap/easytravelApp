import React, { useState, useEffect } from 'react';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../pages/Home';
import Settings from '../pages/Settings';

import FindJourney from '../pages/FindJourney';
import SpecialOffer from '../pages/SpecialOffer';
import JourneyDetails from '../pages/JourneyDetails';
import Review from '../pages/Review';
import Payment from '../pages/Payment';
import Signin from '../pages/Login';

import Profile from '../pages/Profile';
import Notifications from '../pages/Notifications';

import { MenuButton } from "../components/header/header";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

//HeaderTile
function getHeaderTitle(route) {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen || 'Home'

  switch (routeName) {
    case 'Home':
      return 'Home'
    case 'Account':
      return 'Account'
    case 'Find Journey':
      return 'Find Journey'
    case 'Special Offers':
      return 'Special Offers'
    case 'JourneyDetails':
      return 'JourneyDetails'
    case 'Review':
      return 'Review'
    case 'Payment':
      return 'Payment'
    case 'Signin':
      return 'Signin'
      break;
  }
}

function getHeaderRight(route, navigation) {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen || 'Home'

  switch (routeName) {
    case 'Account':
      return (<MenuButton onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} /> )
  }
}
//Drawer navigations
function MainDrawerNavigation(){
  return (
    <Drawer.Navigator initialRouteName="Profile">
      <Drawer.Screen
        name="Profile"
        component={Profile}
      />
      <Drawer.Screen
        name="Notifications"
        component={Notifications}
      />
      <Drawer.Screen
        name="Signin"
        component={Signin}
      />
    </Drawer.Navigator>
  );
}

//Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#fff',
        style: {
          backgroundColor: '#64c07a'
        }
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName
          if (route.name == 'Home') {
            iconName = 'ios-home'
          } else if (route.name == 'Find Journey') {
            iconName = 'ios-search'
          } else if (route.name == 'Special Offers') {
            iconName = 'ios-pricetags'
          } else if (route.name == 'Account') {
            iconName = 'ios-person'
          }

          return <Ionicons name={iconName} color={color} size={size} />
        }
      })}>
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Find Journey' component={FindJourney} />
      <Tab.Screen name='Special Offers' component={SpecialOffer} />
      <Tab.Screen name='Account' component={MainDrawerNavigation} />
    </Tab.Navigator>
  )
}

//Stack Navigator
function MainStackNavigator() {
  //const [progress, setProgress] = useState(false);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{
          gestureEnabled: true,
          headerStyle: {
            backgroundColor: '#64c07a'
          },
          headerTitleStyle: {
            fontWeight: 'bold'
          },
          headerTintColor: '#fff',
          headerBackTitleVisible: false
        }}
        headerMode='float'>
        <Stack.Screen
          name='Home'
          component={MainTabNavigator}
          options={({ route, navigation }) => ({
            headerTitle: getHeaderTitle(route),
            headerLeft: () => getHeaderRight(route, navigation),
          })}
        />
        <Stack.Screen
          name='JourneyDetails'
          component={JourneyDetails}
          options={({ route }) => ({
            id: route.params.item.id
          })}
        />
        <Stack.Screen
          name='Review'
          component={Review}
          options={({ route }) => ({
            id: route.params.item.id,
            totalTraveler: route.totalTraveler
          })}
        />
        <Stack.Screen
          name='Payment'
          component={Payment}
          options={({ route }) => ({
            id: route.params.item.id,
            totalTraveler: route.totalTraveler
          })}
        />
        <Stack.Screen
          name='Signin'
          component={Signin}
          options={{ title: 'Signin' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigator;
