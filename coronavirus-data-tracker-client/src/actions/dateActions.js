import { CHANGE_DATE } from './types';
import moment from 'moment';

export const changeDate = (date) => async (dispatch) => {
    dispatch({
        type: CHANGE_DATE,
        payload: moment(date).isAfter(moment().subtract(1, 'days')) ? moment().format('YYYY-MM-DD') : date
    });
};