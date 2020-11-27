import { GET_MARGINAL_STATE_DATA, GET_MARGINAL_STATES_DATA_FOR_DATE, GET_MARGINAL_DATA_USA, GET_TOTAL_STATE_DATA, GET_TOTAL_STATES_DATA_FOR_DATE, GET_TOTAL_USA_DATA } from './types';
import _ from 'lodash';

const serverUri = process.env.NODE_ENV.trim() === 'development' ? 'http://localhost:8000' : '';

export const getTotalDataUSA = () => async (dispatch) => {
    const response = await (await fetch(`${serverUri}/api/totalDataUSA`)).json();
    dispatch({
        type: GET_TOTAL_USA_DATA,
        payload: _.takeRight(response.map((date) => ({ date: date.date.substring(5), cases: date.cases, deaths: date.deaths })), 240)
    });
};

export const getMarginalDataUSA = () => async (dispatch) => {
    const response = await (await fetch(`${serverUri}/api/marginalDataUSA`)).json();
    dispatch({
        type: GET_MARGINAL_DATA_USA,
        payload: _.takeRight(response.map((date) => ({ date: date.date.substring(5), cases: date.cases, deaths: date.deaths })), 240)
    });
};

export const getTotalStatesDataForDate = (date) => async (dispatch) => {
    const response = await (await fetch(`${serverUri}/api/totalStatesDataForDate/${date}`)).json();
    dispatch({
        type: GET_TOTAL_STATES_DATA_FOR_DATE,
        payload: response.map((date) => ({ state: date.state, date: date.date.substring(5), cases: date.cases, deaths: date.deaths }))
    });
};

export const getMarginalStatesDataForDate = (date) => async (dispatch) => {
    const response = await (await fetch(`${serverUri}/api/marginalStatesDataForDate/${date}`)).json();
    dispatch({
        type: GET_MARGINAL_STATES_DATA_FOR_DATE,
        payload: response.map((date) => ({ state: date.state, date: date.date.substring(5), cases: date.cases, deaths: date.deaths }))
    });
};

export const getTotalStateData = (state) => async (dispatch) => {
    const response = await (await fetch(`${serverUri}/api/totalDataByState/${state}`)).json();
    dispatch({
        type: GET_TOTAL_STATE_DATA,
        payload: {
            stateName: state,
            data: response.map((date) => ({ date: date.date.substring(5), cases: date.cases, deaths: date.deaths }))
        }
    });
};

export const getMarginalStateData = (state) => async (dispatch) => {
    const response = await (await fetch(`${serverUri}/api/marginalDataByState/${state}`)).json();
    dispatch({
        type: GET_MARGINAL_STATE_DATA,
        payload: {
            stateName: state,
            data: response.map((date) => ({ date: date.date.substring(5), cases: date.cases, deaths: date.deaths }))
        }
    });
};