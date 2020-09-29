import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import Header from './Components/Header/Header';
import USAData from './Components/USAData/USAData';
import StateData from './Components/StateData/StateData';
import store from './store';
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';

const serverUri = process.env.NODE_ENV.trim() === 'development' ? 'http://localhost:8000' : '';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            totalDataUSA: [],
            marginalDataUSA: [],
            totalStateData: [],
            marginalStateData: [],
            currentState: '',
            allStates: []
        };
    }

    async componentDidMount() {
        const states = await this.getStates();
        this.setState({
            totalDataUSA: await this.totalDataUSA(),
            marginalDataUSA: await this.marginalDataUSA(),
            totalStateData: await this.totalDataByState(states[0]),
            marginalStateData: await this.marginalDataByState(states[0]),
            totalStatesDataForDay: await this.totalStatesDataForDay('hi'),
            marginalStatesDataForDay: await this.marginalStatesDataForDay(moment(new Date()).format('MM-DD-YYYY')),
            currentState: states[0],
            allStates: states
        });
    }

    totalDataUSA = async () => {
        const response = await (await fetch(`${serverUri}/coronavirusDataTracker/api/totalDataUSA`)).json();
        return _.takeRight(response.map((day) => ({ day: day.date.substring(5), cases: day.cases, deaths: day.deaths })), 120);
    }

    marginalDataUSA = async () => {
        const response = await (await fetch(`${serverUri}/coronavirusDataTracker/api/marginalDataUSA`)).json();
        return _.takeRight(response.map((day) => ({ day: day.date.substring(5), cases: day.cases, deaths: day.deaths })), 120);
    }

    totalDataByState = async (state) => {
        const response = await (await fetch(`${serverUri}/coronavirusDataTracker/api/totalDataByState/${state}`)).json();
        return _.takeRight(response.map((day) => ({ day: day.date.substring(5), cases: day.cases, deaths: day.deaths })), 120);
    }

    marginalDataByState = async (state) => {
        const response = await (await fetch(`${serverUri}/coronavirusDataTracker/api/marginalDataByState/${state}`)).json();
        return response.map((day) => ({ day: day.date.substring(5), cases: day.cases, deaths: day.deaths }));
    }

    totalStatesDataForDay = async (date) => {
        const response = await (await fetch(`${serverUri}/coronavirusDataTracker/api/totalStatesDataForDay/${date}`)).json();
        return response.map((day) => ({ state: day.state, day: day.date.substring(5), cases: day.cases, deaths: day.deaths }));
    }

    marginalStatesDataForDay = async (date) => {
        const response = await (await fetch(`${serverUri}/coronavirusDataTracker/api/marginalStatesDataForDay/${date}`)).json();
        return response.map((day) => ({ state: day.state, day: day.date.substring(5), cases: day.cases, deaths: day.deaths }));
    }

    getStates = async () => {
        const states = await (await fetch(`${serverUri}/coronavirusDataTracker/api/states`)).json();
        return states;
    }

    onStateSelectChange = async (e) => {
        this.setState({
            totalStateData: await this.totalDataByState(e.target.value),
            marginalStateData: await this.marginalDataByState(e.target.value),
            currentState: e.target.value
        });
    }

    render() {
        const { totalDataUSA, marginalDataUSA, totalStateData, marginalStateData, totalStatesDataForDay, marginalStatesDataForDay, currentState, allStates } = this.state;
        return (
            <Router>
                <Provider store={store}>
                    <Header />
                    <Redirect exact from='/' to='totalDataUSA' />
                    <Route exact path='/totalDataUSA'>
                        <USAData data={totalDataUSA} statesDataForDay={totalStatesDataForDay} title='Total Coronavirus' />
                    </Route>
                    <Route exact path='/marginalDataUSA'>
                        <USAData data={marginalDataUSA} statesDataForDay={marginalStatesDataForDay} title='Marginal Coronavirus' marginalStatesDataForDay={this.marginalStatesDataForDay} />
                    </Route>
                    <Route exact path='/totalStateData'>
                        <StateData currentState={currentState} allStates={allStates} onStateSelectChange={this.onStateSelectChange} data={totalStateData} title={`Total Coronavirus Cases vs Deaths in ${currentState}`} />
                    </Route>
                    <Route exact path='/marginalStateData'>
                        <StateData currentState={currentState} allStates={allStates} onStateSelectChange={this.onStateSelectChange} data={marginalStateData} title={`Marginal Coronavirus Cases vs Deaths in ${currentState}`} />
                    </Route>
                </Provider>
            </Router>
        );
    }
}

export default App;
