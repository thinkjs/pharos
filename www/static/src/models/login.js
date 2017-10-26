import {login} from 'services';
import {queryURL} from 'utils';
import {routerRedux} from 'dva/router';
import {config} from 'utils'

export default {
  namespace: 'login',
  state: {
    img: ''
  },
  reducers: {
    reload(state, {payload}){
      return {...state, ...payload}
    },
  },
  effects: {
    *login({payload = {}}, {call, put}){
      const user = yield call(login.login, payload.values);
      if (user) {
        window.USER = user;
        localStorage.setItem('USER',JSON.stringify(user));
        const from = queryURL('from');
        yield put({type: 'app/init',payload:{user}});
        if (from) {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/'))
        }
      }
    },
    *register({payload = {}}, {call, put}){
      const user = yield call(login.register, payload.values);
      if (user) {
        yield put(routerRedux.push('/login'))
      }
    },
  },
  subscriptions: {}
};
