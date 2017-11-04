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
      }
    },
    *delete({ payload = {} }, { call, put }) {
      let ret = yield call(site.delete, payload);
      if (ret) {
        yield put({ type: 'query' });
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
      let userList = yield call(user.query);
      if (ret) {
        yield put({ type: 'save', payload: { userData: ret,userList } })
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
