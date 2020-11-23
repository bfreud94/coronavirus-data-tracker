import * as React from 'react';
import { Chart, ArgumentAxis, ValueAxis, BarSeries, Legend } from '@devexpress/dx-react-chart-material-ui';
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

class BarChart extends React.Component {

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
                        <BarSeries name='Cases' valueField='cases' argumentField='day' />
                        <BarSeries name='Deaths' valueField='deaths' argumentField='day' />
                        <Legend position='bottom' rootComponent={Root} labelComponent={Label} />
                        <Stack />
                    </Chart>
                )
                : ''}
            </div>
        );
    }
}

export default withStyles(barChartStyles)(BarChart);