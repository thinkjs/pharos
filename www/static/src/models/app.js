import {routerRedux} from 'dva/router';

export default {
  namespace: 'app',
  state: {
    user: {}
  },
  reducers: {},
  effects: {
    *redirect({payload={}}, {put}){
      yield put(routerRedux.push(payload))
    }
  },
  subscriptions: {
    setup({dispatch, history}){
      history.listen(location => {
        if (location.pathname !== '/login' && location.pathname !== '/register' && !window.USER.id) {
          dispatch({type: 'redirect', payload: '/login'});
        }
      })
    }
  },
};
