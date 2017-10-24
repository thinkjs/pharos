import React from 'react';
import Highcharts from 'react-highcharts';

class ChartsBase extends React.Component {
  static defaultProps = {
    data: false,
    config: false,
    type: 'default',
    xType: 'default'
  }

  state = {
    data: false,
    composedConfig: false
  }

  componentWillMount() {
    if(this.props.config !== false && this.props.data !== false) {
      this.state.composedConfig = this._createConfig(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.data !== nextProps.data && nextProps.config !== false && nextProps.data !== false) {
      this.state.composedConfig = this._createConfig(nextProps);
    }
  }

  _createConfig(props) {
    let config = this.createConfig(props);
    if( props.xType === 'datetime' ) {
      config.tooltip.headerFormat = '<div>{point.x:%Y-%m-%d %H:%M:%S}<br/></div><table>';
    }
    return config;
  }
  xAxisFactory(resp, xType) {
    var xAxis = {type: 'category', tickmarkPlacement: 'on'};
    xAxis = Object.assign(xAxis, resp.xAxis ? resp.xAxis : {categories: resp.categories, tickPositions: []});
    // var tickPositions = xAxis.tickPositions;
    var categories = xAxis.categories;
    // var i = 0;
    // var normalTick = ()=> {
    //   for(i = 1; i < 6; i++) {
    //     tickPositions.push(Math.floor(categories.length * i / 6));
    //   }
    // };
    //
    if(xType === 'datetime') {
      xAxis.labels = {
        format: '{value:%Y-%m-%d %H:%M:%S}'
      };
      let range = categories[categories.length - 1] - categories[0];
      if(xAxis.format) {
        xAxis.labels.format = xAxis.format;
      } else if(range <= 7200000) {
        // for(i = 0; i < categories.length; i++) {
        //   if(categories[i] % 1800000 === 0) {
        //     tickPositions.push(i);
        //   }
        // }
        xAxis.labels.format = '{value:%H:%M:%S}';
      } else if(range <= 86400000) {
        // for(i = 0; i < categories.length; i++) {
        //   if(categories[i] % 10800000 === 0) {
        //     tickPositions.push(i);
        //   }
        // }
        xAxis.labels.format = '{value:%H:%M:%S}';
      } else if(range <= 604800000) {
        // for(i = 0; i < categories.length; i++) {
        //   if(categories[i] % 86400000 === 0) {
        //     tickPositions.push(i);
        //   }
        // }
        xAxis.labels.format = '{value:%Y-%m-%d}';
      } else if(range <= 2592000000) {
        // normalTick();
        xAxis.labels.format = '{value:%Y-%m-%d}';
      }
    } else {
      // xAxis.tickPositions = categories.map((item, i)=>i);
    }
    return xAxis;
  }

  render(){
    if(!this.state.composedConfig) {
      return <div></div>;
    }
    return (
      <Highcharts config={this.state.composedConfig} isPureConfig />
    );
  }
}
export default ChartsBase;
export {ChartsBase};
