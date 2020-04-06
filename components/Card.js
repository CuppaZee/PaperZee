import * as React from 'react';
import { View } from 'react-native';
import { TouchableRipple, Surface } from 'react-native-paper';

// const x = false;

export default function (props) {
  var x = false;
  if (x) return (
    <TouchableRipple rippleColor="rgba(0, 0, 0, .32)" style={{ borderRadius: 8 }} onPress={props.onPress}>
      <View style={{ padding: props.noPad === undefined ? 8 : 0, borderWidth: 0, borderColor: "black", borderRadius: 8, backgroundColor: "#e9ffdc" }}>
        {props.children}
      </View>
    </TouchableRipple>
  )
  return (
    // height: '100%', 
    <TouchableRipple rippleColor="rgba(0, 0, 0, .32)" style={{ flex: 1, borderRadius: 8 }} onPress={props.onPress}>
      <Surface style={{ flex: 1, elevation: 4, padding: props.noPad === undefined ? 8 : 0, borderRadius: 8, backgroundColor: "#e9ffdc", ...(props.cardStyle||{}) }}>
        {props.children}
      </Surface>
    </TouchableRipple>
  )
}