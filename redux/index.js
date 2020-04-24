import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import r from './request';
import { AsyncStorage } from 'react-native';
import darkMapStyle from './darkMapStyle.json'
var {makeRequest} = r;
const defaultState = {
  requests: [],
  request_data: {},
  loading: 0,
  loadingLogin: true,
  loggedIn: false,
  logins: true,
  tick: 0,
  code: '',
  dash: [],
  clanLevelSelect: {},
  route: {},
  themes: {
    xdark: {
      error: {
        bg: '#660000',
        fg: '#ffffff'
      },
      navigation: {
        // bg: "#232323",
        bg: "#000000",
        fg: "#ffffff"
      },
      page: {
        // bg: "#121212",
        bg: "#000000",
        fg: "#ffffff"
      },
      page_content: {
        bg: "#000000",
        fg: "#d3d3d3",
        border: "#ffffff"
      },
      activity: {
        capture: {
          bg: "#004400",
          fg: "#aaffaa"
        },
        deploy: {
          bg: "#00403e",
          fg: "#a5fffc"
        },
        capon: {
          bg: "#401700",
          fg: "#ffbcad"
        }
      },
      mapStyle: darkMapStyle
    },
    dark: {
      error: {
        bg: '#aa0000',
        fg: '#ffffff'
      },
      navigation: {
        bg: "#121212",
        fg: "#ffffff"
      },
      page: {
        bg: "#232323",
        fg: "#ffffff"
      },
      page_content: {
        bg: "#343434",
        fg: "#d3d3d3",
        border: "#ffffff"
      },
      activity: {
        capture: {
          bg: "#004400",
          fg: "#aaffaa"
        },
        deploy: {
          bg: "#00403e",
          fg: "#a5fffc"
        },
        capon: {
          bg: "#401700",
          fg: "#ffbcad"
        }
      },
      mapStyle: darkMapStyle
    },
    light: {
      error: {
        bg: '#ffaaaa',
        fg: '#000000'
      },
      navigation: {
        bg: "#016930",
        fg: "#ffffff"
      },
      page: {
        bg: "#c6e3b6",
        fg: "#000000"
      },
      page_content: {
        bg: "#e6fcd9",
        fg: "#000000"
      },
      activity: {
        capture: {
          bg: "#aaffaa",
          fg: "#004400"
        },
        deploy: {
          bg: "#a5fffc",
          fg: "#00403e"
        },
        capon: {
          bg: "#ffbcad",
          fg: "#401700"
        }
      }
    },
    hcontrast: {
      error: {
        bg: '#ffaaaa',
        fg: '#000000'
      },
      navigation: {
        bg: "#00642D",
        fg: "#ffffff"
      },
      page: {
        bg: "#c6e3b6",
        fg: "#000000"
      },
      page_content: {
        bg: "#ffffff",
        fg: "#000000"
      },
      activity: {
        capture: {
          bg: "#aaffaa",
          fg: "#004400"
        },
        deploy: {
          bg: "#a5fffc",
          fg: "#00403e"
        },
        capon: {
          bg: "#ffbcad",
          fg: "#401700"
        }
      }
    }
  },
  theme: "light"
};


function refreshRequests(store,force) {
  for(var request of store.getState().requests.filter(i=>i.count>0&&(force||i.expires<Date.now()))) {
    makeRequest(store.getState,store.dispatch,request.page,true);
  }
}

var refresh = () => async (dispatch, getState) => {
  refreshRequests({dispatch,getState},true);
}

