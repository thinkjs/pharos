import { perf, site } from 'services';
import { routerRedux } from 'dva/router'
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';
import { constant } from 'utils';

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
    setup({ dispatch, history }) {
      history.listen(() => {
        dispatch({ type: 'init' });
      })
    },
  },

  effects: {
    *init({ payload = {} }, { call, select, put }) {
      const routing = yield select(state => state.routing.locationBeforeTransitions);
      const app = yield select(state => state.app);
      const { pathname, query } = routing;
      let sites = yield call(site.query);
      let param = {
        ...query,
        site_id: app.currentSite.id,
        // end_time: moment().format('YYYY-MM-DD'),//最近7天
        // start_time: moment().subtract(7, 'days').format('YYYY-MM-DD')
      }
      // if (!query.site_id && sites.length > 0) {
      //   yield put(routerRedux.push({
      //     pathname,
      //     query: param
      //   }))
      //   return;
      // }
      if (pathname.indexOf('/perf/specific') > -1 && !param.type) {
        const match = pathToRegexp('/perf/specific/:type').exec(location.pathname);  
        if (match) {
          param.type = match[1];
        }
      }
      yield put({ type: 'query', payload: param });
    },
    *query({ payload = {} }, { call, put }) {
      payload.page = payload.page || 1;
      // const [t,y,b] = [
      //   moment().subtract(1,'days').format('YYYY-MM-DD'),
      //   moment().subtract(2,'days').format('YYYY-MM-DD'),
      //   moment().subtract(3,'days').format('YYYY-MM-DD')
      // ];
      // let today = yield call(perf.query, {...payload,start_time:y,end_time:t});
      // let yesterday = yield call(perf.query, {...payload,start_time:b,end_time:y});
      // if (today && yesterday) {
      //   let overview = [];
      //   today.forEach((item,index)=>{
      //     overview.push({
      //       name:item.index_name,
      //       yesterday:yesterday[index].index_value,
      //       today:item.index_value
      //     })
      //   });
      // }  
       payload.end_time = moment().format('YYYY-MM-DD'),//最近7天
       payload.start_time = moment().subtract(7, 'days').format('YYYY-MM-DD')
       
      let rawData = yield call(perf.query, payload);
      let data = {};
      let columns = [
        {
          title:'指标',
          dataIndex:'name',
          key:'name'
        }
      ];
      if (payload.type) {
        const { categories, series } = rawData;
        data = series.map((item, index) => {
          let s = {};
          categories.forEach((c, i) => {
            s[`${i}`] = item.data[i];
            s.name = item.name;
            if (index === 0) {
              columns.push({
                title: c,
                dataIndex: `${i}`,
                key: `${i}`,
              })
            }
          })
          return s;
        })
      }
      yield put({ type: 'save', payload: { data,columns,rawData } })
    },
    *specific({ payload = {} }, { call, put }) {
      payload.page = payload.page || 1;
      payload.metric = 'perfDistributionTime'
      const [t, y, b] = [
        moment().subtract(1, 'days').format('YYYY-MM-DD'),
        moment().subtract(2, 'days').format('YYYY-MM-DD'),
        moment().subtract(3, 'days').format('YYYY-MM-DD')
      ];
      let today = yield call(perf.query, { ...payload, start_time: y, end_time: t });
      let yesterday = yield call(perf.query, { ...payload, start_time: b, end_time: y });
      let ret = yield call(perf.query, payload);
      if (today && yesterday) {
        let overview = [];
        today.forEach((item, index) => {
          overview.push({
            name: item.index_name,
            yesterday: yesterday[index].index_value,
            today: item.index_value
          })
        });
        yield put({ type: 'save', payload: { data, pagination } })
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
