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
  customStore: any
}


interface HighchartsOption extends Highcharts.Options {
  legend?: any;
  yAxis: any
}

@inject('customStore') @observer
class CustomList extends React.Component<Props, any> {

  state = {
    options: [],
    noData: false
  };


  async componentDidMount() {
    const { customStore } = this.props
    const { siteId } = customStore
    const result = await axios.get(`/api/metric/${siteId}?type=0`)
     const data = result.data.data.data
    const options = this.formatOptions(data)
    this.setState({ options })
    if (data.length) {
      const id = result.data.data.data[0].id + ''
      customStore.setFactor([id])
      this.onLoad([id])
    }
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
    const { customStore } = this.props
    customStore.setFactor(arr)
    customStore.getCharts(arr)
    customStore.getSameRingRatio()
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
    const { customStore } = this.props
    const { siteId, metricId, factor } = customStore
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
    const { customStore } = this.props
    const { factor } = customStore
    customStore.setCriteria({
      start_time: data[0],
      end_time: data[1]
    })
    customStore.getCharts(factor)
  }

  formatRatio(ratios) {
    const series = ratios.series.map(item => {
      item['type'] = 'line'
      return item
    })

    return {
      title: {
        text: '同环比图'
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      xAxis: {
        categories: ratios.categories,
        tickInterval: 6,
      },
      yAxis: {
        title: {
          align: 'high',
          text: '单位：ms',
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

  render() {
    const { customStore } = this.props
    const { factor, charts, criteria, sameRingRatio } = customStore
    const highchartOptions: HighchartsOption = this.formatData(charts)
    const sameRingRatioOption: HighchartsOption = this.formatRatio(sameRingRatio)
    if (this.state.noData) {
      return (
        <div style={{ margin: '200px auto', textAlign: 'center' }}>暂无数据</div>
      )
    }
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

        <div className="same-ring-ratio">
          <HighchartsReact
            highcharts={Highcharts}
            options={sameRingRatioOption}
            {...this.props}
          />
        </div>


      </Content>
    )
  }
}

export default CustomList