var setCurrentRoute = (data) => ({ type: "CURRENT_ROUTE", data: data })
var login_ = (data) => ({ type: "LOGIN", data: data })
var dash_ = (data) => ({ type: "DASH", data: data })
var setCode_ = (data) => ({ type: "SET_CODE", data: data })
var setTheme_ = (data) => ({ type: "SET_THEME", data: data })
var levelSelect_ = (data) => ({ type: "LEVEL_SELECT", data: data })
var tick = () => ({ type: "TICK" })
var login = (data,noUpdate) => async (dispatch, getState) => {
  if(!noUpdate) await AsyncStorage.setItem('LOGINS',JSON.stringify({...getState().logins,...data}));
  dispatch(login_(data));
}
var dash = (data,noUpdate) => async (dispatch, getState) => {
  if(!noUpdate) await AsyncStorage.setItem('DASH',JSON.stringify(data));
  dispatch(dash_(data));
}
var setCode = (data,noUpdate) => async (dispatch, getState) => {
  if(!noUpdate) await AsyncStorage.setItem('CODE',data);
  dispatch(setCode_(data));
}
var setTheme = (data,noUpdate) => async (dispatch, getState) => {
  if(!noUpdate) await AsyncStorage.setItem('THEME',data);
  dispatch(setTheme_(data));
}
var levelSelect = (data,noUpdate) => async (dispatch, getState) => {
  if(!noUpdate) await AsyncStorage.setItem('LEVEL_SELECT',JSON.stringify({...getState().clanLevelSelect,...data}));
  dispatch(levelSelect_(data));
}

var rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_REQUEST':
      if(state.requests.find(i=>i.page==action.page)) {
        return {
          ...state,
          requests: state.requests.map(i=>i.page==action.page?{...i,count:i.count+1}:i)
        }
      } else {
        return {
          ...state,
          requests: [...state.requests, {page:action.page,count:1,expires:Date.now()+(15*60000)}]
        }
      }
    case 'REMOVE_REQUEST':
      if(state.requests.find(i=>i.page==action.page).count>0) {
        return {
          ...state,
          requests: state.requests.map(i=>i.page==action.page?{...i,count:i.count-1}:i)
        }
      } else {
        return {
          ...state,
          requests: state.requests.filter(i=>i.page!=action.page)
        }
      }
    case 'LOADING':
      return {
        ...state,
        loading: state.loading+action.change
      }
    case 'LOGIN':
      return {
        ...state,
        loggedIn: Object.keys(action.data).length>0,
        logins: {...state.logins,...action.data},
        loadingLogin: false,
      }
    case 'SET_REQUEST_DATA':
      var data = {};
      data[action.page] = action.data;
      return {
        ...state,
        requests: state.requests.map(i=>i.page==action.originalpage?{...i,expires:Date.now()+(20*60000)}:i),
        request_data: {
          ...state.request_data,
          ...data
        }
      }
    case 'TICK':
      return {
        ...state,
        tick: state.tick+1
      }
    case 'SET_CODE':
      return {
        ...state,
        code: action.data
      }
    case 'SET_THEME':
      return {
        ...state,
        theme: action.data
      }
    case 'DASH':
      return {
        ...state,
        dash: action.data
      }
    case 'CURRENT_ROUTE':
      return {
        ...state,
        route: action.data
      }
    case 'LEVEL_SELECT':
      return {
        ...state,
        clanLevelSelect: {
          ...state.clanLevelSelect,
          ...action.data,
        }
      }
    default:
      return state;
  }
}
// import rootReducer from './reducers/index';


const store = createStore(rootReducer, applyMiddleware(thunk));
setInterval(refreshRequests,60000,store);
// setInterval(()=>{
//   store.dispatch(tick());
// },1000)

AsyncStorage.getItem('LOGINS').then((data)=>{
  if(!data) return store.dispatch(login({},true));
  store.dispatch(login(JSON.parse(data),true));
})
AsyncStorage.getItem('DASH').then((data)=>{
  if(!data) return store.dispatch(dash([],true));
  store.dispatch(dash(JSON.parse(data),true));
})
AsyncStorage.getItem('CODE').then((data)=>{
  if(!data) return;
  store.dispatch(setCode(data,true));
})
AsyncStorage.getItem('THEME').then((data)=>{
  if(!data) return;
  store.dispatch(setTheme(data,true));
})
AsyncStorage.getItem('LEVEL_SELECT').then((data)=>{
  if(!data) return store.dispatch(levelSelect({},true));
  store.dispatch(levelSelect(JSON.parse(data),true));
})

export default {store,refresh,login,setCode,dash,levelSelect,setCurrentRoute,setTheme};