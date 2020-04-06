import * as React from 'react';
import { Text, View, Image, ScrollView, Picker, FlatList, TouchableHighlight, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { List, ActivityIndicator } from 'react-native-paper';
import request from '../../redux/request'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../Card';
import s from '../../redux';
var { levelSelect: levelSelectX } = s

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

export default function UserActivityDash({ game_id, clan_id }) {
  var level_colors = {
    ind: "#ffe97f",
    bot: "#dff77e",
    gro: "#b0fc8d",
    0:   "#eb0000",
    1:   "#ef6500",
    2:   "#fa9102",
    3:   "#fcd302",
    4:   "#bfe913",
    5:   "#55f40b",
    null:"#e3e3e3",
    // border:"#016930",
    // border:"white",
    // border: '#fff9', // < Changed from 7 to 9.. what do you think Sam?
    border: '#000a'
  }

  var nav = useNavigation();
  var date = new Date(Date.now() - (5 * 60 * 60000));
  var dateString = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${(date.getUTCDate()).toString().padStart(2, '0')}`
  var dispatch = useDispatch();
  var { data } = useSelector(i => i.request_data[`clan/requirements/v1?game_id=${game_id}`] ?? {})
  var { data: clan } = useSelector(i => i.request_data[`clan/details/formatted?game_id=${game_id}&clan_id=${clan_id}`] ?? {})
  var tick = useSelector(i => i.tick)
  var ls = useSelector(i => i.clanLevelSelect[clan_id]??4);
  var levelSelect = Number(ls.toString().slice(0,1));
  var share = !!ls.toString().slice(1,2);
  function setLevelSelect(val) {
    var x = {};
    x[clan_id] = val;
    return dispatch(levelSelectX(x));
  }
  
  useFocusEffect(
    React.useCallback(() => {
      dispatch(request.add(`clan/requirements/v1?game_id=${game_id}`))
      dispatch(request.add(`clan/details/formatted?game_id=${game_id}&clan_id=${clan_id}`))
      return () => {
        dispatch(request.remove(`clan/requirements/v1?game_id=${game_id}`))
        dispatch(request.remove(`clan/details/formatted?game_id=${game_id}&clan_id=${clan_id}`))
      };
    }, [game_id, clan_id])
  );

  function calculateLevel(user,value,requirement) {
    var x = false;
    var lvl = 0;
    for(var level of data?.data?.levels) {
      if(level[user?"individual":"group"][requirement]) x = true;
      if(level[user?"individual":"group"][requirement] <= value || !level[user?"individual":"group"][requirement]) lvl = (lvl||0) + 1;
    }
    return x?lvl:null;
  }

  function num(x="noauth",y) {
    return Number(x)===0?(y?"-":"-"):x.toString();
  }

  function calculateLevelT(user) {
    if(user) {
      var lev = Infinity;
      for(var requirement of data?.data?.order?.individual) {
        var lvl = 0;
        var x = false;
        for(var level of data?.data?.levels) {
          if(level.individual[requirement]) x = true;
          if(level.individual[requirement] <= clan?.requirements?.[requirement]?.users?.[user] || !level.individual[requirement]) lvl = (lvl||0) + 1;
        }
        if(x) lev = Math.min(lev,(lvl||0));
      
      }
      return lev;
    } else {
      var lev = Infinity;
      for(var user of clan?.members) {
        lev = Math.min(lev,calculateLevelT(user.user_id));
      }
      for(var requirement of data?.data?.order?.group) {
        var lvl = 0;
        var x = false;
        for(var level of data?.data?.levels) {
          if(level.group[requirement]) x = true;
          if(level.group[requirement] <= clan?.requirements?.[requirement]?.total || !level.group[requirement]) lvl = (lvl||0) + 1;
        }
        if(x) lev = Math.min(lev,(lvl||0));
      }
      return lev;
    }
  }
  if (!data?.data?.levels || !clan?.details || !clan?.members) {
    if (!data || !clan) {
      return (
        <Card>
          <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        </Card>
      )
    } else {
      return (
        <Card cardStyle={{backgroundColor:'#ffaaaa'}}>
          <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text>An Error Occurred</Text>
          </View>
        </Card>
      );
    }
  }
  return (
    // <View style={{ flex: 1, alignItems: "stretch", flexDirection: "column", backgroundColor: "#e9ffdc"??"#e6fcd9", borderRadius: 8 }}>
    <Card noPad>
      <View style={{ backgroundColor: "#016930", padding: 8, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>{clan?.details?.name}</Text>
      </View>
      <View style={{flexDirection:"row"}}>
        <ScrollView horizontal={true} style={{flex:1}} contentContainerStyle={{flexDirection:"row",minWidth:'100%',paddingLeft:100}}>
          <View style={{flexDirection:"column",flexGrow:1,alignItems:"stretch",backgroundColor:level_colors.null}}>
            <View style={{flexDirection:"row"}}>
              {(data?.data?.order?.requirements??[]).map(i=><View style={{flexGrow:1}}>
                <View style={{height:96-19,padding:4,alignItems:"center",backgroundColor:level_colors[data?.data?.order.individual.includes(i)?(data?.data?.order.group.includes(i)?'bot':'ind'):'gro']}}>
                  <Image source={{uri:data?.data?.requirements?.[i]?.icon??data?.data?.requirements?.[i]?.icons?.[tick%data?.data?.requirements?.[i]?.icons?.length]}} style={{height:36,width:36}} />
                  <Text numberOfLines={1} style={{textAlign:"center",fontWeight:"bold",fontSize:12}}>{data?.data?.requirements?.[i]?.top}</Text>
                  <Text numberOfLines={1} style={{textAlign:"center",fontSize:12}}>{data?.data?.requirements?.[i]?.bottom}</Text>
                </View>
                <View style={{borderBottomWidth:2,borderBottomColor:level_colors.border,marginHorizontal:-1,height:24,padding:4,alignItems:"center",backgroundColor:level_colors[levelSelect+1]}}>
                  {
                    share?
                    <Text style={{textAlign:"center",width:'100%',fontSize:12}}>{num(Math.max(data?.data?.levels?.[levelSelect]?.individual?.[i]||0,Math.ceil((data?.data?.levels?.[levelSelect]?.group?.[i]||0)/(clan?.members?.length||100)),0),true)}</Text>
                    :<Text style={{textAlign:"center",width:'100%',fontSize:12}}>{num(data?.data?.levels?.[levelSelect]?.individual?.[i]||0,true)}</Text>
                  }
                </View>
                {clan?.members?.map(u=><View style={{marginHorizontal:-1,height:24,padding:4,alignItems:"center",backgroundColor:level_colors[calculateLevel(true,clan.requirements?.[i]?.users?.[u.user_id],i)]}}>
                  <Text style={{textAlign:"center",width:'100%',fontSize:12}}>{num(clan.requirements?.[i]?.users?.[u.user_id])}</Text>
                </View>)}
                <View style={{borderTopWidth:2,borderTopColor:level_colors.border,marginHorizontal:-1,height:24,padding:4,alignItems:"center",backgroundColor:level_colors[calculateLevel(false,clan.requirements?.[i]?.total,i)]}}>
                  <Text style={{textAlign:"center",width:'100%',fontSize:12}}>{clan.requirements?.[i]?.total}</Text>
                </View>
                <View style={{marginHorizontal:-1,height:24,padding:4,alignItems:"center",backgroundColor:level_colors[levelSelect+1]}}>
                  <Text style={{textAlign:"center",width:'100%',fontSize:12}}>{num(data?.data?.levels?.[levelSelect]?.group?.[i]||0,true)}</Text>
                </View>
              </View>)}
            </View>
          </View>
        </ScrollView>


        <View style={{width:101,position:"absolute",left:0,top:0,borderRightWidth:2,borderRightColor:level_colors.border}}>
          {/* height:Platform.OS=="web"?76:77, */}
          <View style={{height:96-19,backgroundColor:level_colors.null,flexDirection:"row",alignItems:"center",padding:4}}><Text style={{fontSize:12}}>Levels</Text></View>
          <View style={{borderBottomWidth:2,borderBottomColor:level_colors.border,height:24,justifyContent:"center",backgroundColor:level_colors[levelSelect+1]}}>
            <Picker
              selectedValue={ls}
              style={{ height: 20, fontSize: 12, backgroundColor: "transparent", borderWidth: 0 }}
              onValueChange={(val, index) => setLevelSelect(val)}
            >
              {data?.data?.levels?.map((i,index)=><Picker.Item key={i} label={i.name + " Indiv"} value={index} />)}
              {data?.data?.levels?.map((i,index)=><Picker.Item key={i+'s'} label={i.name + " Share"} value={index+'s'} />)}
            </Picker>
          </View>
          {clan?.members?.map(i=><View style={{backgroundColor:level_colors[calculateLevelT(i.user_id)],padding:4,height:24,flexDirection:"row",alignItems:"center",justifyContent:"flex-start"}} key={i.name}>{(i.leader||i.ghost)&&<MaterialCommunityIcons name={i.ghost?'ghost':'hammer'} color="black" size={12} />}<Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:12,flexShrink:1}}>{i.username}</Text></View>)}
          <View style={{justifyContent:"center",borderTopWidth:2,borderTopColor:level_colors.border,backgroundColor:level_colors[calculateLevelT(false)],padding:4,height:24}}><Text style={{fontSize:12}}>Group Total</Text></View>
          <View style={{justifyContent:"center",height:24,backgroundColor:level_colors[levelSelect+1]}}>
            <Picker
              selectedValue={levelSelect}
              style={{ height: 20, fontSize: 12, backgroundColor: "transparent", borderWidth: 0 }}
              onValueChange={(val, index) => setLevelSelect(index)}
            >
              {data?.data?.levels?.map((i,index)=><Picker.Item key={i} label={i.name + " Group"} value={index} />)}
            </Picker>
          </View>
        </View>
      </View>
    </Card>
    // </View>
  );
}