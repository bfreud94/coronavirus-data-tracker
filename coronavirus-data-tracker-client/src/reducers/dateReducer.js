import { CHANGE_DATE } from '../actions/types';
import moment from 'moment';

const initialState = moment('2021-03-07').format('YYYY-MM-DD');

export default function (state = initialState, action) {
    switch (action.type) {
        case CHANGE_DATE: {
            return action.payload;
        }
        default:
            return state;
    }
}