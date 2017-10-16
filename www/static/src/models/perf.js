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
        if(!query.site_id){
          yield put(routerRedux.push({
            pathname,
            query: {
              ...query,
              site_id:sites[0].id,//默认取第一个
              // end_time:moment().format('YYYY-MM-DD'),//最近7天
              // start_time:moment().subtract(7,'days').format('YYYY-MM-DD')
            },
          }))
        }

        yield put({type: 'overview', payload: {metric: 'allPerfAvgConsumeTime', ...query}});
      }
    },
    *overview({payload = {}}, {call, put}) {
      payload.page = payload.page || 1;
      const [t,y,b] = [
        moment().subtract(1,'days').format('YYYY-MM-DD'),
        moment().subtract(2,'days').format('YYYY-MM-DD'),
        moment().subtract(3,'days').format('YYYY-MM-DD')
      ];
      let today = yield call(perf.query, {...payload,start_time:y,end_time:t});
      let yesterday = yield call(perf.query, {...payload,start_time:b,end_time:y});
      if (today && yesterday) {
        let overview = [];
        today.forEach((item,index)=>{
          overview.push({
            name:item.index_name,
            yesterday:yesterday[index].index_value,
            today:item.index_value
          })
        });
        console.log(overview);
        // yield put({type: 'save', payload: {data, pagination}})
      }
    },
    *specific({payload = {}}, {call, put}) {
      payload.page = payload.page || 1;
      payload.metric = 'perfDistributionTime'
      const [t,y,b] = [
        moment().subtract(1,'days').format('YYYY-MM-DD'),
        moment().subtract(2,'days').format('YYYY-MM-DD'),
        moment().subtract(3,'days').format('YYYY-MM-DD')
      ];
      let today = yield call(perf.query, {...payload,start_time:y,end_time:t});
      let yesterday = yield call(perf.query, {...payload,start_time:b,end_time:y});
      let ret = yield call(perf.query, payload);
      if (today && yesterday) {
        let overview = [];
        today.forEach((item,index)=>{
          overview.push({
            name:item.index_name,
            yesterday:yesterday[index].index_value,
            today:item.index_value
          })
        });
        console.log(overview);
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
