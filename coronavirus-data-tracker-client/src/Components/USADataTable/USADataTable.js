import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { getMarginalStatesDataForDay } from '../../actions/dataActions';
import { changeDate } from '../../actions/dateActions';
import 'date-fns';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import Loader from 'react-loader-spinner';
import store from '../../store';
import '../../bootstrap.min.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './USADataTable.css';

const styles = () => ({
    datePicker: {
        margin: '-15px 100px 0px 0px',
        border: '1.3px solid rgb(128, 128, 128)',
        borderRadius: '5px',
        padding: '4px'
    }
});

export class USADataTable extends Component {

    constructor() {
        super();
        this.state = {
            data: []
        };
    }

    tableHeaderStyles = () => {
        const { title } = this.props;
        return {
            margin: title.includes('Marginal') ? '0px 0px 0px 100px' : '0px 0px 0px 375px'
        };
    }

    tableBodyStyles = () => {
        const { tableData } = this.props;
        return {
            height: tableData !== undefined && tableData.length !== 0 ? '' : '200px'
        };
    }

    tableHeader = () => {
        const { title } = this.props;
        const isStatesDataTable = title.includes('States');
        return (
            <tr className='usaDataTable-column-header'>
                {isStatesDataTable ? <th title='state' className='usaDataTable-column-header-state' onClick={this.sortByColumn}>State</th> : <th title='day' className='usaDataTable-column-header-day' onClick={this.sortByColumn}>Day</th>}
                <th title='cases' className='usaDataTable-column-header-cases' onClick={this.sortByColumn}>Cases</th>
                <th title='deaths' className='usaDataTable-column-header-deaths' onClick={this.sortByColumn}>Deaths</th>
            </tr>
        );
    }

    // Change function name
    // Change 'day' to 'date' everywhere (including APIs)
    tableData = () => {
        const { title } = this.props;
        // const { date } = this.state;
        const data = this.props.tableData;
        // Make call to getUpdatedData function
        /*
        let data = [];
        if (title.includes('Total')) {
            data = this.state.data.length === 0 ? this.props.tableData : this.state.data;
        } else {
            data = this.state.data.length === 0 ? this.props.tableData[date] : this.state.data;
        }
        */
        const isStatesDataTable = title.includes('States');
        const tableDataElements = [];
        if (Array.isArray(data)) {
            data.forEach((day, index) => {
                tableDataElements.push(
                    <tr className='usaDataTable-column-header' key={index}>
                        <td>{isStatesDataTable ? day.state : day.day}</td>
                        <td>{day.cases}</td>
                        <td>{day.deaths}</td>
                    </tr>
                );
            });
        }
        return (
            <React.Fragment>
                {tableDataElements}
            </React.Fragment>
        );
    }

    tableButtons = () => {
        const { onHeaderButtonClick } = this.props;
        return (
            <React.Fragment>
                <Button className='usaDataTable-total-cases-usa-button' variant='contained' color='primary' onClick={onHeaderButtonClick} name='Show Daily Totals'>Show Daily Totals</Button>
                <Button className='usaDataTable-total-cases-each-state-button' variant='contained' color='primary' onClick={onHeaderButtonClick} name='Show State Totals'>Show State Totals</Button>
            </React.Fragment>
        );
    }

    showTable = () => {
        const { isVisible } = this.props;
        return {
            display: isVisible ? 'block' : 'none'
        };
    }

    sortByColumn = (e) => {
        let sortedData = [];
        const sortBy = e.currentTarget === undefined ? e : e.currentTarget.title;
        const dataToSort = this.state.data.length > 0 ? this.state.data : this.props.tableData;
        let isReverse = false;
        if (dataToSort !== undefined && dataToSort.length > 0) {
            if (sortBy === 'state') {
                isReverse = dataToSort[0][sortBy].charAt(0) !== 'A';
            } else if (sortBy === 'day') {
                const firstDay = parseInt(dataToSort[0][sortBy].substring(0, 2));
                const lastDay = parseInt(dataToSort[dataToSort.length - 1][sortBy].substring(0, 2));
                isReverse = firstDay > lastDay;
            } else {
                isReverse = dataToSort[0][sortBy] > dataToSort[dataToSort.length - 1][sortBy];
            }
            sortedData = isReverse ? dataToSort.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1)) : dataToSort.sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1));
            this.setState({
                data: sortedData
            });
        }
    }

    handleDateChange = (date) => {
        if (moment().diff(moment(date), 'days') > 29) date = moment().subtract(29, 'days');
        if (moment(date).isAfter(moment())) date = moment().subtract(1, 'days');
        this.props.getMarginalStatesDataForDay(moment(date).format('YYYY-MM-DD'));
        this.props.changeDate(moment(date).format('YYYY-MM-DD'));
        this.setState({
            data: []
        });
    };

    datePicker = () => {
        const { classes } = this.props;
        const date = moment(store.getState().date).format('YYYY-MM-DD');
        return (
            <span className='usaDataTable-date-picker-wrapper'>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker disableToolbar autoOk variant='inline' format='MM/dd/yyyy' margin='normal' value={moment(date)} onChange={this.handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date'
                        }}
                        InputProps={{
                            className: classes.datePicker,
                            disableUnderline: true
                        }}
                    />
                </MuiPickersUtilsProvider>
            </span>
        );
    }

    render() {
        const { tableData, title } = this.props;
        const date = moment(store.getState().date).format('MM-DD');
        const isTotalData = title.includes('Total');
        return (
            <div className='usaDataTable' style={this.showTable()}>
                <h3 className='usaDataTable-header' style={this.tableHeaderStyles()}>
                    <span>{`${title}` + (isTotalData ? '' : ' for ' + moment(date, 'MM-DD').format('MMM Do'))}</span>
                    {isTotalData ? this.tableButtons() : this.datePicker()}
                </h3>
                <MDBTable style={this.tableBodyStyles()}>
                    <MDBTableHead>
                        {this.tableHeader()}
                    </MDBTableHead>
                    <MDBTableBody>
                        {tableData !== undefined && tableData.length !== 0 ? this.tableData()
                        : <tr><td><Loader className='usaDataTable-loader' type='TailSpin' color='blue' /></td></tr>}
                    </MDBTableBody>
                </MDBTable>
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    data: state.data,
    date: state.date,
    states: state.states
});

USADataTable.propTypes = {
    getMarginalStatesDataForDay: PropTypes.func.isRequired,
    changeDate: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getMarginalStatesDataForDay, changeDate })(withStyles(styles)(USADataTable));