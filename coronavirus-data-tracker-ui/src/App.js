import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import moment from 'moment';
import Header from './Components/Header/Header';
import USAData from './Components/USAData/USAData';
import StateData from './Components/StateData/StateData';
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';
import store from './store';

class App extends React.Component {
  
  constructor() {
    super();
    this.state = {
      totalDataUSA: [],
      marginalDataUSA: [],
      totalStateData: [],
      marginalStateData: [],
      currentState: '',
      allStates: [],
      totalDataUSATableVisible: true
    }
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
    const response = await (await fetch(`http://localhost:8000/coronavirusDataTracker/totalDataUSA`)).json();
    return response.map((day) => ({day: day.date.substring(5), cases: day.cases, deaths: day.deaths})).slice(60);
  }

  marginalDataUSA = async () => {
    const response = await (await fetch(`http://localhost:8000/coronavirusDataTracker/marginalDataUSA`)).json();
    return response.map((day) => ({day: day.date.substring(5), cases: day.cases, deaths: day.deaths})).slice(59);
  }

  totalDataByState = async (state) => {
    const response = await (await fetch(`http://localhost:8000/coronavirusDataTracker/totalDataByState/${state}`)).json();
    return response.map((day) => ({day: day.date.substring(5), cases: day.cases, deaths: day.deaths})).slice(15);
  }

  marginalDataByState = async (state) => {
    const response = await (await fetch(`http://localhost:8000/coronavirusDataTracker/marginalDataByState/${state}`)).json();
    return response.map((day) => ({day: day.date.substring(5), cases: day.cases, deaths: day.deaths})).slice(15);
  }

  totalStatesDataForDay = async (date) => {
    const response = await (await fetch(`http://localhost:8000/coronavirusDataTracker/totalStatesDataForDay/${date}`)).json();
    return response.map((day) => ({state: day.state, day: day.date.substring(5), cases: day.cases, deaths: day.deaths}));
  }

  marginalStatesDataForDay = async (date) => {
    const response = await (await fetch(`http://localhost:8000/coronavirusDataTracker/marginalStatesDataForDay/${date}`)).json();
    return response.map((day) => ({state: day.state, day: day.date.substring(5), cases: day.cases, deaths: day.deaths}));
  }

  getStates = async () => {
    const states = await (await fetch(`http://localhost:8000/coronavirusDataTracker/states`)).json();
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
          <Header/>
          <Redirect exact from="/" to="totalDataUSA" />
          <Route exact path="/totalDataUSA" render={props => (
            <USAData data={totalDataUSA} statesDataForDay={totalStatesDataForDay} title={`Total Coronavirus`}/>
          )}/>
          <Route exact path="/marginalDataUSA" render={props => (
            <USAData data={marginalDataUSA} statesDataForDay={marginalStatesDataForDay} title={`Marginal Coronavirus`} marginalStatesDataForDay={this.marginalStatesDataForDay}/>
          )}/>
          <Route exact path="/totalStateData" render={props => (
            <StateData currentState={currentState} allStates={allStates} onStateSelectChange={this.onStateSelectChange} data={totalStateData} title={`Total Coronavirus Cases vs Deaths in `}/>
          )}/>
          <Route exact path="/marginalStateData" render={props => (
            <StateData currentState={currentState} allStates={allStates} onStateSelectChange={this.onStateSelectChange} data={marginalStateData} title={`Marginal Coronavirus Cases vs Deaths in ${currentState}`}/>
          )}/>
        </Provider>
      </Router>
    );
  }
}

export default App;
