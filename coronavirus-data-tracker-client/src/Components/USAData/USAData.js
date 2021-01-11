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
        if (title.includes('Total') && (Object.keys(totalStatesDataForDate).length === 0 || totalStatesDataForDate[date].length === 0)) this.props.getTotalStatesDataForDate(date);
        if (title.includes('Marginal') && (Object.keys(marginalStatesDataForDate).length === 0 || marginalStatesDataForDate[date].length === 0)) this.props.getMarginalStatesDataForDate(date);
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
        let data = title.includes('Total') ? totalDataUSA : marginalDataUSA;
        if (data.length === 0) return data;
        return [...data].map((dataForDate) => ({...dataForDate, date: moment(dataForDate.date).format('MM-DD')}));
    }

    getDataForSpecificDate = () => {
        const { title } = this.props;
        const date = moment(store.getState().date).format('YYYY-MM-DD');
        const { totalStatesDataForDate, marginalStatesDataForDate } = store.getState().data;
        if (title.includes('Total')) {
            if (Object.keys(totalStatesDataForDate).length === 0) return [];
            return [...totalStatesDataForDate[date]].sort((a, b) => a.cases > b.cases ? -1 : 1);
        } else {
            return marginalStatesDataForDate[date] === undefined || marginalStatesDataForDate[date].length === 0 ? [] : [...marginalStatesDataForDate[date]].sort((a, b) => a.cases > b.cases ? -1 : 1);
        }
    }

    render() {
        const { title } = this.props;
        const { totalStatesDataIsVisible } = this.state;
        const data = this.getData();
        const tableData = [...data].sort((a, b) => a.date > b.date ? -1 : 1);
        const dateData = this.getDataForSpecificDate();
        return (
            <React.Fragment>
                <USADataTable tableData={dateData} isVisible={totalStatesDataIsVisible} title={title + ' Data for all States'} onHeaderButtonClick={this.onHeaderButtonClick} />
                <USADataTable tableData={tableData} isVisible={!totalStatesDataIsVisible} title={title + ' Data for all Dates'} onHeaderButtonClick={this.onHeaderButtonClick} />
                <SplineChart data={this.minimizeDataSet(data)} title={title + ' Cases vs. Deaths'} />
                <LineChart data={this.minimizeDataSet(data)} title={title + ' Cases vs. Deaths'} />
                <BarChart data={this.minimizeDataSet(data)} title={title + ' Cases vs. Deaths'} />
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