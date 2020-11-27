import { CHANGE_DATE } from './types';

export const changeDate = (date) => async (dispatch) => {
    dispatch({
        type: CHANGE_DATE,
        payload: date
    });
};