import states from './states';

const serverUri = process.env.NODE_ENV.trim() === 'development' ? 'http://localhost:8000/coronavirusDataTracker' : '';

export const getDates = async () => {
    const response = await (await fetch(`${serverUri}/api/totalDataUSA`)).json();
    return response.map((date) => date.date);
};

// Fix this
// eslint-disable-next-line no-sequences
export const getStates = () => states.reduce((a, b) => (a[b] = [], a), {});

// Change names of this function and the one below
export const getStatesForDropdown = () => {
    return states;
}