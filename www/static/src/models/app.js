import {routerRedux} from 'dva/router';

export default {
  namespace: 'app',
  state: {
    user:{}
  },
  reducers: {},
  effects: {
    *redirect({payload={}}, {put}){
      yield put(routerRedux.push(payload))
    }
  },
  subscriptions: {},
};
