import { observable, action, computed } from 'mobx';
import axios from '@utils/axios';


class ErrorListStore {

  @computed get siteId() {
    return localStorage.getItem('projectId')
  }
  @observable currentMetricId = ''
  @observable.ref metricList = []

  @action setMetricList = (list) => this.metricList = list
  @action setCurrentMtericId = (id) => this.currentMetricId = id

  @action getErrorMetricList = async () => {
    const result = await axios.get(`/api/metric/${this.siteId}?type=2`)
    const data = result.data.data.data;
    this.setMetricList(data)
    if (data.length) {
      this.setCurrentMtericId(data[0].id)
      this.getList()
    }
  }


  @observable list = []
  @action setList = (list) => this.list = []

  @action getList = async () => {
    const result = await axios.get(`/api/metric/error?site_id=${this.siteId}&metric_id=${this.currentMetricId}`)
    this.setList(result.data.data.data)
  }
}

export default new ErrorListStore()