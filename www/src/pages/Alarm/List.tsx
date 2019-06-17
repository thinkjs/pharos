import * as React from 'react';
import { Layout, Cascader } from 'antd'
import { observer, inject } from 'mobx-react';
import * as Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official'

const { Content } = Layout;
// const Option = Select.Option;
interface Props {
  props: HighchartsReact.Props;
  alarmStore: any
}

// interface HighchartsOption extends Highcharts.Options {
//   legend?: any;
// }

@inject('alarmStore') @observer
class AlarmList extends React.Component<Props, any> {


  componentDidMount() {
    const { alarmStore } = this.props
    alarmStore.getMetricList()
  }

  formatData(charts) {
    const series = charts.series.map(item => {
      item['type'] = 'line'
      return item
    })

    return {
      title: {
        text: ''
      },
      xAxis: {
        categories: charts.categories,
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      series

    }
  }

  onChange(data) {
    console.log(data)
  }

  render() {
    const { alarmStore } = this.props
    const { options } = alarmStore

    // const options = [{
    //   value: 'jkx1',
    //   label: '浏览器监测',
    //   children: [{
    //     value: 'chrome',
    //     label: 'chrome',

    //   }, {
    //     value: 'firefox',
    //     label: 'firefox'
    //   }]
    // }]

    return (
      <Content>
        <div className="dashboard-select">
          <Cascader
            defaultValue={['jkx1']}
            options={options}
            onChange={this.onChange}
            changeOnSelect
          />
        </div>
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            // options={options}
            {...this.props}
          />
        </div>
      </Content>
    )
  }
}

export default AlarmList