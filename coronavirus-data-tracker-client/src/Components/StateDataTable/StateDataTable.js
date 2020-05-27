import React, { Component } from 'react';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import 'bootstrap/dist/css/bootstrap.min.css';
import './stateDataTable.css';

export class StateDataTable extends Component {

    tableHeader = () => {
        return (
            <tr className="stateDataTable-column-header">
                <th>Day</th>
                <th>Cases</th>
                <th>Deaths</th>
            </tr>
        );
    }

    tableData = () => {
        const { data } = this.props;
        let tableData = [];
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
        )
    }
}

export default StateDataTable;