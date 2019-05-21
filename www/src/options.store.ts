import SigninStore from './pages/Sign/store/signin';
import SignupStore from './pages/Sign/store/signup';
import ProjectStore from './pages/Project/store/project.store';



class OptionsStore {
  signinStore: SigninStore;
  signupStore: SignupStore;
  projectStore: ProjectStore;

  constructor() {
    this.signinStore = new SigninStore(this);
    this.signupStore = new SignupStore(this);
    this.projectStore = new ProjectStore(this);

  }
}

export default OptionsStore;
