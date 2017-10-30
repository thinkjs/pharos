import React from 'react';
import {connect} from 'dva';
import {Page} from 'components';
import AddModal from './add-or-edit-modal';
import CodeModal from './code-modal';
import Filter from './filter';
import List from './list';
import {Modal,Button,message} from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard';

function Whatever({dispatch, site, location, loading,}) {
  const {data, pagination, organs, addModalVisible, codeModalVisible, current, modalType} = site;
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

  const getCode = ()=>{
    if(!current){
      return
    }
    return `
      <script>
        var _pScript = _pScript || [];
        (function(){
          var _pScript = document.createElement('script');
          _pScript.setAttribute('data-siteid', '${current.id}');
          _pScript.src = window.location.protocol + '//pharos.eming.li/static/js/performance.js';
          document.body.appendChild(_pScript);
        })();
      </script>
    `
  };

  const codeModalProps = {
    width:610,
    title: '获取代码',
    current,
    visible: codeModalVisible,
    code: getCode(),
    footer:[
      <Button
        key="back"
        size="large"
        onClick={()=>{
          dispatch({
            type: 'site/save',
            payload: {codeModalVisible: false}
          })
        }}>
        关闭
      </Button>,
      <CopyToClipboard
        text={getCode()}
        onCopy={()=>{
          message.success('已成功复制到剪切板');
        }}
      >
        <Button key="copy" size="large" type="primary">复制代码</Button>
      </CopyToClipboard>
    ],
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
    onGetCode(item){
      dispatch({
        type: 'site/save',
        payload: {codeModalVisible: true, current: item}
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
      {codeModalVisible && <CodeModal {...codeModalProps} />}
    </Page>
  );
}

export default connect(({site, app ,loading}) => ({site, app,loading}))(Whatever)
