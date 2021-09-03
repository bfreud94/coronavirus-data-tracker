// Imports for external dependencies
const express = require('express');
const fetch = require('node-fetch');
const { convertToDate, isValidDateFormat, nonStates, states, statesToAbbreviations } = require('../util/util');

// Initializing Express router
const router = express.Router();

router.get('/totalDataUSA', async (request, response, next) => {
    try {
        let data = await (await fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us.csv')).text();
        data = data.split('\n').map((item) => {
            const [date, cases, deaths] = item.split(',');
            return {
                date,
                cases: cases === '' ? 0 : parseInt(cases, 10),
                deaths: deaths === '' ? 0 : parseInt(deaths, 10)
            };
        });
        data.shift();
        response.send(data);
    } catch (error) {
        next(error);
    }
});

router.get('/marginalDataUSA', async (request, response, next) => {
    try {
        let data = await (await fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us.csv')).text();
        data = data.split('\n').map((item) => {
            const [date, cases, deaths] = item.split(',');
            return {
                date,
                cases: cases === '' ? 0 : parseInt(cases, 10),
                deaths: deaths === '' ? 0 : parseInt(deaths, 10)
            };
        });
        data.shift();
        data = data.map(({ date, cases, deaths }, i) => ({
            date,
            cases: i === 0 ? 0 : cases - data[i - 1].cases,
            deaths: i === 0 ? 0 : deaths - data[i - 1].deaths
        }));
        response.send(data);
    } catch (error) {
        next(error);
    }
});

router.get('/totalDataByState/:state', async (request, response, next) => {
    try {
        const { state } = request.params;
        if (!states.includes(state)) throw new Error('Invalid state');
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
        if (!states.includes(state)) throw new Error('Invalid state');
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
        if (!isValidDateFormat(date)) throw new Error('Invalid date');
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
        if (!isValidDateFormat(date)) throw new Error('Invalid date');
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

router.get('/states/', async (request, response, next) => {
    try {
        response.send(states);
    } catch (error) {
        next(error);
    }
});

module.exports = router;