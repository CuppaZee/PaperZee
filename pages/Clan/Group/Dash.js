import * as React from 'react';
import { Text, View, Image, ScrollView, FlatList, TouchableHighlight } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { List, ActivityIndicator } from 'react-native-paper';
import request from '../../../redux/request'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../../components/Card';

var countup = (t) => (a, b) => {
  a[b[t]] = (a[b[t]] || 0) + 1;
  return a;
}

var count = (array, t) => {
  return Object.entries(array.reduce((a, b) => {
    a[b[t]] = (a[b[t]] || 0) + 1;
    return a;
  }, {})).sort((a, b) => b[1] - a[1])
}

var creatures = {
  'firepouchcreature': 'tuli',
  'waterpouchcreature': 'vesi',
  'earthpouchcreature': 'muru',
  'airpouchcreature': 'puffle',
  'mitmegupouchcreature': 'mitmegu',
  'unicorn': 'theunicorn',
  'fancyflatrob': 'coldflatrob',
  'fancy_flat_rob': 'coldflatrob',
  'fancyflatmatt': 'footyflatmatt',
  'fancy_flat_matt': 'footyflatmatt',
  'tempbouncer': 'expiring_specials_filter',
  'temp_bouncer': 'expiring_specials_filter'
}

var hostIcon = (icon) => {
  var host = icon.match(/\/([^\/\.]+?)_?(?:virtual|physical)?_?host\./)?.[1];
  if (!host) return null;
  return `https://munzee.global.ssl.fastly.net/images/pins/${creatures[host] ?? host}.png`;
}

export default function ClanGroupDash({group}) {
  var nav = useNavigation()
  // var date = new Date(Date.now() - (5 * 60 * 60000));
  // var dateString = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${(date.getUTCDate()).toString().padStart(2, '0')}`
  // var dispatch = useDispatch();
  // var { data } = useSelector(i => i.request_data[`user/activity?user_id=${user_id}&day=${dateString}`] ?? {})
  // var { data: userdata } = useSelector(i => i.request_data[`user/details?user_id=${user_id}`] ?? {})
  // useFocusEffect(
  //   React.useCallback(() => {
  //     dispatch(request.add(`user/activity?user_id=${user_id}&day=${dateString}`))
  //     dispatch(request.add(`user/details?user_id=${user_id}`))
  //     return () => {
  //       dispatch(request.remove(`user/activity?user_id=${user_id}&day=${dateString}`))
  //       dispatch(request.remove(`user/details?user_id=${user_id}`))
  //     };
  //   }, [user_id])
  // );
  // if (!data?.data?.captures) {
  //   if(!data) {
  //     return (
  //       <View style={{ flexDirection: "column", flex: 1, width: "100%", alignContent: "center", backgroundColor: '#e6fcd9' }}>
  //         <ActivityIndicator size="large" color="#000" />
  //       </View>
  //     )
  //   } else {
  //     return (
  //       <View>
  //         <Text>{JSON.stringify(data)}</Text>
  //       </View>
  //     );
  //   }
  // }
  return (
    // <View style={{ flex: 1, alignItems: "stretch", flexDirection: "column", backgroundColor: "#e9ffdc"??"#e6fcd9", borderRadius: 8 }}>
    <Card noPad onPress={()=>nav.navigate('ClanGroup',{group})}>
      <Image style={{flex:1,borderRadius:8,minHeight:250}} source={{
        bushrangers:require('../../../assets/BushrangersBanner.jpg'),
        cuppaclans:require('../../../assets/BushrangersBanner.jpg')
      }[group]} />
    </Card>
    // </View>
  );
}