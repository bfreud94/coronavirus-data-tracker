import React, { Component } from 'react';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import '../../bootstrap.min.css';
import './StateDataTable.css';

class StateDataTable extends Component {

    constructor() {
        super();
        this.state = {
            data: {}
        };
    }

    tableHeader = () => (
        <tr className='state-data-table-column-header'>
            <th className='state-data-table-column-header-date' title='date' onClick={this.sortByColumn}>Date</th>
            <th className='state-data-table-column-header-cases' title='cases' onClick={this.sortByColumn}>Cases</th>
            <th className='state-data-table-column-header-deaths' title='deaths' onClick={this.sortByColumn}>Deaths</th>
        </tr>
    );

    tableData = () => {
        const { data } = this.props;
        const tableData = [];
        data.forEach((date, index) => {
            tableData.push(
                <tr className='state-data-table-column-header' key={index}>
                    <td>{date.date}</td>
                    <td>{date.cases}</td>
                    <td>{date.deaths}</td>
                </tr>
            );
        });
        return (
            <React.Fragment>
                {tableData}
            </React.Fragment>
        );
    }

    sortByColumn = (e) => {
        let sortedData = [];
        const sortBy = e.currentTarget === undefined ? e : e.currentTarget.title;
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
                data: sortedData
            });
        }
    }

    render() {
        const { title } = this.props;
        return (
            <div className='state-data-table'>
                <h3 className='state-data-table-header'>
                    <span>{title}</span>
                </h3>
                <MDBTable>
                    <MDBTableHead>
                        {this.tableHeader()}
                    </MDBTableHead>
                    <MDBTableBody>
                        {this.tableData()}
                    </MDBTableBody>
                </MDBTable>
            </div>
        );
    }
}

export default StateDataTable;