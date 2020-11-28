import { GET_STATES, CHANGE_CURRENT_STATE } from './types';

const serverUri = process.env.NODE_ENV.trim() === 'development' ? 'http://localhost:8000' : '';

export const getStates = () => async (dispatch) => {
    const states = await (await fetch(`${serverUri}/api/states`)).json();
    dispatch({
        type: GET_STATES,
        payload: states
    });
};

export const changeCurrentState = (state) => async (dispatch) => {
    dispatch({
        type: CHANGE_CURRENT_STATE,
        payload: state
    });
};