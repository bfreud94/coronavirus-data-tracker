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
        if (!states.includes(request.params.state)) throw new Error('Invalid state');
        let data = await (await fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv')).text();
        data = data.split('\n').map((item) => {
            const [date, state, cases, deaths] = item.split(',');
            return {
                date,
                state,
                cases: cases === '' ? 0 : parseInt(cases, 10),
                deaths: deaths === '' ? 0 : parseInt(deaths, 10)
            };
        }).filter((item) => item.state === request.params.state);
        response.send(data);
    } catch (error) {
        next(error);
    }
});

router.get('/marginalDataByState/:state', async (request, response, next) => {
    try {
        if (!states.includes(request.params.state)) throw new Error('Invalid state');;
        let data = await (await fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/rolling-averages/us-states.csv')).text();
        data = data.split('\n').map((item) => {
            const [date, , state, cases, , , deaths] = item.split(',');
            return {
                date,
                state,
                cases: cases === '' ? 0 : parseInt(cases, 10),
                deaths: deaths === '' ? 0 : parseInt(deaths, 10)
            };
        });
        data.shift();
        data = data.filter((item) => item.state === request.params.state);
        if (data.length === 0) throw new Error('Invalid state');
        response.send(data);
    } catch (error) {
        next(error);
    }
});

router.get('/totalStatesDataForDate/:date', async (request, response, next) => {
    try {
        if (!isValidDateFormat(request.params.date)) throw new Error('Invalid date');
        let data = await (await fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv')).text();
        data = data.split('\n').map((item) => {
            const [date, state, , cases, deaths] = item.split(',');
            return {
                date,
                state,
                cases: cases === '' ? 0 : parseInt(cases, 10),
                deaths: deaths === '' ? 0 : parseInt(deaths, 10)
            };
        }).filter((item) => item.date === request.params.date);
        if (data.length === 0) throw new Error('Invalid date');
        response.send(data);
    } catch (error) {
        next(error);
    }
});

router.get('/marginalStatesDataForDate/:date', async (request, response, next) => {
    try {
        if (!isValidDateFormat(request.params.date)) throw new Error('Invalid date');
        let data = await (await fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/rolling-averages/us-states.csv')).text();
        data = data.split('\n').map((item) => {
            const [date, , state, cases, , , deaths] = item.split(',');
            return {
                date,
                state,
                cases: cases === '' ? 0 : parseInt(cases, 10),
                deaths: deaths === '' ? 0 : parseInt(deaths, 10)
            };
        });
        data.shift();
        data = data.filter((item) => item.date === request.params.date);
        if (data.length === 0) throw new Error('Invalid date');
        response.send(data);
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