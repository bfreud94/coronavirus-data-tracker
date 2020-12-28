import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import SplineChart from '../SplineChart/SplineChart';
import LineChart from '../LineChart/LineChart';
import BarChart from '../BarChart/BarChart';
import USADataTable from '../USADataTable/USADataTable';
import { getTotalDataUSA, getMarginalDataUSA, getTotalStatesDataForDate, getMarginalStatesDataForDate } from '../../actions/dataActions';
import { getStates } from '../../actions/stateActions';
import store from '../../store';

class USAData extends Component {

    constructor() {
        super();
        this.state = {
            totalStatesDataIsVisible: true
        };
    }

    componentDidMount() {
        const { title } = this.props;
        const { date } = store.getState();
        const { states } = store.getState().stateData;
        const { totalDataUSA, marginalDataUSA, totalStatesDataForDate, marginalStatesDataForDate } = store.getState().data;
        if (states.length === 1) this.props.getStates();
        if (totalDataUSA.length === 0 && title.includes('Total')) this.props.getTotalDataUSA();
        if (marginalDataUSA.length === 0 && title.includes('Marginal')) this.props.getMarginalDataUSA();
        if (title.includes('Total') && (Object.keys(totalStatesDataForDate).length === 0 || totalStatesDataForDate[date.substring(5)].length === 0)) this.props.getTotalStatesDataForDate(date);
        if (title.includes('Marginal') && (Object.keys(marginalStatesDataForDate).length === 0 || marginalStatesDataForDate[date.substring(5)].length === 0)) this.props.getMarginalStatesDataForDate(date);
    }

    minimizeDataSet = (data) => data.filter((date, index) => index % 7 === 0);

    onHeaderButtonClick = (e) => {
        this.setState({
            totalStatesDataIsVisible: e.currentTarget.name.includes('State')
        });
    }

    getData = () => {
        const { title } = this.props;
        const { totalDataUSA, marginalDataUSA } = store.getState().data;
        const data = title.includes('Total') ? totalDataUSA : marginalDataUSA;
        return data;
    }

    getDataForSpecificDate = () => {
        const { title } = this.props;
        const date = moment(store.getState().date).format('MM-DD');
        const { totalStatesDataForDate, marginalStatesDataForDate } = store.getState().data;
        if (title.includes('Total')) {
            if (Object.keys(totalStatesDataForDate).length === 0) return [];
            return totalStatesDataForDate[date];
        } else {
            return marginalStatesDataForDate[date];
        }
    }

    render() {
        const { title } = this.props;
        const { totalStatesDataIsVisible } = this.state;
        const data = this.getData();
        const dateData = this.getDataForSpecificDate();
        return (
            <React.Fragment>
                <SplineChart data={this.minimizeDataSet(data)} title={title + ' Cases vs. Deaths'} />
                <LineChart data={this.minimizeDataSet(data)} title={title + ' Cases vs. Deaths'} />
                <BarChart data={this.minimizeDataSet(data)} title={title + ' Cases vs. Deaths'} />
                <USADataTable tableData={dateData} isVisible={totalStatesDataIsVisible} title={title + ' Data for all States'} onHeaderButtonClick={this.onHeaderButtonClick} />
                <USADataTable tableData={data} isVisible={!totalStatesDataIsVisible} title={title + ' Data for all Dates'} onHeaderButtonClick={this.onHeaderButtonClick} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.data,
    states: state.states,
    stateData: state.stateData
});

USAData.propTypes = {
    getTotalDataUSA: PropTypes.func.isRequired,
    getMarginalDataUSA: PropTypes.func.isRequired,
    getTotalStatesDataForDate: PropTypes.func.isRequired,
    getMarginalStatesDataForDate: PropTypes.func.isRequired,
    getStates: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getTotalDataUSA, getMarginalDataUSA, getTotalStatesDataForDate, getMarginalStatesDataForDate, getStates })(USAData);