import React from 'react';
import Highcharts from 'react-highcharts';

class ChartsCircle extends React.Component{
  static defaultProps = {
    config: {}
  }
  render(){
    var config = {
      chart: {
          height: 300,
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false
      },
      tooltip: {
        shared: true,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 8,
        shadow: false,
        style: {
          color: '#fff'
        },
        borderWidth: 0,
        pointFormat: '{point.percentage:.1f}%'
      },
      plotOptions: {
          pie: {
              startAngle: 0,
              endAngle: 360,
              showInLegend: true,
              connectorColor: '#DFDCE7',
              softConnector: false
          }
      },
      credits: {
        enabled: false
      }
    };
    config = Object.assign(config, this.props.config);
    return (
      <Highcharts config={config} />
    );
  }
}
export default ChartsCircle;
export {ChartsCircle};
