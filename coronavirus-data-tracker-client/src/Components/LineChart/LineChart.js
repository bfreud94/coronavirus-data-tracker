import React from 'react';
import { Chart, ArgumentAxis, ValueAxis, LineSeries, Legend } from '@devexpress/dx-react-chart-material-ui';
import { withStyles } from '@material-ui/core/styles';
import './LineChart.css';

const legendStyles = () => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        margin: 'auto'
    }
});

const legendLabelStyles = (theme) => ({
    label: {
        paddingTop: theme.spacing(1),
        whiteSpace: 'nowrap'
    }
});

const legendItemStyles = () => ({
    item: {
        flexDirection: 'column'
    }
});

const legendRootBase = ({ classes, ...restProps }) => (
    <Legend.Root {...restProps} className={classes.root} />
);

const legendLabelBase = ({ classes, ...restProps }) => (
    <Legend.Label className={classes.label} {...restProps} />
);

const legendItemBase = ({ classes, ...restProps }) => (
    <Legend.Item className={classes.item} {...restProps} />
);

const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase);
const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase);
const Item = withStyles(legendItemStyles, { name: 'LegendItem' })(legendItemBase);

const lineChartStyles = () => ({
    chart: {
        paddingRight: '20px',
        width: '2000px'
    }
});

const ValueLabel = (props) => {
    const { text } = props;
    return (
        <ValueAxis.Label {...props} text={text} />
    );
};

class LineChart extends React.Component {
    render() {
        const { classes, data, title } = this.props;
        return (
            <div className='lineChart-wrapper'>
                <h3 className='lineChart-title'>{title}</h3>
                {data.length > 0
                    ? (
                    <Chart data={data} className={classes.chart}>
                        <ArgumentAxis />
                        <ValueAxis max={50} labelComponent={ValueLabel} />
                        <LineSeries name='Cases' valueField='cases' argumentField='date' />
                        <LineSeries name='Deaths' valueField='deaths' argumentField='date' />
                        <Legend position='bottom' rootComponent={Root} itemComponent={Item} labelComponent={Label} />
                    </Chart>
                    )
                : ''}
            </div>
        );
    }
}

export default withStyles(lineChartStyles)(LineChart);
