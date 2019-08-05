import * as React from "react";
import { Layout, Cascader } from "antd";
import { observer, inject } from "mobx-react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "@utils/axios";
import Fieldset from "@components/Fieldset";
import moment from "@utils/moment";
import { DatePicker, Radio } from "antd";
import "./style.less";
const { RangePicker } = DatePicker;
const { Content } = Layout;
interface Props {
  props: HighchartsReact.Props;
  perfStore: any;
}

interface HighchartsOption extends Highcharts.Options {
  legend?: any;
  yAxis: any;
}

@inject("perfStore")
@observer
class Perf extends React.Component<Props, any> {
  state = {
    options: [],
    noData: false
  };

  async componentDidMount() {
    const { perfStore } = this.props;
    const { siteId } = perfStore;
    const result = await axios.get(`/api/metric/${siteId}?type=1`);
    const data = result.data.data.data;

    const options = this.formatOptions(data);
    this.setState({ options });
    if (data.length) {
      const id = data[0].id + "";
      perfStore.setFactor([id]);
      this.onLoad([id]);
    } else {
      this.setState({
        noData: true
      });
    }
  }

  formatOptions(data) {
    let options: any = [];
    for (let i = 0; i < data.length; i++) {
      const item = {
        value: data[i].id + "",
        label: data[i].display_name,
        isLeaf: false
      };
      options.push(item);
    }
    return options;
  }

  formatData(charts) {
    const series = charts.series.map(item => {
      item["type"] = "line";
      return item;
    });

    return {
      title: {
        text: "性能图表"
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      xAxis: {
        categories: charts.categories,
        tickInterval: 6
      },
      yAxis: {
        title: {
          align: "high",
          text: "单位：",
          offset: -20,
          rotation: 0,
          y: -20
        },
        lineWidth: 1
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle"
      },
      series
    };
  }

  onLoad = arr => {
    const { perfStore } = this.props;
    perfStore.setFactor(arr);
    perfStore.getCharts(arr);
    perfStore.getSameRingRatio();
  };

  onChange = arr => {
    this.onLoad(arr);
  };

  formatResult = data => {
    return data.map(d => {
      return {
        value: d,
        label: d,
        isLeaf: false
      };
    });
  };

  loadData = async selectedOptions => {
    const { perfStore } = this.props;
    const { siteId, metricId, factor } = perfStore;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    const params = factor.slice(1).join(",");
    const query = `?site_id=${siteId}&metric_id=${metricId}&metrics=${params}`;
    const result = await axios.get(`/api/metric/factors${query}`);
    const { data } = result.data;
    const children = this.formatResult(data);
    targetOption.children = data[0] ? children : [];

    targetOption.loading = false;
    this.setState({
      options: [...this.state.options]
    });
  };

  dataChange = ({}, data) => {
    const { perfStore } = this.props;
    const { factor } = perfStore;
    perfStore.setCriteria({
      start_time: data[0],
      end_time: data[1]
    });
    perfStore.getCharts(factor);
  };

  formatRatio(ratios) {
    const series = ratios.series.map(item => {
      item["type"] = "line";
      return item;
    });

    return {
      title: {
        text: "同环比图"
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      xAxis: {
        categories: ratios.categories,
        tickInterval: 6
      },
      yAxis: {
        title: {
          align: "high",
          text: "单位：ms",
          offset: -20,
          rotation: 0,
          y: -20
        },
        lineWidth: 1
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle"
      },
      series
    };
  }

  periodChange = e => {
    const { perfStore } = this.props;
    const { factor } = perfStore;
    perfStore.setCriteria({
      type: e.target.value
    });
    perfStore.getCharts(factor);
  };

  render() {
    const { perfStore } = this.props;
    const { factor, charts, criteria, sameRingRatio } = perfStore;
    const highchartOptions: HighchartsOption = this.formatData(charts);
    const sameRingRatioOption: HighchartsOption = this.formatRatio(
      sameRingRatio
    );
    if (this.state.noData) {
      return (
        <div style={{ margin: "200px auto", textAlign: "center" }}>
          暂无数据
        </div>
      );
    }
    if (!factor.length) return null;
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
            <Fieldset.Row label="周期：">
              <Radio.Group onChange={this.periodChange} value={criteria.type}>
                <Radio value="mins">分钟</Radio>
                <Radio value="day">天</Radio>
              </Radio.Group>
            </Fieldset.Row>
            <Fieldset.Row label="时间：">
              <RangePicker
                defaultValue={[
                  moment(criteria.start_time, "YYYY-MM-DD HH:mm"),
                  moment(criteria.end_time, "YYYY-MM-DD HH:mm")
                ]}
                onChange={this.dataChange}
                format="YYYY-MM-DD HH:mm"
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
    );
  }
}

export default Perf;
