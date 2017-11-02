import React from 'react';
import {connect} from 'dva';
import {Page} from 'components';
import AddModal from './add-or-edit-modal';
import Filter from './filter';
import List from './list';
import {Modal,Button,message} from 'antd';

function Whatever({dispatch, site, location, loading,}) {
  const {fieldData, addModalVisible, current, modalType} = site;
  
  const modalProps = {
    title: modalType === 'add' ? '新增' : '编辑',
    current: modalType === 'add' ? {} : current,
    visible: addModalVisible,
    onCancel: ()=> {
      dispatch({
        type: 'site/save',
        payload: {addModalVisible: false}
      })
    },
    onOk: (data)=> {
      dispatch({
        type: 'site/addField',
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
    loading:loading.effects['site/queryField'],
    onEdit: (item)=> {
      dispatch({
        type: 'site/save',
        payload: {addModalVisible: true, current: item, modalType: 'edit'}
      })
    },
    onDelete:(id)=>{
      Modal.confirm({
        title:'确认删除吗?',
        onOk:()=>{
          dispatch({
            type: 'site/deleteField',
            payload:{id}
          })
        }
      })
    },
    data:fieldData,
    pagination:false
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
