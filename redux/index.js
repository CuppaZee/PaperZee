import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import r from './request';
import { AsyncStorage } from 'react-native';
var {makeRequest} = r;
const defaultState = {
  requests: [],
  request_data: {},
  loading: 0,
  loadingLogin: true,
  loggedIn: false,
  logins: true,
};


function refreshRequests(store,force) {
  for(var request of store.getState().requests.filter(i=>i.count>0&&(force||i.expires<Date.now()))) {
    makeRequest(store.getState,store.dispatch,request.page,true);
  }
}

var refresh = () => async (dispatch, getState) => {
  refreshRequests({dispatch,getState},true);
}

var login_ = (data) => ({ type: "LOGIN", data: data })
var login = (data,noUpdate) => async (dispatch, getState) => {
  if(!noUpdate) await AsyncStorage.setItem('LOGINS',JSON.stringify({...getState().logins,...data}));
  dispatch(login_(data));
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
          ...state.clans,
          ...data
        }
      }
    default:
      return state;
  }
}
// import rootReducer from './reducers/index';


const store = createStore(rootReducer, applyMiddleware(thunk));
setInterval(refreshRequests,60000,store);

AsyncStorage.getItem('LOGINS').then((data)=>{
  if(!data) return store.dispatch(login({},true));
  store.dispatch(login(JSON.parse(data),true));
})

export default {store,refresh,login};