// Imports for external dependencies
const express = require('express');
const fetch = require('node-fetch');
const { convertToDate, nonStates, states, statesToAbbreviations } = require('../util/util');

// Initializing Express router
const router = express.Router();

router.get('/totalDataUSA', async (request, response, next) => {
    try {
        let data = await (await fetch('https://api.covidtracking.com/v1/us/daily.json')).json();
        data = data.map((item) => ({
            date: convertToDate(item.date),
            cases: item.positive === null ? 0 : item.positive,
            deaths: item.death === null ? 0 : item.death
        }));
        response.send(data.reverse());
    } catch (error) {
        next(error);
    }
});

router.get('/marginalDataUSA', async (request, response, next) => {
    try {
        let data = await (await fetch('https://api.covidtracking.com/v1/us/daily.json')).json();
        data = data.map((item) => ({
            date: convertToDate(item.date),
            cases: item.positiveIncrease === null ? 0 : item.positiveIncrease,
            deaths: item.deathIncrease === null ? 0 : item.deathIncrease
        }));
        response.send(data.reverse());
    } catch (error) {
        next(error);
    }
});

router.get('/totalDataByState/:state', async (request, response, next) => {
    try {
        const { state } = request.params;
        if (!states.includes(state)) throw new Error('Not a valid state');
        let data = await (await fetch('https://api.covidtracking.com/v1/states/daily.json')).json();
        data = data.filter((item) => !nonStates.includes(item.state) && item.state === statesToAbbreviations[state]);
        data = data.map((item) => ({
            date: convertToDate(item.date),
            state: item.state,
            cases: item.positive === null ? 0 : item.positive,
            deaths: item.death === null ? 0 : item.death
        }));
        response.send(data.reverse());
    } catch (error) {
        next(error);
    }
});

router.get('/marginalDataByState/:state', async (request, response, next) => {
    try {
        const { state } = request.params;
        let data = await (await fetch('https://api.covidtracking.com/v1/states/daily.json')).json();
        data = data.filter((item) => !nonStates.includes(item.state) && item.state === statesToAbbreviations[state]);
        data = data.map((item) => ({
            date: convertToDate(item.date),
            state: item.state,
            cases: item.positiveIncrease,
            deaths: item.deathIncrease
        }));
        response.send(data.reverse());
    } catch (error) {
        next(error);
    }
});

router.get('/totalStatesDataForDate/:date', async (request, response, next) => {
    try {
        const { date } = request.params;
        let data = await (await fetch('https://api.covidtracking.com/v1/states/daily.json')).json();
        data = data.filter((item) => convertToDate(item.date) === date && !nonStates.includes(item.state));
        data = data.map((item) => ({
            date,
            state: states.filter((state) => statesToAbbreviations[state] === item.state)[0],
            cases: item.positive === null ? 0 : item.positive,
            deaths: item.death === null ? 0 : item.death
        }));
        response.send(
            data
        );
    } catch (error) {
        next(error);
    }
});

router.get('/marginalStatesDataForDate/:date', async (request, response, next) => {
    try {
        const { date } = request.params;
        let data = await (await fetch('https://api.covidtracking.com/v1/states/daily.json')).json();
        data = data.filter((item) => convertToDate(item.date) === date && !nonStates.includes(item.state));
        data = data.map((item) => ({
            date,
            state: states.filter((state) => statesToAbbreviations[state] === item.state)[0],
            cases: item.positiveIncrease === null ? 0 : item.positiveIncrease,
            deaths: item.deathIncrease === null ? 0 : item.deathIncrease
        }));
        response.send(
            data
        );
    } catch (error) {
        next(error);
    }
});

module.exports = router;