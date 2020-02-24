import * as React from 'react';
import { Button, Text, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#c6e3b6', justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
      <Button
        title="Go to User Activity"
        onPress={() => navigation.navigate('UserActivity')}
      />
    </View>
  );
}