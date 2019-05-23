import { message } from 'antd';
import { CurrentModel } from '../proto/index';
import { observable, action, computed } from 'mobx';
import axios from '../../../utils/axios';

class MetricStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore
    
  }

  @computed get siteId() {
    return this.rootStore.siteStore.currentId;
  }

  @observable list = []
  @action setList = (list) => this.list = list

  @action getList = async (id?: any) => {
    let params = { page: '1', pagesize: 50 }
    try {
      const { data } = await axios.get(`/api/metric/${id ? id : this.siteId}`, { params })
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



  @action addModifyMetric = async (values) => {
    
    const result = await axios.post(`/api/metric/${this.siteId}`, values)
    if (result) {
      this.setShowAddModifyModal(false)
      this.getList();
    }

  }

  @action handleDeleteClick = async (id) => {
    await axios({
      method: 'delete',
      url: `api/metric/${this.siteId}`,
      data: { id: String(id) }
    })
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
    const result = await axios.put(`/api/metric/${this.siteId}`, this.currentModel)
    if (result) {
      this.getList();
      this.setShowAddModifyModal(false)
    }

  }

}

export default MetricStore