import * as React from 'react';
import { Button, Text, View, Platform } from 'react-native';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#e6fcd9', justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}