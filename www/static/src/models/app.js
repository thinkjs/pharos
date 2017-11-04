import { routerRedux } from 'dva/router';
import { login, site } from 'services';
import { config,menus } from 'utils';

const getSelectKey = ()=>{
  const pathname = location.pathname === '/'? config.dashboardURL : location.pathname;
  let currMenu = {};
  let selectMenu = {}
  const fn = (menu)=>{
    const children = menu.children;
    if(!children){
      return;
    }
    children.forEach(c=>{
      if(c.url === pathname){
        selectMenu = currMenu;
        return;
      }
      fn(c);
    })
  }
  menus.forEach(m=>{
    currMenu = m;
    fn(m)
  });
  return selectMenu || {};
}

export default {
  namespace: 'app',
  state: {
    user: {},
    leftMenus:menus[0].children || [],
    topMenu:menus[0],
    currentSite:{}
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    changeTopMenu(state, { payload }) {
      // const leftMenus = menus.filter(item=>item.key === payload)[0].children;
      const leftMenus = payload.children;
      return { ...state,topMenu:payload,leftMenus };      
    },
  },
  effects: {
    *init({ payload = {} }, { call, select, put }) {
      const sites = yield call(site.query, payload);
      if(!sites){
        return;
      }
      let currentSite = localStorage.getItem(config.ls_key.site);
      if (currentSite) {
        currentSite = JSON.parse(currentSite);
      } else {
        currentSite = sites[0];
        localStorage.setItem(config.ls_key.site, JSON.stringify(currentSite));
      }
      const topMenu = getSelectKey();
      yield put({ type: 'save', payload: { sites, currentSite,topMenu,leftMenus:topMenu.children } })
    },
    *redirect({ payload = {} }, { put }) {
      yield put(routerRedux.push(payload))
    },
    *logout({ payload = {} }, { call, put }) {
      let ret = yield call(login.logout, payload);
      if (ret) {
        localStorage.removeItem('USER');
        yield put(routerRedux.push('/login'))
      }
    },
    *changeSite({ payload }, { call, put, select }) {
      const app = yield select(state => state.app);
      const routing = yield select(state => state.routing.locationBeforeTransitions);
      const siteId = payload;
      const { sites } = app;
      const currentSite = sites.filter(s => s.id == siteId)[0];
      localStorage.setItem(config.ls_key.site, JSON.stringify(currentSite));
      yield put(routerRedux.push(routing))
      yield put({ type: 'save', payload: { currentSite } })
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'init', payload: {} });
      history.listen(location => {
        if (location.pathname !== '/login' && location.pathname !== '/register' && !window.USER.id) {
          dispatch({ type: 'redirect', payload: '/login' });
        }
      })
    }
  },
};
