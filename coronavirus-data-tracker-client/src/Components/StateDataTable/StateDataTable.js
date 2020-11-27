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
        <tr className="stateDataTable-column-header">
            <th className="stateDataTable-column-header-day" title="day" onClick={this.sortByColumn}>Day</th>
            <th className="stateDataTable-column-header-cases" title="cases" onClick={this.sortByColumn}>Cases</th>
            <th className="stateDataTable-column-header-deaths" title="deaths" onClick={this.sortByColumn}>Deaths</th>
        </tr>
    );

    tableData = () => {
        const { data } = this.props;
        const tableData = [];
        data.forEach((day, index) => {
            tableData.push(
                <tr className="stateDataTable-column-header" key={index}>
                    <td>{day.day}</td>
                    <td>{day.cases}</td>
                    <td>{day.deaths}</td>
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
            if (sortBy === 'day') {
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
            <div className="stateDataTable">
                <h3 className="stateDataTable-header">
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