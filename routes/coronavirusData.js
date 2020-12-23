// Imports for external dependencies
const express = require('express');
const fetch = require('node-fetch');
const util = require('../util/util');

// Initializing Express router
const router = express.Router();

router.get('/totalDataUSA', async (request, response, next) => {
    try {
        let data = await (await fetch('https://api.covidtracking.com/v1/us/daily.json')).json();
        data = data.map((item) => ({
            date: `${item.date.toString().substring(0, 4)}-${item.date.toString().substring(4, 6)}-${item.date.toString().substring(6, 8)}`,
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
            date: `${item.date.toString().substring(0, 4)}-${item.date.toString().substring(4, 6)}-${item.date.toString().substring(6, 8)}`,
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
        let data = await (await fetch('https://api.covidtracking.com/v1/states/daily.json')).json();
        data = data.filter((item) => !util.nonStates.includes(item.state) && item.state === util.statesToAbbreviations[request.params.state]);
        data = data.map((item) => ({
            date: `${item.date.toString().substring(0, 4)}-${item.date.toString().substring(4, 6)}-${item.date.toString().substring(6, 8)}`,
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
        let data = await (await fetch('https://api.covidtracking.com/v1/states/daily.json')).json();
        data = data.filter((item) => !util.nonStates.includes(item.state) && item.state === util.statesToAbbreviations[request.params.state]);
        data = data.map((item) => ({
            date: `${item.date.toString().substring(0, 4)}-${item.date.toString().substring(4, 6)}-${item.date.toString().substring(6, 8)}`,
            state: item.state,
            cases: item.positiveIncrease,
            deaths: item.deathIncrease
        }));
        response.send(data.reverse());
    } catch (error) {
        next(error);
    }
});

router.get('/totalStatesDataForDate/:day', async (request, response, next) => {
    try {
        let data = await (await fetch('https://api.covidtracking.com/v1/states/daily.json')).json();
        const { day } = request.params;
        data = data.filter((item) => `${item.date.toString().substring(0, 4)}-${item.date.toString().substring(4, 6)}-${item.date.toString().substring(6, 8)}` === day && !util.nonStates.includes(item.state));
        data = data.map((item) => ({
            date: day,
            state: Object.keys(util.statesToAbbreviations).filter((state) => util.statesToAbbreviations[state] === item.state)[0],
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
        let data = await (await fetch('https://api.covidtracking.com/v1/states/daily.json')).json();
        const { date } = request.params;
        data = data.filter((item) => `${item.date.toString().substring(0, 4)}-${item.date.toString().substring(4, 6)}-${item.date.toString().substring(6, 8)}` === date && !util.nonStates.includes(item.state));
        data = data.map((item) => ({
            date,
            state: Object.keys(util.statesToAbbreviations).filter((state) => util.statesToAbbreviations[state] === item.state)[0],
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