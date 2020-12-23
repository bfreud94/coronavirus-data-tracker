import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import SplineChart from '../SplineChart/SplineChart';
import LineChart from '../LineChart/LineChart';
import BarChart from '../BarChart/BarChart';
import USADataTable from '../USADataTable/USADataTable';
import { getTotalDataUSA, getMarginalDataUSA, getTotalStatesDataForDate, getMarginalStatesDataForDate } from '../../actions/dataActions';
import store from '../../store';

class USAData extends Component {

    constructor() {
        super();
        this.state = {
            totalStatesDataIsVisible: true
        };
    }

    componentDidMount() {
        this.props.getTotalDataUSA();
        this.props.getMarginalDataUSA();
        this.props.getTotalStatesDataForDate(moment(new Date()).format('YYYY-MM-DD'));
        this.props.getMarginalStatesDataForDate(moment(new Date()).format('YYYY-MM-DD'));
    }

    formatData = (data) => data.filter((date, index) => index % 7 === 0);

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

    getDateData = () => {
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
        const dateData = this.getDateData();
        return (
            <React.Fragment>
                <SplineChart data={this.formatData(data)} title={title + ' Cases vs. Deaths'} />
                <LineChart data={this.formatData(data)} title={title + ' Cases vs. Deaths'} />
                <BarChart data={this.formatData(data)} title={title + ' Cases vs. Deaths'} />
                <USADataTable tableData={dateData} isVisible={totalStatesDataIsVisible} title={title + ' Data for all States'} onHeaderButtonClick={this.onHeaderButtonClick} />
                <USADataTable tableData={data} isVisible={!totalStatesDataIsVisible} title={title + ' Data for all Dates'} onHeaderButtonClick={this.onHeaderButtonClick} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.data,
    states: state.states
});

USAData.propTypes = {
    getTotalDataUSA: PropTypes.func.isRequired,
    getMarginalDataUSA: PropTypes.func.isRequired,
    getTotalStatesDataForDate: PropTypes.func.isRequired,
    getMarginalStatesDataForDate: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getTotalDataUSA, getMarginalDataUSA, getTotalStatesDataForDate, getMarginalStatesDataForDate })(USAData);