import React from 'react'
import {Table,Spin} from 'antd';


const List = ({data, onEdit, onDelete, onGetCode, onPageChange, pagination, loading})=> {
  const columns = [
    {
      title: '指标',
      dataIndex: 'name',
      key: 'name',
      width:'50%'
    },
    {
      title: '指标值',
      dataIndex: 'data',
      key: 'data',
      width:'50%'      
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={data}
        onChange={onPageChange}
        pagination={pagination}
        size="middle"
      />
    </Spin>
  )
};

export default List
