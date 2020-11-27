import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StateSelection from '../StateSelection/StateSelection';
import SplineChart from '../SplineChart/SplineChart';
import LineChart from '../LineChart/LineChart';
import BarChart from '../BarChart/BarChart';
import StateDataTable from '../StateDataTable/StateDataTable';
import { getTotalStateData, getMarginalStateData } from '../../actions/dataActions';
import store from '../../store';

class StateData extends Component {

    componentDidMount() {
        const { currentState } = store.getState().stateData;
        this.props.getTotalStateData(currentState);
        this.props.getMarginalStateData(currentState);
    }

    formatData = () => {
        const { title } = this.props;
        const { currentState } = store.getState().stateData;
        let data = title.includes('Total') ? store.getState().data.totalStateData[currentState] : store.getState().data.marginalStateData[currentState];
        data = data.sort((a, b) => (a.date > b.date ? 1 : -1));
        return data;
    }

    render() {
        let title = this.props.title + store.getState().stateData.currentState;
        return (
            <React.Fragment>
                <StateSelection />
                <SplineChart data={this.formatData()} title={title} />
                <LineChart data={this.formatData()} title={title} />
                <BarChart data={this.formatData()} title={title} />
                <StateDataTable data={this.formatData()} title={title} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.data,
    state: state.state,
    states: state.states
});

StateData.propTypes = {
    getTotalStateData: PropTypes.func.isRequired,
    getMarginalStateData: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getTotalStateData, getMarginalStateData })(StateData);