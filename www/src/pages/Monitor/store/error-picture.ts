import { observable, action, computed } from 'mobx';
import axios from '@utils/axios';

class ErrorPictureStore {


  @computed get siteId() {
    return localStorage.getItem('projectId')
  }

  initData = () => {
    return {
      start_time: '2019-06-17 00:00:00',
      end_time: '2019-06-19 00:00:00',
      metrics: '',
      type: 'mins'
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


  @observable charts = {
    categories: [],
    series: []
  }
  @action setCharts = (values) => this.charts = values


  @observable list = []
  @action setList = (list) => this.list = list


  @observable options = []
  @action setOptions = (data) => this.options = data
  @observable.ref factor = []
  @action setFactor = (val) => this.factor = val

  @computed get metricId() {
    return this.factor[0]
  }

  @observable metricList = []
  @action setMetricList = (list) => this.metricList = list




  formatCriteria = (factor) => {
    const metrics = factor.slice(1).join(',')
    const criteria = Object.assign(this.criteria, { metrics })
    let query = ''
    Object.keys(criteria).map(key => {
      if (criteria[key]) {
        query += `&${key}=${criteria[key]}`
      }
    })
    return query
  }

  @action getCharts = async (factor) => {
    const params = this.formatCriteria(factor)
    const query = `?site_id=${this.siteId}&metric_id=${this.metricId}${params}`
    const result = await axios.get(`/api/metric/custom_time${query}`)
    this.setCharts(result.data.data)
  }

  @observable.ref sameRingRatio = {
    series: [],
    categories: []
  }
  @action setSameRingRatio = (data) => this.sameRingRatio = data
  @action getSameRingRatio = async () => {
    const result = await axios.get(`/api/metric/ratio?site_id=${this.siteId}&metric_id=${this.metricId}`);
    
    this.setSameRingRatio(result.data.data)
  }

}

export default new ErrorPictureStore()