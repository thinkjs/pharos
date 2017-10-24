import moment from 'moment';
import ChartsBase from './base';

class ChartsLine extends ChartsBase{
  createConfig(nextProps) {
    return Object.assign(
      {},
      this.createLineFactory(nextProps.data, nextProps.xType),
      nextProps.config || {}
    );
  }

  createLineFactory(data, xType) {
    var { title, unit, dateType } = data;
    var config = {
      chart: {
        height: 360,
        spacingTop: 30,
        spacingBottom: 0,
        zoomType: 'x'
      },
      xAxis: this.xAxisFactory(data, xType),
      tooltip: {
        shared: true,
        backgroundColor: '#4C5E70',
        borderRadius: 8,
        shadow: false,
        style: {
          color: '#fff'
        },
        borderWidth: 0,
        headerFormat: '<table>',
        pointFormat: '<tr><td style="padding-right:4px">{series.name}：</td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        useHTML: true,
        formatter: function() {
          let formatter = 'YYYY-MM-DD HH:mm:ss';
          if(dateType == 'day') {
            formatter = 'YYYY-MM-DD';
          }
          var s = moment(new Date(this.points[0].key)).format(formatter);

          var sortedPoints = this.points.sort(function(a, b){
            return ((a.y > b.y) ? -1 : ((a.y < b.y) ? 1 : 0));
          });

          sortedPoints.forEach((point) =>{
            s += '<br/><span style="color: '+point.color+';"><strong>●</strong> </span>'+ point.series.name +': '+ point.y + ' ' + unit;
          });
         return s;
        }
      },
      title: {
        text: title,
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          fontFamily: 'Microsoft Yahei'
        }
      },
      yAxis: {
        lineWidth: 1,
        title: {
          align: 'high',
          text: '单位：' + unit,
          offset: -20,
          rotation: 0,
          y: -20
        },
        labels: {
          formatter: function () {
            var ret, multi, numericSymbols, i;
            if(['bit/s', 'bytes', 'byte', 'byte/s'].indexOf(unit.toLowerCase()) > -1) {
              numericSymbols = ['k', 'M', 'G', 'T', 'P', 'E'];
              i = numericSymbols.length;
            }else if(['kb/s', 'kb'].indexOf(unit.toLowerCase()) > -1) {
              numericSymbols = ['M', 'G', 'T', 'P', 'E'];
              i = numericSymbols.length;
            } else if(unit === '个') {
              numericSymbols = ['千'];
              i = numericSymbols.length;
            }else if(unit === '次'){
              numericSymbols = ['万', '亿'];
              i = numericSymbols.length;
            }

            if (this.value >= 1000) {
              while (i-- && ret === undefined) {
                multi = Math.pow(1000, i + 1);
                if(unit === '次'){multi = Math.pow(10000, i + 1);}
                if (this.value >= multi && numericSymbols[i] !== null) {
                  ret = (this.value / multi) + ' ' + numericSymbols[i];
                }
              }
            }
            return ret ? ret : this.value;
          }
        },
        gridLineDashStyle: 'dot'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          connectNulls: true
        },
        area: {
          fillColor: {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
            },
            stops: [
                [0, 1],
                [1, 2]
            ]
          }
        }
      }
    };
    var seriesTheme = [
      {
        fillColor: 'rgba(221,230,239,0.5)',
        lineColor: '#08bbea',
        color: '#08bbea',
        lineWidth: 1,
        maker: {
          states: {
            hover: {
              enabled: true,
              lineWidth: 2,
              lineColor: '#08bbea',
              fillColor: '#FFF'
            }
          }
        }
      },
      {
        fillColor: 'rgba(221,230,239,0.5)',
        lineColor: '#ee6c56',
        color: '#ee6c56',
        lineWidth: 1,
        maker: {
          states: {
            hover: {
              enabled: true,
              lineWidth: 2,
              lineColor: '#ee6c56',
              fillColor: '#FFF'
            }
          }
        }
      }
    ];
    config.series = data.series.map( (serie, i) => {
      let obj = seriesTheme[i] || {};
      Object.assign(obj, serie);
      return obj;
    });
    return config;
  }
}
export default ChartsLine;
export {ChartsLine};
