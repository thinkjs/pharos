import React from 'react';
import Highcharts from 'react-highcharts';

class ChartsPie extends React.Component{
  static defaultProps = {
    config: {}
  }
  render(){
    var config = {
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
      tooltip: {
        shared: true,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 8,
        shadow: false,
        style: {
          color: '#fff'
        },
        borderWidth: 0,
        pointFormat: '{series.name}: {point.y}({point.percentage:.1f}%)'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: false
              },
              showInLegend: true
          }
      },
      credits: {
          enabled: false
      }
    };
    config = Object.assign(config, this.props.config);
    return (
        <Highcharts config = {config} />
    );
  }
}
export default ChartsPie;
export {ChartsPie};
