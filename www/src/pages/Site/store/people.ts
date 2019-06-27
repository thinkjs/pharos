import { observable, action, computed } from 'mobx';
import { message } from 'antd';
import axios from '@utils/axios';
import { PeopleList } from '../proto/index';

class People {
  rootStore;
  constructor(rootStore) {
    this.rootStore = rootStore
  }
  @computed get siteId() {
    return localStorage.getItem('projectId')
  }
  @observable peopleList: PeopleList[] = []
  @action setPeopleList = (list: []) => this.peopleList = list

  @observable sourceData: any = []
  @action setSourceData = val => this.sourceData = val
  @action getPeopleList = async (criteria?: any) => {
    try {
      const data = await axios.get(`/api/site/${this.siteId}/user`)
      this.setSourceData(data.data.data)
    } catch (error) {
      message.error('获取列表失败');
    }
  }

  @observable showModal: boolean = false
  @action setModal = (status: boolean) => this.showModal = status

  //提前获取所有的注册用户在新增的时候直接使用
  @observable optionsData: any = []
  @action setOptionsData = data => this.optionsData = data
  @action getListData = async (params: any) => {
    let { data } = await axios.get('api/user', { params })
    if (data) {
      this.optionsData = this.setOptionsData(data.data.data)
    }
  }

  @observable selectList: any = []
  @action handleSelected = val => this.selectList = val

  @action hanldeClickOk = async () => {
    const { data } = await axios.post(`api/site/${this.siteId}/user/${this.selectList.join(',')}`)
    if (data.errno === 0) {
      message.info('添加成功')
    } else {
      message.error('添加失败请稍后再试')
    }
    this.getPeopleList()
    this.setModal(false)
  }
  @action handleCancel = () => this.setModal(false)

  @action handleDelete = async (user_id: any) => {
    const { data } = await axios.delete(`api/site/${this.siteId}/user/${user_id}`)
    this.getPeopleList()
    if (data.errno === 0) {
      message.success('删除成功')
    } else {
      message.success('删除失败')
    }
  }

  @action handleStatus = async (status: any, id: any) => {
    const { data } = await axios.put(`api/site/${this.siteId}/user/${id}`, {
      status
    })
    if (data.errno === 0) {
      message.success('修改成功')
    } else {
      message.error('修改失败')
    }
  }
}


export default People