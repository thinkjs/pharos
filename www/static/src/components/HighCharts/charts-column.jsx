import React from 'react';
import Highcharts from 'react-highcharts';

var config = {
  chart: {
      type: 'column',
      height: 300
  },
  title: {
      text: null
  },
  xAxis: {
      categories: [
          'Jan',
          'Feb'
      ],
      crosshair: true
  },
  yAxis: {
      min: 0,
      title: {
          text: 'Rainfall (mm)'
      }
  },
  tooltip: {
    backgroundColor: '#4C5E70',
    borderRadius: 8,
    shadow: false,
    style: {
      color: '#fff'
    },
    borderWidth: 0,
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat: `<tr>
                    <td style="color:{series.color};padding:0">{series.name}: </td>
                    <td style="padding:0"><b>{point.y}</b></td>
                  </tr>`,
    footerFormat: '</table>',
    shared: true,
    useHTML: true
  },
  plotOptions: {
      column: {
          pointPadding: 0.2,
          borderWidth: 0
      }
  },
  series: [{
      name: 'Tokyo',
      data: [49.9, 71.5]

  }, {
      name: 'New York',
      data: [83.6, 78.8]

  }],
  legend: {
    verticalAlign: 'top',
    y: 0
  },
  credits: {
      enabled: false
  },
  colors: ['#00add7', '#b2bed2']
};

class ChartsColumn extends React.Component{
  static defaultProps = {
    config: {}
  }
  render(){
    config = Object.assign(config, this.props.config);
    return (
      <Highcharts config = {config} />
    );
  }
}
export default ChartsColumn;
export {ChartsColumn};
