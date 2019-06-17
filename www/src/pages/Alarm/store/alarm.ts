// import { message } from 'antd';
import { observable, action, computed } from 'mobx';
import axios from '@utils/axios';
// import history from '@utils/history'

class AlarmStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @computed get siteId() {
    return localStorage.getItem('projectId')
  }

  initData = () => {
    return {
      start_time: '',
      end_time: '',
      metric: ['k1'],
      type: ['mins']
    }
  }

  @observable criteria = this.initData();

  @action setCriteria = (data) => {
    if (data) {
      this.criteria = Object.assign({}, this.criteria, data)
    } else {
      this.criteria = this.initData()
    }
  }

  @observable status = 1

  @observable charts = {
    categories: ["06-05 08:00", "06-05 08:05", "06-05 08:10", "06-05 08:15", "06-05 08:20", "06-05 08:25"],
    series: [{
      name: 'chrome',
      data: [20, 50, 40, 5, 80, 90]
    }, {
      name: 'firefox',
      data: [50, 40, 5, 80, 90, 60]
    }]
  }
  @action setCharts = (values) => this.charts = values


  @observable list = []
  @action setList = (list) => this.list = list


  @observable options = []
  @action setOptions = (data) => this.options = data
  @observable factor = []
  @action setFactor = (val) => this.factor = val

  @observable selectMetricId = ''
  @action setSelectMetric = (val) => this.selectMetricId = val

  @observable metricList = []
  @action setMetricList = (list) => this.metricList = list

  @action getMetricList = async () => {
    const result = await axios.get(`/api/metric/${this.siteId}`)
    const data = result.data.data.data
    let list = []
    for (let i = 0; i < data.length; i++) {
      const item: any = [{
        value: data[i].id,
        label: data[i].display_name,
        children: []
      }]
      list = list.concat(item)
    }

    this.setOptions(list)

    // this.setSelectMetric(data.length ? data[0].id : 1)
    // this.setMetricList(data)
    // this.getList()
  }

  @action changeMetric = async (val) => {
    this.setSelectMetric(val)
    this.getList()
  }

  formatCriteria = () => {
    let query = ''
    Object.keys(this.criteria).map(key => {
      if (this.criteria[key]) {
        query += `&${key}=${this.criteria[key]}`
      }
    })
    return query
  }

  @action getList = async () => {
    const params = this.formatCriteria()
    const query = `?site_id=${this.siteId}&metric_id=${this.selectMetricId}${params}`

    const result = await axios.get(`/api/metric/custom_time${query}`)
    console.log(7, result)
    // this.setList(result.data)
  }




}

export default AlarmStore