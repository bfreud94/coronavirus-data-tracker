import React, { Component } from 'react';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import { TableContainer, TablePagination } from '@material-ui/core';
import './StateDataTable.css';

class StateDataTable extends Component {

    constructor() {
        super();
        this.state = {
            data: {},
            page: 0,
            rowsPerPage: 10
        };
    }

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
        const { title } = this.props;
        const { page, rowsPerPage } = this.state;
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
        let sortedData = [];
        const dataToSort = this.state.data.length > 0 ? this.state.data : this.props.data;
        let isReverse = false;
        if (dataToSort !== undefined && dataToSort.length > 0) {
            if (sortBy === 'date') {
                isReverse = parseInt(dataToSort[0][sortBy].substring(0, 2)) > parseInt(dataToSort[dataToSort.length - 1][sortBy].substring(0, 2));
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
        const { data, title } = this.props;
        const { page, rowsPerPage } = this.state;
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
                    onChangePage={this.handlePageChange}
                    onChangeRowsPerPage={(e) => this.handleChangeRowsPerPage(e.target.value)}
                />
            </div>
        );
    }
}

export default StateDataTable;