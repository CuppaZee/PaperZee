import * as React from 'react';
import { NavigationContainer, useLinking, useNavigation } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider as ReduxProvider, useSelector, useDispatch } from 'react-redux';
import s from './redux/index'
var { store, login } = s;

import DashScreen from './tabs/Dash';
import SettingsScreen from './tabs/Settings';
import ToolsScreen from './tabs/Tools';
import MapScreen from './tabs/Map';

import UserActivityScreen from './pages/User/Activity/Page';
import MunzeeDetailsScreen from './pages/Munzee/Details/Page';

import { Platform, View, Text } from 'react-native';
import { IconButton, ActivityIndicator } from 'react-native-paper'
import LoadingButton from './LoadingButton';
import WebView from 'react-native-webview';
import { Linking } from 'expo';

const Tab = createMaterialBottomTabNavigator();

const Stack = createStackNavigator();

function AuthScreen() {
  var [auth,setAuth] = React.useState(false);
  var loggedIn = useSelector(i=>i.loggedIn);
  var dispatch = useDispatch();
  var nav = useNavigation();
  if(auth&&loggedIn) nav.replace('Home');
  function handleNavChange({url}) {
    if(url.includes('authsuccess')) {
      var x = {};
      var auth = url.match(/authsuccess\/([a-z0-9]+)\/([0-9]+)\/([^]+)/).slice(1,4);
      x[auth[1]] = {
        username: auth[2],
        code: auth[0]
      }
      setAuth(true);
      dispatch(login(x));
    }
  }
  if(Platform.OS=="web") {
    Linking.openURL('https://flame.cuppazee.uk/auth');
    return null;
  }
  if(auth) return <View style={{flex:1,alignContent:"center"}}><ActivityIndicator size="large" color="#000" /></View>
  return <WebView
    source={{ uri: 'https://flame.cuppazee.uk/auth' }}
    textZoom={200}
    style={{flex:1}}
    onNavigationStateChange={handleNavChange}
  />
}
function AuthSuccessScreen(props) {
  var [auth,setAuth] = React.useState(false);
  var loggedIn = useSelector(i=>i.loggedIn);
  var dispatch = useDispatch();
  var nav = useNavigation();
  if(auth&&loggedIn) nav.replace('Home');
  React.useEffect(()=>{
    console.log(props.route)
    if(!props.route?.params?.code) {
      nav.replace('Auth');
    } else {
      var authx = props.route?.params
      var x = {};
      x[authx.id] = {
        username: authx.name,
        code: authx.code
      }
      setAuth(true);
      dispatch(login(x));
    }
  },[])
  if(auth) return <View style={{flex:1,alignContent:"center"}}><ActivityIndicator size="large" color="#000" /></View>
  return <Text>...</Text>
}

function Tabs() {
  return <Tab.Navigator
    initialRouteName="Home"
    barStyle={{ backgroundColor: '#016930' }}
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
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="map" color={color} size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="Tools"
      component={ToolsScreen}
      options={{
        tabBarLabel: 'Tools',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="wrench" color={color} size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarLabel: "Settings",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="settings" color={color} size={24} />
        ),
      }}
    />
  </Tab.Navigator>
}

function App() {
  const loadingLogin = useSelector(i=>i.loadingLogin);
  const loggedIn = useSelector(i=>i.loggedIn);
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
  var [isReady, setIsReady] = React.useState(false);
  var [initialState, setInitialState] = React.useState();

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
        if (state !== undefined) {
          setInitialState(state);
        }

        setIsReady(true);
      });
  }, [getInitialState]);

  function handleStateChange() { }

  if (loadingLogin) {
    return <Text>Loading...</Text>;
  }
  if (!isReady) {
    return null;
  }
  return (
    <NavigationContainer onStateChange={handleStateChange} initialState={initialState} ref={ref}>
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          gestureEnabled: Platform.OS == 'ios',
          headerStyle: {
            backgroundColor: '#016930'
          },
          headerLeft: () => (
            (route.name == "Home" || !loggedIn) ? null : <IconButton
              onPress={() => { navigation.canGoBack() ? navigation.goBack() : navigation.replace('Home') }}
              color="#fff"
              icon={navigation.canGoBack() ? 'arrow-left' : 'home'}
            />
          ),
          headerRight: () => {
            return loggedIn && (
              <View style={{ flexDirection: "row" }}>
                {(route.name == "Home" || !navigation.canGoBack()) ? null : <IconButton
                  onPress={() => navigation.replace('Home')}
                  color="#fff"
                  icon="home"
                />}
                <LoadingButton />
              </View>
            )
          },
          headerTintColor: '#fff',
        })}>
        {loggedIn && <>
          <Stack.Screen
            name="Home"
            options={{
              title: JSON.stringify(store.requests),
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
            name="MunzeeDetails"
            options={{
              title: 'Munzee Details',
            }}
            component={MunzeeDetailsScreen}
          />
        </>}
        <Stack.Screen
          name="Auth"
          options={{
            title: "Authenticate",
          }}
          component={AuthScreen}
        />
        <Stack.Screen
          name="AuthSuccess"
          options={{
            title: 'Authentication Successful',
          }}
          component={AuthSuccessScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function () {
  return <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
}