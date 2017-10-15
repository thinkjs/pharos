import {site} from 'services';

const initialState = {
  data: [],
  organs: [],
  pagination: {},
  filter: {},
  addModalVisible:false,
};

export default {

  namespace: 'site',

  state: initialState,

  subscriptions: {
    setup({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/site' || location.pathname === '/') {
          dispatch({type: 'query', payload: location.query});
        } else {
          dispatch({type: 'clear'});
        }
      })
    },
  },

  effects: {
    *query({payload = {}}, {call, put}) {
      let ret = yield call(site.query, payload);
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
    *add({payload = {}}, {call, put}){
      let ret = yield call(payload.id ? site.edit : site.add,payload);
      console.log(ret);
      if(ret){
        yield put({type:'save',payload:{addModalVisible:false,codeModalVisible:!payload.id,current:{id:ret.id,...payload}}});
        yield put({ type: 'query' });
      }
    },
    *delete({payload = {}}, {call, put}){
      let ret = yield call(site.delete, payload);
      if (ret) {
        yield put({type: 'query'});
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
      return {...state,addModalVisible:false}
    }
  }
};
