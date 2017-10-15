import {perf, site} from 'services';
import {routerRedux} from 'dva/router'
import moment from 'moment';

const initialState = {
  data: [],
  organs: [],
  pagination: {},
  filter: {},
  addModalVisible: false,
};

export default {

  namespace: 'perf',

  state: initialState,

  subscriptions: {
    setup({dispatch, history}) {
      history.listen(() => {
        dispatch({type: 'init'});
      })
    },
  },

  effects: {
    *init({payload = {}}, {call, select, put}) {
      const routing = yield select(state => state.routing.locationBeforeTransitions);
      const {pathname, query} = routing;
      if(pathname === '/perf/overview'){
        let sites = yield call(site.query);
        if(!query.site_id || !query.start_time || !query.end_time){
          yield put(routerRedux.push({
            pathname,
            query: {
              ...query,
              site_id:sites[0].id,//默认取第一个
              end_time:moment().format('YYYY-MM-DD'),//最近7天
              start_time:moment().subtract(7,'days').format('YYYY-MM-DD')
            },
          }))
        }
        yield put({type: 'query', payload: {metric: 'allPerfAvgConsumeTime', ...query}});
      }
    },
    *query({payload = {}}, {call, put}) {
      payload.page = payload.page || 1;
      let ret = yield call(perf.query, payload);
      if (ret) {
        const data = ret.data;
        const pagination = {
          current: +ret.currentPage,
          pageSize: +ret.pagesize,
          total: +ret.count,
          defaultCurrent: 1
        };
        yield put({type: 'save', payload: {data, pagination}})
      }
    },
  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    },
    clear(){
      return {...initialState}
    },
    hideModal(state){
      return {...state, addModalVisible: false}
    }
  }
};
