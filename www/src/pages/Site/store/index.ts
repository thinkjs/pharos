import { configure } from 'mobx'
// import MetricStore from './metric'
// import SiteStore from './site'

import { message } from 'antd';
import { observable, action } from 'mobx';
import { ProjectList, ListCriteria } from '../proto/index';
import axios from '@utils/axios';

configure({ enforceActions: 'never' })

export class RootStore {

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
          this.setCurrentProject(result[0].name)
        }
        this.setList(result)
      }
    } catch (e) {
      message.error('获取列表失败');
    }
  }

  @observable currentProject = ''
  @action setCurrentProject = (value: string) => this.currentProject = value
}


export default RootStore