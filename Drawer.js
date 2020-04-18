import * as React from 'react'
import { Text, View, Image } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CustomDrawerContent(props) {
  var dash = useSelector(i=>i.dash);
  var users = useSelector(i=>Object.entries(i.logins));
  var route = useSelector(i=>i.route);
  var nav = props.navigation;
  
  var allclans = [
    [1349, "The Cup of Coffee Clan"],
    [457, "The Cup of Tea Clan"],
    [1441, "The Cup of Cocoa Clan"],
    [1902, "The Cup of Hot Chocolate Clan"],
    [1870, "The Cup of Horlicks Clan"],
    [-1, "CuppaClans Shadow Crew"],
    [1493, "Bushrangers Pistol"],
    [1605, "Bushrangers Gin"],
    [-2, "Bushrangers Shadow"],
    [251, "ALLSTARS"],
    [1695, "ALLSTARS II"],
    [1793, "Hjælp, jeg er en fisk!"],
    [1551, "Cockers"],
    [19, "Maryland Munzee Militia (HC)"]
  ];
  var pages = [
    {title:"Search",icon:"magnify",page:"Search"},
    {title:"Maps",icon:"map", focused: true,page:"Map"},
    {title:"Tools",icon:"wrench",page:"Tools"},
    {title:"Settings",icon:"settings",page:"Settings"}
  ]
  return (
    <DrawerContentScrollView {...props}>
      {/* <View style={{paddingTop: 8, paddingLeft: 18}}>
        <Text style={{fontSize:16,fontWeight:"bold",color:"#000a"}}>Tools</Text>
      </View> */}
      {pages.map?.(i=><DrawerItem
        activeBackgroundColor="#016930"
        activeTintColor="#ffffff"
        style={{marginVertical:0}}
        focused={route.name==i.page}
        icon={({ focused, color, size }) => <MaterialCommunityIcons name={i.icon} color={color} size={24} style={{marginRight: -24, marginLeft: 4, marginVertical: 4}} />}
        label={i.title}
        onPress={() => nav.reset({
            index: 1,
            routes: [
              { name: '__primary', params: {screen: i.page} },
            ],
          })
        }
      />)}
      <View style={{paddingTop: 8, paddingLeft: 18}}>
        <Text style={{fontSize:16,fontWeight:"bold",color:"#000a"}}>Users</Text>
      </View>
      {users?.map?.(i=><DrawerItem
        activeBackgroundColor="#016930"
        activeTintColor="#ffffff"
        style={{marginVertical:0}}
        icon={({ focused, color, size }) => <Image style={{height: 32, width: 32, marginRight: -28, borderRadius: 16}} source={{uri:`https://munzee.global.ssl.fastly.net/images/avatars/ua${Number(i[0]||0).toString(36)}.png`}} />}
        label={i[1].username}
        focused={route.name=="UserActivity"&&route.params?.userid==Number(i[0])}
        onPress={() => nav.reset({
            index: 1,
            routes: [
              { name: '__primary', params: {screen: "UserActivity", params: {userid: Number(i[0])}} },
            ],
          })
        }
      />)}
      <View style={{paddingTop: 8, paddingLeft: 18}}>
        <Text style={{fontSize:16,fontWeight:"bold",color:"#000a"}}>Clans</Text>
      </View>
      <DrawerItem
        activeBackgroundColor="#016930"
        activeTintColor="#ffffff"
        style={{marginVertical:0}}
        focused={route.name=="AllClans"}
        icon={({ focused, color, size }) => <MaterialCommunityIcons name="shield-half-full" color={color} size={24} style={{marginRight: -24, marginLeft: 4, marginVertical: 4}} />}
        label="All Clans"
        onPress={() => nav.reset({
            index: 1,
            routes: [
              { name: '__primary', params: {screen: "AllClans"} },
            ],
          })
        }
      />
      {dash?.map?.(i=><DrawerItem
        activeBackgroundColor="#016930"
        activeTintColor="#ffffff"
        style={{marginVertical:0, opacity: 0.6}}
        // focused={i.clan_id==1349}
        icon={({ focused, color, size }) => <Image style={{height: 32, width: 32, marginRight: -28, borderRadius: 16}} source={{uri:`https://munzee.global.ssl.fastly.net/images/clan_logos/${(i.clan_id||0).toString(36)}.png`}} />}
        label={(allclans.find(x=>x[0]==i.clan_id)||[0,i.clan_id||"?"])[1].toString()}
        onPress={() => {}}
      />)}
      {/* <DrawerItemList activeBackgroundColor="#016930" activeTintColor="#ffffff" itemStyle={{marginVertical:0}} {...props} /> */}
    </DrawerContentScrollView>
  );
}