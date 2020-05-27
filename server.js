// Imports for external dependencies
const bodyParser = require('body-parser');
const express = require('express');
const { NovelCovid } = require('novelcovid');
const moment = require('moment');
const cors = require('cors');
const path = require('path');

// Initialize express
const app = express();

// Port number
const port = process.env.PORT || 8000;

// Use bodyParser
app.use(bodyParser.json());

// Use CORS
app.use(cors());

// Use NovelCovid
const novelCovid = new NovelCovid();

// Starting server
app.listen(port, () =>  {
    console.log('Server started on port ' + port);
});

app.get('/coronavirusDataTracker/api/totalDataUSA', async (request, response) => {
    const data = await novelCovid.nytUSA();
    response.send(data);
});

app.get('/coronavirusDataTracker/api/marginalDataUSA', async (request, response) => {
    const data = await novelCovid.nytUSA();
    let marginalData = [];
    data.map((day, index) => {
        if(index > 0) {
            marginalData.push({
                date: data[index].date,
                cases: day.cases - data[index - 1].cases,
                deaths: day.deaths - data[index - 1].deaths
            });
        }
    });
    response.send(marginalData);
});

app.get('/coronavirusDataTracker/api/totalDataByState/:state', async (request, response) =>  {
    // Get List of States
    const states = await novelCovid.states();
    const listOfStates = states.map((stateData) => stateData.state.toLowerCase());

    const state = request.params.state;
    const data = listOfStates.includes(state.toLowerCase()) ? await novelCovid.nytState(state) : "Input is not a state";
    response.send(data);
});

app.get('/coronavirusDataTracker/api/marginalDataByState/:state', async (request, response) =>  {
    // Get List of States
    const states = await novelCovid.states();
    const listOfStates = states.map((stateData) => stateData.state.toLowerCase());
    const state = request.params.state;
    const data = listOfStates.includes(state.toLowerCase()) ? await novelCovid.nytState(state) : "Input is not a state";
    let marginalData = [];
    data.map((day, index) => {
        if(index > 0) {
            marginalData.push({
                date: data[index].date,
                cases: day.cases - data[index - 1].cases,
                deaths: day.deaths - data[index - 1].deaths
            });
        }
    });
    response.send(marginalData);
});

app.get('/coronavirusDataTracker/api/casesByCountry', async (request, response) =>  {
    const data = await novelCovid.historical();
    response.send(data);
});

app.get('/coronavirusDataTracker/api/states', async (request, response) =>  {
    const states = (await novelCovid.states()).map((state) => state.state);
    response.send(states);
});

app.get('/coronavirusDataTracker/api/totalStatesDataForDay/:day', async (request, response) =>  {
    // Get List of States
    const states = await novelCovid.states();
    const listOfStates = states.map((stateData) => stateData.state.toLowerCase()).slice(0, 51);
    let data = [];
    await Promise.all(listOfStates.map(async (state) => {
        const stateData = await novelCovid.nytState(state);
        data.push(stateData[stateData.length - 1]);
    }));
    response.send(data);
});

app.get('/coronavirusDataTracker/api/marginalStatesDataForDay/:date', async (request, response) =>  {
    const states = await novelCovid.states();
    const listOfStates = states.map((stateData) => stateData.state.toLowerCase()).slice(0, 51);
    let data = [];
    await Promise.all(listOfStates.map(async (state) => {
        const stateData = await novelCovid.nytState(state);
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
            deaths: stateData[index].deaths - stateData[index - 1].deaths,
        });
    }));
    response.send(data);
});

