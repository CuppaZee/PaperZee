import * as React from 'react';
import { Button, Text, View, Platform } from 'react-native';
import request from '../redux/request';
import redux, { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';

export default function SettingsScreen({ navigation }) {
  var data = useSelector(i=>i);
  var dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      dispatch(request.add('user/activity?user_id=125914&day=2020-03-06'))
      return ()=>{
        dispatch(request.remove('user/activity?user_id=125914&day=2020-03-06'))
      };
    }, [])
  );
  return (
    <View style={{ flex: 1, backgroundColor: '#e6fcd9', justifyContent: 'center', alignItems: 'center' }}>
      {/* <Text>{data.loading}</Text>
      <Text>{JSON.stringify(data.requests)}</Text>
      <Text>{JSON.stringify(data.logins)}</Text>
      <Text>{JSON.stringify(data.loadingLogin)}</Text>
      <Text>{JSON.stringify(Object.keys(data))}</Text> */}
      <Button
        title="Add User"
        onPress={() => navigation.navigate('Auth')}
      />
    </View>
  );
}