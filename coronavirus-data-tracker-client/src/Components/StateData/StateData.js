import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import StateSelection from '../StateSelection/StateSelection';
import SplineChart from '../SplineChart/SplineChart';
import LineChart from '../LineChart/LineChart';
import BarChart from '../BarChart/BarChart';
import StateDataTable from '../StateDataTable/StateDataTable';
import { getTotalStateData, getMarginalStateData } from '../../actions/dataActions';
import store from '../../store';

class StateData extends Component {

    constructor() {
        super();
        this.state = {
            data: [],
            page: 0,
            rowsPerPage: 10,
            sortKey: ''
        };
    }

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

    minimizeDataSet = (data) => {
        if (data.length === 0) return data;
        return data.filter((date, index) => index % 30 === 0).map((dataForDate) => ({...dataForDate, date: moment(dataForDate.date).format('MM-DD-YYYY')}));
    };

    resetPageCounter = () => {
        this.setState({
            rowsPerPage: 5,
            page: 0
        })
    }

    handlePageChange = (e, page) => {
        this.setState({
            page
        });
    }

    handleChangeRowsPerPage = (page) => {
        this.setState({
            rowsPerPage: +page,
            page: 0
        });
    }

    sortData = (data, sortKey) => {
        this.setState({
            data,
            page: 0,
            sortKey
        })
    }

    render() {
        const { rowsPerPage, page } = this.state;
        let title = this.props.title + store.getState().stateData.currentState;
        const tableData = this.state.data.length > 0 ? this.state.data : this.formatData();
        const chartData = this.minimizeDataSet(tableData);
        return (
            <React.Fragment>
                <StateSelection pageTitle={title} resetPageCounter={this.resetPageCounter} />
                <StateDataTable data={tableData} title={title} rowsPerPage={rowsPerPage} page={page}
                    handlePageChange={this.handlePageChange} handleChangeRowsPerPage={this.handleChangeRowsPerPage} sortData={this.sortData} />
                <SplineChart data={chartData} title={title} />
                <LineChart data={chartData} title={title} />
                <BarChart data={chartData} title={title} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.data,
    stateData: state.stateData
});

StateData.propTypes = {
    getTotalStateData: PropTypes.func.isRequired,
    getMarginalStateData: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getTotalStateData, getMarginalStateData })(StateData);