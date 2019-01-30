import React from 'react';
import { connect } from 'dva';
import { Page, HighCharts } from 'components';
function Whatever({ perf }) {
  const { rawData, pageConfig } = perf;
  const chartProps = {
    chart: {
      type: 'line'
    },
    data: rawData,
    title: { text: '实时数据' },
    subtitle: { text: '每5分钟' }
  };
  return (
    <Page>
      <HighCharts {...chartProps} />
    </Page>
  );
}

export default connect(({ perf, app, loading }) => ({ perf, app, loading }))(Whatever);
