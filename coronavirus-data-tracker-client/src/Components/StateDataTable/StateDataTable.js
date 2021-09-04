import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import moment from 'moment';
import { TableContainer, TablePagination } from '@material-ui/core';
import './StateDataTable.css';

class StateDataTable extends Component {

    tableHeader = () => (
        <tr className='state-data-table-column-header'>
            <th className='state-data-table-column-header-date' title='date' onClick={(e) => this.sortByColumn(e.currentTarget.title)}>Date</th>
            <th className='state-data-table-column-header-cases' title='cases' onClick={(e) => this.sortByColumn(e.currentTarget.title)}>Cases</th>
            <th className='state-data-table-column-header-deaths' title='deaths' onClick={(e) => this.sortByColumn(e.currentTarget.title)}>Deaths</th>
        </tr>
    );

    totalData = () => {
        const { data } = this.props;
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

    numberWithCommas = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    tableData = () => {
        const { title, page, rowsPerPage } = this.props;
        const data = [...this.props.data].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        const tableData = [];
        const { totalCases, totalDeaths } = this.totalData();
        const isMarginalDataTable = title.includes('Marginal');
        if (isMarginalDataTable) {
            tableData.push(
                <tr className='state-data-table-top-row' key={0}>
                    <td>Total Data</td>
                    <td>{this.numberWithCommas(totalCases)}</td>
                    <td>{this.numberWithCommas(totalDeaths)}</td>
                </tr>  
            );
        }
        data.forEach((date, index) => {
            tableData.push(
                <tr className={`${index % 2 === 0 ? `state-data-table-odd-row` : 'state-data-table-even-row'}`} style={{ backgroundColor: index % 2 === 0 ? '#e7f3c5' : ''}} key={index + 1}>
                    <td>{date.date}</td>
                    <td>{this.numberWithCommas(date.cases)}</td>
                    <td>{this.numberWithCommas(date.deaths)}</td>
                </tr>
            );
        });
        return (
            <React.Fragment>
                {tableData}
            </React.Fragment>
        );
    }

    sortByColumn = (sortBy) => {
        const { data, sortData } = this.props;
        let sortedData = [];
        let isReverse = false;
        if (data !== undefined && data.length > 0) {
            if (sortBy === 'date') {
                isReverse = moment(data[0][sortBy]).isAfter(moment(data[data.length - 1][sortBy])) ? true : isReverse;
            } else {
                isReverse = data[0][sortBy] > data[data.length - 1][sortBy];
            }
            sortedData = isReverse ? data.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1)) : data.sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1));
            sortData(sortedData, sortBy);
        }
    }

    render() {
        const { data, title, page, rowsPerPage, handlePageChange, handleChangeRowsPerPage } = this.props;
        return (
            <div className='state-data-table'>
                <h3 className='state-data-table-header'>
                    <span>{title}</span>
                </h3>
                <TableContainer>
                    <MDBTable>
                        <MDBTableHead>
                            {this.tableHeader()}
                        </MDBTableHead>
                        <MDBTableBody>
                            {this.tableData()}
                        </MDBTableBody>
                    </MDBTable>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component='div'
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={(e) => handleChangeRowsPerPage(e.target.value)}
                />
            </div>
        );
    }
}

StateDataTable.propTypes = {
    data: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
    sortData: PropTypes.func.isRequired
};

export default StateDataTable;