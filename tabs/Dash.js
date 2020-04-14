import * as React from 'react';
import { Button, Text, View, ScrollView, FlatList } from 'react-native';
import UserActivityDash from '../pages/User/Dash';
import ClanGroupDash from '../pages/Clan/Group/Dash';
import ClanRequirements from '../components/Clan/Requirements';
import ClanStats from '../components/Clan/Stats';
import { useDimensions } from '@react-native-community/hooks'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Card from '../components/Card';
import s from '../redux';
var { dash: dashR } = s;

export default function DashScreen() {
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
  var { width } = useDimensions().window;
  var nav = useNavigation();
  var users = useSelector(i => Object.keys(i.logins));
  var dash = useSelector(i => i.dash);
  var dispatch = useDispatch();
  var [edit, setEdit] = React.useState(false);

  function add(clan) {
    dispatch(dashR(dash.concat([{
      type: "clan_stats",
      clan_id: clan
    }])));
  }
  function remove(clan) {
    dispatch(dashR(dash.filter(i => i.clan_id != clan)));
  }
  return (
    <FlatList
      key={width}
      style={{backgroundColor:'#b3dc9c'}}
      contentContainerStyle={{padding:4}}
      numColumns={width>800?2:1}
      data={[
        ...users.map(i=>({
          type: "user",
          user_id: i,
          key: `u${i}`
        })),
        {type:"clan_requirements",key:"clanreq"},
        ...dash.map(i=>{
          i.key=i.clan_id;
          return i;
        }),
        {type:"blankHack"}
      ]}
      renderItem={({ item }) => ({
        clan_stats:<View style={{ padding: 4, flex: 1 }}>
          <ClanStats clan_id={item.clan_id} game_id={85} />
        </View>,
        clan_requirements:<View style={{ padding: 4, flex: 1 }}>
          <ClanRequirements game_id={85} />
        </View>,
        user:<View style={{ padding: 4, flex: 1 }}>
          <UserActivityDash user_id={item.user_id} />
        </View>,
        blankHack:<View style={{flex:1,padding:4}}></View>
      }[item.type])}
      keyExtractor={item => (item.key||"xd").toString()}
    />
    // <ScrollView style={{flex: 1, backgroundColor: '#b3dc9c'??'#c6e3b6'??'#e6fcd9'}} contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", padding: 4 }}>
    //     {users.map(user=><View key={user} style={{padding:4,width:width>800?"50%":"100%"}}>
    //       <UserActivityDash user_id={user} />
    //     </View>)}
    //     {/* <View style={{padding:4,width:width>800?"50%":"100%"}}> */}
    //       {/* <TouchableHighlight onPress={()=>nav.navigate('UserActivity',{userid:user})}> */}
    //         {/* <ClanGroupDash group="cuppaclans" /> */}
    //       {/* </TouchableHighlight> */}
    //     {/* </View> */}
    //     {/* <View style={{padding:4,width:width>800?"50%":"100%"}}> */}
    //       {/* <TouchableHighlight onPress={()=>nav.navigate('UserActivity',{userid:user})}> */}
    //         {/* <ClanGroupDash group="bushrangers" /> */}
    //       {/* </TouchableHighlight> */}
    //     {/* </View> */}
    //     <View style={{padding:4,width:width>800?"50%":"100%"}}>
    //       <ClanRequirements game_id={85} />
    //     </View>
    //     {!edit?<>
    //       {dash.map(i=>({
    //         clan_stats:<View style={{padding:4,width:width>800?"50%":"100%"}}>
    //           <ClanStats clan_id={i.clan_id} game_id={85} />
    //         </View>
    //       }[i.type]))}
    //       {/* <View style={{padding:4,width:width>800?"50%":"100%"}}>
    //         <ClanStats clan_id={457} game_id={85} />
    //       </View>
    //       <View style={{padding:4,width:width>800?"50%":"100%"}}>
    //         <ClanStats clan_id={1441} game_id={85} />
    //       </View>
    //       <View style={{padding:4,width:width>800?"50%":"100%"}}>
    //         <ClanStats clan_id={1870} game_id={85} />
    //       </View>
    //       <View style={{padding:4,width:width>800?"50%":"100%"}}>
    //         <ClanStats clan_id={1902} game_id={85} />
    //       </View>
    //       <View style={{padding:4,width:width>800?"50%":"100%"}}>
    //         <ClanStats clan_id={-1} game_id={85} />
    //       </View> */}
    //     </>:<>
    //       <View style={{width:"100%",height:20}}></View>
    //       {dash.filter(i=>i.type=="clan_stats").map(i=><View style={{padding:4,width:width>800?"50%":"100%"}}>
    //         <Card onPress={()=>remove(i.clan_id)}>
    //           <Text style={{fontSize:20,fontWeight:"bold"}}>Remove "{(allclans.find(x=>x[0]==i.clan_id)||[])[1]||`ID #${i.clan_id}`}"</Text>
    //         </Card>
    //       </View>)}
    //       <View style={{width:"100%",height:20}}></View>
    //       {/* {allclans.filter(x=>!dash.find(i=>i.clan_id==x[0])).map(i=><View style={{padding:4,width:width>800?"50%":"100%"}}>
    //         <Card onPress={()=>add(i[0])}>
    //           <Text style={{fontSize:20,fontWeight:"bold"}}>Add "{i[1]}"</Text>
    //         </Card>
    //       </View>)} */}

    //       <View style={{padding:4,width:width>800?"50%":"100%"}}>
    //         <Card>
    //           <Text style={{fontSize:20,fontWeight:"bold"}}>Clans can now be added from the Search page.</Text>
    //         </Card>
    //       </View>
    //       <View style={{width:"100%",height:20}}></View>
    //     </>}
    //     <View style={{padding:4,width:width>800?"50%":"100%"}}>
    //       <Card onPress={()=>setEdit(!edit)}>
    //         <Text style={{fontSize:20,fontWeight:"bold"}}>{edit?'Finish Editing':'Edit'} Clan List</Text>
    //       </Card>
    //     </View>
    // </ScrollView>
  );
}