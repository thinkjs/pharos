import ChartsBase from './base';

class ChartsArea extends ChartsBase {
  createConfig(nextProps) {
    var data = nextProps.data;
    var baseConfig = nextProps.config;
    var xType = nextProps.xType;
    var colorThemes = [{
      fillColor: 'rgba(221,230,239,0.5)',
      lineColor: '#04A870',
      marker: {
        fillColor: '#04A870',
        states: {
          hover: {
            enabled: true,
            lineColor: '#04A870',
            fillColor: '#FFFFFF'
          }
        }
      }
    }, {
      fillColor: 'rgba(250,242,249,0.5)',
      lineColor: '#C97FC4',
      marker: {
        fillColor: '#C97FC4',
        states: {
          hover: {
            enabled: true,
            lineColor: '#C97FC4',
            fillColor: '#FFFFFF'
          }
        }
      }
    }];
    var xAxis = this.xAxisFactory(data, xType);
    var config = {
      series: data.series.map((serie, i)=>{
        let newData = serie.data.map(y=>{
          return {y, marker: {enabled: false}};
        });
        xAxis.tickPositions.forEach(position=>{
          newData[position].marker.enabled = true;
        });
        return Object.assign({name: serie.name, data: newData}, colorThemes[i]);
      }),
      xAxis
    };
    return Object.assign({}, baseConfig, config);
  }
}
export default ChartsArea;
export {ChartsArea};
