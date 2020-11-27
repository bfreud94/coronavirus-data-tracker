import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import SplineChart from '../SplineChart/SplineChart';
import LineChart from '../LineChart/LineChart';
import BarChart from '../BarChart/BarChart';
import USADataTable from '../USADataTable/USADataTable';
import { getTotalDataUSA, getMarginalDataUSA, getTotalStatesDataForDay, getMarginalStatesDataForDay } from '../../actions/dataActions';
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
        this.props.getTotalStatesDataForDay('l');
        this.props.getMarginalStatesDataForDay(moment(new Date()).format('YYYY-MM-DD'));
    }

    formatData = (data) => data.filter((day, index) => index % 7 === 0);

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

    getDayData = () => {
        const { title } = this.props;
        const date = moment(store.getState().date).format('MM-DD');
        const { totalStatesDataForDay, marginalStatesDataForDay } = store.getState().data;
        if (title.includes('Total')) {
            if (Object.keys(totalStatesDataForDay).length === 0) return [];
            return totalStatesDataForDay[date];
        } else {
            return marginalStatesDataForDay[date];
        }
    }

    render() {
        const { title } = this.props;
        const { totalStatesDataIsVisible } = this.state;
        const data = this.getData();
        const dayData = this.getDayData();
        return (
            <React.Fragment>
                <SplineChart data={this.formatData(data)} title={title + ' Cases vs. Deaths'} />
                <LineChart data={this.formatData(data)} title={title + ' Cases vs. Deaths'} />
                <BarChart data={this.formatData(data)} title={title + ' Cases vs. Deaths'} />
                <USADataTable tableData={dayData} isVisible={totalStatesDataIsVisible} title={title + ' Data for all States'} onHeaderButtonClick={this.onHeaderButtonClick} />
                <USADataTable tableData={data} isVisible={!totalStatesDataIsVisible} title={title + ' Data for all Days'} onHeaderButtonClick={this.onHeaderButtonClick} />
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
    getTotalStatesDataForDay: PropTypes.func.isRequired,
    getMarginalStatesDataForDay: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getTotalDataUSA, getMarginalDataUSA, getTotalStatesDataForDay, getMarginalStatesDataForDay })(USAData);