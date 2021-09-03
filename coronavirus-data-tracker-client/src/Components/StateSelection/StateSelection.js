import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { changeCurrentState } from '../../actions/stateActions';
import { getTotalStateData, getMarginalStateData } from '../../actions/dataActions';
import store from '../../store';
import './StateSelection.css';

const styles = {
    select: {
        '& ul': {
            backgroundColor: 'cadetblue',
            color: 'white'
        }
    }
};

class StateSelection extends Component {

    menuItems = () => {
        const { states } = store.getState().stateData;
        const menuItems = [];
        states.forEach((state, index) => {
            menuItems.push(
                <MenuItem key={index} value={state}>{state}</MenuItem>
            );
        });
        return menuItems;
    }

    changeCurrentState = (state) => {
        const { pageTitle, resetPageCounter } = this.props;
        resetPageCounter();
        const { totalStateData, marginalStateData } = store.getState().data;
        this.props.changeCurrentState(state);
        if (pageTitle.includes('Total') && totalStateData[state].length === 0) this.props.getTotalStateData(state);
        if (pageTitle.includes('Marginal') && marginalStateData[state].length === 0) this.props.getMarginalStateData(state);
    }

    render() {
        const { classes } = this.props;
        const { currentState } = store.getState().stateData;
        return (
            <header className='stateSelectionHeader'>
                Select a state to display its COVID-19 data
                <Select className='stateSelectionSelect' value={currentState} onChange={(e) => this.changeCurrentState(e.target.value)} disableUnderline
                    MenuProps={{
                        classes: {
                            paper: classes.select
                        }
                    }}
                >
                    {this.menuItems()}
                </Select>
            </header>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.data,
    stateData: state.stateData
});

StateSelection.propTypes = {
    changeCurrentState: PropTypes.func.isRequired,
    getTotalStateData: PropTypes.func.isRequired,
    getMarginalStateData: PropTypes.func.isRequired,
    pageTitle: PropTypes.string.isRequired,
    resetPageCounter: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { changeCurrentState, getTotalStateData, getMarginalStateData })(withStyles(styles)(StateSelection));
