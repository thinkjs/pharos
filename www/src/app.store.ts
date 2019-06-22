import { configure } from 'mobx';
import SignStore from '@pages/Sign/store';
import ProjectStore from '@pages/Project/store';
import SiteStore from '@pages/Site/store';
import AlarmStore from '@pages/Alarm/store'


import OptionStore from './options.store';


configure({
  enforceActions: 'never'
});

export class AppStore {

  signStore: SignStore;
  projectStore: ProjectStore;
  siteStore: SiteStore;
  alarmStore: AlarmStore;




  constructor() {
    this.signStore = new SignStore();
    this.projectStore = new ProjectStore();
    this.siteStore = new SiteStore();
    this.alarmStore = new AlarmStore()
  }

}

const store = {
  ...new AppStore(),
  ...new OptionStore(),
};

export default store;