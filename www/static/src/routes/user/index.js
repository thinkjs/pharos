import React from 'react';
import {connect} from 'dva';
import {Page} from 'components';
import AddModal from './add-or-edit-modal';
import Filter from './filter';
import List from './list';
import {Modal} from 'antd';

function Whatever({dispatch, user, location, loading,}) {
  const {data, pagination, organs, addModalVisible, current, modalType} = user;
  const modalProps = {
    title: modalType === 'add' ? '新增' : '编辑',
    current: modalType === 'add' ? {} : current,
    visible: addModalVisible,
    organs,
    onCancel: ()=> {
      dispatch({
        type: 'user/save',
        payload: {addModalVisible: false}
      })
    },
    onOk: (data)=> {
      dispatch({
        type: 'user/add',
        payload: data
      })
    }
  };

  const filterProps = {
    onAdd: ()=> {
      dispatch({
        type: 'user/save',
        payload: {addModalVisible: true, modalType: 'add'}
      })
    },
    ...location.query
  };

  const listProps = {
    loading:loading.effects['user/query'],
    onPageChange: (page)=> {
      helper.queryByUrl(dispatch, location, {
        pageNo: page.current,
        pageSize: page.pageSize
      });
    },
    onEdit: (item)=> {
      dispatch({
        type: 'user/save',
        payload: {addModalVisible: true, current: item, modalType: 'edit'}
      })
    },
    onDelete:(id)=>{
      Modal.confirm({
        title:'确认删除吗?',
        // content:'确认删除吗?',
        onOk:()=>{
          dispatch({
            type: 'user/delete',
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

export default connect(({user, app ,loading}) => ({user, app,loading}))(Whatever)
