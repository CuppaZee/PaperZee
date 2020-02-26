import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import user_search from './Actions/user_search';
const defaultState = {
  requirements: {}
};

var setRequirements = (data) => ({ type: "SET_REQUIREMENTS", requirements: data })
var getRequirements = (month = "February 2020") => async (dispatch) => {
  var data = await axios.get('http://us-central1-cuppazeex.cloudfunctions.net/getRequ');
  dispatch(setRequirements(data.data[month]));
}

var setClanDetails = (data) => ({ type: "SET_CLAN_DATA", clan_id: data.details.data.details.clan_id, clan_data: data })
var getClanDetails = (clan_id) => async (dispatch) => {
  var data = await axios.get(`https://flame.cuppazee.uk/clan/details?clan_id=${encodeURIComponent(clan_id)}`);
  dispatch(setClanDetails(data.data));
}

var rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_REQUIREMENTS':
      return {
        ...state,
        requirements: action.requirements
      }
    case 'SET_CLAN_DATA':
      var clan_data = {};
      clan_data[action.clan_id] = action.clan_data;
      return {
        ...state,
        clans: {
          ...state.clans,
          ...clan_data
        }
      }
    case 'SET_USER_SEARCH':
      return user_search.reducer(state, action);
    default:
      return state;
  }
}
// import rootReducer from './reducers/index';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;