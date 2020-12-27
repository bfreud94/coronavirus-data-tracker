import { CHANGE_DATE } from '../actions/types';
import moment from 'moment';

const initialState = moment().subtract(1, 'days').format('YYYY-MM-DD');

export default function (state = initialState, action) {
    switch (action.type) {
        case CHANGE_DATE:
            return action.payload
        default:
            return state;
    }
}