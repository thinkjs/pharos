// import { message } from 'antd';
import { ListCriteria } from '../proto/index';
import { observable, action, computed, toJS } from 'mobx';
import axios from '@utils/axios';
import history from '@utils/history'

class ProjectStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @computed get siteId() {
    return localStorage.getItem('projectId')
  }
  // @observable jsString = '';

  // @action setJsString = (id) => {
  //   let sid = ''
  //   this.projectList.forEach((item: any) => {
  //     if (item.id === parseInt(id)) {
  //       sid = item.sid
  //     }
  //   })
  //   let tem = `<script
  //     src="//lib.baomitu.com/lightkeeper/latest/pharos.min.js"
  //     data-siteid=${sid}
  //     data-host="//pharos.baomitu.com"  
  //     >
  //   </script>
  //   <script type="text/javascript">
  //     window.addEventListener('load', function() {
  //       pharos.monitor();
  //     });
  //   </script>`
  //   this.jsString = tem
  // }
  // @observable status = 1

  @action createProject = async (values) => {
    const result: any = await axios.post('/api/site', values)
    localStorage.setItem('projectId', result.data.data.id)
    localStorage.setItem('sid', result.data.data.sid)
    history.push('/project/embed')
  }

  @observable embedInfo = ''
  @action setEmbedInfo = (value) => this.embedInfo = value

  @action getProjectEmbedInfo = async () => {
    const result = await axios.get(`site/${this.siteId}`)
    this.setEmbedInfo(result)
  }

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
    localStorage.setItem('sid', value.sid)
    window.location.href = '/monitor';
  }

  @observable showUserInfo = false
  @action setShowUserInfo = (bool) => this.showUserInfo = bool


  @action deleteProject = async () => {
    await axios.delete(`/api/site/${this.siteId}`)
    window.location.href = '/monitor'
    localStorage.removeItem('projectId')
    localStorage.removeItem('sid')
  }

  @observable showDeleteModal = false
  @action setShowDeleteModal = (bool) => this.showDeleteModal = bool


}

export default ProjectStore