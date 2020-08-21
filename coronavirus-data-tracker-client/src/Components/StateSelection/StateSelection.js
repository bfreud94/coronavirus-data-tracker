import React, { Component } from 'react';
import './stateSelection.css';
import { withStyles } from '@material-ui/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
    select: {
        "& ul": {
            backgroundColor: 'cadetblue',
            color: 'white'
        }
    },
};

export class StateSelection extends Component {

    menuItems = () => {
        const { allStates } = this.props;
        let menuItems = [];
        allStates.forEach((state, index) => {
            menuItems.push(
                <MenuItem key={index} value={state}>{state}</MenuItem>
            );
        })
        return menuItems;
    }

    render() {
        const { classes, currentState, onStateSelectChange } = this.props;
        return (
            <header className="stateSelectionHeader">Select a state to display its COVID-19 data
            <Select className="stateSelectionSelect" value={currentState} onChange={onStateSelectChange} disableUnderline={true}
            MenuProps={{classes: {paper: classes.select}}}>
                {this.menuItems()}
            </Select>
            </header>
        );
    }
}

export default withStyles(styles)(StateSelection);