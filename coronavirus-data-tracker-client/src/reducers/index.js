import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import dateReducer from './dateReducer';
import stateReducer from './stateReducer';

export default combineReducers({
    data: dataReducer,
    date: dateReducer,
    stateData: stateReducer
});