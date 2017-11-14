import React from 'react';
import {connect} from 'dva';
import {Page,helper,HighCharts,HighChartsMap} from 'components';
import Filter from './filter';
import List from './list';
import {Modal} from 'antd';
import {constant} from 'utils';
function Whatever({dispatch, perf, location, loading}) {
  const {data,columns=[],rawData,pageConfig} = perf;
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
    scroll: {x:columns.length * 100}
  };

  const chartProps = {
    chart:{type:pageConfig.chartType},
    data:rawData,
    title:{text:'数据分析'},
    subtitle:{text:pageConfig.chartSubTitle}
  }

  return (
    <Page>
      {
        /* <Filter {...filterProps} />*/
      }
      
      {
        pageConfig.chartType === 'map' ?
        <HighChartsMap {...chartProps}/>
        :<HighCharts {...chartProps}/>
      }
      {
        /*
      <List {...listProps} />
        */
      }
    </Page>
  );
}

export default connect(({perf, app ,loading}) => ({perf, app,loading}))(Whatever)
