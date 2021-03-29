import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart, ArgumentAxis, ValueAxis, BarSeries, Legend } from '@devexpress/dx-react-chart-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { Stack } from '@devexpress/dx-react-chart';
import { ValueScale } from '@devexpress/dx-react-chart';
import './BarChart.css';

const barChartStyles = () => ({
    chart: {
        paddingRight: '20px',
        width: '1250px'
    }
});

const legendStyles = () => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        margin: 'auto'
    }
});

const legendRootBase = ({ classes, ...restProps }) => (
    <Legend.Root {...restProps} className={classes.root} />
);

const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase);

const legendLabelStyles = () => ({
    label: {
        whiteSpace: 'nowrap'
    }
});

const legendLabelBase = ({ classes, ...restProps }) => (
    <Legend.Label className={classes.label} {...restProps} />
);

const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase);

const getMax = (data) => {
    return Math.max.apply(
        Math,
        data.map(({ cases }) => cases)
    ) * 1.1;
};

class BarChart extends Component {

    render() {
        const { classes, data, title } = this.props;
        const max = data && data.length > 0 ? getMax(data) : 1;
        return (
            <div className='barChart-wrapper'>
                <h3 className='barChart-title'>{title}</h3>
                {data.length > 0
                ? (
                    <Chart data={data} className={classes.chart}>
                        <ArgumentAxis />
                        <ValueAxis />
                        <ValueScale modifyDomain={() => [0, max]} />
                        <BarSeries name='Cases' valueField='cases' argumentField='date' />
                        <BarSeries name='Deaths' valueField='deaths' argumentField='date' />
                        <Legend position='bottom' rootComponent={Root} labelComponent={Label} />
                        <Stack />
                    </Chart>
                )
                : <React.Fragment />}
            </div>
        );
    }
}

BarChart.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
};

export default withStyles(barChartStyles)(BarChart);