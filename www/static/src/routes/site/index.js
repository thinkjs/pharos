import React from 'react';
import {connect} from 'dva';
import {Page} from 'components';
import AddModal from './add-or-edit-modal';
import Filter from './filter';
import List from './list';
import {Modal} from 'antd';

function Whatever({dispatch, site, location, loading,}) {
  const {data, pagination, organs, addModalVisible, current, modalType} = site;
  const modalProps = {
    title: modalType === 'add' ? '新增' : '编辑',
    current: modalType === 'add' ? {} : current,
    visible: addModalVisible,
    organs,
    onCancel: ()=> {
      dispatch({
        type: 'site/save',
        payload: {addModalVisible: false}
      })
    },
    onOk: (data)=> {
      dispatch({
        type: 'site/add',
        payload: data
      })
    }
  };

  const filterProps = {
    onAdd: ()=> {
      dispatch({
        type: 'site/save',
        payload: {addModalVisible: true, modalType: 'add'}
      })
    },
    ...location.query
  };

  const listProps = {
    loading:loading.effects['site/query'],
    onPageChange: (page)=> {
      helper.queryByUrl(dispatch, location, {
        pageNo: page.current,
        pageSize: page.pageSize
      });
    },
    onEdit: (item)=> {
      dispatch({
        type: 'site/save',
        payload: {addModalVisible: true, current: item, modalType: 'edit'}
      })
    },
    onDelete:(id)=>{
      Modal.confirm({
        title:'确认删除吗?',
        // content:'确认删除吗?',
        onOk:()=>{
          dispatch({
            type: 'site/delete',
            payload:{id}
          })
        }
      })
    },
    onResetPass(userId){
      Modal.confirm({
        title: '重置密码',
        content: '确定重置密码?',
        onOk(){
          dispatch({
            type: 'user/resetPassword',
            payload: {userId}
          })
        }
      })
    },
    onDisable(userId){
      Modal.confirm({
        title: '停用',
        content: '确定停用?',
        onOk(){
          dispatch({
            type: 'user/disable',
            payload: {userId}
          })
        }
      })
    },
    data,
    pagination
  };

  return (
    <Page>
      <Filter {...filterProps} />
      <List {...listProps} />
      {addModalVisible && <AddModal {...modalProps} />}
    </Page>
  );
}

export default connect(({site, app ,loading}) => ({site, app,loading}))(Whatever)
