import React from 'react';
import {connect} from 'dva';
import {Page,helper,HighCharts} from 'components';
import Filter from './filter';
import List from './list';
import {Modal} from 'antd';
import {constant} from 'utils';
function Whatever({dispatch, perf, location, loading}) {
  const {data,columns,rawData,pageType} = perf;
  const filterProps = {
    onAdd: ()=> {
      dispatch({
        type: 'perf/save',
        payload: {addModalVisible: true, modalType: 'add'}
      })
    },
    handleSearch: (filter) => {
      helper.queryByUrl(dispatch, location, filter);
    },
    ...location.query
  };
  console.log(columns)
  const listProps = {
    loading:loading.effects['perf/query'],
    columns,
    onPageChange: (page)=> {
      helper.queryByUrl(dispatch, location, {
        pageNo: page.current,
        pageSize: page.pageSize
      });
    },
    data,
    pagination:false,
    scroll: pageType === 'day' ? {x:columns.length * 100} :{x:2000}
  };

  const chartProps = {
    data:rawData,
    title:{text:'数据分析'},
    subtitle:{text:constant.PERF_PAGE_NAME[pageType]}
  }

  return (
    <Page>
      <Filter {...filterProps} />
      <HighCharts {...chartProps}/>
      <List {...listProps} />
    </Page>
  );
}

export default connect(({perf, app ,loading}) => ({perf, app,loading}))(Whatever)
