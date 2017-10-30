import React from 'react'
import {Table,Spin} from 'antd';


const List = ({data, onEdit, onDelete, loading,pagination})=> {
  const columns = [
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: (id, item)=> {
        return (
          <span>        
            <a onClick={()=>onEdit(item)}>编辑</a>
            <span className="ant-divider"/>
            <a onClick={()=>onDelete(item.id)}>删除</a>
          </span>
        )
      }
    },
    {
      title: '指标名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={data}
        size="middle"
        pagination={pagination}
      />
    </Spin>
  )
};

export default List
