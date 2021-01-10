import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import StateSelection from '../StateSelection/StateSelection';
import SplineChart from '../SplineChart/SplineChart';
import LineChart from '../LineChart/LineChart';
import BarChart from '../BarChart/BarChart';
import StateDataTable from '../StateDataTable/StateDataTable';
import { getTotalStateData, getMarginalStateData } from '../../actions/dataActions';
import store from '../../store';

class StateData extends Component {

    componentDidMount() {
        const { title } = this.props;
        const { currentState } = store.getState().stateData;
        const { totalStateData, marginalStateData } = store.getState().data;
        if (title.includes('Total')) {
            if (!_.isEmpty(totalStateData)) {
                if (title.includes('Total') && totalStateData[currentState].length === 0) this.props.getTotalStateData(currentState);
            }
        } else {
            if (!_.isEmpty(marginalStateData)) {
                if (title.includes('Marginal') && marginalStateData[currentState].length === 0) this.props.getMarginalStateData(currentState);
        
            }

        }
    }

    formatData = () => {
        const { title } = this.props;
        const { data, stateData } = store.getState();
        const { marginalStateData, totalStateData } = data;
        const { currentState } = stateData;
        if (title.includes('Total')) {
            if (_.isEmpty(totalStateData)) return [];
        } else {
            if (_.isEmpty(marginalStateData)) return [];
        }
        let formattedData = title.includes('Total') ? [...totalStateData[currentState]] : [...marginalStateData[currentState]];
        if (formattedData === undefined) return [];
        return formattedData;
    }

    minimizeDataSet = (data) => data.filter((date, index) => index % 7 === 0);

    render() {
        let title = this.props.title + store.getState().stateData.currentState;
        const rawData = this.formatData();
        const tableData = [...rawData].sort((a, b) => (a.date < b.date ? 1 : -1));
        const chartData = this.minimizeDataSet(rawData);
        return (
            <React.Fragment>
                <StateSelection pageTitle={title} />
                <StateDataTable data={tableData} title={title} />
                <SplineChart data={chartData} title={title} />
                <LineChart data={chartData} title={title} />
                <BarChart data={chartData} title={title} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.data,
    state: state.state,
    stateData: state.stateData
});

StateData.propTypes = {
    getTotalStateData: PropTypes.func.isRequired,
    getMarginalStateData: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getTotalStateData, getMarginalStateData })(StateData);