import { site,user } from 'services';
import {message} from 'antd';
const initialState = {
  data: [],
  organs: [],
  pagination: {},
  filter: {},
  addModalVisible: false,
};

export default {

  namespace: 'site',

  state: initialState,

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/site/list' || location.pathname === '/') {
          dispatch({ type: 'query', payload: location.query });
        } else if (location.pathname === '/site/field') {
          dispatch({ type: 'queryField', payload: location.query });
        } else if (location.pathname === '/site/user'){
          dispatch({ type: 'queryUser', payload: location.query });
        } else if (location.pathname === '/site/setting'){
          dispatch({ type: 'queryOptions', payload: location.query });          
        }else {
          dispatch({ type: 'clear' });
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put }) {
      payload.page = payload.page || 1;
      let ret = yield call(site.query, payload);
      if (ret) {
        const data = ret.data;
        const pagination = {
          current: +ret.currentPage,
          pageSize: +ret.pagesize,
          total: +ret.count,
          defaultCurrent: 1
        };
        yield put({ type: 'save', payload: { data, pagination } })
      }
    },
    *add({ payload = {} }, { call, put }) {
      let ret = yield call(payload.id ? site.edit : site.add, payload);
      if (ret) {
        yield put({ type: 'save', payload: { addModalVisible: false, codeModalVisible: !payload.id, current: { id: ret.id, ...payload } } });
        yield put({ type: 'query' });
        yield put({ type: 'app/init' });
        
      }
    },
    *delete({ payload = {} }, { call, put }) {
      let ret = yield call(site.delete, payload);
      if (ret) {
        yield put({ type: 'query' });
        yield put({ type: 'app/init' });
      }
    },
    *queryField({ payload = {} }, { call, put, select }) {
      const currentSite = yield select(state => state.app.currentSite);
      payload.siteId = currentSite.id;
      let ret = yield call(site.queryField, payload);
      if (ret) {
        yield put({ type: 'save', payload: { fieldData: ret } })
      }
    },
    *addField({ payload = {} }, { call, put, select }) {
      const currentSite = yield select(state => state.app.currentSite);
      payload.siteId = currentSite.id;
      let ret = yield call(payload.id ? site.editField : site.addField, payload);
      if (ret) {
        yield put({ type: 'save', payload: { addModalVisible: false } });
        yield put({ type: 'queryField' });
      }
    },
    *deleteField({ payload = {} }, { call, put,select }) {
      const currentSite = yield select(state => state.app.currentSite);
      payload.siteId = currentSite.id;
      let ret = yield call(site.deleteField, payload);
      if (ret) {
        yield put({ type: 'queryField' });
      }
    },
    *queryUser({ payload = {} }, { call, put, select }) {
      const currentSite = yield select(state => state.app.currentSite);
      payload.siteId = currentSite.id;
      let ret = yield call(site.queryUser, payload);
      if (ret) {
        // yield put({ type: 'queryUserList' });
        yield put({ type: 'save', payload: { userData: ret } })
      }
    },
    *addUser({ payload = {} }, { call, put, select }) {
      const currentSite = yield select(state => state.app.currentSite);
      payload.siteId = currentSite.id;
      let ret = yield call(site.addUser, payload);
      if (ret) {
        yield put({ type: 'save', payload: { addModalVisible: false } });
        yield put({ type: 'queryUser' });
      }
    },
    *editUser({ payload = {} }, { call, put, select }) {
      const currentSite = yield select(state => state.app.currentSite);
      payload.siteId = currentSite.id;
      let ret = yield call(site.editUser, payload);
      if (ret) {
        message.success('修改成功');
        yield put({ type: 'queryUser' });
      }
    },
    *deleteUser({ payload = {} }, { call, put,select }) {
      const currentSite = yield select(state => state.app.currentSite);
      payload.siteId = currentSite.id;
      let ret = yield call(site.deleteUser, payload);
      if (ret) {
        yield put({ type: 'queryUser' });
      }
    },
    *queryUserList({ payload = {} }, { call, put, select }) {
      let ret = yield call(user.query,payload);
      if (ret) {
        yield put({ type: 'save', payload: { userList:payload.keyword && ret.data } })
      }
    },
    *queryOptions({ payload = {} }, { call, put, select }) {
      const currentSite = yield select(state => state.app.currentSite);
      payload.site_id = currentSite.id;
      let ret = yield call(site.getOptions, payload);
      try{
        ret = JSON.parse(ret.name);
      }catch(e){
        ret = {}
      }
      if (ret) {
        yield put({ type: 'save', payload: { optionsData: ret } })
      }
    },
    *options({ payload = {} }, { call, put, select }) {
      const currentSite = yield select(state => state.app.currentSite);
      // payload.site_id = currentSite.id;
      const data = {
        site_id:currentSite.id,
        // name:JSON.stringify(payload)
        payload
      }
      let ret = yield call(site.options, data);
      if (ret) {
        message.success('设置成功');
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear() {
      return { ...initialState }
    },
    hideModal(state) {
      return { ...state, addModalVisible: false }
    }
  }
};
