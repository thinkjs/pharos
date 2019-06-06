import SigninStore from '@pages/Sign/store/signin';
import SignupStore from '@pages/Sign/store/signup';
import ProjectStore from '@pages/Project/store/project';
import SiteStore from '@pages/Site/store/site';
import MetricStore from '@pages/Site/store/metric';
import PeopleStore from '@pages/Site/store/people';
import AlarmStore from '@pages/Alarm/store/alarm';



class OptionsStore {
  signinStore: SigninStore;
  signupStore: SignupStore;
  projectStore: ProjectStore;
  metricStore: MetricStore;
  siteStore: SiteStore;
  alarmStore: AlarmStore;
  peopleStore: PeopleStore;


  constructor() {
    this.signinStore = new SigninStore(this);
    this.signupStore = new SignupStore(this);
    this.projectStore = new ProjectStore(this);
    this.metricStore = new MetricStore(this);
    this.siteStore = new SiteStore(this)
    this.alarmStore = new AlarmStore(this)
    this.peopleStore = new PeopleStore(this);
  }
}

export default OptionsStore;
