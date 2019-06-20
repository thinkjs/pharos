import * as React from 'react';
import { Layout, Cascader } from 'antd'
import { observer, inject } from 'mobx-react';
import * as Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official'
import axios from '@utils/axios'
import Fieldset from '@components/Fieldset'
import moment from '@utils/moment'
import { DatePicker } from 'antd';
import './style.less'
const { RangePicker } = DatePicker;
const { Content } = Layout;
interface Props {
  props: HighchartsReact.Props;
  alarmStore: any
}


interface HighchartsOption extends Highcharts.Options {
  legend?: any;
  yAxis: any
}

@inject('alarmStore') @observer
class AlarmList extends React.Component<Props, any> {

  state = {
    options: []
  };


  async componentDidMount() {
    const { alarmStore } = this.props
    const { siteId } = alarmStore
    const result = await axios.get(`/api/metric/${siteId}`)
    const options = this.formatOptions(result.data.data.data)
    this.setState({ options })
    const id = result.data.data.data[0].id + ''
    alarmStore.setFactor([id])
    this.onLoad([id])
  }

  formatOptions(data) {
    let options: any = []
    for (let i = 0; i < data.length; i++) {
      const item = {
        value: data[i].id + '',
        label: data[i].display_name,
        isLeaf: false
      }
      options.push(item)
    }
    return options
  }

  formatData(charts) {
    const series = charts.series.map(item => {
      item['type'] = 'line'
      return item
    })

    return {
      title: {
        text: '监控项图表'
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      xAxis: {
        categories: charts.categories,
        tickInterval: 6,
      },
      yAxis: {
        title: {
          align: 'high',
          text: '单位：',
          offset: -20,
          rotation: 0,
          y: -20
        },
        lineWidth: 1,
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      series

    }
  }

  onLoad = (arr) => {
    const { alarmStore } = this.props
    alarmStore.setFactor(arr)
    alarmStore.getCharts(arr)
  }

  onChange = (arr) => {
    this.onLoad(arr)
  }

  formatResult = (data) => {
    return data.map(d => {
      return {
        value: d,
        label: d,
        isLeaf: false
      }
    })
  }

  loadData = async selectedOptions => {
    const { alarmStore } = this.props
    const { siteId, metricId, factor } = alarmStore
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    const params = factor.slice(1).join(',')
    const query = `?site_id=${siteId}&metric_id=${metricId}&metrics=${params}`
    const result = await axios.get(`/api/metric/factors${query}`)
    const { data } = result.data
    const children = this.formatResult(data)
    targetOption.children = data[0] ? children : [];

    targetOption.loading = false;
    this.setState({
      options: [...this.state.options]
    })
  }

  dataChange = ({ }, data) => {
    const { alarmStore } = this.props
    const { factor } = alarmStore
    alarmStore.setCriteria({
      start_time: data[0],
      end_time: data[1]
    })
    alarmStore.getCharts(factor)
  }

  render() {
    const { alarmStore } = this.props
    const { factor, charts, criteria } = alarmStore
    const highchartOptions: HighchartsOption = this.formatData(charts)
    if (!factor.length) return null
    return (
      <Content>
        <div className="dashboard-select">
          <Fieldset>
            <Fieldset.Row label="监控项：">
              <Cascader
                defaultValue={factor}
                options={this.state.options}
                onChange={this.onChange}
                loadData={this.loadData}
                changeOnSelect
              />
            </Fieldset.Row>
            <Fieldset.Row label="时间：">
              <RangePicker
                defaultValue={[moment(criteria.start_time, 'YYYY-MM-DD HH:mm:ss'), moment(criteria.end_time, 'YYYY-MM-DD HH:mm:ss')]}
                onChange={this.dataChange}
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Fieldset.Row>
          </Fieldset>
        </div>
        <div className="dashboard-highcharts">
          <HighchartsReact
            highcharts={Highcharts}
            options={highchartOptions}
            {...this.props}
          />
        </div>
      </Content>
    )
  }
}

export default AlarmList