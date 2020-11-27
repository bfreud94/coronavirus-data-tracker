import { GET_STATES, CHANGE_STATE } from './types';

const serverUri = process.env.NODE_ENV.trim() === 'development' ? 'http://localhost:8000' : '';

export const getStates = () => async (dispatch) => {
    const states = await (await fetch(`${serverUri}/api/states`)).json();
    dispatch({
        type: GET_STATES,
        payload: states
    });
};

export const changeState = (state) => async (dispatch) => {
    dispatch({
        type: CHANGE_STATE,
        payload: state
    });
};