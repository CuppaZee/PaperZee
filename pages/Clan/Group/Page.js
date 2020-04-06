import * as React from 'react';
import { Text, View, Image, ScrollView, FlatList, TouchableHighlight } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ClanRequirements from '../../../components/Clan/Requirements';

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
    <ScrollView style={{flex: 1, backgroundColor: '#b3dc9c'??'#c6e3b6'??'#e6fcd9'}} contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", alignContents: "flex-start", padding: 4 }}>
        {/* {users.map(user=><View key={user} style={{padding:4,width:width>800?"50%":"100%"}}>
            <UserActivityDash user_id={user} />
        </View>)}
        <View style={{padding:4,width:width>800?"50%":"100%"}}>
            <ClanGroupDash group="cuppaclans" />
        </View> */}
        <View style={{padding:4,width:width>800?"50%":"100%"}}>
          <ClanRequirements />
        </View>
    </ScrollView>
  );
}