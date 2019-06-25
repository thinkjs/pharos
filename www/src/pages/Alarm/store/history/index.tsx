import { observable, action } from 'mobx';
import axios from '@utils/axios';

class AlarmHistoryStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore
  }
  @observable projectId = localStorage.getItem('projectId')
  @observable alarmHistoryList: any = []

  @action setList = (list: any) => this.alarmHistoryList = list

  @action getList = async () => {
    const { data } = await axios.get(`api/site/${this.projectId}/alarmlog`)
    this.setList(data.data.data)
  }


}

export default AlarmHistoryStore