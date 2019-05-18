import { configure } from 'mobx'
import SigninStore from './signin'
import SignupStore from './signup'
configure({ enforceActions: 'never' })

export class RootStore {

  signinStore: SigninStore;
  signupStore: SignupStore;

  constructor() {
    this.signinStore = new SigninStore(this)
    this.signupStore = new SignupStore(this)
  }
}


export default RootStore