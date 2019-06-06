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

  @action getList = async () => {
    const values = {
      site_id: this.siteId,
      metric_id: '4'
    }
    console.log(8, values)
    const result = await axios.get(`/api/metric/custom_time?site_id=${this.siteId}`)
    console.log(7, result)
  }


}

export default AlarmStore