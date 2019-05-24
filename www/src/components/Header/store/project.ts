// import { message } from 'antd';
import { ListCriteria } from '../proto/index';
import { observable, action, toJS } from 'mobx';
import axios from '../../../utils/axios';
import history from '../../../utils/history'

class ProjectStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  // @observable 

  // @observable projectStatus = '' // '0': 无任何项目  '1': 有项目
  // @action setProjectStatus = (value) => this.projectStatus = value

  // 修改对象数据的一般方法，或者使用map

  @observable selectedProject = { id: '', name: '', url: '' }
  @action setSelectedProject = (data: any) => {
    if (data) {
      this.selectedProject = Object.assign(this.selectedProject, data);
    } else {
      this.selectedProject = { id: '', name: '', url: '' }
    }
  }

  @observable.ref projectList = []
  @action setList = (list) => { this.projectList = toJS(list) }

  @action getList = async (criteria?: any) => {
    let params: ListCriteria;
    params = criteria ? criteria : { keywords: '', page: '1', pagesize: 50 }

    const { data } = await axios.get('/api/site', { params })
    const result = data.data.data
    this.setList(result)
  }

  @observable showProjectList = false
  @action setShowProjectList = (bool) => this.showProjectList = bool

  @action projectClick = (value) => {
    this.setShowProjectList(false)
    localStorage.setItem('projectId', value.id)
    history.push('/alarm');
  }

  @action changeSelectedProject = (value) => {

  }

  // 修改对象数据的一般方法，或者使用map
  // initCurrentModel = () => {
  //   return { id: '', name: '', url: '' }
  // }
  // @observable currentModel: CurrentModel = this.initCurrentModel()
  // @action setCurrentModel = (data: any) => {
  //   if (data) {
  //     this.currentModel = Object.assign(this.currentModel, data);
  //   } else {
  //     this.currentModel = this.initCurrentModel()
  //   }
  // }

  // @observable isEdit = false
  // @action setIsEdit = (bool: boolean) => this.isEdit = bool

  // @observable showAddModifyModal = false
  // @action setShowAddModifyModal = (bool: boolean) => this.showAddModifyModal = bool;


  // @action handleSearch = (value) => {
  //   let data = {
  //     page: 1,
  //     pagesize: 50,
  //     keywords: value
  //   }
  //   this.getList(data)
  // }

  // @action addModify = async () => {
  //   const { name, url } = this.currentModel
  //   const result = await axios.post('/api/site', {
  //     name,
  //     url
  //   })
  //   if (result) {
  //     this.setShowAddModifyModal(false)
  //     this.getList();
  //   }

  // }

  // @action handleDeleteClick = async (id: string) => {
  //   await axios.delete(`api/site/${id}`)
  //   this.getList();
  // }

  // @action handleEdit = (id: string, name: string, url: string) => {
  //   this.setCurrentModel({
  //     id,
  //     name,
  //     url
  //   })
  //   this.setShowAddModifyModal(true)
  // }

  // @action handleUpdateOk = async () => {
  //   const { id, name } = this.currentModel
  //   const result = await axios.put(`/api/site/${id}`, { name })
  //   if (result) {
  //     this.getList();
  //     this.setShowAddModifyModal(false)
  //   }

  // }

}

export default ProjectStore