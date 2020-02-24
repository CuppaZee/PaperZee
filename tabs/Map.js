import * as React from 'react';
import { Button, Text, View } from 'react-native';

export default function MapScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#c6e3b6', justifyContent: 'center', alignItems: 'center' }}>
      <Text>Map screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}