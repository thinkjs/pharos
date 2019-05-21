import { action } from 'mobx'
import axios from '../../../utils/axios';
import history from '../../../utils/history'
import { baseURL } from '../../../config/domain'

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
        localStorage.setItem('isLogin', result.data.name)
        history.push('/project')
      }
    } catch (e) {
      console.log('/api/token error')
    }
  }

  @action
  refreshToken = async () => {
    const dom = document.querySelector('#imgToken')
    if (dom) {
      dom.setAttribute('src', `${baseURL}api/token?v=${Date.now()}`)
    }
  }

}

export default SigninStore