import { configure } from 'mobx';
import SignStore from '@pages/Sign/store';
import ProjectStore from '@pages/Project/store';
import SiteStore from '@pages/Site/store';


import OptionStore from './options.store';


configure({
  enforceActions: 'never'
});

export class AppStore {

  signStore: SignStore;
  projectStore: ProjectStore;
  siteStore: SiteStore;




  constructor() {
    this.signStore = new SignStore();
    this.projectStore = new ProjectStore();
    this.siteStore = new SiteStore();
  }

}

const store = {
  ...new AppStore(),
  ...new OptionStore(),
};

export default store;