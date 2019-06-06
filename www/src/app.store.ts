import { configure } from 'mobx';
import SignStore from '@pages/Sign/store';
import ProjectStore from '@pages/Project/store';
import AlarmStore from '@pages/Alarm/store';
import SiteStore from '@pages/Site/store';
import OptionStore from './options.store';
import PeopleStore from '@pages/People/store'

configure({
  enforceActions: 'never'
});

export class AppStore {

  signStore: SignStore;
  projectStore: ProjectStore;
  siteStore: SiteStore;
  alarmStore: AlarmStore;
  peopleStore: PeopleStore;


  constructor() {
    this.signStore = new SignStore();
    this.projectStore = new ProjectStore();
    this.siteStore = new SiteStore();
    this.alarmStore = new AlarmStore();
    this.peopleStore = new PeopleStore();
  }

}

const store = {
  ...new AppStore(),
  ...new OptionStore(),
  ...new PeopleStore()
};

export default store;