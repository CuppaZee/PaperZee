import * as React from 'react';
import { Button, Text, View, Platform } from 'react-native';
// import MapView from 'react-native-maps';
var MapView;

export default function MapScreen({ navigation }) {
  var [MapViewLoading,setMapViewLoading] = React.useState(false);
  React.useEffect(()=>{
    if(!MapView && !MapViewLoading) {
      (async function (){
        setMapViewLoading(true);
        MapView = (Platform.OS!=='web'?(await import('../map/native.js')):(await import('../map/web.js'))).default;
        setMapViewLoading(false);
      })();
    }
  },[MapView])
  if(MapView) {
    return (
      <MapView markers={[{lat:52,lng:-1,icon:'https://munzee.global.ssl.fastly.net/images/pins/treehouse.png'}]} style={{ flex: 1 }} />
    );
  } else {
    return (
      <View style={{ flex: 1, backgroundColor: '#c6e3b6', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    )
  }
}