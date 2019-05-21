import { action } from 'mobx'
import axios from '../../../utils/axios';
import history from '../../../utils/history'

class SignupStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @action
  submit = async (values) => {
    try {
      const result = await axios.post('/api/user', values)
      if (result) {
        localStorage.setItem('isLogin', result.data.data.name)
        history.push('/project')
      }
    } catch (e) {
      console.log('/api/user error')
    }
  }

}

export default SignupStore