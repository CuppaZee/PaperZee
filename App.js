import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AsyncStorage } from 'expo'
import { WebView } from 'react-native-webview';

import HomeScreen from './tabs/Home';
import SettingsScreen from './tabs/Settings';
import ToolsScreen from './tabs/Tools';
import MapScreen from './tabs/Map';

import UserActivityScreen from './pages/User/Activity/Page';
import { Platform, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaConsumer } from 'react-native-safe-area-context';

const Tab = createMaterialBottomTabNavigator();

const Stack = createStackNavigator();

function Tabs() {
  return <Tab.Navigator
    initialRouteName="Home"
    barStyle={{backgroundColor:'#016930'}}
    shifting={true}
    >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color} size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="Map"
      component={MapScreen}
      options={{
        tabBarLabel: 'Map',
        tabBarIcon: ({color}) => (
          <MaterialCommunityIcons name="map" color={color} size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="Tools"
      component={ToolsScreen}
      options={{
        tabBarLabel: 'Tools',
        tabBarIcon: ({color}) => (
          <MaterialCommunityIcons name="wrench" color={color} size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarLabel: "Settings",
        tabBarIcon: ({color}) => (
          <MaterialCommunityIcons name="settings" color={color} size={24} />
        ),
      }}
    />
  </Tab.Navigator>
}

export default function App() {
  var [currentPage,setCurrentPage] = React.useState('hi')
  var webref = null;
  // var style = `
  //   body {
  //     background-color: #c6e3b6;
  //     text-align: center;
  //   }
  //   input, button {
  //     border: 1px solid black;
  //     padding: 8px;
  //     font: unset;
  //     border-radius: 8px;
  //     background-color: white;
  //     font-size: 1rem!important;
  //   }
  //   img {
  //     width:300px;
  //   }
  //   form p:nth-child(1) {
  //     font-size: 1.4rem;
  //   }
  //   form p:nth-child(2) {
  //     font-size: 1.4rem;
  //   }
  // `
  // const runFirst = `
  //   document.children[0].innerHTML+=\`Hi<style>${style}</style>\`;
  //   true; // note: this is required, or you'll sometimes get silent failures
  // `;
  if(Platform.OS!='web') {
    return <SafeAreaProvider>
      <SafeAreaConsumer>{insets=><WebView
          ref={r => (webref = r)}
          source={{ uri: 'https://flame.cuppazee.uk/auth' }}
          textZoom={200}
          style={{marginTop:insets.top}}
          // injectedJavaScript={runFirst}
      />}</SafeAreaConsumer>
    </SafeAreaProvider>
        
    // <View>
    // <Text>Hi</Text>
    //   <Text>Hi</Text>
    //   <Text>Hi</Text>
    //   <Text>Hi</Text>
    //   <Text>Hi</Text>
      
    // </View>
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={()=>({
          headerStyle: {
            backgroundColor: '#016930'
          },
          headerTintColor: '#fff',
        })}>
        <Stack.Screen
          name="Home"
          options={{
            title: 'Home',
          }}
          component={Tabs}
          />
        <Stack.Screen
          name="UserActivity"
          options={{
            title: 'User Activity',
          }}
          component={UserActivityScreen}
          />
        <Stack.Screen
          name="Munzee"
          options={{
            title: 'Munzee',
          }}
          component={UserActivityScreen}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}