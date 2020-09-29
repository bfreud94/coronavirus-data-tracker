import { GET_DATA } from './types';

export const getData = () => (dispatch) => {
    fetch('http://localhost:8000/coronavirusDataTracker/api/totalDataUSA')
        .then((res) => res.json())
        .then((players) => dispatch({
            type: GET_DATA,
            payload: players
        }));
};