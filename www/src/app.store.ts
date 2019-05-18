import { configure } from 'mobx';
import SignStore from './pages/Sign/store';
import OptionStore from './options.store'

configure({
  enforceActions: 'never'
});

export class AppStore {

  signStore: SignStore;


  constructor() {
    this.signStore = new SignStore();
  }

}

const store = {
  ...new AppStore(),
  ...new OptionStore()
};

export default store;