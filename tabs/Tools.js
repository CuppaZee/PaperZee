import * as React from 'react';
import { Button, Text, View } from 'react-native';

export default function ToolsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#c6e3b6', justifyContent: 'center', alignItems: 'center' }}>
      <Text>Tools Page</Text>
      {/* <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      /> */}
      <View style={{position:"absolute",top:0,left:0,bottom:0,right:0,alignItems:"center",justifyContent:"center"}}>
        <View style={{borderRadius:8,backgroundColor:'#ff3322',padding:8}}>
          <Text style={{fontWeight:"bold",fontSize:20,color:"white"}}>Coming Soon</Text>
        </View>
      </View>
    </View>
  );
}