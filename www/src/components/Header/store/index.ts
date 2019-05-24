import { configure } from 'mobx'
import ProjectStore from './project'
configure({ enforceActions: 'never' })

export class RootStore {

  projectStore: ProjectStore;

  constructor() {
    this.projectStore = new ProjectStore(this)
  }
}


export default RootStore