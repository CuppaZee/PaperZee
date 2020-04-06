import * as React from 'react';
import { Button, Text, View, TextInput } from 'react-native';
import Card from '../components/Card';
import { useFocusEffect } from '@react-navigation/native';

export default function SearchScreen({ navigation }) {
  var input = React.useRef();
  var [value,setValue] = React.useState('');
  useFocusEffect(
    React.useCallback(() => {
      // console.log(input);
      setTimeout(()=>input.current.focus(),100)
    }, [])
  );
  return (
    <View style={{ flex: 1, backgroundColor: '#c6e3b6' }}>
      <View style={{position:"absolute",top:0,left:0,bottom:0,right:0,alignItems:"center",justifyContent:"center"}}>
        <View style={{borderRadius:8,backgroundColor:'#ff3322',padding:8}}>
          <Text style={{fontWeight:"bold",fontSize:20,color:"white"}}>Coming Soon</Text>
        </View>
      </View>
      <View style={{padding:8}}>
        <TextInput
          ref={input}
          style={{ height: 40 }}
          onChangeText={text => setValue(text)}
          value={value}
          returnKeyType="search"
        />
      </View>
      {/* <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      /> */}
    </View>
  );
}