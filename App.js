import * as React from 'react';
import { NavigationContainer, useLinking, useNavigation } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider as ReduxProvider, useSelector, useDispatch } from 'react-redux';
import s from './redux/index'
import lang from './lang/index'
var { store, login, setCurrentRoute } = s;

// import DashScreen from './tabs/Dash';
import AllClansScreen from './tabs/AllClans';
import ClanScreen from './tabs/Clan';
import ScannerScreen from './tabs/Scanner';
import SettingsScreen from './tabs/Settings';
import ToolsScreen from './tabs/Tools';
import MapScreen from './tabs/Map';
import SearchScreen from './tabs/Search';

import UserActivityScreen from './pages/User/Activity';
import UserInventoryScreen from './pages/User/Inventory';

import MunzeeDetailsScreen from './pages/Munzee/Details/Page';

import { Platform, View, Text, StatusBar } from 'react-native';
import { IconButton, ActivityIndicator, Provider as PaperProvider } from 'react-native-paper'
import LoadingButton from './LoadingButton';
import WebView from 'react-native-webview';
import { Linking } from 'expo';

import DrawerContent from './Drawer';
import { useDimensions } from '@react-native-community/hooks';

// const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();

function RedirectScreen() {
  var nav = useNavigation();
  var users = useSelector(i=>Object.keys(i.logins??{}));
  if(users && users[0]) {
    nav.replace('UserActivity',{userid:Number(users[0])});
  }
  return <Text>_redirect</Text>;
}

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
  if(auth&&loggedIn) nav.replace('_redirect');
  React.useEffect(()=>{
    if(!props.route?.params?.code) {
      nav.replace('_redirect');
    } else {
      var authx = props.route?.params
      var x = {};
      x[authx.id] = {
        username: authx.name,
        code: authx.code
      }
      console.log('AUTHED',authx)
      setAuth(true);
      dispatch(login(x));
      console.log('AUTHED')
    }
  },[])
  if(auth) return <View style={{flex:1,alignContent:"center"}}><ActivityIndicator size="large" color="#000" /></View>
  return <Text>...</Text>
}

