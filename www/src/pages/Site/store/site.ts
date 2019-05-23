
import { message } from 'antd';
import { observable, action, computed } from 'mobx';
import { ProjectList, ListCriteria } from '../proto/index';
import axios from '../../../utils/axios';

class SiteStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @observable list: ProjectList[] = []
  @action setList = (list: ProjectList[]) => this.list = list

  @action getList = async (criteria?: any) => {
    let params: ListCriteria;
    params = criteria ? criteria : { keywords: '', page: '1', pagesize: 50 }
    try {
      const { data } = await axios.get('/api/site', { params })
      if (data) {
        const result = data.data.data
        if (result.length) {
          this.setCurrentProject(result[0].id)
        }
        this.setList(result)
        this.rootStore.metricStore.getList()
      }
    } catch (e) {
      message.error('获取列表失败');
    }
  }

  @observable currentProject = ''
  @action setCurrentProject = (value) => this.currentProject = value

  @computed get currentId() {
    const result = this.list.find(item => String(item.id) == this.currentProject)
    if (result) {
      return result['id']
    } else {
      return ''
    }
  }

  @action changeSelectValue = (value) => {
    this.setCurrentProject(value)
    this.rootStore.metricStore.getList(this.currentId)
  }

}

export default SiteStore