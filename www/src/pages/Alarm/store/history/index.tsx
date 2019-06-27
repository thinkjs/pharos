import { observable, action, computed } from 'mobx';
import axios from '@utils/axios';

class AlarmHistoryStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore
  }
  @computed get siteId() {
    return localStorage.getItem('projectId')
  }
  @observable alarmHistoryList: any = []

  @action setList = (list: any) => this.alarmHistoryList = list

  @action getList = async () => {
    const { data } = await axios.get(`api/site/${this.siteId}/alarmlog`)
    this.setList(data.data.data)
  }


}

export default AlarmHistoryStore