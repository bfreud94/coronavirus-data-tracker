// Imports for external dependencies
const express = require('express');
const novelCovid = require('novelcovid');
const moment = require('moment');
const fetch = require('node-fetch');
const util = require('../util/util');

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
        let data = await (await fetch('https://api.covidtracking.com/v1/states/daily.json')).json();
        data = data.filter((item) => !util.nonStates.includes(item.state) && item.state === util.abbreviationsToState[request.params.state]);
        data = data.map((item) => ({
            date: item.date.toString().substring(0, 4) + '-' + item.date.toString().substring(4, 6) + '-' + item.date.toString().substring(6, 8),
            state: item.state,
            cases: item.positive,
            deaths: item.death === null ? 0 : item.death
        }));
        response.send(data.reverse());
    } catch (error) {
        next(error);
    }
});

router.get('/marginalDataByState/:state', async (request, response, next) => {
    try {
        let data = await (await fetch('https://api.covidtracking.com/v1/states/daily.json')).json();
        data = data.filter((item) => !util.nonStates.includes(item.state) && item.state === util.abbreviationsToState[request.params.state]);
        data = data.map((item) => ({
            date: item.date.toString().substring(0, 4) + '-' + item.date.toString().substring(4, 6) + '-' + item.date.toString().substring(6, 8),
            state: item.state,
            cases: item.positiveIncrease,
            deaths: item.deathIncrease
        }));
        response.send(data.reverse());
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

router.get('/totalStatesDataForDate/:day', async (request, response, next) => {
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

router.get('/marginalStatesDataForDate/:date', async (request, response, next) => {
    try {
        const states = await novelCovid.states();
        const listOfStates = states.map((stateData) => stateData.state.toLowerCase()).slice(0, 51);
        const data = [];
        await Promise.all(listOfStates.map(async (state) => {
            const stateData = await novelCovid.nyt.states({ state });
            const inputDate = moment(request.params.date, 'YYYY-MM-DD');
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