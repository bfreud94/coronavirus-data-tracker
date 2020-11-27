import { GET_MARGINAL_STATE_DATA, GET_MARGINAL_STATES_DATA_FOR_DAY, GET_MARGINAL_DATA_USA, GET_TOTAL_STATE_DATA, GET_TOTAL_STATES_DATA_FOR_DAY, GET_TOTAL_USA_DATA } from './types';
import _ from 'lodash';

const serverUri = process.env.NODE_ENV.trim() === 'development' ? 'http://localhost:8000' : '';

export const getTotalDataUSA = () => async (dispatch) => {
    const response = await (await fetch(`${serverUri}/api/totalDataUSA`)).json();
    dispatch({
        type: GET_TOTAL_USA_DATA,
        payload: _.takeRight(response.map((day) => ({ day: day.date.substring(5), cases: day.cases, deaths: day.deaths })), 240)
    });
};

export const getMarginalDataUSA = () => async (dispatch) => {
    const response = await (await fetch(`${serverUri}/api/marginalDataUSA`)).json();
    dispatch({
        type: GET_MARGINAL_DATA_USA,
        payload: _.takeRight(response.map((day) => ({ day: day.date.substring(5), cases: day.cases, deaths: day.deaths })), 240)
    });
};

export const getTotalStatesDataForDay = (date) => async (dispatch) => {
    const response = await (await fetch(`${serverUri}/api/totalStatesDataForDay/${date}`)).json();
    dispatch({
        type: GET_TOTAL_STATES_DATA_FOR_DAY,
        payload: response.map((day) => ({ state: day.state, day: day.date.substring(5), cases: day.cases, deaths: day.deaths }))
    });
};

export const getMarginalStatesDataForDay = (date) => async (dispatch) => {
    const response = await (await fetch(`${serverUri}/api/marginalStatesDataForDay/${date}`)).json();
    dispatch({
        type: GET_MARGINAL_STATES_DATA_FOR_DAY,
        payload: response.map((day) => ({ state: day.state, day: day.date.substring(5), cases: day.cases, deaths: day.deaths }))
    });
};

export const getTotalStateData = (state) => async (dispatch) => {
    const response = await (await fetch(`${serverUri}/api/totalDataByState/${state}`)).json();
    dispatch({
        type: GET_TOTAL_STATE_DATA,
        payload: {
            stateName: state,
            data: response.map((day) => ({ day: day.date.substring(5), cases: day.cases, deaths: day.deaths }))
        }
    });
};

export const getMarginalStateData = (state) => async (dispatch) => {
    const response = await (await fetch(`${serverUri}/api/marginalDataByState/${state}`)).json();
    dispatch({
        type: GET_MARGINAL_STATE_DATA,
        payload: {
            stateName: state,
            data: response.map((day) => ({ day: day.date.substring(5), cases: day.cases, deaths: day.deaths }))
        }
    });
};