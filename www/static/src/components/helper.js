import {routerRedux} from 'dva/router'
import {config} from 'utils';

const helper = {
  queryByUrl: (dispatch, location, args)=> {
    const {query, pathname} = location;
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        ...args
      },
    }))
  }
}

export default helper