function MainNav () {
  var { width } = useDimensions().window;
  const loggedIn = useSelector(i=>i.loggedIn);
  const theme = useSelector(i=>i.themes[i.theme]);
  return <Stack.Navigator
    screenOptions={({ navigation, route }) => ({
      gestureEnabled: Platform.OS == 'ios',
      headerStyle: {
        backgroundColor: theme.navigation.bg
      },
      headerLeft: () => (
        width<=1000?<View style={{flexDirection:"row"}}>
          {width<=1000&&<IconButton
            onPress={() => navigation.toggleDrawer()}
            color="#fff"
            icon="home"
          />}
          {/* {(route.name == "Home" || !loggedIn || !navigation.canGoBack()) ? null : <IconButton
            onPress={() => navigation.goBack()}
            color="#fff"
            icon="arrow-left"
          />} */}
        </View>:null
      ),
      headerRight: () => {
        return loggedIn && (
          <View style={{ flexDirection: "row" }}>
            {(route.name == "Home" || !loggedIn || navigation.dangerouslyGetState().index<1) ? null : <IconButton
              onPress={() => navigation.pop()}
              color="#fff"
              icon="arrow-left"
            />}
            {/* {(route.name == "Home" || !navigation.canGoBack()) ? null : <IconButton
              onPress={() => navigation.replace('Home')}
              color="#fff"
              icon="home"
            />} */}
            <LoadingButton />
          </View>
        )
      },
      headerTintColor: '#fff',
    })}>
    {loggedIn && <>
      <Stack.Screen
        name="_redirect"
        component={RedirectScreen}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
      />
      <Stack.Screen
        name="Tools"
        component={ToolsScreen}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
      />
      <Stack.Screen
        name="Scanner"
        component={ScannerScreen}
      />
      <Stack.Screen
        name="AllClans"
        component={AllClansScreen}
      />
      <Stack.Screen
        name="Clan"
        component={ClanScreen}
      />
      {/* <Stack.Screen
        name="Home"
        options={{
          title: "Hello",
        }}
        // component={Tabs}
      /> */}
      <Stack.Screen
        name="UserActivity"
        options={{
          title: 'User Activity',
        }}
        component={UserActivityScreen}
      />
      <Stack.Screen
        name="UserInventory"
        options={{
          title: 'User Inventory',
        }}
        component={UserInventoryScreen}
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
      label="Auth Success"
      component={AuthSuccessScreen}
    />
  </Stack.Navigator>
}

function Tabs() {
  var { width } = useDimensions().window;
  return <Drawer.Navigator
    drawerStyle={{width:width>500?240:width}}
    drawerContent={props => <DrawerContent {...props} />}
    drawerType={width>1000?"permanent":"back"}
    edgeWidth={100}
    openByDefault={true}
  >
    <Drawer.Screen
      name="__primary"
      label="__primary"
      component={MainNav}
      // component={App}
    />
    {/* <Drawer.Screen
      name="Dash"
      component={DashScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color} size={24} />
        ),
      }}
    />
    <Drawer.Screen
      name="Search"
      component={SearchScreen}
      options={{
        tabBarLabel: "Search",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="magnify" color={color} size={24} />
        ),
      }}
    />
    <Drawer.Screen
      name="Map"
      component={MapScreen}
      options={{
        tabBarLabel: 'Map',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="map" color={color} size={24} />
        ),
      }}
    />
    <Drawer.Screen
      name="Tools"
      component={ToolsScreen}
      options={{
        tabBarLabel: 'Tools',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="wrench" color={color} size={24} />
        ),
      }}
    />
    <Drawer.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarLabel: "Settings",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="settings" color={color} size={24} />
        ),
      }}
    /> */}
  </Drawer.Navigator>
}

function App() {
  const loadingLogin = useSelector(i=>i.loadingLogin);
  const ref = React.useRef();
  const dispatch = useDispatch();

  const { getInitialState } = useLinking(ref, {
    prefixes: ['https://paper.cuppazee.uk', 'cuppazee://'],
    config: {
      __primary: {
        path: '__you_should_never_see_this_please_report_it_on_facebook_at_cuppazee_or_via_email_at_mail_at_cuppazee_dot_uk',
        screens: {
          Tools: 'tools',
          Search: 'search',
          Map: 'maps',
          Scanner: 'scanner',
          Settings: 'settings',
          AllClans: 'clans/list',
          Clan: {
            path: 'clan/:clanid',
            parse: {
              clanid: Number
            }
          },
          UserActivity: {
            path: 'user/:userid/activity',
            parse: {
              userid: Number
            }
          },
          AuthSuccess: 'authsuccess/:code/:id/:name',
          Auth: 'auth',
          MunzeeDetails: 'munzee/:url',
        },
      }
    },
  });
  var [isReady, setIsReady] = React.useState(false);
  var [initialState, setInitialState] = React.useState();
  var theme = useSelector(i=>i.themes[i.theme])

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
          console.log('Initial Route',state?.routes?.[0]?.state?.routes?.slice?.()?.reverse?.()?.[0]);
          setTimeout(()=>dispatch(setCurrentRoute(state?.routes?.[0]?.state?.routes?.slice?.()?.reverse?.()?.[0]??{})),100);
          setInitialState(state);
        }

        setIsReady(true);
      });
  }, [getInitialState]);

  function handleStateChange(a,b,c) {
    dispatch(setCurrentRoute(a?.routes?.[0]?.state?.routes?.slice?.()?.reverse?.()?.[0]??{}))
  }

  if (loadingLogin) {
    return <Text>Loading...</Text>;
  }
  if (!isReady) {
    return null;
  }
  return (
    <NavigationContainer independent={true} onStateChange={handleStateChange} initialState={initialState} ref={ref}>
      <StatusBar translucent={true} backgroundColor={theme.navigation.bg + 'cc'} barStyle="light-content" />
      <Tabs/>
      {/* <MainNav/> */}
    </NavigationContainer>
  );
}

export default function () {
  return <ReduxProvider store={store}>
    <PaperProvider>
      <App />
      {/* <NavigationContainer independent={true}>
        <Tabs />
      </NavigationContainer> */}
    </PaperProvider>
  </ReduxProvider>
}