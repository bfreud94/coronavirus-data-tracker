import React, { Component } from 'react';
import StateSelection from '../StateSelection/StateSelection';
import SplineChart from '../SplineChart/SplineChart';
import LineChart from '../LineChart/LineChart';
import BarChart from '../BarChart/BarChart';
import StateDataTable from '../StateDataTable/StateDataTable';

class StateData extends Component {

    formatData = () => {
        let { data } = this.props;
        data = data.sort((a, b) => a.day > b.day ? 1 : -1);
        return data.filter((day, index) => index % 3 === 0);
    }

    render() {
        const { data, title, currentState, allStates, onStateSelectChange } = this.props;
        return (
            <React.Fragment>
                <StateSelection currentState={currentState} allStates={allStates} onStateSelectChange={onStateSelectChange}/>
                <SplineChart data={this.formatData()} title={title}/>
                <LineChart data={this.formatData()} title={title}/>
                <BarChart data={this.formatData()} title={title}/>
                <StateDataTable data={data} title={title}/>
            </React.Fragment>
        );
    }
}

export default StateData;