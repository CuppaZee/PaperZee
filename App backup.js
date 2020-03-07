import * as React from 'react';
import { NavigationContainer, useLinking, useNavigation } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Linking } from 'expo';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import s from './redux/index'
var { store, refresh } = s;

import DashScreen from './tabs/Dash';
import SettingsScreen from './tabs/Settings';
import ToolsScreen from './tabs/Tools';
import MapScreen from './tabs/Map';

import UserActivityScreen from './pages/User/Activity/Page';
import MunzeeDetailsScreen from './pages/Munzee/Details/Page';

import { Platform, AsyncStorage, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaConsumer } from 'react-native-safe-area-context';
import { IconButton } from 'react-native-paper'
import LoadingButton from './LoadingButton';

const Tab = createMaterialBottomTabNavigator();

const Stack = createStackNavigator();

function Tabs() {
  return <Tab.Navigator
    initialRouteName="Home"
    barStyle={{backgroundColor:'#016930'}}
    shifting={true}
    >
    <Tab.Screen
      name="Dash"
      component={DashScreen}
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
  const ref = React.useRef();

  const { getInitialState } = useLinking(ref, {
    prefixes: ['https://paper.cuppazee.uk', 'cuppazee://'],
    config: {
      Home: 'Home',
      UserActivity: {
        path: 'User/:userid/Activity',
        parse: {
          userid: Number
        }
      },
      MunzeeDetails: 'Munzee/:url',
      AuthSuccess: 'authsuccess/:code/:id/:name'
    },
  });
  var [login,setLogin] = React.useState(null);
  var [newAuthentication,setNewAuthentication] = React.useState(false);
  var [isReady, setIsReady] = React.useState(false);
  var [initialState, setInitialState] = React.useState();
  var [savingData, setSavingData] = React.useState(false);

  React.useEffect(() => {
    Promise.race([
      getInitialState(),
      new Promise(resolve =>
        setTimeout(resolve, 150)
      )
    ])
      .catch(e => {
        console.error(e);
      })
      .then(state => {
        console.log('initial',state)
        if (state !== undefined) {
          setInitialState(state);
        }

        setIsReady(true);
      });
  }, [getInitialState]);
  

  async function getLogin() {
    const value = await AsyncStorage.getItem('LOGIN')
    console.log(value)
    if(value!==null) {
      setLogin(JSON.parse(value))
    } else {
      setLogin(false)
    }
  }

  React.useEffect(function() {
    getLogin();
  },[true])

  async function saveLogin(value) {
    console.log('SAVELOGIN',value);
    await AsyncStorage.setItem('LOGIN',JSON.stringify(value));
    setLogin(value);
    setNewAuthentication(false);
    return true;
  }

  function handleNavChange({url}) {
    if(url.includes('authsuccess')) {
      var x = {};
      var auth = url.match(/authsuccess\/([a-z0-9]+)\/([0-9]+)\/([^]+)/).slice(1,4);
      x[auth[1]] = {
        username: auth[2],
        code: auth[0]
      }
      saveLogin({...(login??{}),...x})
    }
  }

  if(!savingData&&isReady&&initialState&&initialState.routes[initialState.routes.length-1].name=="AuthSuccess") {
    console.log(initialState);
    var params = initialState.routes[initialState.routes.length-1].params;
    var x = {};
    x[params.id] = {
      username: params.name,
      code: params.code
    }
    setSavingData(true)
    saveLogin({...(login??{}),...x}).then(()=>{
      console.log('AUTH',{...(login??{}),...x});
      setInitialState({
        routes: [
          { name: 'Home' }
        ],
      })
      setTimeout(()=>setSavingData(false),1000)
    })
  }
  if (!isReady) {
    return null;
  }
  if (savingData) {
    return null;
  }
      //http://localhost:19006/authsuccess/f508b53be6aad36a6efc66e220d976fe18b4ffb0/125914/sohcah
      // return null;

  if(Platform.OS!='web'&&(login===false||newAuthentication)) {
    return <SafeAreaProvider>
      <SafeAreaConsumer>{insets=><WebView
          source={{ uri: 'https://flame.cuppazee.uk/auth' }}
          textZoom={200}
          style={{marginTop:insets.top}}
          onNavigationStateChange={handleNavChange}
      />}</SafeAreaConsumer>
    </SafeAreaProvider>
  }
  if(Platform.OS=='web'&&!savingData&&(login===false||newAuthentication)) {
    Linking.openURL('https://flame.cuppazee.uk/auth')
  }
  function handleStateChange(state) {
    if(state.routes[state.routes.length-1].name=="Auth") {
      setNewAuthentication(true);
    }
  }
  return (
    <ReduxProvider store={store}>
      <NavigationContainer onStateChange={handleStateChange} initialState={initialState} ref={ref}>
        <Stack.Navigator
          screenOptions={({navigation,route})=>({
            gestureEnabled: Platform.OS=='ios',
            headerStyle: {
              backgroundColor: '#016930'
            },
            headerLeft: () => (
              route.name=="Home"?null:<IconButton
                onPress={()=>{navigation.canGoBack()?navigation.goBack():navigation.replace('Home')}}
                color="#fff"
                icon={navigation.canGoBack()?'arrow-left':'home'}
              />
            ),
            headerRight: () => {
              return (
                <View style={{flexDirection:"row"}}>
                    {(route.name=="Home"||!navigation.canGoBack())?null:<IconButton
                      onPress={()=>navigation.replace('Home')}
                      color="#fff"
                      icon="home"
                    />}
                    <LoadingButton/>
                  </View>
              )
            },
            headerTintColor: '#fff',
          })}>
          <Stack.Screen
            name="Home"
            options={{
              title: JSON.stringify(store.requests),
            }}
            component={Tabs}
            />
          <Stack.Screen
            name="Auth"
            options={{
              title: "Authenticate",
            }}
            component={()=>{
              var navigation = useNavigation();
              setTimeout(()=>navigation.replace('Home'),100)
              return null
            }}
            />
          <Stack.Screen
            name="UserActivity"
            options={{
              title: 'User Activity',
            }}
            component={UserActivityScreen}
            />
          <Stack.Screen
            name="MunzeeDetails"
            options={{
              title: 'Munzee Details',
            }}
            component={MunzeeDetailsScreen}
            />
          <Stack.Screen
            name="AuthSuccess"
            options={{
              title: 'Authentication Successful',
            }}
            component={()=>{
              // var navigation = useNavigation();
              // navigation.replace('Home')
              return null
            }}
            />
        </Stack.Navigator>
      </NavigationContainer>
    </ReduxProvider>
  );
}