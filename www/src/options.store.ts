import SigninStore from './pages/Sign/store/signin';
import SignupStore from './pages/Sign/store/signup';



class OptionsStore {
  signinStore: SigninStore;
  signupStore: SignupStore;


  constructor() {
    this.signinStore = new SigninStore(this);
    this.signupStore = new SignupStore(this);

  }
}

export default OptionsStore;
