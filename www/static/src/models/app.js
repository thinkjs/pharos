import {routerRedux} from 'dva/router';
import {login} from 'services';

export default {
  namespace: 'app',
  state: {
    user: {}
  },
  reducers: {},
  effects: {
    *redirect({payload={}}, {put}){
      yield put(routerRedux.push(payload))
    },
    *logout({payload = {}}, {call, put}) {
      let ret = yield call(login.logout, payload);
      if (ret) {
        localStorage.removeItem('USER');
        yield put(routerRedux.push('/login'))
      }
    },
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
