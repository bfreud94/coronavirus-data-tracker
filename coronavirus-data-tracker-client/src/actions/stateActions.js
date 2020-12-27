import { CHANGE_CURRENT_STATE, GET_STATES } from './types';

const serverUri = process.env.NODE_ENV.trim() === 'development' ? 'http://localhost:8000' : '';

export const getStates = () => async (dispatch) => {
    const response = await (await fetch(`${serverUri}/api/states`)).json();
    dispatch({
        type: GET_STATES,
        payload: response
    });
};

export const changeCurrentState = (state) => async (dispatch) => {
    dispatch({
        type: CHANGE_CURRENT_STATE,
        payload: state
    });
};