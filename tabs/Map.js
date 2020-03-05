import * as React from 'react';
import { Button, Text, View, Platform } from 'react-native';
// import MapView from 'react-native-maps';
var MapView;

export default function MapScreen({ navigation }) {
  var [MapViewLoading,setMapViewLoading] = React.useState(false);
  React.useEffect(()=>{
    if(!MapView && !MapViewLoading) {
      if(Platform.OS!=='web'){
        (async function (){
          setMapViewLoading(true);
          MapView = (await import('react-native-maps')).default;
          setMapViewLoading(false);
        })();
      } else {
        (async function (){
          setMapViewLoading(true);
          MapView = (await import('../map/web')).default;
          console.log('XXX',MapView)
          setMapViewLoading(false);
        })();
      }
    }
  },[MapView])
  if(MapView&&Platform.OS) {
    console.log(MapView);
    return (
      <MapView style={{ flex: 1 }} />
      //   <MapView />
      // </View>
    );
  } else if(MapView&&Platform.OS==='web') {
    console.log(MapView);
    return (
      <View style={{ flex: 1, backgroundColor: '#c6e3b6', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Maps are not currently supported on Web</Text>
      </View>
    )
  } else {
    return (
      <View style={{ flex: 1, backgroundColor: '#c6e3b6', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    )
  }
}