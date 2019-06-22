import { configure } from 'mobx'
import AlarmHistoryStore from './history'
import { AlarmHistroyList } from '../proto/index'
configure({ enforceActions: 'never' })

export class RootStore {

  alarmHistoryStore: AlarmHistroyList;

  constructor() {
    this.alarmHistoryStore = new AlarmHistoryStore(this)
  }
}


export default RootStore