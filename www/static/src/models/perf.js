import { perf, site } from 'services';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';
import { constant, config, helper } from 'utils';

const initialState = {
  data: [],
  pagination: {},
  filter: {},
  pageConfig: {}
};

const serviceMap = {
  hour: 'query',
  day: 'query',
  interval: 'query',
  os: 'queryByOs'
};

const PAGE_CONFIG = {
  hour: {
    type: 'hour',
    service: 'query',
    chartSubTitle: '按小时'
  },
  day: {
    type: 'day',
    service: 'query',
    chartSubTitle: '按日期'
  },
  interval: {
    type: 'interval',
    service: 'query',
    chartSubTitle: '耗时区间'
  },
  os: {
    type: 'os',
    service: 'queryByOs',
    chartSubTitle: '按操作系统',
    chartType: 'column'
  },
  browser: {
    type: 'browser',
    service: 'queryByBrowser',
    chartSubTitle: '按浏览器',
    chartType: 'column'
  },
  region: {
    type: 'region',
    service: 'queryByRegion',
    chartSubTitle: '按地域',
    chartType: 'map'
  },
  js_error: {
    type: 'error',
    service: 'queryByJSError',
    chartSubTitle: ''
  }
};
export default {

  namespace: 'perf',

  state: initialState,

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        dispatch({ type: 'init' });
      });
    }
  },

  effects: {
    * init({ payload = {} }, { call, select, put }) {
      const routing = yield select(state => state.routing.locationBeforeTransitions);
      // const app = yield select(state => state.app);
      // if(!app.currentSite){
      //   return
      // }
      const currentSite = helper.getDataFromLs(config.ls_key.site);
      if (!currentSite) {
        return;
      }
      const { pathname, query } = routing;
      const param = {
        ...query,
        site_id: currentSite.id
        // end_time: moment().format('YYYY-MM-DD'),//最近7天
        // start_time: moment().subtract(7, 'days').format('YYYY-MM-DD')
      };
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
      } else if (pathname.indexOf('/perf/js-error') > -1 && !param.type) {
        const match = pathToRegexp('/perf/js-error/:type').exec(location.pathname);
        if (match) {
          param.type = match[1];
        }
      }
      yield put({ type: 'query', payload: param });
    },
    * query({ payload = {} }, { call, put }) {
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

      // payload.end_time = '2017-11-11'
      // payload.start_time = '2017-10-01'
      let pageConfig = PAGE_CONFIG[payload.type];
      if (location.pathname.indexOf('/perf/js-error') > -1) {
        pageConfig = PAGE_CONFIG.js_error;
      }

      if (location.pathname === '/perf/overview') {
        // 概览页直接返回
        const rawData = yield call(perf.query, payload);
        yield put({ type: 'save', payload: { data: rawData } });
        return;
      }
      const rawData = yield call(perf[pageConfig.service], payload);

      let data = {};
      const columns = [
        {
          title: '指标',
          dataIndex: 'name',
          key: 'name'
        }
      ];
      if (payload.type === 'region') {
        data = rawData;
      } else {
        const { categories, series } = rawData;
        data = (series || []).map((item, index) => {
          const s = {};
          categories.forEach((c, i) => {
            s[`${i}`] = item.data[i];
            s.name = item.name;
            if (index === 0) {
              columns.push({
                title: c,
                dataIndex: `${i}`,
                key: `${i}`
              });
            }
          });
          return s;
        });
      }
      yield put({ type: 'save', payload: { data, columns, rawData, pageConfig } });
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear() {
      return { ...initialState };
    },
    hideModal(state) {
      return { ...state, addModalVisible: false };
    }
  }
};
