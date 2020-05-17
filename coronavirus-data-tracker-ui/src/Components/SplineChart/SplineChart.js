import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Chart, ArgumentAxis, ValueAxis, AreaSeries, Title, Legend } from '@devexpress/dx-react-chart-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { curveCatmullRom, area } from 'd3-shape';
import Loader from 'react-loader-spinner';
import './splineChart.css';

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
        whiteSpace: 'nowrap'
    }
});

const legendLabelBase = ({ classes, ...restProps }) => (
    <Legend.Label className={classes.label} {...restProps} />
);

const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase);

const splineChartStyles = () => ({
    chart: {
        paddingRight: '20px',
    },
});

const format = () => tick => tick;

const Area = props => (
    <AreaSeries.Path {...props}
        path={area()
            .x(({ arg }) => arg)
            .y1(({ val }) => val)
            .y0(({ startVal }) => startVal)
            .curve(curveCatmullRom)
        }
    />
);

class SplineChart extends React.Component {

    render() {
        const { classes, data, title } = this.props;
        return (
            <div style={{margin: '0px 100px 100px 100px', overflow: 'auto'}}>
                <Paper>
                    {data.length > 0 ?
                        <Chart data={data} className={classes.chart}>
                            <ArgumentAxis tickFormat={format}/>
                            <ValueAxis/>
                            <AreaSeries name="Cases" valueField="cases" argumentField="day" seriesComponent={Area}/>
                            <AreaSeries name="Deaths" valueField="deaths" argumentField="day" seriesComponent={Area} />
                            <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
                            <Title text={title} />
                    </Chart>
                    : <Loader className="splineChart-loader" type="TailSpin" color="blue"/> }
                </Paper>
            </div>
        );
    }
}

export default withStyles(splineChartStyles)(SplineChart);
