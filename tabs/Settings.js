import * as React from 'react';
import { Button, Text, View, Platform, Image, Dimensions } from 'react-native';
import { useDimensions } from '@react-native-community/hooks'
import redux, { useSelector, useDispatch } from "react-redux";

function forceReload() {
  try {
    global.navigator.serviceWorker.getRegistration().then(function(reg) {
      if (reg) {
        reg.unregister().then(function() { global.window.location.reload(true); });
      } else {
        global.window.location.reload(true);
      }
    });
  } catch(e) {
    global.window.location.reload(true);
  }
}

export default function SettingsScreen({ navigation }) {
  var logins = useSelector(i=>i.logins);
  var dispatch = useDispatch();
  var {width,height} = useDimensions().window;
  return (
    <View style={{ flex: 1, backgroundColor: '#e6fcd9', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{width:width>800?width/2:width,borderRadius:4,backgroundColor:"white"}}>
        {Object.entries(logins).map(user=><View key={user[0]} style={{padding:8,flexDirection:"row"}}>
          <Image source={{uri:`https://munzee.global.ssl.fastly.net/images/avatars/ua${Number(user[0]).toString(36)}.png`}} style={{borderRadius:24,width:48,height:48}} />
          <View style={{paddingLeft:8,flexGrow:1,alignSelf:"center"}}>
            <Text style={{fontWeight:"bold",fontSize:16}}>{user[1].username}</Text>
          </View>
        </View>)}
        <Button
          title="Add User"
          onPress={() => navigation.navigate('Auth')}
        />

        <View style={{backgroundColor:'white'}}><Text><Text style={{fontWeight:"bold"}}>Supporters: </Text>Code input is not yet necessary as I've decided to release User Activity to everyone. Code input will be added when I add another feature</Text></View>
        {Platform.OS==="web"&&<Button
          title="Force Update"
          onPress={() => forceReload()}
        />}
      </View>
      {/* <Text>{data.loading}</Text>
      <Text>{JSON.stringify(data.requests)}</Text>
      <Text>{JSON.stringify(data.logins)}</Text>
      <Text>{JSON.stringify(data.loadingLogin)}</Text>
      <Text>{JSON.stringify(Object.keys(data))}</Text> */}
    </View>
  );
}