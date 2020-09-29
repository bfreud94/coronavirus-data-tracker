// Imports for external dependencies
const express = require('express');
const novelCovid = require('novelcovid');
const moment = require('moment');

// Initializing Express router
const router = express.Router();

router.get('/totalDataUSA', async (request, response, next) => {
    try {
        const data = await novelCovid.nyt.usa();
        response.send(data);
    } catch (error) {
        next(error);
    }
});

router.get('/marginalDataUSA', async (request, response, next) => {
    try {
        const data = await novelCovid.nyt.usa();
        const marginalData = [];
        data.forEach((day, index) => {
            if (index > 0) {
                marginalData.push({
                    date: data[index].date,
                    cases: day.cases - data[index - 1].cases,
                    deaths: day.deaths - data[index - 1].deaths
                });
            }
        });
        response.send(marginalData);
    } catch (error) {
        next(error);
    }
});

router.get('/totalDataByState/:state', async (request, response, next) => {
    try {
        // Get List of States
        const states = await novelCovid.states();
        const listOfStates = states.map((stateData) => stateData.state.toLowerCase());
        const { state } = request.params;
        const data = listOfStates.includes(state.toLowerCase()) ? await novelCovid.nyt.states({ state }) : next(new Error('Input is not a state'));
        response.send(data);
    } catch (error) {
        next(error);
    }
});

router.get('/marginalDataByState/:state', async (request, response, next) => {
    try {
        // Get List of States
        const states = await novelCovid.states();
        const listOfStates = states.map((stateData) => stateData.state.toLowerCase());
        const { state } = request.params;
        const data = listOfStates.includes(state.toLowerCase()) ? await novelCovid.nyt.states({ state }) : next(new Error('Input is not a state'));
        const marginalData = [];
        data.forEach((day, index) => {
            if (index > 0) {
                marginalData.push({
                    date: data[index].date,
                    cases: day.cases - data[index - 1].cases,
                    deaths: day.deaths - data[index - 1].deaths
                });
            }
        });
        response.send(marginalData);
    } catch (error) {
        next(error);
    }
});

router.get('/casesByCountry', async (request, response, next) => {
    try {
        const data = await novelCovid.historical.all();
        response.send(data);
    } catch (error) {
        next(error);
    }
});

router.get('/states', async (request, response, next) => {
    try {
        const states = (await novelCovid.states()).map((state) => state.state);
        response.send(states);
    } catch (error) {
        next(error);
    }
});

router.get('/totalStatesDataForDay/:day', async (request, response, next) => {
    try {
        // Get List of States
        const states = await novelCovid.states();
        const listOfStates = states.map((stateData) => stateData.state.toLowerCase()).slice(0, 51);
        const data = [];
        await Promise.all(listOfStates.map(async (state) => {
            const stateData = await novelCovid.nyt.states({ state });
            data.push(stateData[stateData.length - 1]);
        }));
        response.send(data);
    } catch (error) {
        next(error);
    }
});

router.get('/marginalStatesDataForDay/:date', async (request, response, next) => {
    try {
        const states = await novelCovid.states();
        const listOfStates = states.map((stateData) => stateData.state.toLowerCase()).slice(0, 51);
        const data = [];
        await Promise.all(listOfStates.map(async (state) => {
            const stateData = await novelCovid.nyt.states({ state });
            const inputDate = moment(new Date(request.params.date));
            const today = moment();
            const daysDifference = today.diff(inputDate, 'days');
            let index = stateData.length - daysDifference - (daysDifference === 0 ? 1 : 0);
            index = index < 1 ? 1 : index;
            index = index > stateData.length ? stateData.length - 1 : index;
            data.push({
                date: stateData[index].date,
                state: stateData[index].state,
                cases: stateData[index].cases - stateData[index - 1].cases,
                deaths: stateData[index].deaths - stateData[index - 1].deaths
            });
        }));
        response.send(data);
    } catch (error) {
        next(error);
    }
});

module.exports = router;