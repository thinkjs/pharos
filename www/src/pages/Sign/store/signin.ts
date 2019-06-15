import axios from '@utils/axios';
import { baseURL } from '@config/domain'
import { observable, action } from 'mobx';
import history from '@utils/history'
class SigninStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @action
  submit = async (values) => {
    try {
      const result = await axios.post('/api/token', values)
      if (result) {
        localStorage.setItem('pharosUser', JSON.stringify(result.data.data))
        await this.getList()
      }
    } catch (e) {
      this.refreshToken();
    }
  }

  @action
  refreshToken = async () => {
    const dom = document.querySelector('#imgToken')
    if (dom) {
      dom.setAttribute('src', `${baseURL}api/token?v=${Date.now()}`)
    }
  }

  @observable list = []
  @action setList = (list) => this.list = list

  @action getList = async (criteria?: any) => {
    let params;
    params = criteria ? criteria : { keywords: '', page: '1', pagesize: 50 }

    const { data } = await axios.get('/api/site', { params })
    const result = data.data.data
    if (result.length === 0) {
      history.push('/project/create')
    } else {
      this.setList(result)
      localStorage.setItem('projectId', result[0].id)
      history.push('/alarm')
    }
  }

}

export default SigninStore