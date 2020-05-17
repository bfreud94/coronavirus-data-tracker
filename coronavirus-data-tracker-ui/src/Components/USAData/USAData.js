import React, { Component } from 'react';
import SplineChart from '../SplineChart/SplineChart';
import LineChart from '../LineChart/LineChart';
import BarChart from '../BarChart/BarChart';
import USADataTable from '../USADataTable/USADataTable';

class USAData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalStatesDataIsVisible: true
        }
    }

    formatData = () => {
        const { data } = this.props;
        return data.filter((day, index) => index % 3 === 0);
    }

    onHeaderButtonClick = (e) => {
        this.setState({
            totalStatesDataIsVisible: e.currentTarget.name.includes("State")
        });
    }

    render() {
        const { data, title, statesDataForDay, marginalStatesDataForDay } = this.props;
        const { totalStatesDataIsVisible } = this.state;
        return (
            <React.Fragment>
                <SplineChart data={this.formatData()} title={title + ' Cases vs. Deaths'}/>
                <LineChart data={this.formatData()} title={title + ' Cases vs. Deaths'}/>
                <BarChart data={this.formatData()} title={title + ' Cases vs. Deaths'}/>
                <USADataTable data={statesDataForDay} isVisible={totalStatesDataIsVisible} title={title + ' Data for all States'} onHeaderButtonClick={this.onHeaderButtonClick} marginalStatesDataForDay={marginalStatesDataForDay}/>
                <USADataTable data={data} isVisible={!totalStatesDataIsVisible} title={title + ' Data for all Days'} onHeaderButtonClick={this.onHeaderButtonClick}/>
            </React.Fragment>
        );
    }
}

export default USAData;