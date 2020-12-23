import { CHANGE_CURRENT_STATE } from './types';

export const changeCurrentState = (state) => async (dispatch) => {
    dispatch({
        type: CHANGE_CURRENT_STATE,
        payload: state
    });
};