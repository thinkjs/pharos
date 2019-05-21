import { configure } from 'mobx';
import SignStore from './pages/Sign/store';
import ProjectStore from './pages/Project/store';
import OptionStore from './options.store'

configure({
  enforceActions: 'never'
});

export class AppStore {

  signStore: SignStore;
  projectStore: ProjectStore;


  constructor() {
    this.signStore = new SignStore();
    this.projectStore = new ProjectStore();
  }

}

const store = {
  ...new AppStore(),
  ...new OptionStore()
};

export default store;