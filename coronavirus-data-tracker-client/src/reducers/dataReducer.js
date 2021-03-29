import { GET_MARGINAL_STATES_DATA_FOR_DATE, GET_MARGINAL_DATA_USA, GET_TOTAL_STATES_DATA_FOR_DATE, GET_TOTAL_USA_DATA, GET_TOTAL_STATE_DATA, GET_MARGINAL_STATE_DATA, GET_STATES } from '../actions/types';

const initialState = {
    totalDataUSA: [],
    marginalDataUSA: [],
    totalStatesDataForDate: {},
    marginalStatesDataForDate: {},
    totalStateData: {},
    marginalStateData: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_STATES: {
            /* eslint-disable no-sequences */
            return {
                ...state,
                totalStateData: action.payload.reduce((a, b) => (a[b] = [], a), {}),
                marginalStateData: action.payload.reduce((a, b) => (a[b] = [], a), {})
            };
        }
        case GET_TOTAL_USA_DATA: {
            if (state.totalDataUSA.length === 0) action.payload.forEach((date) => state.totalStatesDataForDate[date.date] = []);
            return {
                ...state,
                totalDataUSA: action.payload,
                totalStatesDataForDate: state.totalStatesDataForDate
            };
        }
        case GET_MARGINAL_DATA_USA: {
            if (state.marginalDataUSA.length === 0) action.payload.forEach((date) => state.marginalStatesDataForDate[date.date] = []);
            return {
                ...state,
                marginalDataUSA: action.payload,
                marginalStatesDataForDate: state.marginalStatesDataForDate
            };
        }
        case GET_TOTAL_STATES_DATA_FOR_DATE: {
            Object.keys(state.totalStatesDataForDate).forEach((date) => {
                if (action.payload.length > 0 && date.toString() === action.payload[0].date.toString()) state.totalStatesDataForDate[date] = action.payload;
            });
            return {
                ...state,
                totalStatesDataForDate: state.totalStatesDataForDate
            };
        }
        case GET_MARGINAL_STATES_DATA_FOR_DATE: {
            Object.keys(state.marginalStatesDataForDate).forEach((date) => {
                if (date.toString() === action.payload[0].date.toString()) state.marginalStatesDataForDate[date] = action.payload;
            });
            return {
                ...state,
                marginalStatesDataForDate: state.marginalStatesDataForDate
            };
        }
        case GET_TOTAL_STATE_DATA: {
            const { stateName, data } = action.payload;
            Object.keys(state.totalStateData).forEach((s) => {
                if (stateName === s) state.totalStateData[stateName] = data;
            });
            return {
                ...state,
                totalStateData: state.totalStateData
            };
        }
        case GET_MARGINAL_STATE_DATA: {
            const { stateName, data } = action.payload;
            Object.keys(state.marginalStateData).forEach((s) => {
                if (stateName === s) state.marginalStateData[stateName] = data;
            });
            return {
                ...state,
                marginalStateData: state.marginalStateData
            };
        }
        default:
            return state;
    }
}