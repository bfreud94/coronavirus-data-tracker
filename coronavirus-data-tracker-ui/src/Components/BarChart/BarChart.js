import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { Chart, ArgumentAxis, ValueAxis, BarSeries, Title, Legend } from '@devexpress/dx-react-chart-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { Stack } from '@devexpress/dx-react-chart';
import Loader from 'react-loader-spinner';
import './barChart.css';

const legendStyles = () => ({
    root: {
        display: 'flex',
        margin: 'auto',
        flexDirection: 'row',
    },
});

const legendRootBase = ({ classes, ...restProps }) => (
    <Legend.Root {...restProps} className={classes.root} />
);

const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase);

const legendLabelStyles = () => ({
    label: {
        whiteSpace: 'nowrap',
    },
});

const legendLabelBase = ({ classes, ...restProps }) => (
    <Legend.Label className={classes.label} {...restProps} />
);

const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase);

class BarChart extends React.Component {

    render() {
        const { data, title } = this.props;
        return (
            <div style={{margin: '0px 100px 200px 100px', overflow: 'auto'}}>
                <Paper>
                    {data.length > 0 ?
                        <Chart data={data}>
                            <ArgumentAxis />
                            <ValueAxis />
                            <BarSeries name="Cases" valueField="cases" argumentField="day"/>
                            <BarSeries name="Deaths" valueField="deaths" argumentField="day"/>
                            <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
                            <Title text={title} />
                            <Stack/>
                        </Chart>
                    : <Loader className="barChart-loader" type="TailSpin" color="blue"/>}
                </Paper>
            </div>
        );
    }
}

export default BarChart;