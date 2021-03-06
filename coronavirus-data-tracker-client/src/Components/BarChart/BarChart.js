import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart, ArgumentAxis, ValueAxis, BarSeries, Legend, ZoomAndPan } from '@devexpress/dx-react-chart-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { Stack } from '@devexpress/dx-react-chart';
import './BarChart.css';

const barChartStyles = () => ({
    chart: {
        paddingRight: '20px',
        width: '2000px'
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

class BarChart extends Component {

    render() {
        const { classes, data, title } = this.props;
        return (
            <div className='barChart-wrapper'>
                <h3 className='barChart-title'>{title}</h3>
                {data.length > 0
                ? (
                    <Chart data={data} className={classes.chart}>
                        <ArgumentAxis />
                        <ValueAxis />
                        <BarSeries name='Cases' valueField='cases' argumentField='date' />
                        <BarSeries name='Deaths' valueField='deaths' argumentField='date' />
                        <Legend position='bottom' rootComponent={Root} labelComponent={Label} />
                        <Stack />
                        <ZoomAndPan />
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