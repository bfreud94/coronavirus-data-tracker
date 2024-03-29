import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import { withStyles } from '@material-ui/styles';
import { Button, TableContainer, TablePagination } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { getMarginalStatesDataForDate } from '../../actions/dataActions';
import { changeDate } from '../../actions/dateActions';
import 'date-fns';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import Loader from 'react-loader-spinner';
import store from '../../store';
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
            data: [],
            page: 0,
            rowsPerPage: 10
        };
    }

    tableBodyStyles = () => ({
        height: this.props.tableData !== undefined && this.props.tableData.length !== 0 ? '' : '200px'
    });

    tableHeader = () => (
        <tr className='usa-data-table-column-header'>
            {this.props.title.includes('States') ? <th title='state' className='usa-data-table-column-header-state' onClick={(e) => this.sortByColumn(e.currentTarget.title)}>State</th> : <th title='date' className='usa-data-table-column-header-date' onClick={this.sortByColumn}>Date</th>}
            <th title='cases' className='usa-data-table-column-header-cases' onClick={(e) => this.sortByColumn(e.currentTarget.title)}>Cases</th>
            <th title='deaths' className='usa-data-table-column-header-deaths' onClick={(e) => this.sortByColumn(e.currentTarget.title)}>Deaths</th>
        </tr>
    );

    numberWithCommas = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    totalData = () => {
        const data = this.props.tableData;
        let totalCases = 0;
        let totalDeaths = 0;
        data.forEach(({ cases, deaths }) => {
            totalCases += cases;
            totalDeaths += deaths;
        });
        return {
            totalCases,
            totalDeaths
        };
    }

    tableData = () => {
        const { title } = this.props;
        const { page, rowsPerPage } = this.state;
        const data = [...this.props.tableData].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        const tableDataElements = [];
        const { totalCases, totalDeaths } = this.totalData();
        if (title.includes('Marginal')) {
            tableDataElements.push(
                <tr className='usa-data-table-top-row' key={0}>
                    <td>Total Data</td>
                    <td>{this.numberWithCommas(totalCases)}</td>
                    <td>{this.numberWithCommas(totalDeaths)}</td>
                </tr>
            );
        }
        if (Array.isArray(data)) {
            data.forEach((date, index) => {
                tableDataElements.push(
                    <tr className={`${index % 2 === 0 ? `usa-data-table-odd-row` : 'usa-data-table-even-row'}`} key={index + 1}>
                        <td>{title.includes('States') ? date.state : date.date}</td>
                        <td>{this.numberWithCommas(date.cases)}</td>
                        <td>{this.numberWithCommas(date.deaths)}</td>
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
                <Button className='usa-data-table-total-cases-usa-button' variant='contained' color='primary' onClick={onHeaderButtonClick} name='Show Daily Totals'>Show Daily Totals</Button>
                <Button className='usa-data-table-total-cases-each-state-button' variant='contained' color='primary' onClick={onHeaderButtonClick} name='Show State Totals'>Show State Totals</Button>
            </React.Fragment>
        );
    }

    showTable = () => {
        const { isVisible } = this.props;
        return {
            display: isVisible ? 'block' : 'none'
        };
    }

    sortByColumn = (sortBy) => {
        let sortedData = [];
        const dataToSort = this.state.data.length > 0 ? this.state.data : this.props.tableData;
        let isReverse = false;
        if (dataToSort !== undefined && dataToSort.length > 0) {
            if (sortBy === 'state') {
                isReverse = dataToSort[0][sortBy].charAt(0) !== 'A';
            } else if (sortBy === 'date') {
                const firstDate = parseInt(dataToSort[0][sortBy].substring(0, 2));
                const lastDate = parseInt(dataToSort[dataToSort.length - 1][sortBy].substring(0, 2));
                isReverse = firstDate > lastDate;
            } else {
                isReverse = dataToSort[0][sortBy] > dataToSort[dataToSort.length - 1][sortBy];
            }
            sortedData = isReverse ? dataToSort.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1)) : dataToSort.sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1));
            this.setState({
                data: sortedData,
                page: 0
            });
        }
    }

    handleDateChange = (date) => {
        const firstDay = moment('2020-01-21').format('YYYY-MM-DD');
        const lastDay = moment().subtract(1, 'days').format('YYYY-MM-DD');
        if (moment(date).isBefore(firstDay)) date = firstDay;
        if (moment(date).isAfter(lastDay)) date = lastDay;
        this.props.getMarginalStatesDataForDate(moment(date).format('YYYY-MM-DD'));
        this.props.changeDate(moment(date).format('YYYY-MM-DD'));
        this.setState({
            data: []
        });
    };

    datePicker = () => {
        const { classes } = this.props;
        const date = moment(store.getState().date).format('YYYY-MM-DD');
        return (
            <span className='usa-data-table-date-picker-wrapper'>
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

    render() {
        const { tableData, title } = this.props;
        const { page, rowsPerPage } = this.state;
        const date = moment(store.getState().date).format('MM-DD');
        const isTotalData = title.includes('Total');
        return (
            <div className='usa-data-table' style={this.showTable()}>
                <h3 className='usa-data-table-header'>
                    <span>{`${title}` + (isTotalData ? '' : ' for ' + moment(date, 'MM-DD').format('MMM Do'))}</span>
                    {isTotalData ? this.tableButtons() : this.datePicker()}
                </h3>
                <TableContainer>
                    <MDBTable style={this.tableBodyStyles()}>
                        <MDBTableHead>
                            {this.tableHeader()}
                        </MDBTableHead>
                        <MDBTableBody>
                            {tableData !== undefined && tableData.length !== 0 ? this.tableData()
                            : <tr><td><Loader className='usa-data-table-loader' type='TailSpin' color='blue' /></td></tr>}
                        </MDBTableBody>
                    </MDBTable>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component='div'
                    count={tableData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handlePageChange}
                    onChangeRowsPerPage={(e) => this.handleChangeRowsPerPage(e.target.value)}
                />
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    data: state.data,
    date: state.date
});

USADataTable.propTypes = {
    getMarginalStatesDataForDate: PropTypes.func.isRequired,
    changeDate: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getMarginalStatesDataForDate, changeDate })(withStyles(styles)(USADataTable));