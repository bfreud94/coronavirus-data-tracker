import React, { Component } from 'react';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import 'date-fns';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import '../../bootstrap.min.css';
import './usaDataTable.css';

const styles = () => ({
    datePicker: {
        margin: '-15px 100px 0px 0px',
        border: '1.3px solid rgb(128, 128, 128)',
        borderRadius: '5px',
        padding: '4px'
    }
});

export class USADataTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            date: moment().subtract(1, 'days')
        }
    }

    tableHeaderStyles = () => {
        const { title } = this.props;
        return {
            margin: title.includes('Marginal') ? '0px 0px 0px 100px': '0px 0px 0px 375px'
        }
    }

    tableBodyStyles = () => {
        const { data } = this.props;
        return {
            height: data !== undefined && data.length !== 0 ? '' : '200px'
        }
    }

    tableHeader = () => {
        const { title } = this.props;
        const isStatesDataTable = title.includes('States');
        return (
            <tr className="usaDataTable-column-header">
                {isStatesDataTable ? <th title="state" className="usaDataTable-column-header-state" onClick={this.sortByColumn}>State</th> : <th title="day" className="usaDataTable-column-header-day" onClick={this.sortByColumn}>Day</th>}
                <th title="cases" className="usaDataTable-column-header-cases" onClick={this.sortByColumn}>Cases</th>
                <th title="deaths" className="usaDataTable-column-header-deaths" onClick={this.sortByColumn}>Deaths</th>
            </tr>
        );
    }

    tableData = () => {
        const { title } = this.props;
        const data = this.state.data.length === 0 ? this.props.data : this.state.data;
        const isStatesDataTable = title.includes('States');
        let tableData = [];
        if(Array.isArray(data)) {
            data.forEach((day, index) => {
                tableData.push(
                    <tr className="usaDataTable-column-header" key={index}>
                        <td>{isStatesDataTable ? day.state : day.day}</td>
                        <td>{day.cases}</td>
                        <td>{day.deaths}</td>
                    </tr>
                );
            });
        }
        return (
            <React.Fragment>
                {tableData}
            </React.Fragment>
        );
    }

    tableButtons = () => {
        const { onHeaderButtonClick } = this.props;
        return (
            <React.Fragment>
                <Button className="usaDataTable-total-cases-usa-button" variant="contained" color="primary" onClick={onHeaderButtonClick} name="Show Daily Totals">Show Daily Totals</Button>
                <Button className="usaDataTable-total-cases-each-state-button" variant="contained" color="primary" onClick={onHeaderButtonClick} name="Show State Totals">Show State Totals</Button>
            </React.Fragment>
        );
    }

    showTable = () => {
        const { isVisible } = this.props;
        return {
            display: isVisible ? 'block' : 'none'
        }
    }

    sortByColumn = (e) => {
        let sortedData = [];
        let sortBy = e.currentTarget === undefined ? e : e.currentTarget.title;
        const dataToSort = this.state.data.length > 0 ? this.state.data : this.props.data;
        let isReverse = false;
        if(dataToSort !== undefined && dataToSort.length > 0) {
            if(sortBy === 'state') {
                isReverse = dataToSort[0][sortBy].charAt(0) !== 'A';
            } else if(sortBy === 'day') {
                isReverse = dataToSort[0][sortBy].substring(0, 2) !== '03';
            } else {
                isReverse = dataToSort[0][sortBy] > dataToSort[dataToSort.length - 1][sortBy];
            }
            sortedData = isReverse ? dataToSort.sort((a, b) => a[sortBy] < b[sortBy] ? -1 : 1) : dataToSort.sort((a, b) => a[sortBy] < b[sortBy] ? 1 : -1);
            this.setState({
                data: sortedData
            });
        }
    }

    handleDateChange = async (date) => {
        const { marginalStatesDataForDay } = this.props;
        this.setState({
            date: date,
            data: await marginalStatesDataForDay(moment(date).format('YYYY-MM-DD'))
        });
    }

    datePicker = () => {
        const { classes } = this.props;
        const { date } = this.state;
        return (
            <span className="usaDataTable-date-picker-wrapper">  
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker disableToolbar autoOk={true} variant="inline" format="MM/dd/yyyy" margin="normal" value={date} onChange={this.handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
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
        const { data, title } = this.props;
        const { date } = this.state;
        const isTotalData = title.includes('Total');
        return (
            <div className="usaDataTable" style={this.showTable()}>
                <h3 className="usaDataTable-header" style={this.tableHeaderStyles()}>
                    <span>{`${title}` + (isTotalData ? '' : ' for ' + moment(new Date(date)).format('MMM Do'))}</span>
                    {isTotalData ? this.tableButtons() : this.datePicker()}
                </h3>
                <MDBTable style={this.tableBodyStyles()}>
                    <MDBTableHead>
                        {this.tableHeader()}
                    </MDBTableHead>
                    <MDBTableBody>
                        {data !== undefined && data.length !== 0 ? this.tableData() :
                        <tr><td><Loader className="usaDataTable-loader" type="TailSpin" color="blue"/></td></tr>}
                    </MDBTableBody>
                </MDBTable>
            </div>
        )
    }
}

export default withStyles(styles)(USADataTable);