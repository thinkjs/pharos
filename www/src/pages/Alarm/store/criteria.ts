import { observable, action, computed } from 'mobx';

class CriteriaStore {

  @observable start_time = '';
  @observable end_time = '';
  @observable metrics = '';
  @observable type = 'mins';
  @observable options = [];
  @observable factor = [];

  @computed get siteId() {
    return localStorage.getItem('projectId')
  }

  @computed get metricId() {
    return this.factor[0]
  }

  @computed get criteria() {
    return {
      start_time: this.start_time,
      end_time: this.end_time,
      metrics: this.metrics,
      type: this.type
    }
  }

  @action setCriteria = (name: string, value: string | any[]) => {
    this[name] = value
  }

  @action addArray = (name, data) => {
    this[name].push(data)
  }


}

export default CriteriaStore