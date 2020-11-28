import { GET_STATES, CHANGE_CURRENT_STATE } from '../actions/types';
import { getStatesForDropdown } from '../util/util';

const initialState = {
    states: getStatesForDropdown(),
    currentState: 'New York'
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_STATES:
            return {
                ...state,
                states: action.payload
            };
        case CHANGE_CURRENT_STATE: {
            return {
                ...state,
                currentState: action.payload
            };
        }
        default:
            return state;
    }
}