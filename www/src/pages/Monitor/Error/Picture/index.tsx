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
  errorPictureStore: any;
}

interface HighchartsOption extends Highcharts.Options {
  legend?: any;
  yAxis: any;
}

@inject("errorPictureStore")
@observer
class CustomList extends React.Component<Props, any> {
  state = {
    options: [],
    noData: false,
    type: "day"
  };

  async componentDidMount() {
    const { errorPictureStore } = this.props;
    const { siteId } = errorPictureStore;
    const result = await axios.get(`/api/metric/${siteId}?type=2`);
    const data = result.data.data.data;
    const options = this.formatOptions(data);
    this.setState({ options });
    if (data.length) {
      const id = result.data.data.data[0].id + "";
      errorPictureStore.setFactor([id]);
      this.onLoad([id]);
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
        text: "错误图表"
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
    const { errorPictureStore } = this.props;
    errorPictureStore.setFactor(arr);
    errorPictureStore.getCharts(arr);
    errorPictureStore.getSameRingRatio();
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
    const { errorPictureStore } = this.props;
    const { siteId, metricId, factor } = errorPictureStore;
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
    const { errorPictureStore } = this.props;
    const { factor } = errorPictureStore;
    errorPictureStore.setCriteria({
      start_time: data[0],
      end_time: data[1]
    });
    errorPictureStore.getCharts(factor);
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
    const { errorPictureStore } = this.props;
    const { factor } = errorPictureStore;
    errorPictureStore.setCriteria({
      type: e.target.value
    });
    errorPictureStore.getCharts(factor);
  };

  render() {
    const { errorPictureStore } = this.props;
    const { factor, charts, criteria, sameRingRatio } = errorPictureStore;
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

export default CustomList;
