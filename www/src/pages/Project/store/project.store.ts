import { message } from 'antd';
import { CurrentModel, ProjectList, ListCriteria } from './../proto/index';
import { observable, action } from 'mobx';
import axios from '../../../utils/axios';

class ProjectStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @observable list: ProjectList[] = []
  @action setList = (list: ProjectList[]) => this.list = list

  @action getList = async (criteria?: any) => {
    let params: ListCriteria;
    params = criteria ? criteria : { keywords: '', page: '1', pagesize: 50 }
    try {
      const { data } = await axios.get('/api/site', { params })
      if (data) {
        this.list = this.setList(data.data.data)
      }
    } catch (e) {
      message.error('获取列表失败');
    }
  }

  // 修改对象数据的一般方法，或者使用map
  initCurrentModel = () => {
    return { id: '', name: '', url: '' }
  }
  @observable currentModel: CurrentModel = this.initCurrentModel()
  @action setCurrentModel = (data: any) => {
    if (data) {
      this.currentModel = Object.assign(this.currentModel, data);
    } else {
      this.currentModel = this.initCurrentModel()
    }
  }

  @observable isEdit = false
  @action setIsEdit = (bool: boolean) => this.isEdit = bool

  @observable showAddModifyModal = false
  @action setShowAddModifyModal = (bool: boolean) => this.showAddModifyModal = bool;

  @observable currentModalSid = ''
  @observable currentModalUrl = ''
  @observable showGetCodeModal = false
  @action setShowGetCodeModal = (bool: boolean, sid: string, url: string) => {
    this.showGetCodeModal = bool; this.currentModalSid = sid;
    this.currentModalUrl = url
  }
  @action handleSearch = (value) => {
    let data = {
      page: 1,
      pagesize: 50,
      keywords: value
    }
    this.getList(data)
  }

  @action addModify = async () => {
    const { name, url } = this.currentModel
    const result = await axios.post('/api/site', {
      name,
      url
    })
    if (result) {
      this.setShowAddModifyModal(false)
      this.getList();
    }

  }

  @action handleDeleteClick = async (id: string) => {
    await axios.delete(`api/site/${id}`)
    this.getList();
  }

  @action handleEdit = (id: string, name: string, url: string) => {
    this.setCurrentModel({
      id,
      name,
      url
    })
    this.setShowAddModifyModal(true)
  }

  @action handleUpdateOk = async () => {
    const { id, name } = this.currentModel
    const result = await axios.put(`/api/site/${id}`, { name })
    if (result) {
      this.getList();
      this.setShowAddModifyModal(false)
    }

  }

}

export default ProjectStore