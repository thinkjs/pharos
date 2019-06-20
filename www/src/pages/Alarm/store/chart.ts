import { observable, action, computed } from 'mobx';
import { alarmRootStore } from '.';
// import axios from '@utils/axios';

console.log(19, alarmRootStore)


class ChartStore {


  @computed get siteId() {
    return localStorage.getItem('projectId')
  }


  @observable charts = {
    categories: [],
    series: []
  }
  @action setCharts = (values) => this.charts = values


  // formatCriteria = (factor) => {
  //   const metrics = factor.slice(1).join(',')
  //   const criteria = Object.assign(criteriaStore.criteria, { metrics })
  //   let query = ''
  //   Object.keys(criteria).map(key => {
  //     if (criteria[key]) {
  //       query += `&${key}=${criteria[key]}`
  //     }
  //   })
  //   return query
  // }

  // @action getCharts = async (factor) => {
  //   const params = this.formatCriteria(factor)
  //   const query = `?site_id=${this.siteId}&metric_id=${criteriaStore.metricId}${params}`
  //   const result = await axios.get(`/api/metric/custom_time${query}`)
  //   this.setCharts(result.data.data)
  // }

}

export default ChartStore