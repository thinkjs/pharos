import { configure } from 'mobx'
import AlarmStore from './alarm'
configure({ enforceActions: 'never' })

export class RootStore {

  alarmStore: AlarmStore;

  constructor() {
    this.alarmStore = new AlarmStore(this)
  }
}


export default RootStore