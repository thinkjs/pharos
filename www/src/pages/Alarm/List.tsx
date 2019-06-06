import * as React from 'react';
import { Layout } from 'antd'
import { observer, inject } from 'mobx-react';
import * as Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official'

const { Content } = Layout;

interface Props {
  props: HighchartsReact.Props;
  alarmStore: any
}

interface HighchartsOption extends Highcharts.Options {
  legend?: any;
}

@inject('alarmStore') @observer
class AlarmList extends React.Component<Props, any> {


  componentDidMount() {
    // const { alarmStore } = this.props
    // alarmStore.getList()
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

  render() {
    const { alarmStore } = this.props
    const { charts } = alarmStore
    const options: HighchartsOption = this.formatData(charts)

    return (
      <Content>
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            {...this.props}
          />
        </div>
      </Content>
    )
  }
}

export default AlarmList