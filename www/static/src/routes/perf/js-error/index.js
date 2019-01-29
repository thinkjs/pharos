import React from 'react';
import { connect } from 'dva';
import { Page } from 'components';
function Whatever() {
  return (
    <Page>
      Hello world
    </Page>
  );
}

export default connect(({ perf, app, loading }) => ({ perf, app, loading }))(Whatever);
