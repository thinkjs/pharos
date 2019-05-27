import { configure } from 'mobx'
import PeopleStore from './people.store'
configure({ enforceActions: 'never' })

export class RootStore {

  PeopleStore: PeopleStore;

  constructor() {
    this.PeopleStore = new PeopleStore(this)
  }
}


export default RootStore