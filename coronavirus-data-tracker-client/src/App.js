import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Header from './Components/Header/Header';
import USAData from './Components/USAData/USAData';
import StateData from './Components/StateData/StateData';
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import store from './store';

class App extends Component {

    render() {
        return (
            <Router>
                <Provider store={store}>
                    <Header />
                    <Redirect exact from='/' to='totalDataUSA' />
                    <Route exact path='/totalDataUSA'>
                        <USAData title='Total Coronavirus' />
                    </Route>
                    <Route exact path='/marginalDataUSA'>
                        <USAData title='Marginal Coronavirus' />
                    </Route>
                    <Route exact path='/totalStateData'>
                        <StateData title='Total Coronavirus Cases vs Deaths in ' />
                    </Route>
                    <Route exact path='/marginalStateData'>
                        <StateData title='Marginal Coronavirus Cases vs Deaths in ' />
                    </Route>
                </Provider>
            </Router>
        );
    }
}

export default App;
