import * as React from 'react';
import { Button, Text, View } from 'react-native';
import MapView from 'react-native-maps';

export default function MapScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#c6e3b6', justifyContent: 'center', alignItems: 'center' }}>
      <MapView />
    </View>
  );
}